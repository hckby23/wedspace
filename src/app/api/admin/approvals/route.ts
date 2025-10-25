import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
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

    // Get pending listings
    const { data: pendingListings } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        listing_type,
        city,
        vendor_category,
        created_at,
        status
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    const approvals = pendingListings?.map(listing => ({
      id: listing.id,
      type: listing.listing_type === 'venue' ? 'venue' : 'vendor',
      name: listing.title,
      location: listing.city,
      category: listing.vendor_category,
      submitted: new Date(listing.created_at).toLocaleDateString(),
      status: 'under_review',
    })) || [];

    return NextResponse.json(approvals);
  } catch (error) {
    console.error('Admin approvals error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
