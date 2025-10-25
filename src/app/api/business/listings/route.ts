import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createListingSchema = z.object({
  listing_type: z.enum(['venue', 'vendor']),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  base_price: z.number().optional(),
  city: z.string(),
  state: z.string(),
  tags: z.array(z.string()).optional(),
  // Venue specific
  venue_data: z.object({
    venue_type: z.string().optional(),
    capacity_min: z.number().optional(),
    capacity_max: z.number().optional(),
    amenities: z.array(z.string()).optional(),
    address: z.string().optional(),
  }).optional(),
  // Vendor specific
  vendor_data: z.object({
    category: z.string().optional(),
    services_offered: z.array(z.string()).optional(),
    website: z.string().optional(),
  }).optional(),
});

const updateListingSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  base_price: z.number().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's listings
    const { data: listings, error } = await supabase
      .from('listings')
      .select(`
        *,
        venues (*),
        vendors (*),
        media (*),
        scorecards (*)
      `)
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ listings });

  } catch (error) {
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
    const validatedData = createListingSchema.parse(body);

    let businessId = null;

    // Create business record first
    if (validatedData.listing_type === 'venue' && validatedData.venue_data) {
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .insert({
          owner_id: user.id,
          name: validatedData.title,
          description: validatedData.description,
          address: validatedData.venue_data.address || `${validatedData.city}, ${validatedData.state}`,
          city: validatedData.city,
          state: validatedData.state,
          venue_type: validatedData.venue_data.venue_type,
          capacity_min: validatedData.venue_data.capacity_min,
          capacity_max: validatedData.venue_data.capacity_max,
          base_price: validatedData.base_price,
          amenities: validatedData.venue_data.amenities,
          status: 'draft',
        })
        .select()
        .single();

      if (venueError) {
        return NextResponse.json({ error: venueError.message }, { status: 500 });
      }
      businessId = venue.id;

    } else if (validatedData.listing_type === 'vendor' && validatedData.vendor_data) {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          owner_id: user.id,
          name: validatedData.title,
          category: validatedData.vendor_data.category || 'Other',
          description: validatedData.description,
          city: validatedData.city,
          state: validatedData.state,
          services_offered: validatedData.vendor_data.services_offered,
          website: validatedData.vendor_data.website,
          status: 'draft',
        })
        .select()
        .single();

      if (vendorError) {
        return NextResponse.json({ error: vendorError.message }, { status: 500 });
      }
      businessId = vendor.id;
    }

    // Create listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        owner_id: user.id,
        listing_type: validatedData.listing_type,
        venue_id: validatedData.listing_type === 'venue' ? businessId : null,
        vendor_id: validatedData.listing_type === 'vendor' ? businessId : null,
        title: validatedData.title,
        description: validatedData.description,
        base_price: validatedData.base_price,
        city: validatedData.city,
        state: validatedData.state,
        tags: validatedData.tags,
        status: 'draft',
      })
      .select()
      .single();

    if (listingError) {
      return NextResponse.json({ error: listingError.message }, { status: 500 });
    }

    return NextResponse.json({ listing });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { listing_id, ...updates } = body;
    const validatedUpdates = updateListingSchema.parse(updates);

    const { data: listing, error } = await supabase
      .from('listings')
      .update(validatedUpdates)
      .eq('id', listing_id)
      .eq('owner_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ listing });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
