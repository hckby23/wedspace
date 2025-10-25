import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const taskSchema = z.object({
  title: z.string().min(1),
  category: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  dueDate: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const completed = searchParams.get('completed');
    const weddingId = searchParams.get('weddingId');

    let query = supabase
      .from('checklist_tasks')
      .select('*');

    // Filter by wedding or personal scope
    if (weddingId) {
      query = query.eq('wedding_id', weddingId);
    } else {
      query = query.eq('user_id', user.id).is('wedding_id', null);
    }
    
    query = query.order('created_at', { ascending: false });

    if (category) query = query.eq('category', category);
    if (completed !== null) query = query.eq('done', completed === 'true');

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ tasks: data || [] });
  } catch (error) {
    console.error('Checklist GET error:', error);
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
    const taskData = taskSchema.parse(body.task);
    const weddingId = body.weddingId;

    const insertData: any = {
      title: taskData.title,
      category: taskData.category,
      priority: taskData.priority,
      due_date: taskData.dueDate || null,
      done: false
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
      .from('checklist_tasks')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Checklist POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
