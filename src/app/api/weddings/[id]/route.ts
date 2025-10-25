import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const updateSchema = z.object({
  title: z.string().optional(),
  event_date: z.string().optional(),
  city: z.string().optional(),
  guest_count_estimate: z.number().optional(),
  total_budget: z.number().optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get wedding with members
    const { data: wedding, error: weddingError } = await supabase
      .from('weddings')
      .select(`
        *,
        members:wedding_members(
          *,
          user:user_id(id, email, full_name, avatar_url)
        )
      `)
      .eq('id', params.id)
      .single();

    if (weddingError) throw weddingError;

    // Get user's role
    const myMembership = wedding.members.find((m: any) => m.user_id === user.id);
    
    return NextResponse.json({
      wedding: {
        ...wedding,
        my_role: myMembership?.role
      }
    });
  } catch (error) {
    console.error('Wedding GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const updates = updateSchema.parse(body);

    // Update will fail if RLS denies (requires owner/partner role)
    const { data: wedding, error: updateError } = await supabase
      .from('weddings')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', params.id)
      .select()
      .single();

    if (updateError) throw updateError;

    return NextResponse.json({ wedding });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Wedding PATCH error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user is owner
    const { data: membership } = await supabase
      .from('wedding_members')
      .select('role')
      .eq('wedding_id', params.id)
      .eq('user_id', user.id)
      .single();

    if (membership?.role !== 'owner') {
      return NextResponse.json({ error: 'Only owner can delete wedding' }, { status: 403 });
    }

    // Delete wedding (cascade will handle members and related data)
    const { error: deleteError } = await supabase
      .from('weddings')
      .delete()
      .eq('id', params.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Wedding DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
