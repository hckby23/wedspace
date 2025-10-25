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

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get top performing listings based on bookings and revenue
    const { data: topListings } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        listing_type,
        base_price,
        bookings:bookings(count, final_price),
        reviews:reviews(rating)
      `)
      .eq('status', 'active')
      .limit(limit * 2); // Get more to calculate properly

    if (!topListings) {
      return NextResponse.json([]);
    }

    // Calculate performance metrics
    const performers = topListings
      .map(listing => {
        const bookingsData = listing.bookings as any[];
        const reviewsData = listing.reviews as any[];
        
        const bookingCount = bookingsData?.length || 0;
        const totalRevenue = bookingsData?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0;
        const avgRating = reviewsData?.length 
          ? reviewsData.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewsData.length 
          : 0;

        return {
          type: listing.listing_type === 'venue' ? 'venue' : 'vendor',
          name: listing.title,
          bookings: bookingCount,
          revenue: `₹${(totalRevenue / 1000).toFixed(0)}K`,
          rating: parseFloat(avgRating.toFixed(1)),
        };
      })
      .sort((a, b) => b.bookings - a.bookings)
      .slice(0, limit);

    return NextResponse.json(performers);
  } catch (error) {
    console.error('Admin top performers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
