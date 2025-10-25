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
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get recent events/activities
    const { data: events } = await supabase
      .from('events')
      .select(`
        id,
        event_type,
        event_data,
        created_at,
        profiles:user_id (full_name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Transform events to activity format
    const activities = events?.map(event => {
      const data = event.event_data as any;
      let type: 'booking' | 'venue' | 'vendor' | 'payment' | 'user' = 'user';
      let description = '';
      let status = 'completed';
      let amount: string | undefined;

      switch (event.event_type) {
        case 'booking_created':
          type = 'booking';
          description = `New booking created by ${data.user_name || 'User'}`;
          status = 'pending';
          amount = data.amount ? `₹${data.amount.toLocaleString()}` : undefined;
          break;
        case 'listing_created':
          type = data.listing_type === 'venue' ? 'venue' : 'vendor';
          description = `New ${data.listing_type} listing: ${data.title}`;
          status = 'under_review';
          break;
        case 'payment_completed':
          type = 'payment';
          description = `Payment received for booking #${data.booking_id}`;
          status = 'success';
          amount = data.amount ? `₹${data.amount.toLocaleString()}` : undefined;
          break;
        case 'user_registered':
          type = 'user';
          description = `New user registered: ${data.user_name || 'Unknown'}`;
          status = 'success';
          break;
        default:
          description = event.event_type.replace(/_/g, ' ');
      }

      return {
        id: event.id,
        type,
        description,
        status,
        amount,
        time: new Date(event.created_at).toLocaleString(),
      };
    }) || [];

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Admin activities error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
