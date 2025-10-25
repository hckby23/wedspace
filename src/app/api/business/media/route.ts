import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const createMediaSchema = z.object({
  listing_id: z.string().uuid(),
  url: z.string().url(),
  type: z.enum(['image', 'video']),
  alt_text: z.string().optional(),
  is_primary: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createMediaSchema.parse(body);

    // Verify user owns the listing
    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', validatedData.listing_id)
      .eq('owner_id', user.id)
      .single();

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found or access denied' }, { status: 404 });
    }

    // If this is primary, unset other primary media
    if (validatedData.is_primary) {
      await supabase
        .from('media')
        .update({ is_primary: false })
        .eq('listing_id', validatedData.listing_id);
    }

    const { data: media, error } = await supabase
      .from('media')
      .insert(validatedData)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ media });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('media_id');

    if (!mediaId) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    // Verify user owns the media through listing ownership
    const { data: media } = await supabase
      .from('media')
      .select(`
        id,
        listings!inner (owner_id)
      `)
      .eq('id', mediaId)
      .eq('listings.owner_id', user.id)
      .single();

    if (!media) {
      return NextResponse.json({ error: 'Media not found or access denied' }, { status: 404 });
    }

    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
