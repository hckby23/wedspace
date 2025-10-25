import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const blockDatesSchema = z.object({
  listing_id: z.string().uuid(),
  start_date: z.string(),
  end_date: z.string(),
  reason: z.string().min(3),
  block_type: z.enum(['holiday', 'maintenance', 'personal', 'other']).optional()
});

/**
 * GET /api/availability/block
 * Get blocked dates for a listing
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const listing_id = searchParams.get('listing_id');

    if (!listing_id) {
      return NextResponse.json({ error: 'listing_id is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('listing_id', listing_id)
      .eq('is_active', true)
      .order('start_date');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ blocked_dates: data });
  } catch (error) {
    console.error('Block dates GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST /api/availability/block
 * Block dates for a listing
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const blockData = blockDatesSchema.parse(body);

    // Verify ownership
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', blockData.listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Call block_dates function
    const { data: blocked_id, error: blockError } = await supabase.rpc('block_dates', {
      p_listing_id: blockData.listing_id,
      p_owner_id: user.id,
      p_start_date: blockData.start_date,
      p_end_date: blockData.end_date,
      p_reason: blockData.reason,
      p_block_type: blockData.block_type || 'other'
    });

    if (blockError) {
      return NextResponse.json({ error: blockError.message }, { status: 500 });
    }

    // Get the created blocked date
    const { data: blockedDate, error: fetchError } = await supabase
      .from('blocked_dates')
      .select('*')
      .eq('id', blocked_id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      blocked_date: blockedDate,
      message: 'Dates blocked successfully'
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid block data', details: error.errors }, { status: 400 });
    }
    console.error('Block dates POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * DELETE /api/availability/block
 * Unblock dates
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const blocked_date_id = searchParams.get('id');

    if (!blocked_date_id) {
      return NextResponse.json({ error: 'blocked_date_id is required' }, { status: 400 });
    }

    // Verify ownership
    const { data: blockedDate, error: fetchError } = await supabase
      .from('blocked_dates')
      .select('owner_id')
      .eq('id', blocked_date_id)
      .single();

    if (fetchError || !blockedDate) {
      return NextResponse.json({ error: 'Blocked date not found' }, { status: 404 });
    }

    if (blockedDate.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Deactivate blocked date
    const { error: updateError } = await supabase
      .from('blocked_dates')
      .update({ is_active: false })
      .eq('id', blocked_date_id);

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Dates unblocked successfully'
    });
  } catch (error) {
    console.error('Block dates DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
