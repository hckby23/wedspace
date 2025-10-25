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

    // Approve the listing
    const { data: listing, error } = await supabase
      .from('listings')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Error approving listing:', error);
      return NextResponse.json({ error: 'Failed to approve listing' }, { status: 500 });
    }

    // Log the approval event
    await supabase.from('events').insert({
      user_id: user.id,
      event_type: 'listing_approved',
      event_data: {
        listing_id: params.id,
        listing_title: listing.title,
        listing_type: listing.listing_type,
      },
    });

    // Send notification to listing owner
    await supabase.from('notifications').insert({
      user_id: listing.owner_id,
      type: 'listing_approved',
      title: 'Listing Approved',
      message: `Your listing "${listing.title}" has been approved and is now live!`,
      data: { listing_id: params.id },
    });

    return NextResponse.json({ success: true, listing });
  } catch (error) {
    console.error('Approve listing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
