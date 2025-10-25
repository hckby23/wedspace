import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const searchQuerySchema = z.object({
  q: z.string().min(1),
  type: z.enum(['all', 'venues', 'vendors', 'inspiration', 'reels']).default('all'),
  city: z.string().optional(),
  min_price: z.coerce.number().optional(),
  max_price: z.coerce.number().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const query = searchQuerySchema.parse(Object.fromEntries(searchParams));

    const results: any = {
      query: query.q,
      results: {
        listings: [],
        inspiration: [],
        reels: [],
      },
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    };

    // Search listings (venues and vendors)
    if (query.type === 'all' || query.type === 'venues' || query.type === 'vendors') {
      const { data: listings } = await supabase.rpc('search_listings', {
        search_query: query.q,
        listing_type_filter: query.type === 'venues' ? 'venue' : query.type === 'vendors' ? 'vendor' : null,
        city_filter: query.city || null,
        min_price: query.min_price || null,
        max_price: query.max_price || null,
        min_rating: null,
        guest_count_filter: null,
        date_filter: null,
        use_ai_sort: true,
        limit_count: query.limit,
        offset_count: (query.page - 1) * query.limit,
      });

      results.results.listings = listings || [];
    }

    // Search inspiration posts
    if (query.type === 'all' || query.type === 'inspiration') {
      const { data: inspiration } = await supabase
        .from('inspiration_posts')
        .select(`
          *,
          profiles (full_name)
        `)
        .or(`title.ilike.%${query.q}%,description.ilike.%${query.q}%,tags.cs.{${query.q}}`)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(query.type === 'inspiration' ? query.limit : 5);

      results.results.inspiration = inspiration || [];
    }

    // Search reels
    if (query.type === 'all' || query.type === 'reels') {
      const { data: reels } = await supabase
        .from('reels')
        .select(`
          *,
          profiles (full_name)
        `)
        .or(`title.ilike.%${query.q}%,description.ilike.%${query.q}%,tags.cs.{${query.q}}`)
        .eq('is_active', true)
        .order('view_count', { ascending: false })
        .limit(query.type === 'reels' ? query.limit : 5);

      results.results.reels = reels || [];
    }

    // Log search event for analytics
    await supabase.from('events').insert({
      event_type: 'search',
      metadata: {
        query: query.q,
        type: query.type,
        city: query.city,
        results_count: {
          listings: results.results.listings.length,
          inspiration: results.results.inspiration.length,
          reels: results.results.reels.length,
        },
      },
    });

    return NextResponse.json(results);

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
