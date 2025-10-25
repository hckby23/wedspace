import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const analyticsQuerySchema = z.object({
  event_type: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  listing_id: z.string().uuid().optional(),
  user_id: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is admin or listing owner
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const { searchParams } = new URL(request.url);
    const query = analyticsQuerySchema.parse(Object.fromEntries(searchParams));

    let eventsQuery = supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false });

    // Non-admin users can only see their own listing analytics
    if (profile?.role !== 'admin') {
      if (query.listing_id) {
        // Verify user owns the listing
        const { data: listing } = await supabase
          .from('listings')
          .select('owner_id')
          .eq('id', query.listing_id)
          .eq('owner_id', user.id)
          .single();

        if (!listing) {
          return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }
      } else {
        // Show only events for user's listings
        const { data: userListings } = await supabase
          .from('listings')
          .select('id')
          .eq('owner_id', user.id);

        const listingIds = userListings?.map(l => l.id) || [];
        if (listingIds.length === 0) {
          return NextResponse.json({ events: [] });
        }

        eventsQuery = eventsQuery.in('listing_id', listingIds);
      }
    }

    if (query.event_type) {
      eventsQuery = eventsQuery.eq('event_type', query.event_type);
    }

    if (query.start_date) {
      eventsQuery = eventsQuery.gte('created_at', query.start_date);
    }

    if (query.end_date) {
      eventsQuery = eventsQuery.lte('created_at', query.end_date);
    }

    if (query.listing_id) {
      eventsQuery = eventsQuery.eq('listing_id', query.listing_id);
    }

    if (query.user_id && profile?.role === 'admin') {
      eventsQuery = eventsQuery.eq('user_id', query.user_id);
    }

    const { data: events, error } = await eventsQuery.limit(1000);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ events });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const body = await request.json();
    const { event_type, listing_id, user_id, metadata } = body;

    // Create analytics event
    const { error } = await supabase.from('events').insert({
      event_type,
      listing_id,
      user_id,
      metadata,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
