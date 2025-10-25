import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';
import { z } from 'zod';

const pricingRuleSchema = z.object({
  listing_id: z.string().uuid(),
  rule_name: z.string(),
  rule_type: z.enum(['seasonal', 'demand_based', 'day_of_week', 'advance_booking', 'duration', 'capacity']),
  adjustment_type: z.enum(['percentage', 'fixed_amount', 'override']),
  adjustment_value: z.number(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  days_of_week: z.array(z.number()).optional(),
  min_price: z.number().optional(),
  max_price: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    const listing_id = searchParams.get('listing_id');
    const date = searchParams.get('date');
    const base_price = searchParams.get('base_price');

    if (listing_id && date && base_price) {
      const { data, error } = await supabase.rpc('calculate_dynamic_price', {
        p_listing_id: listing_id,
        p_date: date,
        p_base_price: parseFloat(base_price)
      });

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ price: data });
    }

    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('listing_id', listing_id)
      .eq('is_active', true);

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ rules: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const ruleData = pricingRuleSchema.parse(body);

    const { data: listing } = await supabase
      .from('listings')
      .select('owner_id')
      .eq('id', ruleData.listing_id)
      .single();

    if (!listing || listing.owner_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('pricing_rules')
      .insert({ ...ruleData, owner_id: user.id })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ rule: data }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid data', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
