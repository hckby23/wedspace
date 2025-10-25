import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const adminListingQuerySchema = z.object({
  status: z.enum(['draft', 'active', 'inactive', 'suspended']).optional(),
  verified: z.coerce.boolean().optional(),
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(20),
});

const updateListingSchema = z.object({
  status: z.enum(['draft', 'active', 'inactive', 'suspended']).optional(),
  verified: z.boolean().optional(),
  admin_notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const query = adminListingQuerySchema.parse(Object.fromEntries(searchParams));

    let listingsQuery = supabase
      .from('listings')
      .select(`
        *,
        venues (name, address),
        vendors (name, category),
        profiles!listings_owner_id_fkey (full_name, email)
      `)
      .order('created_at', { ascending: false })
      .range((query.page - 1) * query.limit, query.page * query.limit - 1);

    if (query.status) {
      listingsQuery = listingsQuery.eq('status', query.status);
    }

    if (query.verified !== undefined) {
      listingsQuery = listingsQuery.eq('verified', query.verified);
    }

    const { data: listings, error } = await listingsQuery;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      listings,
      pagination: {
        page: query.page,
        limit: query.limit,
      },
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid query parameters', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const body = await request.json();
    const { listing_id, ...updates } = body;
    const validatedUpdates = updateListingSchema.parse(updates);

    const { data: listing, error } = await supabase
      .from('listings')
      .update(validatedUpdates)
      .eq('id', listing_id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Log admin action
    await supabase.from('admin_audit_log').insert({
      admin_id: user.id,
      action: 'update_listing',
      target_type: 'listing',
      target_id: listing_id,
      changes: validatedUpdates,
    });

    return NextResponse.json({ listing });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
