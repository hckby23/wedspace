-- Dynamic Pricing System

CREATE TYPE pricing_rule_type AS ENUM ('seasonal', 'demand_based', 'day_of_week', 'advance_booking', 'duration', 'capacity');

CREATE TABLE IF NOT EXISTS public.pricing_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  rule_name TEXT NOT NULL,
  rule_type pricing_rule_type NOT NULL,
  priority INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  -- Conditions
  start_date DATE,
  end_date DATE,
  days_of_week INTEGER[], -- [0,6] for Sun-Sat
  min_advance_days INTEGER,
  max_advance_days INTEGER,
  min_duration_hours INTEGER,
  capacity_threshold INTEGER,
  
  -- Pricing adjustment
  adjustment_type TEXT NOT NULL, -- 'percentage', 'fixed_amount', 'override'
  adjustment_value DECIMAL(10,2) NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_pricing_rules_listing ON public.pricing_rules(listing_id);
CREATE INDEX idx_pricing_rules_active ON public.pricing_rules(is_active);

CREATE FUNCTION calculate_dynamic_price(
  p_listing_id UUID,
  p_date DATE,
  p_base_price DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
  v_final_price DECIMAL := p_base_price;
  v_rule RECORD;
  v_day_of_week INTEGER;
  v_advance_days INTEGER;
BEGIN
  v_day_of_week := EXTRACT(DOW FROM p_date);
  v_advance_days := p_date - CURRENT_DATE;
  
  FOR v_rule IN
    SELECT * FROM public.pricing_rules
    WHERE listing_id = p_listing_id
    AND is_active = true
    AND (start_date IS NULL OR p_date >= start_date)
    AND (end_date IS NULL OR p_date <= end_date)
    AND (days_of_week IS NULL OR v_day_of_week = ANY(days_of_week))
    AND (min_advance_days IS NULL OR v_advance_days >= min_advance_days)
    AND (max_advance_days IS NULL OR v_advance_days <= max_advance_days)
    ORDER BY priority DESC
  LOOP
    IF v_rule.adjustment_type = 'percentage' THEN
      v_final_price := v_final_price * (1 + v_rule.adjustment_value / 100);
    ELSIF v_rule.adjustment_type = 'fixed_amount' THEN
      v_final_price := v_final_price + v_rule.adjustment_value;
    ELSIF v_rule.adjustment_type = 'override' THEN
      v_final_price := v_rule.adjustment_value;
    END IF;
    
    IF v_rule.min_price IS NOT NULL THEN
      v_final_price := GREATEST(v_final_price, v_rule.min_price);
    END IF;
    
    IF v_rule.max_price IS NOT NULL THEN
      v_final_price := LEAST(v_final_price, v_rule.max_price);
    END IF;
  END LOOP;
  
  RETURN v_final_price;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage pricing rules"
  ON public.pricing_rules FOR ALL
  USING (auth.uid() = owner_id);
