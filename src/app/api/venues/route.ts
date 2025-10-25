import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const venueQuerySchema = z.object({
  city: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  min_rating: z.coerce.number().optional(),
  capacity_min: z.coerce.number().optional(),
  capacity_max: z.coerce.number().optional(),
  venue_type: z.string().optional(),
  amenities: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});

const createVenueSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().default('India'),
  lat: z.number().optional(),
  lng: z.number().optional(),
  capacity_min: z.number().optional(),
  capacity_max: z.number().optional(),
  price_per_plate: z.number().optional(),
  base_price: z.number().optional(),
  venue_type: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  cancellation_policy: z.string().optional(),
  advance_booking_days: z.number().default(30),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const query = venueQuerySchema.parse(Object.fromEntries(searchParams));
    
    let venuesQuery = supabase
      .from('venues')
      .select(`
        *,
        listings!inner (
          id,
          title,
          base_price,
          rating,
          review_count,
          verified,
          featured,
          status
        )
      `)
      .eq('listings.status', 'active')
      .eq('verified', true);

    // Apply filters
    if (query.city) {
      venuesQuery = venuesQuery.ilike('city', `%${query.city}%`);
    }
    
    if (query.min_price) {
      venuesQuery = venuesQuery.gte('base_price', query.min_price);
    }
    
    if (query.max_price) {
      venuesQuery = venuesQuery.lte('base_price', query.max_price);
    }
    
    if (query.min_rating) {
      venuesQuery = venuesQuery.gte('rating', query.min_rating);
    }
    
    if (query.capacity_min) {
      venuesQuery = venuesQuery.gte('capacity_max', query.capacity_min);
    }
    
    if (query.capacity_max) {
      venuesQuery = venuesQuery.lte('capacity_min', query.capacity_max);
    }
    
    if (query.venue_type) {
      venuesQuery = venuesQuery.eq('venue_type', query.venue_type);
    }
    
    if (query.amenities) {
      const amenitiesList = query.amenities.split(',');
      venuesQuery = venuesQuery.contains('amenities', amenitiesList);
    }
    
    if (query.search) {
      venuesQuery = venuesQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%`);
    }

    // Pagination
    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;
    
    venuesQuery = venuesQuery
      .range(from, to)
      .order('rating', { ascending: false });

    const { data: venues, error, count } = await venuesQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      venues,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / query.limit),
      },
    });

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
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const venueData = createVenueSchema.parse(body);

    // Create venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .insert({
        ...venueData,
        owner_id: user.id,
      })
      .select()
      .single();

    if (venueError) {
      return NextResponse.json({ error: venueError.message }, { status: 500 });
    }

    // Create corresponding listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        owner_id: user.id,
        listing_type: 'venue',
        venue_id: venue.id,
        title: venueData.name,
        description: venueData.description,
        base_price: venueData.base_price,
        city: venueData.city,
        state: venueData.state,
        status: 'draft',
      })
      .select()
      .single();

    if (listingError) {
      // Rollback venue creation
      await supabase.from('venues').delete().eq('id', venue.id);
      return NextResponse.json({ error: listingError.message }, { status: 500 });
    }

    return NextResponse.json({ venue, listing }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid venue data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
