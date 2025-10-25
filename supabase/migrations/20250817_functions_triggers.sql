-- WedSpace Database Functions and Triggers
-- Business logic functions and automated triggers

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_venues_updated_at ON public.venues;
CREATE TRIGGER update_venues_updated_at
  BEFORE UPDATE ON public.venues
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_vendors_updated_at ON public.vendors;
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON public.vendors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_moodboards_updated_at ON public.moodboards;
CREATE TRIGGER update_moodboards_updated_at
  BEFORE UPDATE ON public.moodboards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_scorecards_updated_at ON public.scorecards;
CREATE TRIGGER update_scorecards_updated_at
  BEFORE UPDATE ON public.scorecards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_negotiations_updated_at ON public.negotiations;
CREATE TRIGGER update_negotiations_updated_at
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON public.bookings;
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON public.visits;
CREATE TRIGGER update_visits_updated_at
  BEFORE UPDATE ON public.visits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle negotiation acceptance and create booking
CREATE OR REPLACE FUNCTION public.handle_negotiation_acceptance()
RETURNS TRIGGER AS $$
DECLARE
  booking_id UUID;
BEGIN
  -- Only proceed if status changed to 'accepted'
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status != 'accepted') THEN
    -- Set final price
    NEW.final_price = NEW.current_price;
    
    -- Create booking record
    INSERT INTO public.bookings (
      user_id,
      listing_id,
      negotiation_id,
      event_date,
      guest_count,
      total_amount,
      final_price,
      booking_status,
      created_at
    ) VALUES (
      NEW.user_id,
      NEW.listing_id,
      NEW.id,
      NEW.event_date,
      NEW.guest_count,
      NEW.current_price,
      NEW.current_price,
      'confirmed',
      now()
    ) RETURNING id INTO booking_id;
    
    -- Create notification for user
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) VALUES (
      NEW.user_id,
      'negotiation',
      'Negotiation Accepted!',
      'Your negotiation has been accepted. Please proceed with payment.',
      jsonb_build_object('negotiation_id', NEW.id, 'booking_id', booking_id)
    );
    
    -- Create notification for listing owner
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      data
    ) SELECT 
      l.owner_id,
      'negotiation',
      'Negotiation Accepted',
      'You have accepted a negotiation. Booking created.',
      jsonb_build_object('negotiation_id', NEW.id, 'booking_id', booking_id)
    FROM public.listings l
    WHERE l.id = NEW.listing_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply negotiation acceptance trigger
DROP TRIGGER IF EXISTS handle_negotiation_acceptance_trigger ON public.negotiations;
CREATE TRIGGER handle_negotiation_acceptance_trigger
  BEFORE UPDATE ON public.negotiations
  FOR EACH ROW EXECUTE FUNCTION public.handle_negotiation_acceptance();

-- Function to recalculate scorecard metrics
CREATE OR REPLACE FUNCTION public.recalculate_scorecard(listing_id_param UUID)
RETURNS VOID AS $$
DECLARE
  avg_ratings RECORD;
  review_stats RECORD;
  response_stats RECORD;
  booking_stats RECORD;
BEGIN
  -- Calculate average ratings
  SELECT 
    AVG(rating) as overall_rating,
    AVG(CASE WHEN content LIKE '%quality%' THEN rating END) as quality_rating,
    AVG(CASE WHEN content LIKE '%service%' THEN rating END) as service_rating,
    AVG(CASE WHEN content LIKE '%value%' THEN rating END) as value_rating,
    AVG(CASE WHEN content LIKE '%communication%' THEN rating END) as communication_rating,
    COUNT(*) as total_reviews,
    COUNT(CASE WHEN is_verified THEN 1 END) as verified_reviews
  INTO avg_ratings
  FROM public.reviews 
  WHERE listing_id = listing_id_param AND status = 'approved';
  
  -- Calculate response stats (placeholder - would need actual response time tracking)
  SELECT 
    COALESCE(AVG(response_time_hours), 24) as avg_response_time,
    COALESCE(COUNT(*) * 100.0 / NULLIF(COUNT(*), 0), 0) as response_rate
  INTO response_stats
  FROM public.profiles p
  JOIN public.listings l ON l.owner_id = p.id
  WHERE l.id = listing_id_param;
  
  -- Calculate booking stats
  SELECT 
    COALESCE(COUNT(CASE WHEN booking_status = 'completed' THEN 1 END) * 100.0 / 
             NULLIF(COUNT(CASE WHEN booking_status IN ('confirmed', 'completed', 'cancelled') THEN 1 END), 0), 0) as success_rate,
    COALESCE(COUNT(CASE WHEN user_id IN (
      SELECT user_id FROM public.bookings b2 
      WHERE b2.listing_id = listing_id_param AND b2.id != bookings.id
    ) THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 0) as repeat_rate
  INTO booking_stats
  FROM public.bookings
  WHERE listing_id = listing_id_param;
  
  -- Insert or update scorecard
  INSERT INTO public.scorecards (
    listing_id,
    overall_rating,
    quality_rating,
    service_rating,
    value_rating,
    communication_rating,
    total_reviews,
    verified_reviews,
    response_rate,
    avg_response_time_hours,
    booking_success_rate,
    repeat_customer_rate,
    last_calculated_at
  ) VALUES (
    listing_id_param,
    COALESCE(avg_ratings.overall_rating, 0),
    COALESCE(avg_ratings.quality_rating, 0),
    COALESCE(avg_ratings.service_rating, 0),
    COALESCE(avg_ratings.value_rating, 0),
    COALESCE(avg_ratings.communication_rating, 0),
    COALESCE(avg_ratings.total_reviews, 0),
    COALESCE(avg_ratings.verified_reviews, 0),
    COALESCE(response_stats.response_rate, 0),
    COALESCE(response_stats.avg_response_time, 24),
    COALESCE(booking_stats.success_rate, 0),
    COALESCE(booking_stats.repeat_rate, 0),
    now()
  )
  ON CONFLICT (listing_id) DO UPDATE SET
    overall_rating = EXCLUDED.overall_rating,
    quality_rating = EXCLUDED.quality_rating,
    service_rating = EXCLUDED.service_rating,
    value_rating = EXCLUDED.value_rating,
    communication_rating = EXCLUDED.communication_rating,
    total_reviews = EXCLUDED.total_reviews,
    verified_reviews = EXCLUDED.verified_reviews,
    response_rate = EXCLUDED.response_rate,
    avg_response_time_hours = EXCLUDED.avg_response_time_hours,
    booking_success_rate = EXCLUDED.booking_success_rate,
    repeat_customer_rate = EXCLUDED.repeat_customer_rate,
    last_calculated_at = EXCLUDED.last_calculated_at,
    updated_at = now();
    
  -- Update listing rating and review count
  UPDATE public.listings 
  SET 
    rating = COALESCE(avg_ratings.overall_rating, 0),
    review_count = COALESCE(avg_ratings.total_reviews, 0),
    updated_at = now()
  WHERE id = listing_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to trigger scorecard recalculation on review changes
CREATE OR REPLACE FUNCTION public.trigger_scorecard_recalculation()
RETURNS TRIGGER AS $$
BEGIN
  -- Recalculate for the affected listing
  IF TG_OP = 'DELETE' THEN
    PERFORM public.recalculate_scorecard(OLD.listing_id);
    RETURN OLD;
  ELSE
    PERFORM public.recalculate_scorecard(NEW.listing_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply scorecard recalculation triggers
DROP TRIGGER IF EXISTS trigger_scorecard_on_review_change ON public.reviews;
CREATE TRIGGER trigger_scorecard_on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.trigger_scorecard_recalculation();

-- Function to create admin audit log
CREATE OR REPLACE FUNCTION public.create_audit_log(
  action_param TEXT,
  resource_type_param TEXT,
  resource_id_param UUID,
  old_values_param JSONB DEFAULT NULL,
  new_values_param JSONB DEFAULT NULL,
  reason_param TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.admin_audit (
    admin_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    reason,
    created_at
  ) VALUES (
    auth.uid(),
    action_param,
    resource_type_param,
    resource_id_param,
    old_values_param,
    new_values_param,
    reason_param,
    now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log events for analytics
CREATE OR REPLACE FUNCTION public.log_event(
  event_type_param TEXT,
  event_data_param JSONB DEFAULT '{}'::jsonb,
  listing_id_param UUID DEFAULT NULL,
  user_id_param UUID DEFAULT auth.uid()
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.events (
    user_id,
    event_type,
    event_data,
    listing_id,
    created_at
  ) VALUES (
    user_id_param,
    event_type_param,
    event_data_param,
    listing_id_param,
    now()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(
  listing_id_param UUID
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.listings 
  SET 
    view_count = view_count + 1,
    updated_at = now()
  WHERE id = listing_id_param;
  
  -- Log the view event
  PERFORM public.log_event('listing_view', jsonb_build_object('listing_id', listing_id_param), listing_id_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate share token for moodboards
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'base64url');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate share token for moodboards
CREATE OR REPLACE FUNCTION public.auto_generate_share_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_public = true AND NEW.share_token IS NULL THEN
    NEW.share_token = public.generate_share_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS auto_generate_share_token_trigger ON public.moodboards;
CREATE TRIGGER auto_generate_share_token_trigger
  BEFORE INSERT OR UPDATE ON public.moodboards
  FOR EACH ROW EXECUTE FUNCTION public.auto_generate_share_token();

-- Function to search listings with AI ranking (placeholder for now)
CREATE OR REPLACE FUNCTION public.search_listings(
  search_query TEXT DEFAULT NULL,
  listing_type_filter TEXT DEFAULT NULL,
  city_filter TEXT DEFAULT NULL,
  min_price DECIMAL DEFAULT NULL,
  max_price DECIMAL DEFAULT NULL,
  min_rating DECIMAL DEFAULT NULL,
  guest_count_filter INTEGER DEFAULT NULL,
  date_filter DATE DEFAULT NULL,
  use_ai_sort BOOLEAN DEFAULT false,
  limit_count INTEGER DEFAULT 20,
  offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  base_price DECIMAL,
  city TEXT,
  rating DECIMAL,
  review_count INTEGER,
  verified BOOLEAN,
  featured BOOLEAN,
  listing_type TEXT,
  ai_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.title,
    l.description,
    l.base_price,
    l.city,
    l.rating,
    l.review_count,
    l.verified,
    l.featured,
    l.listing_type,
    CASE 
      WHEN use_ai_sort THEN 
        -- Simple AI scoring algorithm (can be enhanced)
        (l.rating * 0.3 + 
         LEAST(l.review_count::decimal / 10, 5) * 0.2 + 
         CASE WHEN l.verified THEN 2 ELSE 0 END * 0.2 +
         CASE WHEN l.featured THEN 1 ELSE 0 END * 0.1 +
         -- Price fit score (closer to user's range = higher score)
         CASE 
           WHEN min_price IS NOT NULL AND max_price IS NOT NULL THEN
             GREATEST(0, 5 - ABS(l.base_price - (min_price + max_price) / 2) / ((max_price - min_price) / 2))
           ELSE 3
         END * 0.2)
      ELSE l.rating
    END as ai_score
  FROM public.listings l
  WHERE 
    l.status = 'active' 
    AND l.verified = true
    AND (search_query IS NULL OR 
         l.title ILIKE '%' || search_query || '%' OR 
         l.description ILIKE '%' || search_query || '%')
    AND (listing_type_filter IS NULL OR l.listing_type = listing_type_filter)
    AND (city_filter IS NULL OR l.city ILIKE city_filter)
    AND (min_price IS NULL OR l.base_price >= min_price)
    AND (max_price IS NULL OR l.base_price <= max_price)
    AND (min_rating IS NULL OR l.rating >= min_rating)
    AND (date_filter IS NULL OR 
         EXISTS (
           SELECT 1 FROM public.availability a 
           WHERE a.listing_id = l.id 
           AND a.date = date_filter 
           AND a.is_available = true
         ))
  ORDER BY 
    CASE WHEN use_ai_sort THEN ai_score ELSE l.rating END DESC,
    l.featured DESC,
    l.verified DESC,
    l.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
