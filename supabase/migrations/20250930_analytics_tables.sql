-- Analytics & Performance Tracking Tables

CREATE TABLE IF NOT EXISTS public.performance_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  url TEXT,
  user_agent TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_name TEXT NOT NULL,
  page_url TEXT,
  referrer TEXT,
  properties JSONB DEFAULT '{}',
  device_type TEXT,
  browser TEXT,
  os TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.conversion_funnel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  funnel_step TEXT NOT NULL, -- 'visit', 'search', 'view', 'inquiry', 'booking', 'payment'
  listing_id UUID REFERENCES public.listings(id),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ab_test_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT NOT NULL,
  converted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX idx_performance_metrics_name ON public.performance_metrics(metric_name);
CREATE INDEX idx_performance_metrics_recorded ON public.performance_metrics(recorded_at DESC);

CREATE INDEX idx_user_analytics_user ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_session ON public.user_analytics(session_id);
CREATE INDEX idx_user_analytics_event ON public.user_analytics(event_type, event_name);
CREATE INDEX idx_user_analytics_created ON public.user_analytics(created_at DESC);

CREATE INDEX idx_conversion_funnel_user ON public.conversion_funnel(user_id);
CREATE INDEX idx_conversion_funnel_session ON public.conversion_funnel(session_id);
CREATE INDEX idx_conversion_funnel_step ON public.conversion_funnel(funnel_step);

CREATE INDEX idx_ab_test_variants_test ON public.ab_test_variants(test_name, variant_name);

-- Function to calculate conversion rate
CREATE FUNCTION calculate_conversion_rate(
  p_start_date DATE,
  p_end_date DATE,
  p_from_step TEXT DEFAULT 'view',
  p_to_step TEXT DEFAULT 'booking'
) RETURNS DECIMAL AS $$
DECLARE
  v_start_count INTEGER;
  v_end_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT session_id) INTO v_start_count
  FROM public.conversion_funnel
  WHERE funnel_step = p_from_step
  AND created_at::DATE BETWEEN p_start_date AND p_end_date;
  
  SELECT COUNT(DISTINCT session_id) INTO v_end_count
  FROM public.conversion_funnel
  WHERE funnel_step = p_to_step
  AND created_at::DATE BETWEEN p_start_date AND p_end_date
  AND session_id IN (
    SELECT session_id FROM public.conversion_funnel
    WHERE funnel_step = p_from_step
    AND created_at::DATE BETWEEN p_start_date AND p_end_date
  );
  
  IF v_start_count = 0 THEN
    RETURN 0;
  END IF;
  
  RETURN (v_end_count::DECIMAL / v_start_count * 100);
END;
$$ LANGUAGE plpgsql;

-- RLS Policies
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversion_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ab_test_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert performance metrics"
  ON public.performance_metrics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view performance metrics"
  ON public.performance_metrics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Anyone can insert analytics"
  ON public.user_analytics FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their analytics"
  ON public.user_analytics FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE public.performance_metrics IS 'Core Web Vitals and performance tracking';
COMMENT ON TABLE public.user_analytics IS 'User behavior and event tracking';
COMMENT ON TABLE public.conversion_funnel IS 'Conversion funnel analysis';
COMMENT ON FUNCTION calculate_conversion_rate IS 'Calculate conversion rate between funnel steps';
