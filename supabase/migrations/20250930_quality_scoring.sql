-- Quality Scoring Engine

CREATE TABLE IF NOT EXISTS public.vendor_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Score components (0-100 each)
  response_score INTEGER DEFAULT 0,
  completion_score INTEGER DEFAULT 0,
  review_score INTEGER DEFAULT 0,
  reliability_score INTEGER DEFAULT 0,
  value_score INTEGER DEFAULT 0,
  
  -- Overall score (0-100)
  overall_score INTEGER DEFAULT 0,
  quality_tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, platinum
  
  -- Metrics
  avg_response_time_hours DECIMAL(10,2),
  completion_rate DECIMAL(5,2),
  avg_rating DECIMAL(3,2),
  total_bookings INTEGER DEFAULT 0,
  successful_bookings INTEGER DEFAULT 0,
  cancellation_rate DECIMAL(5,2),
  
  -- Visibility impact
  search_boost_multiplier DECIMAL(5,2) DEFAULT 1.0,
  featured_eligible BOOLEAN DEFAULT false,
  
  last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  
  UNIQUE(listing_id)
);

CREATE INDEX idx_quality_scores_listing ON public.vendor_quality_scores(listing_id);
CREATE INDEX idx_quality_scores_overall ON public.vendor_quality_scores(overall_score DESC);
CREATE INDEX idx_quality_scores_tier ON public.vendor_quality_scores(quality_tier);

CREATE FUNCTION calculate_quality_scores(p_listing_id UUID) RETURNS VOID AS $$
DECLARE
  v_response_score INTEGER := 0;
  v_completion_score INTEGER := 0;
  v_review_score INTEGER := 0;
  v_reliability_score INTEGER := 0;
  v_value_score INTEGER := 0;
  v_overall_score INTEGER := 0;
  v_tier TEXT := 'bronze';
  
  v_avg_response DECIMAL;
  v_completion_rate DECIMAL;
  v_avg_rating DECIMAL;
  v_total_bookings INTEGER;
  v_successful_bookings INTEGER;
  v_boost DECIMAL := 1.0;
BEGIN
  -- Response time score
  SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at)) / 3600)
  INTO v_avg_response
  FROM public.negotiations
  WHERE listing_id = p_listing_id AND responded_at IS NOT NULL;
  
  v_response_score := CASE
    WHEN v_avg_response IS NULL THEN 50
    WHEN v_avg_response <= 1 THEN 100
    WHEN v_avg_response <= 3 THEN 90
    WHEN v_avg_response <= 6 THEN 75
    WHEN v_avg_response <= 12 THEN 60
    WHEN v_avg_response <= 24 THEN 40
    ELSE 20
  END;
  
  -- Completion score
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'completed')
  INTO v_total_bookings, v_successful_bookings
  FROM public.bookings
  WHERE listing_id = p_listing_id;
  
  v_completion_rate := CASE
    WHEN v_total_bookings = 0 THEN 0
    ELSE (v_successful_bookings::DECIMAL / v_total_bookings) * 100
  END;
  
  v_completion_score := LEAST(v_completion_rate::INTEGER, 100);
  
  -- Review score
  SELECT AVG(rating) INTO v_avg_rating
  FROM public.reviews
  WHERE listing_id = p_listing_id;
  
  v_review_score := CASE
    WHEN v_avg_rating IS NULL THEN 50
    ELSE (v_avg_rating * 20)::INTEGER
  END;
  
  -- Reliability score (based on cancellations, disputes)
  v_reliability_score := 80; -- Placeholder
  
  -- Value score (price competitiveness)
  v_value_score := 75; -- Placeholder
  
  -- Calculate overall (weighted average)
  v_overall_score := (
    v_response_score * 0.25 +
    v_completion_score * 0.25 +
    v_review_score * 0.30 +
    v_reliability_score * 0.15 +
    v_value_score * 0.05
  )::INTEGER;
  
  -- Assign tier
  v_tier := CASE
    WHEN v_overall_score >= 90 THEN 'platinum'
    WHEN v_overall_score >= 75 THEN 'gold'
    WHEN v_overall_score >= 60 THEN 'silver'
    ELSE 'bronze'
  END;
  
  -- Calculate boost
  v_boost := CASE
    WHEN v_overall_score >= 90 THEN 1.5
    WHEN v_overall_score >= 75 THEN 1.3
    WHEN v_overall_score >= 60 THEN 1.1
    ELSE 1.0
  END;
  
  -- Upsert scores
  INSERT INTO public.vendor_quality_scores (
    listing_id, owner_id, response_score, completion_score, review_score,
    reliability_score, value_score, overall_score, quality_tier,
    avg_response_time_hours, completion_rate, avg_rating,
    total_bookings, successful_bookings, search_boost_multiplier,
    featured_eligible, last_calculated_at
  )
  SELECT 
    p_listing_id, l.owner_id, v_response_score, v_completion_score, v_review_score,
    v_reliability_score, v_value_score, v_overall_score, v_tier,
    v_avg_response, v_completion_rate, v_avg_rating,
    v_total_bookings, v_successful_bookings, v_boost,
    v_overall_score >= 75, now()
  FROM public.listings l WHERE l.id = p_listing_id
  ON CONFLICT (listing_id) 
  DO UPDATE SET
    response_score = EXCLUDED.response_score,
    completion_score = EXCLUDED.completion_score,
    review_score = EXCLUDED.review_score,
    reliability_score = EXCLUDED.reliability_score,
    value_score = EXCLUDED.value_score,
    overall_score = EXCLUDED.overall_score,
    quality_tier = EXCLUDED.quality_tier,
    avg_response_time_hours = EXCLUDED.avg_response_time_hours,
    completion_rate = EXCLUDED.completion_rate,
    avg_rating = EXCLUDED.avg_rating,
    total_bookings = EXCLUDED.total_bookings,
    successful_bookings = EXCLUDED.successful_bookings,
    search_boost_multiplier = EXCLUDED.search_boost_multiplier,
    featured_eligible = EXCLUDED.featured_eligible,
    last_calculated_at = EXCLUDED.last_calculated_at,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;

ALTER TABLE public.vendor_quality_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quality scores"
  ON public.vendor_quality_scores FOR SELECT
  USING (true);
