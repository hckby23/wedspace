"use client";

import { supabase } from '@/integrations/supabase/client';

interface BudgetCategory {
  category: string;
  suggested_percentage: number;
  suggested_amount: number;
  min_amount: number;
  max_amount: number;
}

export class AIBudgetService {
  static async generateBudgetAllocation(params: {
    total_budget: number;
    wedding_type?: string;
    guest_count?: number;
    city?: string;
    priorities?: string[];
  }): Promise<{ categories: BudgetCategory[] }> {
    const { total_budget, wedding_type = 'traditional', guest_count = 200, city = 'Delhi' } = params;

    // AI-powered budget allocation logic
    const baseAllocations: Record<string, number> = {
      venue: 25,
      catering: 30,
      decoration: 10,
      photography: 8,
      entertainment: 5,
      wedding_attire: 8,
      invitations: 2,
      makeup_and_beauty: 3,
      transportation: 2,
      miscellaneous: 7
    };

    // Adjust based on wedding type
    const adjustments = wedding_type === 'destination' 
      ? { venue: 5, transportation: 5, catering: -5, miscellaneous: -5 }
      : {};

    const categories: BudgetCategory[] = Object.entries(baseAllocations).map(([category, percentage]) => {
      const adjusted_percentage = percentage + (adjustments[category] || 0);
      const suggested_amount = (total_budget * adjusted_percentage) / 100;
      
      return {
        category,
        suggested_percentage: adjusted_percentage,
        suggested_amount,
        min_amount: suggested_amount * 0.7,
        max_amount: suggested_amount * 1.3
      };
    });

    return { categories };
  }

  static async optimizeBudget(params: {
    current_allocations: Record<string, number>;
    total_budget: number;
  }): Promise<{ optimized: Record<string, number>; savings: number }> {
    const { current_allocations, total_budget } = params;
    
    const optimized: Record<string, number> = {};
    let total_spent = 0;

    // Simple optimization: reduce overspending categories
    for (const [category, amount] of Object.entries(current_allocations)) {
      const suggested = (total_budget * (category === 'venue' ? 25 : 10)) / 100;
      optimized[category] = Math.min(amount, suggested * 1.2);
      total_spent += optimized[category];
    }

    const savings = Object.values(current_allocations).reduce((a, b) => a + b, 0) - total_spent;

    return { optimized, savings };
  }

  static async suggestVendors(params: {
    category: string;
    budget: number;
    city: string;
  }): Promise<any[]> {
    const { category, budget, city } = params;

    const { data } = await supabase
      .from('listings')
      .select('*')
      .ilike('category', `%${category}%`)
      .ilike('city', `%${city}%`)
      .gte('base_price', budget * 0.8)
      .lte('base_price', budget * 1.2)
      .limit(5);

    return data || [];
  }
}
