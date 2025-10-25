import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const onboardingSchema = z.object({
  role: z.enum(['user', 'vendor', 'venue_owner']),
  business_name: z.string().optional(),
  business_category: z.string().optional(),
  business_description: z.string().optional(),
  city: z.string(),
  state: z.string(),
  phone: z.string().optional(),
  website: z.string().optional(),
  services_offered: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  capacity_min: z.number().optional(),
  capacity_max: z.number().optional(),
  base_price: z.number().optional(),
  price_per_plate: z.number().optional(),
  venue_type: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = onboardingSchema.parse(body);

    // Update profile with role and basic info
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        role: validatedData.role,
        city: validatedData.city,
        phone: validatedData.phone,
      })
      .eq('id', user.id);

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    let businessId = null;

    // Create business record based on role
    if (validatedData.role === 'venue_owner') {
      const { data: venue, error: venueError } = await supabase
        .from('venues')
        .insert({
          owner_id: user.id,
          name: validatedData.business_name || 'My Venue',
          description: validatedData.business_description,
          address: `${validatedData.city}, ${validatedData.state}`,
          city: validatedData.city,
          state: validatedData.state,
          venue_type: validatedData.venue_type,
          capacity_min: validatedData.capacity_min,
          capacity_max: validatedData.capacity_max,
          base_price: validatedData.base_price,
          price_per_plate: validatedData.price_per_plate,
          amenities: validatedData.amenities,
          status: 'draft',
        })
        .select()
        .single();

      if (venueError) {
        return NextResponse.json({ error: venueError.message }, { status: 500 });
      }

      businessId = venue.id;

      // Create listing
      await supabase.from('listings').insert({
        owner_id: user.id,
        listing_type: 'venue',
        venue_id: venue.id,
        title: validatedData.business_name || 'My Venue',
        description: validatedData.business_description,
        base_price: validatedData.base_price,
        city: validatedData.city,
        state: validatedData.state,
        status: 'draft',
      });

    } else if (validatedData.role === 'vendor') {
      const { data: vendor, error: vendorError } = await supabase
        .from('vendors')
        .insert({
          owner_id: user.id,
          name: validatedData.business_name || 'My Business',
          category: validatedData.business_category || 'Other',
          description: validatedData.business_description,
          city: validatedData.city,
          state: validatedData.state,
          services_offered: validatedData.services_offered,
          website: validatedData.website,
          status: 'draft',
        })
        .select()
        .single();

      if (vendorError) {
        return NextResponse.json({ error: vendorError.message }, { status: 500 });
      }

      businessId = vendor.id;

      // Create listing
      await supabase.from('listings').insert({
        owner_id: user.id,
        listing_type: 'vendor',
        vendor_id: vendor.id,
        title: validatedData.business_name || 'My Business',
        description: validatedData.business_description,
        base_price: validatedData.base_price,
        city: validatedData.city,
        state: validatedData.state,
        status: 'draft',
      });
    }

    return NextResponse.json({ 
      success: true, 
      role: validatedData.role,
      business_id: businessId 
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
