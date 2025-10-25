import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const bookingQuerySchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
  listing_id: z.string().uuid().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = bookingQuerySchema.parse(Object.fromEntries(searchParams));

    let bookingsQuery = supabase
      .from('bookings')
      .select(`
        *,
        listings (
          id,
          title,
          listing_type,
          owner_id,
          venues (name, address),
          vendors (name, category)
        ),
        payments (
          id,
          amount,
          status,
          payment_method
        )
      `)
      .or(`user_id.eq.${user.id},listings.owner_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (query.status) {
      bookingsQuery = bookingsQuery.eq('status', query.status);
    }

    if (query.listing_id) {
      bookingsQuery = bookingsQuery.eq('listing_id', query.listing_id);
    }

    const { data: bookings, error } = await bookingsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookings });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
