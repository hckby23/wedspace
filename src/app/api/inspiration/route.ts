import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const inspirationQuerySchema = z.object({
  category: z.string().optional(),
  style: z.string().optional(),
  color_palette: z.string().optional(),
  budget_range: z.string().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createInspirationSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  category: z.string(),
  style: z.string().optional(),
  color_palette: z.array(z.string()).optional(),
  budget_range: z.string().optional(),
  tags: z.array(z.string()).optional(),
  images: z.array(z.string()).min(1),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const query = inspirationQuerySchema.parse(Object.fromEntries(searchParams));

    let inspirationQuery = supabase
      .from('inspiration_posts')
      .select(`
        *,
        profiles (full_name)
      `)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.category) {
      inspirationQuery = inspirationQuery.eq('category', query.category);
    }

    if (query.style) {
      inspirationQuery = inspirationQuery.eq('style', query.style);
    }

    if (query.color_palette) {
      inspirationQuery = inspirationQuery.contains('color_palette', [query.color_palette]);
    }

    if (query.budget_range) {
      inspirationQuery = inspirationQuery.eq('budget_range', query.budget_range);
    }

    const { data: inspiration, error } = await inspirationQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      inspiration,
      pagination: {
        page: query.page,
        limit: query.limit,
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
    const validatedData = createInspirationSchema.parse(body);

    const { data: inspiration, error } = await supabase
      .from('inspiration_posts')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        style: validatedData.style,
        color_palette: validatedData.color_palette,
        budget_range: validatedData.budget_range,
        tags: validatedData.tags,
        images: validatedData.images,
        is_featured: false, // Admin approval required
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ inspiration });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
