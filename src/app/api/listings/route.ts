import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const listingsQuerySchema = z.object({
  kind: z.enum(['venue', 'vendor']).optional(),
  city: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  min_rating: z.coerce.number().optional(),
  guest_count: z.coerce.number().optional(),
  date: z.string().optional(),
  sort: z.enum(['rating', 'price_low', 'price_high', 'newest', 'ai']).default('rating'),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
  search: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const query = listingsQuerySchema.parse(Object.fromEntries(searchParams));
    
    // Use the search_listings function for complex queries
    const { data: listings, error } = await supabase.rpc('search_listings', {
      search_query: query.search || null,
      listing_type_filter: query.kind || null,
      city_filter: query.city || null,
      min_price: query.min_price || null,
      max_price: query.max_price || null,
      min_rating: query.min_rating || null,
      guest_count_filter: query.guest_count || null,
      date_filter: query.date || null,
      use_ai_sort: query.sort === 'ai',
      limit_count: query.limit,
      offset_count: (query.page - 1) * query.limit,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('listings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('verified', true);

    if (query.kind) countQuery = countQuery.eq('listing_type', query.kind);
    if (query.city) countQuery = countQuery.ilike('city', `%${query.city}%`);
    if (query.min_price) countQuery = countQuery.gte('base_price', query.min_price);
    if (query.max_price) countQuery = countQuery.lte('base_price', query.max_price);
    if (query.min_rating) countQuery = countQuery.gte('rating', query.min_rating);

    const { count } = await countQuery;

    return NextResponse.json({
      listings,
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
