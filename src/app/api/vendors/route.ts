import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const vendorQuerySchema = z.object({
  category: z.string().optional(),
  city: z.string().optional(),
  price_range: z.string().optional(),
  min_rating: z.coerce.number().optional(),
  services: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});

const createVendorSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  description: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().default('India'),
  price_range: z.string().optional(),
  services_offered: z.array(z.string()).optional(),
  portfolio_images: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  website: z.string().url().optional(),
  cancellation_policy: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const query = vendorQuerySchema.parse(Object.fromEntries(searchParams));
    
    let vendorsQuery = supabase
      .from('vendors')
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
    if (query.category) {
      vendorsQuery = vendorsQuery.eq('category', query.category);
    }
    
    if (query.city) {
      vendorsQuery = vendorsQuery.ilike('city', `%${query.city}%`);
    }
    
    if (query.price_range) {
      vendorsQuery = vendorsQuery.eq('price_range', query.price_range);
    }
    
    if (query.min_rating) {
      vendorsQuery = vendorsQuery.gte('rating', query.min_rating);
    }
    
    if (query.services) {
      const servicesList = query.services.split(',');
      vendorsQuery = vendorsQuery.contains('services_offered', servicesList);
    }
    
    if (query.search) {
      vendorsQuery = vendorsQuery.or(`name.ilike.%${query.search}%,description.ilike.%${query.search}%,category.ilike.%${query.search}%`);
    }

    // Pagination
    const from = (query.page - 1) * query.limit;
    const to = from + query.limit - 1;
    
    vendorsQuery = vendorsQuery
      .range(from, to)
      .order('rating', { ascending: false });

    const { data: vendors, error, count } = await vendorsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      vendors,
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
    const vendorData = createVendorSchema.parse(body);

    // Create vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .insert({
        ...vendorData,
        owner_id: user.id,
      })
      .select()
      .single();

    if (vendorError) {
      return NextResponse.json({ error: vendorError.message }, { status: 500 });
    }

    // Create corresponding listing
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .insert({
        owner_id: user.id,
        listing_type: 'vendor',
        vendor_id: vendor.id,
        title: vendorData.name,
        description: vendorData.description,
        city: vendorData.city,
        state: vendorData.state,
        status: 'draft',
      })
      .select()
      .single();

    if (listingError) {
      // Rollback vendor creation
      await supabase.from('vendors').delete().eq('id', vendor.id);
      return NextResponse.json({ error: listingError.message }, { status: 500 });
    }

    return NextResponse.json({ vendor, listing }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid vendor data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
