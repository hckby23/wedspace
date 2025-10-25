import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const businessType = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get user's listings
    const { data: listings } = await supabase
      .from('listings')
      .select('id')
      .eq('owner_id', user.id)
      .eq('listing_type', businessType || 'venue');

    const listingIds = listings?.map(l => l.id) || [];

    if (listingIds.length === 0) {
      return NextResponse.json([]);
    }

    // Get recent bookings
    const { data: bookings } = await supabase
      .from('bookings')
      .select(`
        id,
        event_date,
        final_price,
        status,
        created_at,
        profiles:user_id (full_name)
      `)
      .in('listing_id', listingIds)
      .order('created_at', { ascending: false })
      .limit(limit);

    const recentBookings = bookings?.map(booking => ({
      id: booking.id,
      customer_name: (booking.profiles as any)?.full_name || 'Guest',
      event_date: booking.event_date,
      amount: booking.final_price,
      status: booking.status,
      created_at: booking.created_at,
    })) || [];

    return NextResponse.json(recentBookings);
  } catch (error) {
    console.error('Business bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
