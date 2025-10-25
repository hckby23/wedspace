import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createReviewSchema = z.object({
  listing_id: z.string().uuid(),
  booking_id: z.string().uuid().optional(),
  rating: z.number().min(1).max(5),
  title: z.string().min(1).max(200),
  content: z.string().min(10).max(2000),
  photos: z.array(z.string()).optional(),
});

const reviewQuerySchema = z.object({
  listing_id: z.string().uuid().optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  verified_only: z.coerce.boolean().default(false),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createReviewSchema.parse(body);

    // Check if listing exists
    const { data: listing, error: listingError } = await supabase
      .from('listings')
      .select('id, owner_id, title')
      .eq('id', validatedData.listing_id)
      .single();

    if (listingError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Prevent self-review
    if (listing.owner_id === user.id) {
      return NextResponse.json({ error: 'Cannot review your own listing' }, { status: 400 });
    }

    // Check if user already reviewed this listing
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('listing_id', validatedData.listing_id)
      .eq('user_id', user.id)
      .single();

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this listing' }, { status: 400 });
    }

    // Verify booking if provided
    let isVerified = false;
    if (validatedData.booking_id) {
      const { data: booking } = await supabase
        .from('bookings')
        .select('id, status')
        .eq('id', validatedData.booking_id)
        .eq('user_id', user.id)
        .eq('listing_id', validatedData.listing_id)
        .single();

      if (booking && booking.status === 'completed') {
        isVerified = true;
      }
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        listing_id: validatedData.listing_id,
        user_id: user.id,
        booking_id: validatedData.booking_id,
        rating: validatedData.rating,
        title: validatedData.title,
        content: validatedData.content,
        photos: validatedData.photos,
        is_verified: isVerified,
      })
      .select(`
        *,
        profiles (full_name)
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Create notification for listing owner
    await supabase.from('notifications').insert({
      user_id: listing.owner_id,
      type: 'review',
      title: 'New Review Received',
      message: `You have received a new ${validatedData.rating}-star review for ${listing.title}`,
      data: { review_id: review.id, listing_id: validatedData.listing_id, rating: validatedData.rating },
    });

    return NextResponse.json({ review });

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
    const { searchParams } = new URL(request.url);
    const query = reviewQuerySchema.parse(Object.fromEntries(searchParams));

    let reviewsQuery = supabase
      .from('reviews')
      .select(`
        *,
        profiles (full_name)
      `)
      .order('created_at', { ascending: false })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.listing_id) {
      reviewsQuery = reviewsQuery.eq('listing_id', query.listing_id);
    }

    if (query.rating) {
      reviewsQuery = reviewsQuery.eq('rating', query.rating);
    }

    if (query.verified_only) {
      reviewsQuery = reviewsQuery.eq('is_verified', true);
    }

    const { data: reviews, error } = await reviewsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true });

    if (query.listing_id) countQuery = countQuery.eq('listing_id', query.listing_id);
    if (query.rating) countQuery = countQuery.eq('rating', query.rating);
    if (query.verified_only) countQuery = countQuery.eq('is_verified', true);

    const { count } = await countQuery;

    return NextResponse.json({
      reviews,
      pagination: {
        page: query.page,
        limit: query.limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / query.limit),
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
