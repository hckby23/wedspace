import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createNegotiationSchema = z.object({
  listing_id: z.string().uuid(),
  event_date: z.string(),
  guest_count: z.number().optional(),
  initial_price: z.number(),
  message: z.string().optional(),
});

const negotiationQuerySchema = z.object({
  listing_id: z.string().uuid().optional(),
  status: z.enum(['pending', 'countered', 'accepted', 'rejected', 'expired']).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createNegotiationSchema.parse(body);

    // Check if listing exists and is active
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, owner_id, title')
      .eq('id', validatedData.listing_id)
      .eq('status', 'active')
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found or inactive' }, { status: 404 });
    }

    // Prevent self-negotiation
    if (listing.owner_id === user.id) {
      return NextResponse.json({ error: 'Cannot negotiate with your own listing' }, { status: 400 });
    }

    // Create negotiation with history
    const history = [{
      type: 'initial_offer',
      user_id: user.id,
      price: validatedData.initial_price,
      message: validatedData.message,
      timestamp: new Date().toISOString(),
    }];

    const { data: negotiation, error } = await supabase
      .from('negotiations')
      .insert({
        listing_id: validatedData.listing_id,
        user_id: user.id,
        event_date: validatedData.event_date,
        guest_count: validatedData.guest_count,
        initial_price: validatedData.initial_price,
        current_price: validatedData.initial_price,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        history: history,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for listing owner
    await supabase.from('notifications').insert({
      user_id: listing.owner_id,
      type: 'negotiation',
      title: 'New Negotiation Request',
      message: `You have received a new negotiation request for ${listing.title}`,
      data: { negotiation_id: negotiation.id, listing_id: validatedData.listing_id },
    });

    return NextResponse.json({ negotiation });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = negotiationQuerySchema.parse(Object.fromEntries(searchParams));

    let negotiationsQuery = supabase
      .from('negotiations')
      .select(`
        *,
        listings (
          id,
          title,
          listing_type,
          owner_id
        )
      `)
      .or(`user_id.eq.${user.id},listings.owner_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (query.listing_id) {
      negotiationsQuery = negotiationsQuery.eq('listing_id', query.listing_id);
    }

    if (query.status) {
      negotiationsQuery = negotiationsQuery.eq('status', query.status);
    }

    const { data: negotiations, error } = await negotiationsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ negotiations });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
