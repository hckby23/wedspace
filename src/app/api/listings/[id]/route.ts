import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    // Get listing with related data
    const { data: listing, error } = await supabase
      .from('listings')
      .select(`
        *,
        venues (*),
        vendors (*),
        media (*),
        scorecards (*),
        reviews (
          id,
          rating,
          title,
          content,
          is_verified,
          created_at,
          profiles (full_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Increment view count
    await supabase.rpc('increment_view_count', { listing_id_param: id });

    // Get availability for next 90 days if it's a venue
    let availability = null;
    if (listing.listing_type === 'venue') {
      const { data: availabilityData } = await supabase
        .from('availability')
        .select('*')
        .eq('listing_id', id)
        .gte('date', new Date().toISOString().split('T')[0])
        .lte('date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
        .order('date');
      
      availability = availabilityData;
    }

    return NextResponse.json({
      listing,
      availability,
    });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
