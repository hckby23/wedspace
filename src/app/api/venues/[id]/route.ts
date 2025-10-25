import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const updateVenueSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
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
  advance_booking_days: z.number().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    const { data: venue, error } = await supabase
      .from('venues')
      .select(`
        *,
        listings!inner (
          id,
          title,
          description,
          base_price,
          rating,
          review_count,
          verified,
          featured,
          status,
          view_count,
          inquiry_count,
          booking_count
        ),
        reviews (
          id,
          rating,
          title,
          content,
          images,
          is_verified,
          is_featured,
          helpful_count,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .eq('listings.status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment view count
    await supabase
      .from('listings')
      .update({ view_count: venue.listings.view_count + 1 })
      .eq('venue_id', id);

    return NextResponse.json({ venue });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (venueError || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    if (venue.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const venueData = updateVenueSchema.parse(body);

    const { data: updatedVenue, error: updateError } = await supabase
      .from('venues')
      .update(venueData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update corresponding listing if title or description changed
    if (venueData.name || venueData.description || venueData.base_price) {
      const listingUpdate: any = {};
      if (venueData.name) listingUpdate.title = venueData.name;
      if (venueData.description) listingUpdate.description = venueData.description;
      if (venueData.base_price) listingUpdate.base_price = venueData.base_price;

      await supabase
        .from('listings')
        .update(listingUpdate)
        .eq('venue_id', id);
    }

    return NextResponse.json({ venue: updatedVenue });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid venue data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this venue
    const { data: venue, error: venueError } = await supabase
      .from('venues')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (venueError || !venue) {
      return NextResponse.json({ error: 'Venue not found' }, { status: 404 });
    }

    if (venue.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete by updating status
    const { error: deleteError } = await supabase
      .from('venues')
      .update({ status: 'inactive' })
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Also update listing status
    await supabase
      .from('listings')
      .update({ status: 'inactive' })
      .eq('venue_id', id);

    return NextResponse.json({ message: 'Venue deleted successfully' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
