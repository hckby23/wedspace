// ============================================================================
// INTERNAL ANALYTICS TYPES (Supabase-only, privacy-first)
// ============================================================================

// ============================================================================
// SESSIONS & IDENTITY
// ============================================================================

export interface Session {
  session_id: string;
  anon_id: string;
  user_id: string | null;
  started_at: string;
  last_activity_at: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  lang: string | null;
  tz_offset: number | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referer: string | null;
  landing_path: string | null;
  is_demo: boolean;
  created_at: string;
}

export interface SessionInit {
  anon_id: string;
  device?: string;
  browser?: string;
  os?: string;
  lang?: string;
  tz_offset?: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referer?: string;
  landing_path?: string;
  is_demo?: boolean;
}

// ============================================================================
// EVENTS
// ============================================================================

export type EventName =
  // Navigation & pages
  | 'page_view'
  | 'search_performed'
  | 'filter_applied'
  | 'collection_viewed'
  
  // Search & discovery
  | 'search_impression'
  | 'card_click'
  | 'profile_view'
  | 'save_listing'
  | 'unsave_listing'
  | 'share_listing'
  
  // Inquiries & engagement
  | 'inquiry_started'
  | 'inquiry_submitted'
  | 'message_sent'
  | 'call_clicked'
  | 'email_clicked'
  | 'whatsapp_clicked'
  | 'website_clicked'
  
  // Vendor portal
  | 'lead_status_changed'
  | 'message_replied'
  | 'quote_created'
  | 'quote_sent'
  | 'quote_viewed'
  | 'quote_accepted'
  | 'availability_updated'
  | 'package_updated'
  | 'media_uploaded'
  | 'profile_updated'
  | 'review_replied'
  
  // Admin
  | 'review_moderated'
  | 'listing_reported'
  | 'verification_approved';

export interface Event {
  event_id: string;
  event_name: EventName;
  session_id: string;
  user_id: string | null;
  anon_id: string | null;
  listing_id: string | null;
  vendor_id: string | null;
  venue_id: string | null;
  city: string | null;
  category: string | null;
  properties: Record<string, any>;
  ts: string;
}

export interface EventPayload {
  event_name: EventName;
  listing_id?: string;
  vendor_id?: string;
  venue_id?: string;
  city?: string;
  category?: string;
  properties?: Record<string, any>;
}

// ============================================================================
// PAGEVIEWS
// ============================================================================

export interface Pageview {
  pageview_id: string;
  session_id: string;
  user_id: string | null;
  path: string;
  title: string | null;
  referer: string | null;
  ts: string;
}

export interface PageviewPayload {
  path: string;
  title?: string;
  referer?: string;
}

// ============================================================================
// SEARCHES
// ============================================================================

export interface Search {
  search_id: string;
  session_id: string;
  user_id: string | null;
  query: string | null;
  filters: SearchFilters;
  city: string | null;
  category: string | null;
  date_from: string | null;
  date_to: string | null;
  results_count: number | null;
  ts: string;
}

export interface SearchFilters {
  category?: string;
  city?: string;
  budget_min?: number;
  budget_max?: number;
  capacity_min?: number;
  capacity_max?: number;
  rating_min?: number;
  amenities?: string[];
  tags?: string[];
  date_from?: string;
  date_to?: string;
}

export interface SearchPayload {
  query?: string;
  filters?: SearchFilters;
  city?: string;
  category?: string;
  date_from?: string;
  date_to?: string;
  results_count?: number;
}

// ============================================================================
// SEARCH IMPRESSIONS & CLICKS
// ============================================================================

export interface SearchImpression {
  impression_id: string;
  search_id: string;
  listing_id: string;
  vendor_id: string | null;
  venue_id: string | null;
  position: number;
  ts: string;
}

export interface SearchClick {
  click_id: string;
  search_id: string;
  impression_id: string | null;
  listing_id: string;
  position: number;
  ts: string;
}

export interface ImpressionPayload {
  search_id: string;
  impressions: Array<{
    listing_id: string;
    vendor_id?: string;
    venue_id?: string;
    position: number;
  }>;
}

export interface ClickPayload {
  search_id: string;
  impression_id?: string;
  listing_id: string;
  position: number;
}

// ============================================================================
// PROFILE VIEWS
// ============================================================================

export interface ProfileView {
  view_id: string;
  session_id: string;
  user_id: string | null;
  listing_id: string;
  vendor_id: string | null;
  venue_id: string | null;
  source: string | null; // 'search', 'direct', 'collection', 'referral'
  ts: string;
}

export interface ProfileViewPayload {
  listing_id: string;
  vendor_id?: string;
  venue_id?: string;
  source?: string;
}

// ============================================================================
// ANALYTICS AGGREGATIONS
// ============================================================================

export interface VendorMetricsDaily {
  business_id: string;
  date: string;
  profile_views: number;
  unique_visitors: number;
  impressions: number;
  clicks: number;
  ctr: number;
  inquiries: number;
}

export interface DateDemandDaily {
  city: string;
  date: string;
  searches: number;
  unique_users: number;
  inquiries: number;
}

export interface RankingMetrics {
  business_id: string;
  period: '7d' | '30d' | '90d';
  avg_position: number;
  position_trend: number; // negative is improvement
  impression_weighted_ctr: number;
  top_3_rate: number; // % of impressions in top 3
}

export interface FunnelMetrics {
  business_id: string;
  period: '7d' | '30d' | '90d';
  impressions: number;
  clicks: number;
  profile_views: number;
  inquiries: number;
  quotes_sent: number;
  quotes_accepted: number;
  conversion_rates: {
    impression_to_click: number;
    click_to_view: number;
    view_to_inquiry: number;
    inquiry_to_quote: number;
    quote_to_accepted: number;
  };
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface AnalyticsTimeSeries {
  metric: string;
  data: TimeSeriesDataPoint[];
  total: number;
  trend: number; // % change vs previous period
}

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export interface AnalyticsDateRange {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface VendorAnalyticsQuery {
  business_id: string;
  date_range: AnalyticsDateRange;
  granularity?: 'day' | 'week' | 'month';
  metrics?: string[];
}

export interface AnalyticsDashboardData {
  overview: {
    impressions: number;
    clicks: number;
    ctr: number;
    profile_views: number;
    saves: number;
    inquiries: number;
    quotes_sent: number;
    win_rate: number;
  };
  trends: {
    impressions: AnalyticsTimeSeries;
    clicks: AnalyticsTimeSeries;
    profile_views: AnalyticsTimeSeries;
    inquiries: AnalyticsTimeSeries;
  };
  ranking: RankingMetrics;
  funnel: FunnelMetrics;
  sources: SourceAttribution[];
  top_searches: TopSearch[];
}

export interface SourceAttribution {
  source: string;
  medium: string | null;
  sessions: number;
  inquiries: number;
  conversion_rate: number;
}

export interface TopSearch {
  query: string;
  searches: number;
  clicks: number;
  ctr: number;
}

// ============================================================================
// DATE RUSH (Demand Analytics)
// ============================================================================

export type DemandLevel = 'low' | 'medium' | 'high' | 'peak';

export interface DateDemand {
  city: string;
  date: string;
  searches: number;
  inquiries: number;
  available_vendors: number;
  demand_level: DemandLevel;
  percentile: number; // 0-100, where 100 is highest demand
}

export interface DateRushHeatmap {
  city: string;
  dates: Array<{
    date: string;
    demand_level: DemandLevel;
    searches: number;
    inquiries: number;
  }>;
}

export interface DateRushSuggestion {
  date: string;
  demand_level: DemandLevel;
  action: 'open_slots' | 'offer_discount' | 'highlight_availability' | 'no_action';
  reason: string;
}

// ============================================================================
// RANKING INSIGHTS
// ============================================================================

export interface RankingFactors {
  quality_score: number; // 0-100
  fit_score: number;
  value_score: number;
  activity_score: number;
  popularity_score: number;
  verification_score: number;
  availability_score: number;
}

export interface RankingBreakdown {
  total_score: number;
  factors: RankingFactors;
  position: number;
  position_trend: number;
  improvement_tips: RankingTip[];
}

export interface RankingTip {
  factor: keyof RankingFactors;
  current_score: number;
  max_score: number;
  impact: 'high' | 'medium' | 'low';
  action: string;
  estimated_improvement: number; // position improvement estimate
}

// ============================================================================
// TRACKING SDK CONFIG
// ============================================================================

export interface AnalyticsConfig {
  enabled: boolean;
  sample_rate: number; // 0-1, for impression sampling
  batch_size: number;
  batch_interval_ms: number;
  retry_attempts: number;
  debug: boolean;
}

export interface TrackerState {
  session_id: string | null;
  anon_id: string;
  user_id: string | null;
  is_demo: boolean;
  queue: EventPayload[];
  last_flush: number;
}
