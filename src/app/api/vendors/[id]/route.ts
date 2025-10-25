import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const updateVendorSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  description: z.string().optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  price_range: z.string().optional(),
  services_offered: z.array(z.string()).optional(),
  portfolio_images: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().optional(),
  website: z.string().url().optional(),
  cancellation_policy: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;

    const { data: vendor, error } = await supabase
      .from('vendors')
      .select(`
        *,
        listings!inner (
          id,
          title,
          description,
          base_price,
          rating,
          review_count,
          verified,
          featured,
          status,
          view_count,
          inquiry_count,
          booking_count
        ),
        reviews (
          id,
          rating,
          title,
          content,
          images,
          is_verified,
          is_featured,
          helpful_count,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .eq('listings.status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Increment view count
    await supabase
      .from('listings')
      .update({ view_count: vendor.listings.view_count + 1 })
      .eq('vendor_id', id);

    return NextResponse.json({ vendor });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (vendor.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const vendorData = updateVendorSchema.parse(body);

    const { data: updatedVendor, error: updateError } = await supabase
      .from('vendors')
      .update(vendorData)
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Update corresponding listing if title or description changed
    if (vendorData.name || vendorData.description) {
      const listingUpdate: any = {};
      if (vendorData.name) listingUpdate.title = vendorData.name;
      if (vendorData.description) listingUpdate.description = vendorData.description;

      await supabase
        .from('listings')
        .update(listingUpdate)
        .eq('vendor_id', id);
    }

    return NextResponse.json({ vendor: updatedVendor });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid vendor data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { id } = params;
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user owns this vendor
    const { data: vendor, error: vendorError } = await supabase
      .from('vendors')
      .select('owner_id')
      .eq('id', id)
      .single();

    if (vendorError || !vendor) {
      return NextResponse.json({ error: 'Vendor not found' }, { status: 404 });
    }

    if (vendor.owner_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Soft delete by updating status
    const { error: deleteError } = await supabase
      .from('vendors')
      .update({ status: 'inactive' })
      .eq('id', id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // Also update listing status
    await supabase
      .from('listings')
      .update({ status: 'inactive' })
      .eq('vendor_id', id);

    return NextResponse.json({ message: 'Vendor deleted successfully' });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
