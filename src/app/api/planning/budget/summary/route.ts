import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/integrations/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: items, error } = await supabase
      .from('budget_items')
      .select('*')
      .eq('user_id', user.id);

    if (error) throw error;

    const totalPlanned = items?.reduce((sum, item) => sum + item.amount, 0) || 0;
    const totalSpent = items?.reduce((sum, item) => sum + (item.actual_amount || item.amount), 0) || 0;

    // Get total budget from settings or calculate
    const { data: settings } = await supabase
      .from('user_settings')
      .select('total_budget')
      .eq('user_id', user.id)
      .single();

    const totalBudget = settings?.total_budget || totalPlanned;

    const categoryBreakdown = items?.reduce((acc: any, item) => {
      if (!acc[item.category]) {
        acc[item.category] = { planned: 0, spent: 0, count: 0 };
      }
      acc[item.category].planned += item.amount;
      acc[item.category].spent += item.actual_amount || item.amount;
      acc[item.category].count += 1;
      return acc;
    }, {});

    return NextResponse.json({
      summary: {
        totalBudget,
        totalPlanned,
        totalSpent,
        remaining: totalBudget - totalSpent,
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Budget summary error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
