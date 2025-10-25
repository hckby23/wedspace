import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const acceptOfferSchema = z.object({
  message: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { message } = acceptOfferSchema.parse(body);

    // Get negotiation with listing info
    const { data: negotiation, error: negotiationError } = await supabase
      .from('negotiations')
      .select(`
        *,
        listings (owner_id, title)
      `)
      .eq('id', id)
      .single();

    if (negotiationError || !negotiation) {
      return NextResponse.json({ error: 'Negotiation not found' }, { status: 404 });
    }

    // Only listing owner can accept
    if (negotiation.listings.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only listing owner can accept negotiations' }, { status: 403 });
    }

    // Check if negotiation is still active
    if (negotiation.status === 'accepted') {
      return NextResponse.json({ error: 'Negotiation already accepted' }, { status: 400 });
    }

    if (negotiation.status !== 'pending' && negotiation.status !== 'countered') {
      return NextResponse.json({ error: 'Negotiation is no longer active' }, { status: 400 });
    }

    // Add acceptance to history
    const newHistoryEntry = {
      type: 'accepted',
      user_id: user.id,
      price: negotiation.current_price,
      message: message,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...(negotiation.history || []), newHistoryEntry];

    // Update negotiation - this will trigger the database function to create booking
    const { data: updatedNegotiation, error: updateError } = await supabase
      .from('negotiations')
      .update({
        status: 'accepted',
        final_price: negotiation.current_price,
        history: updatedHistory,
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ 
      negotiation: updatedNegotiation,
      message: 'Negotiation accepted successfully. Booking has been created.'
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
