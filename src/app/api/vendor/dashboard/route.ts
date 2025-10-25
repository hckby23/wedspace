import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get vendor's listings
    const { data: listings } = await supabase
      .from('listings')
      .select('id, title, status, listing_type')
      .eq('owner_id', user.id);

    const listingIds = listings?.map(l => l.id) || [];

    // Parallel queries for dashboard data
    const [
      bookingsData,
      paymentsData,
      reviewsData,
      inquiriesData,
      analyticsData
    ] = await Promise.all([
      // Bookings stats
      supabase
        .from('bookings')
        .select('id, status, total_amount, event_date, created_at')
        .in('listing_id', listingIds)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Payments stats
      supabase
        .from('payments')
        .select('id, amount, status, payment_type, created_at')
        .in('booking_id', listingIds)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Reviews stats
      supabase
        .from('reviews')
        .select('id, rating, created_at')
        .in('listing_id', listingIds),
      
      // Inquiries (from negotiations)
      supabase
        .from('negotiations')
        .select('id, status, created_at')
        .in('listing_id', listingIds)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // View/inquiry counts from listings
      supabase
        .from('listings')
        .select('view_count, inquiry_count, booking_count')
        .eq('owner_id', user.id)
    ]);

    const bookings = bookingsData.data || [];
    const payments = paymentsData.data || [];
    const reviews = reviewsData.data || [];
    const inquiries = inquiriesData.data || [];
    const analytics = analyticsData.data || [];

    // Calculate metrics
    const totalRevenue = payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);

    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    const conversionRate = inquiries.length > 0
      ? (bookings.length / inquiries.length) * 100
      : 0;

    const totalViews = analytics.reduce((sum, a) => sum + (a.view_count || 0), 0);
    const totalInquiries = analytics.reduce((sum, a) => sum + (a.inquiry_count || 0), 0);
    const totalBookings = analytics.reduce((sum, a) => sum + (a.booking_count || 0), 0);

    return NextResponse.json({
      summary: {
        total_bookings: bookings.length,
        pending_bookings: bookings.filter(b => b.status === 'pending').length,
        confirmed_bookings: bookings.filter(b => b.status === 'confirmed').length,
        total_revenue: totalRevenue,
        avg_rating: avgRating.toFixed(1),
        total_reviews: reviews.length,
        total_inquiries: inquiries.length,
        conversion_rate: conversionRate.toFixed(1),
        total_views: totalViews,
        response_rate: 85 // Placeholder
      },
      recent_bookings: bookings.slice(0, 10),
      upcoming_events: bookings
        .filter(b => new Date(b.event_date) > new Date())
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
        .slice(0, 5),
      recent_inquiries: inquiries.slice(0, 10),
      revenue_chart: payments
        .filter(p => p.status === 'completed')
        .reduce((acc: any[], p) => {
          const date = new Date(p.created_at).toISOString().split('T')[0];
          const existing = acc.find(item => item.date === date);
          if (existing) {
            existing.amount += p.amount;
          } else {
            acc.push({ date, amount: p.amount });
          }
          return acc;
        }, [])
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
