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

    // Get user's listings with performance data
    const { data: listings } = await supabase
      .from('listings')
      .select(`
        id,
        title,
        bookings:bookings(count, final_price),
        events:events!events_listing_id_fkey(event_type)
      `)
      .eq('owner_id', user.id)
      .eq('listing_type', businessType || 'venue')
      .eq('status', 'active');

    if (!listings) {
      return NextResponse.json([]);
    }

    const performance = listings.map(listing => {
      const bookingsData = listing.bookings as any[];
      const eventsData = listing.events as any[];

      const bookings = bookingsData?.length || 0;
      const revenue = bookingsData?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0;
      
      // Count views and inquiries from events
      const views = eventsData?.filter(e => e.event_type === 'listing_viewed').length || 0;
      const inquiries = eventsData?.filter(e => e.event_type === 'inquiry_sent').length || 0;
      
      const conversion_rate = inquiries > 0 ? (bookings / inquiries) * 100 : 0;

      return {
        listing_id: listing.id,
        title: listing.title,
        views,
        inquiries,
        bookings,
        revenue,
        conversion_rate: parseFloat(conversion_rate.toFixed(1)),
      };
    });

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Business performance error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
