import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const settingsSchema = z.object({
  totalBudget: z.number().min(0)
});

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { totalBudget } = settingsSchema.parse(body);

    const { data, error } = await supabase
      .from('user_settings')
      .upsert({
        user_id: user.id,
        total_budget: totalBudget
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ settings: data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Budget settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
