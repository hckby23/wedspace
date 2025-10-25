import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';
import type { CreateWeddingRequest } from '@/types/wedding';

const createWeddingSchema = z.object({
  title: z.string().min(1),
  event_date: z.string().optional(),
  city: z.string().optional(),
  guest_count_estimate: z.number().optional(),
  total_budget: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all weddings user is a member of
    const { data: memberships, error: memberError } = await supabase
      .from('wedding_members')
      .select(`
        wedding_id,
        role,
        status,
        weddings:wedding_id (*)
      `)
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (memberError) throw memberError;

    const weddings = memberships?.map(m => ({
      ...m.weddings,
      my_role: m.role
    })) || [];

    return NextResponse.json({ weddings });
  } catch (error) {
    console.error('Weddings GET error:', error);
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

    const body: CreateWeddingRequest = await request.json();
    const validatedData = createWeddingSchema.parse(body);

    // Create wedding
    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .insert({
        ...validatedData,
        created_by: user.id
      })
      .select()
      .single();

    if (weddingError) throw weddingError;

    // Add creator as owner
    const { error: memberError } = await supabase
      .from('wedding_members')
      .insert({
        wedding_id: wedding.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (memberError) throw memberError;

    return NextResponse.json({ wedding }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Wedding POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
