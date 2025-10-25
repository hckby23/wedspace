import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const guestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  category: z.string().optional(),
  side: z.enum(['bride', 'groom', 'both']).optional(),
  rsvp_status: z.enum(['pending', 'confirmed', 'declined']).optional().default('pending'),
  plus_one: z.boolean().optional().default(false),
  dietary_restrictions: z.array(z.string()).optional(),
  notes: z.string().optional()
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
    const category = searchParams.get('category');
    const rsvpStatus = searchParams.get('rsvpStatus');

    let query = supabase
      .from('guests')
      .select('*');

    // Filter by wedding or personal scope
    if (weddingId) {
      query = query.eq('wedding_id', weddingId);
    } else {
      query = query.eq('user_id', user.id).is('wedding_id', null);
    }

    if (category) query = query.eq('category', category);
    if (rsvpStatus) query = query.eq('rsvp_status', rsvpStatus);

    query = query.order('name', { ascending: true });

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ guests: data || [] });
  } catch (error) {
    console.error('Guests GET error:', error);
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
    const guestData = guestSchema.parse(body.guest);
    const weddingId = body.weddingId;

    const insertData: any = {
      name: guestData.name,
      email: guestData.email,
      phone: guestData.phone,
      category: guestData.category,
      side: guestData.side,
      rsvp_status: guestData.rsvp_status,
      plus_one: guestData.plus_one,
      dietary_restrictions: guestData.dietary_restrictions || [],
      notes: guestData.notes
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
      .from('guests')
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ guest: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Guests POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
