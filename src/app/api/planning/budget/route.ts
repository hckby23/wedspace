import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const budgetItemSchema = z.object({
  name: z.string().min(1),
  amount: z.number().min(0),
  category: z.string(),
  priority: z.enum(['high', 'medium', 'low']),
  vendor: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['planned', 'booked', 'paid'])
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
      .from('budget_items')
      .select('*');

    // Filter by wedding or personal scope
    if (weddingId) {
      query = query.eq('wedding_id', weddingId);
    } else {
      query = query.eq('user_id', user.id).is('wedding_id', null);
    }

    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ items: data || [] });
  } catch (error) {
    console.error('Budget GET error:', error);
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
    const itemData = budgetItemSchema.parse(body.item);
    const weddingId = body.weddingId;

    const insertData: any = {
      name: itemData.name,
      amount: itemData.amount,
      category: itemData.category,
      priority: itemData.priority,
      vendor: itemData.vendor || null,
      notes: itemData.notes || null,
      status: itemData.status
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
      .from('budget_items')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ item: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Budget POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
