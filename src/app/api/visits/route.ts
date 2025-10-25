import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const scheduleVisitSchema = z.object({
  listing_id: z.string().uuid(),
  visit_date: z.string(),
  visit_time: z.string(),
  guest_count: z.number().optional(),
  message: z.string().optional(),
});

const visitQuerySchema = z.object({
  listing_id: z.string().uuid().optional(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled']).optional(),
  upcoming: z.coerce.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = scheduleVisitSchema.parse(body);

    // Check if listing exists
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, owner_id, title')
      .eq('id', validatedData.listing_id)
      .eq('status', 'active')
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found or inactive' }, { status: 404 });
    }

    // Prevent self-visit
    if (listing.owner_id === user.id) {
      return NextResponse.json({ error: 'Cannot schedule visit to your own listing' }, { status: 400 });
    }

    const visitDateTime = new Date(`${validatedData.visit_date}T${validatedData.visit_time}`);

    const { data: visit, error } = await supabase
      .from('visits')
      .insert({
        listing_id: validatedData.listing_id,
        user_id: user.id,
        visit_date: visitDateTime.toISOString(),
        guest_count: validatedData.guest_count,
        message: validatedData.message,
        status: 'scheduled',
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for listing owner
    await supabase.from('notifications').insert({
      user_id: listing.owner_id,
      type: 'booking',
      title: 'New Visit Request',
      message: `You have received a visit request for ${listing.title} on ${validatedData.visit_date}`,
      data: { visit_id: visit.id, listing_id: validatedData.listing_id },
    });

    return NextResponse.json({ visit });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = visitQuerySchema.parse(Object.fromEntries(searchParams));

    let visitsQuery = supabase
      .from('visits')
      .select(`
        *,
        listings (
          id,
          title,
          listing_type,
          owner_id,
          venues (name, address),
          vendors (name, category)
        )
      `)
      .or(`user_id.eq.${user.id},listings.owner_id.eq.${user.id}`)
      .order('visit_date', { ascending: true });

    if (query.listing_id) {
      visitsQuery = visitsQuery.eq('listing_id', query.listing_id);
    }

    if (query.status) {
      visitsQuery = visitsQuery.eq('status', query.status);
    }

    if (query.upcoming) {
      visitsQuery = visitsQuery.gte('visit_date', new Date().toISOString());
    }

    const { data: visits, error } = await visitsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ visits });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
