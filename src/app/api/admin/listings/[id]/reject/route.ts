import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_type')
      .eq('id', user.id)
      .single();

    if (profile?.user_type !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { reason } = body;

    // Reject the listing
    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error rejecting listing:', error);
      return NextResponse.json({ error: 'Failed to reject listing' }, { status: 500 });
    }

    // Log the rejection event
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'listing_rejected',
      event_data: {
        listing_id: params.id,
        listing_title: listing.title,
        listing_type: listing.listing_type,
        reason,
      },
    });

    // Send notification to listing owner
    await supabase.from('notifications').insert({
      user_id: listing.owner_id,
      type: 'listing_rejected',
      title: 'Listing Rejected',
      message: `Your listing "${listing.title}" was not approved. ${reason ? `Reason: ${reason}` : ''}`,
      data: { listing_id: params.id, reason },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('Reject listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
