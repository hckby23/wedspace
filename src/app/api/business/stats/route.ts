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

    // Get user's listings
    const { data: listings } = await supabase
      .from('listings')
      .select('id')
      .eq('owner_id', user.id)
      .eq('listing_type', businessType || 'venue');

    const listingIds = listings?.map(l => l.id) || [];

    if (listingIds.length === 0) {
      return NextResponse.json({
        totalBookings: 0,
        totalRevenue: 0,
        activeListings: 0,
        averageRating: 0,
        completedBookings: 0,
        pendingBookings: 0,
        totalReviews: 0,
        responseRate: 0,
      });
    }

    // Get bookings statistics
    const { data: bookings } = await supabase
      .from('bookings')
      .select('status, final_price')
      .in('listing_id', listingIds);

    const totalBookings = bookings?.length || 0;
    const completedBookings = bookings?.filter(b => b.status === 'completed').length || 0;
    const pendingBookings = bookings?.filter(b => b.status === 'pending').length || 0;
    const totalRevenue = bookings?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0;

    // Get reviews statistics
    const { data: reviews } = await supabase
      .from('reviews')
      .select('rating')
      .in('listing_id', listingIds);

    const totalReviews = reviews?.length || 0;
    const averageRating = reviews?.length
      ? reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length
      : 0;

    // Get active listings count
    const { count: activeListings } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)
      .eq('status', 'active')
      .eq('listing_type', businessType || 'venue');

    // Calculate response rate (simplified - you'd track actual responses)
    const responseRate = 85; // Placeholder

    return NextResponse.json({
      totalBookings,
      totalRevenue,
      activeListings: activeListings || 0,
      averageRating: parseFloat(averageRating.toFixed(1)),
      completedBookings,
      pendingBookings,
      totalReviews,
      responseRate,
    });
  } catch (error) {
    console.error('Business stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
