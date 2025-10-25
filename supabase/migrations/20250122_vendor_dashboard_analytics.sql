-- ============================================================================
-- VENDOR/VENUE DASHBOARD & INTERNAL ANALYTICS SCHEMA
-- Free-tier optimized, privacy-first, with RLS
-- ============================================================================

-- ============================================================================
-- 1. ANALYTICS EVENTS & SESSIONS
-- ============================================================================

-- Anonymous session tracking
CREATE TABLE IF NOT EXISTS sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  anon_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_activity_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  device TEXT,
  browser TEXT,
  os TEXT,
  lang TEXT,
  tz_offset INTEGER,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  referer TEXT,
  landing_path TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_anon_id ON sessions(anon_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);

-- Generic events table
CREATE TABLE IF NOT EXISTS events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  anon_id TEXT,
  listing_id UUID,
  vendor_id UUID,
  venue_id UUID,
  city TEXT,
  category TEXT,
  properties JSONB DEFAULT '{}',
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_events_name ON events(event_name);
CREATE INDEX idx_events_ts ON events(ts);
CREATE INDEX idx_events_session ON events(session_id);
CREATE INDEX idx_events_listing ON events(listing_id) WHERE listing_id IS NOT NULL;
CREATE INDEX idx_events_vendor ON events(vendor_id) WHERE vendor_id IS NOT NULL;

-- Pageviews
CREATE TABLE IF NOT EXISTS pageviews (
  pageview_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  path TEXT NOT NULL,
  title TEXT,
  referer TEXT,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pageviews_session ON pageviews(session_id);
CREATE INDEX idx_pageviews_ts ON pageviews(ts);
CREATE INDEX idx_pageviews_path ON pageviews(path);

-- Searches
CREATE TABLE IF NOT EXISTS searches (
  search_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  query TEXT,
  filters JSONB DEFAULT '{}',
  city TEXT,
  category TEXT,
  date_from DATE,
  date_to DATE,
  results_count INTEGER,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_searches_ts ON searches(ts);
CREATE INDEX idx_searches_city_category ON searches(city, category);

-- Search impressions (sampled for free tier)
CREATE TABLE IF NOT EXISTS search_impressions (
  impression_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(search_id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  vendor_id UUID,
  venue_id UUID,
  position INTEGER NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_impressions_listing ON search_impressions(listing_id);
CREATE INDEX idx_search_impressions_ts ON search_impressions(ts);

-- Search clicks
CREATE TABLE IF NOT EXISTS search_clicks (
  click_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id UUID REFERENCES searches(search_id) ON DELETE CASCADE,
  impression_id UUID REFERENCES search_impressions(impression_id) ON DELETE CASCADE,
  listing_id UUID NOT NULL,
  position INTEGER NOT NULL,
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_search_clicks_listing ON search_clicks(listing_id);
CREATE INDEX idx_search_clicks_ts ON search_clicks(ts);

-- Profile views
CREATE TABLE IF NOT EXISTS profile_views (
  view_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(session_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  listing_id UUID NOT NULL,
  vendor_id UUID,
  venue_id UUID,
  source TEXT, -- 'search', 'direct', 'collection', etc.
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profile_views_listing ON profile_views(listing_id);
CREATE INDEX idx_profile_views_ts ON profile_views(ts);

-- ============================================================================
-- 2. VENDOR/VENUE BUSINESS DATA
-- ============================================================================

-- Vendor/Venue profiles (extends existing profiles table)
CREATE TABLE IF NOT EXISTS business_profiles (
  business_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  business_type TEXT NOT NULL CHECK (business_type IN ('vendor', 'venue')),
  business_name TEXT NOT NULL,
  slug TEXT UNIQUE,
  city TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  service_radius_km INTEGER,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  whatsapp TEXT,
  scheduling_url TEXT,
  pricing_tier TEXT CHECK (pricing_tier IN ('$', '$$', '$$$', '$$$$')),
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified')),
  verification_docs JSONB DEFAULT '[]',
  profile_completeness INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  last_active_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_business_profiles_user ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_type ON business_profiles(business_type);
CREATE INDEX idx_business_profiles_city_category ON business_profiles(city, category);
CREATE INDEX idx_business_profiles_slug ON business_profiles(slug);

-- Packages
CREATE TABLE IF NOT EXISTS packages (
  package_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tier TEXT CHECK (tier IN ('basic', 'standard', 'premium', 'custom')),
  price_min INTEGER,
  price_max INTEGER,
  inclusions JSONB DEFAULT '[]',
  exclusions JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_packages_business ON packages(business_id);

-- Media assets
CREATE TABLE IF NOT EXISTS media_assets (
  media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('photo', 'video', 'document', 'external_url')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  alt_text TEXT,
  tags TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_media_business ON media_assets(business_id);

-- Availability calendar
CREATE TABLE IF NOT EXISTS availability (
  availability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  date DATE NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  slots_total INTEGER,
  slots_booked INTEGER DEFAULT 0,
  pricing_override INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(business_id, date)
);

CREATE INDEX idx_availability_business_date ON availability(business_id, date);

-- ============================================================================
-- 3. LEADS & INQUIRIES
-- ============================================================================

CREATE TABLE IF NOT EXISTS leads (
  lead_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  event_date DATE,
  event_city TEXT,
  budget_min INTEGER,
  budget_max INTEGER,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'quoted', 'negotiating', 'won', 'lost')),
  source TEXT, -- 'inquiry_form', 'manual', 'referral'
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  replied_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_business ON leads(business_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created ON leads(created_at);

-- Messages (portal-based, email bridge outbound only)
CREATE TABLE IF NOT EXISTS messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(lead_id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('business', 'customer')),
  sender_id UUID,
  body TEXT NOT NULL,
  sent_via TEXT DEFAULT 'portal' CHECK (sent_via IN ('portal', 'email')),
  email_sent_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_lead ON messages(lead_id);
CREATE INDEX idx_messages_created ON messages(created_at);

-- ============================================================================
-- 4. QUOTES & PROPOSALS
-- ============================================================================

CREATE TABLE IF NOT EXISTS quotes (
  quote_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(lead_id) ON DELETE CASCADE,
  quote_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'expired', 'declined')),
  subtotal INTEGER NOT NULL,
  tax_amount INTEGER DEFAULT 0,
  discount_amount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  notes TEXT,
  terms TEXT,
  valid_until DATE,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  magic_link_token TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quotes_business ON quotes(business_id);
CREATE INDEX idx_quotes_lead ON quotes(lead_id);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_magic_token ON quotes(magic_link_token);

CREATE TABLE IF NOT EXISTS quote_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES quotes(quote_id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL,
  total_price INTEGER NOT NULL,
  display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_quote_items_quote ON quote_items(quote_id);

-- ============================================================================
-- 5. REVIEWS & RATINGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS reviews (
  review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(lead_id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT,
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  vendor_reply TEXT,
  vendor_replied_at TIMESTAMPTZ,
  is_verified_booking BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_business ON reviews(business_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================================================
-- 6. ANALYTICS AGGREGATIONS (Materialized Views)
-- ============================================================================

-- Daily vendor/venue metrics
CREATE MATERIALIZED VIEW IF NOT EXISTS vendor_metrics_daily AS
SELECT
  COALESCE(pv.vendor_id, pv.venue_id) AS business_id,
  DATE(pv.ts) AS date,
  COUNT(DISTINCT pv.view_id) AS profile_views,
  COUNT(DISTINCT pv.session_id) AS unique_visitors,
  COUNT(DISTINCT si.impression_id) AS impressions,
  COUNT(DISTINCT sc.click_id) AS clicks,
  COALESCE(ROUND(COUNT(DISTINCT sc.click_id)::NUMERIC / NULLIF(COUNT(DISTINCT si.impression_id), 0) * 100, 2), 0) AS ctr,
  COUNT(DISTINCT l.lead_id) AS inquiries
FROM profile_views pv
LEFT JOIN search_impressions si ON si.listing_id = pv.listing_id AND DATE(si.ts) = DATE(pv.ts)
LEFT JOIN search_clicks sc ON sc.listing_id = pv.listing_id AND DATE(sc.ts) = DATE(pv.ts)
LEFT JOIN leads l ON (l.business_id = pv.vendor_id OR l.business_id = pv.venue_id) AND DATE(l.created_at) = DATE(pv.ts)
WHERE pv.vendor_id IS NOT NULL OR pv.venue_id IS NOT NULL
GROUP BY COALESCE(pv.vendor_id, pv.venue_id), DATE(pv.ts);

CREATE UNIQUE INDEX idx_vendor_metrics_daily_pk ON vendor_metrics_daily(business_id, date);

-- Date demand (for Date Rush)
CREATE MATERIALIZED VIEW IF NOT EXISTS date_demand_daily AS
SELECT
  city,
  date_from AS date,
  COUNT(DISTINCT search_id) AS searches,
  COUNT(DISTINCT s.user_id) AS unique_users,
  COUNT(DISTINCT l.lead_id) AS inquiries
FROM searches s
LEFT JOIN leads l ON l.event_date = s.date_from AND l.event_city = s.city
WHERE date_from IS NOT NULL
GROUP BY city, date_from;

CREATE UNIQUE INDEX idx_date_demand_daily_pk ON date_demand_daily(city, date);

-- ============================================================================
-- 7. TEAM & ACCESS
-- ============================================================================

CREATE TABLE IF NOT EXISTS team_members (
  member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner', 'collaborator')),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(business_id, user_id)
);

CREATE INDEX idx_team_members_business ON team_members(business_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);

-- ============================================================================
-- 8. SAVED REPLIES & TEMPLATES
-- ============================================================================

CREATE TABLE IF NOT EXISTS saved_replies (
  reply_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  shortcut TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saved_replies_business ON saved_replies(business_id);

-- ============================================================================
-- 9. AUDIT LOGS
-- ============================================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES business_profiles(business_id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  changes JSONB DEFAULT '{}',
  ts TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_business ON audit_logs(business_id);
CREATE INDEX idx_audit_logs_ts ON audit_logs(ts);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_impressions ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Analytics: Anyone can write (for client tracking), only owners can read their data
CREATE POLICY "Anyone can write analytics events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can read their own events"
  ON events FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can write pageviews"
  ON pageviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can write searches"
  ON searches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can write impressions"
  ON search_impressions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can write clicks"
  ON search_clicks FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can write profile views"
  ON profile_views FOR INSERT
  WITH CHECK (true);

-- Business profiles: Owner can manage
CREATE POLICY "Users can read their own business profile"
  ON business_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own business profile"
  ON business_profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Anyone can read published profiles"
  ON business_profiles FOR SELECT
  USING (is_published = true);

-- Packages, media, availability: Owner manages
CREATE POLICY "Owners can manage packages"
  ON packages FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage media"
  ON media_assets FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage availability"
  ON availability FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

-- Leads: Owner can read/update
CREATE POLICY "Owners can manage leads"
  ON leads FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

-- Messages: Owner and customer can read; owner can write
CREATE POLICY "Participants can read messages"
  ON messages FOR SELECT
  USING (
    lead_id IN (SELECT lead_id FROM leads WHERE business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()))
    OR sender_id = auth.uid()
  );

CREATE POLICY "Owners can send messages"
  ON messages FOR INSERT
  WITH CHECK (
    lead_id IN (SELECT lead_id FROM leads WHERE business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()))
  );

-- Quotes: Owner manages; customer can view with magic link
CREATE POLICY "Owners can manage quotes"
  ON quotes FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Owners can manage quote items"
  ON quote_items FOR ALL
  USING (quote_id IN (SELECT quote_id FROM quotes WHERE business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid())));

-- Reviews: Public read for approved; owner can reply
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Owners can reply to reviews"
  ON reviews FOR UPDATE
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()))
  WITH CHECK (vendor_reply IS NOT NULL);

-- Team members
CREATE POLICY "Team members can read their teams"
  ON team_members FOR SELECT
  USING (user_id = auth.uid() OR business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

-- Saved replies
CREATE POLICY "Owners can manage saved replies"
  ON saved_replies FOR ALL
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

-- Audit logs: Owner read-only
CREATE POLICY "Owners can read audit logs"
  ON audit_logs FOR SELECT
  USING (business_id IN (SELECT business_id FROM business_profiles WHERE user_id = auth.uid()));

-- ============================================================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Update business profile completeness
CREATE OR REPLACE FUNCTION calculate_profile_completeness()
RETURNS TRIGGER AS $$
DECLARE
  score INTEGER := 0;
BEGIN
  -- Basic info (40 points)
  IF NEW.business_name IS NOT NULL AND NEW.business_name != '' THEN score := score + 10; END IF;
  IF NEW.description IS NOT NULL AND LENGTH(NEW.description) > 50 THEN score := score + 10; END IF;
  IF NEW.phone IS NOT NULL THEN score := score + 5; END IF;
  IF NEW.email IS NOT NULL THEN score := score + 5; END IF;
  IF NEW.city IS NOT NULL THEN score := score + 5; END IF;
  IF NEW.category IS NOT NULL THEN score := score + 5; END IF;
  
  -- Media (20 points)
  IF (SELECT COUNT(*) FROM media_assets WHERE business_id = NEW.business_id) >= 6 THEN score := score + 20; END IF;
  
  -- Packages (20 points)
  IF (SELECT COUNT(*) FROM packages WHERE business_id = NEW.business_id) >= 1 THEN score := score + 20; END IF;
  
  -- Availability (10 points)
  IF (SELECT COUNT(*) FROM availability WHERE business_id = NEW.business_id) > 0 THEN score := score + 10; END IF;
  
  -- Verification (10 points)
  IF NEW.verification_status = 'verified' THEN score := score + 10; END IF;
  
  NEW.profile_completeness := score;
  NEW.updated_at := NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_profile_completeness
  BEFORE INSERT OR UPDATE ON business_profiles
  FOR EACH ROW
  EXECUTE FUNCTION calculate_profile_completeness();

-- Auto-generate quote number
CREATE OR REPLACE FUNCTION generate_quote_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quote_number IS NULL THEN
    NEW.quote_number := 'Q-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(NEXTVAL('quote_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS quote_number_seq;

CREATE TRIGGER trigger_quote_number
  BEFORE INSERT ON quotes
  FOR EACH ROW
  EXECUTE FUNCTION generate_quote_number();

-- Audit log trigger
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_logs (business_id, user_id, action, entity_type, entity_id, changes)
  VALUES (
    NEW.business_id,
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    NEW.business_id,
    jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit trigger to key tables
CREATE TRIGGER audit_business_profiles AFTER UPDATE ON business_profiles FOR EACH ROW EXECUTE FUNCTION log_audit();
CREATE TRIGGER audit_packages AFTER INSERT OR UPDATE OR DELETE ON packages FOR EACH ROW EXECUTE FUNCTION log_audit();
CREATE TRIGGER audit_availability AFTER INSERT OR UPDATE OR DELETE ON availability FOR EACH ROW EXECUTE FUNCTION log_audit();

-- ============================================================================
-- 12. REFRESH MATERIALIZED VIEWS (Manual for MVP, later scheduled)
-- ============================================================================

-- Helper function to refresh analytics
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY vendor_metrics_daily;
  REFRESH MATERIALIZED VIEW CONCURRENTLY date_demand_daily;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMPLETE
-- ============================================================================
