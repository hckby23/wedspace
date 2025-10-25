import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const moodboardQuerySchema = z.object({
  user_id: z.string().uuid().optional(),
  is_public: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const createMoodboardSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  is_public: z.boolean().default(false),
  items: z.array(z.object({
    type: z.enum(['image', 'color', 'text', 'listing']),
    content: z.string(),
    position_x: z.number(),
    position_y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
    metadata: z.record(z.any()).optional(),
  })).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const query = moodboardQuerySchema.parse(Object.fromEntries(searchParams));

    let moodboardsQuery = supabase
      .from('moodboards')
      .select(`
        *,
        profiles (full_name),
        moodboard_items (*)
      `)
      .order('created_at', { ascending: false })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.user_id) {
      moodboardsQuery = moodboardsQuery.eq('user_id', query.user_id);
    }

    if (query.is_public !== undefined) {
      moodboardsQuery = moodboardsQuery.eq('is_public', query.is_public);
    }

    const { data: moodboards, error } = await moodboardsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      moodboards,
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
    const validatedData = createMoodboardSchema.parse(body);

    // Create moodboard
    const { data: moodboard, error: moodboardError } = await supabase
      .from('moodboards')
      .insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description,
        is_public: validatedData.is_public,
      })
      .select()
      .single();

    if (moodboardError) {
      return NextResponse.json({ error: moodboardError.message }, { status: 500 });
    }

    // Add items if provided
    if (validatedData.items && validatedData.items.length > 0) {
      const itemsToInsert = validatedData.items.map(item => ({
        moodboard_id: moodboard.id,
        type: item.type,
        content: item.content,
        position_x: item.position_x,
        position_y: item.position_y,
        width: item.width,
        height: item.height,
        metadata: item.metadata,
      }));

      const { error: itemsError } = await supabase
        .from('moodboard_items')
        .insert(itemsToInsert);

      if (itemsError) {
        return NextResponse.json({ error: itemsError.message }, { status: 500 });
      }
    }

    // Get complete moodboard with items
    const { data: completeMoodboard, error: fetchError } = await supabase
      .from('moodboards')
      .select(`
        *,
        moodboard_items (*)
      `)
      .eq('id', moodboard.id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    return NextResponse.json({ moodboard: completeMoodboard });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
