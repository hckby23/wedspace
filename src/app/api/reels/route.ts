import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const reelQuerySchema = z.object({
  category: z.string().optional(),
  trending: z.coerce.boolean().default(false),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createReelSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  video_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  category: z.string(),
  tags: z.array(z.string()).optional(),
  duration: z.number().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const query = reelQuerySchema.parse(Object.fromEntries(searchParams));

    let reelsQuery = supabase
      .from('reels')
      .select(`
        *,
        profiles (full_name)
      `)
      .eq('is_active', true)
      .order(query.trending ? 'view_count' : 'created_at', { ascending: false })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.category) {
      reelsQuery = reelsQuery.eq('category', query.category);
    }

    const { data: reels, error } = await reelsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      reels,
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
    const validatedData = createReelSchema.parse(body);

    const { data: reel, error } = await supabase
      .from('reels')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        video_url: validatedData.video_url,
        thumbnail_url: validatedData.thumbnail_url,
        category: validatedData.category,
        tags: validatedData.tags,
        duration: validatedData.duration,
        is_active: false, // Admin approval required
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ reel });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
