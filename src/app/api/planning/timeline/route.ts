import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const timelineItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  date: z.string(),
  category: z.string(),
  completed: z.boolean().optional().default(false),
  assigned_to: z.string().optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const weddingId = searchParams.get('weddingId');

    let query = supabase
      .from('timeline_items')
      .select('*');

    // Filter by wedding or personal scope
    if (weddingId) {
      query = query.eq('wedding_id', weddingId);
    } else {
      query = query.eq('user_id', user.id).is('wedding_id', null);
    }

    query = query.order('date', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('Timeline GET error:', error);
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
    const itemData = timelineItemSchema.parse(body.item);
    const weddingId = body.weddingId;

    const insertData: any = {
      title: itemData.title,
      description: itemData.description,
      date: itemData.date,
      category: itemData.category,
      completed: itemData.completed,
      assigned_to: itemData.assigned_to
    };

    // Set scope: wedding or personal
    if (weddingId) {
      insertData.wedding_id = weddingId;
      insertData.user_id = null;
    } else {
      insertData.user_id = user.id;
      insertData.wedding_id = null;
    }

    const { data, error } = await supabase
      .from('timeline_items')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Timeline POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
