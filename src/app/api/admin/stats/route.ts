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

    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get total venues
    const { count: totalVenues } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'venue');

    // Get total vendors
    const { count: totalVendors } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('listing_type', 'vendor');

    // Get total bookings
    const { count: totalBookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    // Get active listings
    const { count: activeListings } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Get pending approvals
    const { count: pendingApprovals } = await supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    // Calculate monthly revenue and commission (from completed bookings this month)
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: monthlyBookings } = await supabase
      .from('bookings')
      .select('final_price, commission_amount')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString());

    const monthlyRevenue = monthlyBookings?.reduce((sum, b) => sum + (b.final_price || 0), 0) || 0;
    const commissionEarned = monthlyBookings?.reduce((sum, b) => sum + (b.commission_amount || 0), 0) || 0;

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalVenues: totalVenues || 0,
      totalVendors: totalVendors || 0,
      totalBookings: totalBookings || 0,
      monthlyRevenue,
      commissionEarned,
      activeListings: activeListings || 0,
      pendingApprovals: pendingApprovals || 0,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
