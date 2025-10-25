import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const counterOfferSchema = z.object({
  price: z.number(),
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
    const { price, message } = counterOfferSchema.parse(body);

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

    // Check if user can counter (either negotiation creator or listing owner)
    const canCounter = negotiation.user_id === user.id || negotiation.listings.owner_id === user.id;
    if (!canCounter) {
      return NextResponse.json({ error: 'Not authorized to counter this negotiation' }, { status: 403 });
    }

    // Check if negotiation is still active
    if (negotiation.status !== 'pending' && negotiation.status !== 'countered') {
      return NextResponse.json({ error: 'Negotiation is no longer active' }, { status: 400 });
    }

    // Add counter offer to history
    const newHistoryEntry = {
      type: 'counter_offer',
      user_id: user.id,
      price: price,
      message: message,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = [...(negotiation.history || []), newHistoryEntry];

    // Update negotiation
    const { data: updatedNegotiation, error: updateError } = await supabase
      .from('negotiations')
      .update({
        current_price: price,
        status: 'countered',
        history: updatedHistory,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Reset expiry
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Create notification for the other party
    const notificationUserId = negotiation.user_id === user.id 
      ? negotiation.listings.owner_id 
      : negotiation.user_id;

    await supabase.from('notifications').insert({
      user_id: notificationUserId,
      type: 'negotiation',
      title: 'Counter Offer Received',
      message: `You have received a counter offer for ${negotiation.listings.title}`,
      data: { negotiation_id: id, new_price: price },
    });

    return NextResponse.json({ negotiation: updatedNegotiation });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
