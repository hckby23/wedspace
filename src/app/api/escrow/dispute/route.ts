import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createDisputeSchema = z.object({
  escrow_account_id: z.string().uuid(),
  booking_id: z.string().uuid(),
  dispute_type: z.enum(['service_not_delivered', 'quality_issue', 'cancellation', 'other']),
  dispute_reason: z.string().min(20),
  dispute_amount: z.number().positive().optional(),
  evidence_documents: z.array(z.string()).optional(),
  evidence_description: z.string().optional()
});

const updateDisputeSchema = z.object({
  dispute_id: z.string().uuid(),
  status: z.enum(['open', 'under_review', 'resolved', 'closed']).optional(),
  resolution_notes: z.string().optional(),
  resolution_action: z.enum(['full_refund', 'partial_refund', 'release_to_vendor', 'split']).optional(),
  resolution_amount: z.number().positive().optional()
});

/**
 * GET /api/escrow/dispute
 * Get disputes for user
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const dispute_id = searchParams.get('dispute_id');
    const escrow_id = searchParams.get('escrow_id');

    let query = supabase
      .from('escrow_disputes')
      .select(`
        *,
        escrow_accounts (
          id,
          total_amount,
          status,
          bookings (
            id,
            event_date,
            listings (
              title,
              listing_type
            )
          )
        )
      `)
      .or(`raised_by.eq.${user.id},escrow_accounts.user_id.eq.${user.id},escrow_accounts.vendor_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (dispute_id) {
      query = query.eq('id', dispute_id);
    }

    if (escrow_id) {
      query = query.eq('escrow_account_id', escrow_id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ disputes: data });
  } catch (error) {
    console.error('Dispute GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/escrow/dispute
 * Create a new dispute
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const disputeData = createDisputeSchema.parse(body);

    // Get escrow account
    const { data: escrow, error: escrowError } = await supabase
      .from('escrow_accounts')
      .select('*')
      .eq('id', disputeData.escrow_account_id)
      .single();

    if (escrowError || !escrow) {
      return NextResponse.json({ error: 'Escrow account not found' }, { status: 404 });
    }

    // Verify user is involved in the escrow
    if (escrow.user_id !== user.id && escrow.vendor_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized to create dispute' }, { status: 403 });
    }

    // Check if dispute already exists
    const { data: existingDispute } = await supabase
      .from('escrow_disputes')
      .select('id, status')
      .eq('escrow_account_id', disputeData.escrow_account_id)
      .in('status', ['open', 'under_review'])
      .single();

    if (existingDispute) {
      return NextResponse.json({ 
        error: 'An active dispute already exists for this escrow',
        dispute_id: existingDispute.id 
      }, { status: 400 });
    }

    // Create dispute
    const { data: dispute, error: disputeError } = await supabase
      .from('escrow_disputes')
      .insert({
        ...disputeData,
        raised_by: user.id,
        status: 'open',
        priority: 'medium',
        response_count: 0
      })
      .select()
      .single();

    if (disputeError) {
      return NextResponse.json({ error: disputeError.message }, { status: 500 });
    }

    // Update escrow status to disputed
    await supabase
      .from('escrow_accounts')
      .update({ 
        status: 'disputed',
        notes: escrow.notes 
          ? `${escrow.notes}\n${new Date().toISOString()}: Dispute raised - ${disputeData.dispute_reason}`
          : `${new Date().toISOString()}: Dispute raised - ${disputeData.dispute_reason}`
      })
      .eq('id', disputeData.escrow_account_id);

    // Create notifications
    const otherPartyId = escrow.user_id === user.id ? escrow.vendor_id : escrow.user_id;
    
    const notifyAdmins = async () => {
      const { error: adminNotifyError } = await supabase.rpc('notify_admins', {
        notification_type: 'system',
        notification_title: 'New Dispute',
        notification_message: `A new dispute has been raised. Priority: medium`,
        notification_data: {
          dispute_id: dispute.id,
          escrow_id: disputeData.escrow_account_id,
          raised_by: user.id
        }
      });

      if (adminNotifyError) {
        console.log('Admin notification RPC not available', adminNotifyError.message);
      }
    };

    await Promise.all([
      // Notify other party
      supabase.from('notifications').insert({
        user_id: otherPartyId,
        type: 'system',
        title: 'Dispute Raised',
        message: `A dispute has been raised for your booking. Our team will review it shortly.`,
        data: {
          dispute_id: dispute.id,
          escrow_id: disputeData.escrow_account_id,
          booking_id: disputeData.booking_id
        }
      }),
      // Notify admins (fallback handled inside function)
      notifyAdmins()
    ]);

    return NextResponse.json({ 
      success: true,
      dispute,
      message: 'Dispute created successfully. Our team will review it within 24 hours.'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid dispute data', details: error.errors }, { status: 400 });
    }
    console.error('Dispute POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/escrow/dispute
 * Update dispute status (admin only)
 */
export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const updateData = updateDisputeSchema.parse(body);

    // Update dispute
    const { data: dispute, error: updateError } = await supabase
      .from('escrow_disputes')
      .update({
        status: updateData.status,
        resolution_notes: updateData.resolution_notes,
        resolution_action: updateData.resolution_action,
        resolution_amount: updateData.resolution_amount,
        resolved_by: updateData.status === 'resolved' ? user.id : undefined,
        resolved_at: updateData.status === 'resolved' ? new Date().toISOString() : undefined,
        closed_at: updateData.status === 'closed' ? new Date().toISOString() : undefined,
        assigned_to: user.id
      })
      .eq('id', updateData.dispute_id)
      .select(`
        *,
        escrow_accounts (
          id,
          user_id,
          vendor_id,
          booking_id
        )
      `)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // If resolved, execute the resolution action
    if (updateData.status === 'resolved' && updateData.resolution_action && updateData.resolution_amount) {
      const escrow = dispute.escrow_accounts;
      
      if (updateData.resolution_action === 'full_refund' || updateData.resolution_action === 'partial_refund') {
        // Process refund
        await fetch(`${request.nextUrl.origin}/api/escrow/refund`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            escrow_id: escrow.id,
            amount: updateData.resolution_amount,
            reason: `Dispute resolved: ${updateData.resolution_notes || 'Refund approved'}`
          })
        });
      } else if (updateData.resolution_action === 'release_to_vendor') {
        // Release to vendor
        await fetch(`${request.nextUrl.origin}/api/escrow/release`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            escrow_id: escrow.id,
            amount: updateData.resolution_amount,
            notes: `Dispute resolved: ${updateData.resolution_notes || 'Release approved'}`
          })
        });
      }

      // Update escrow status
      await supabase
        .from('escrow_accounts')
        .update({ status: 'funded' })
        .eq('id', escrow.id);
    }

    // Notify involved parties
    await Promise.all([
      supabase.from('notifications').insert({
        user_id: dispute.escrow_accounts.user_id,
        type: 'system',
        title: 'Dispute Updated',
        message: `Your dispute has been ${updateData.status}. ${updateData.resolution_notes || ''}`,
        data: {
          dispute_id: dispute.id,
          status: updateData.status,
          resolution_action: updateData.resolution_action
        }
      }),
      supabase.from('notifications').insert({
        user_id: dispute.escrow_accounts.vendor_id,
        type: 'system',
        title: 'Dispute Updated',
        message: `The dispute has been ${updateData.status}. ${updateData.resolution_notes || ''}`,
        data: {
          dispute_id: dispute.id,
          status: updateData.status,
          resolution_action: updateData.resolution_action
        }
      })
    ]);

    return NextResponse.json({ 
      success: true,
      dispute,
      message: 'Dispute updated successfully'
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid update data', details: error.errors }, { status: 400 });
    }
    console.error('Dispute PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
