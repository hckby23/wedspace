// ============================================================================
// BUSINESS PROFILES & VENDOR/VENUE DASHBOARD TYPES
// ============================================================================

export type BusinessType = 'vendor' | 'venue';

export type VerificationStatus = 'unverified' | 'pending' | 'verified';

export type PricingTier = '$' | '$$' | '$$$' | '$$$$';

export interface BusinessProfile {
  business_id: string;
  user_id: string;
  business_type: BusinessType;
  business_name: string;
  slug: string | null;
  city: string;
  category: string;
  subcategory: string | null;
  latitude: number | null;
  longitude: number | null;
  service_radius_km: number | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  whatsapp: string | null;
  scheduling_url: string | null;
  pricing_tier: PricingTier | null;
  verification_status: VerificationStatus;
  verification_docs: VerificationDoc[];
  profile_completeness: number;
  is_published: boolean;
  last_active_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface VerificationDoc {
  type: 'pan' | 'gst' | 'business_license' | 'id_proof' | 'portfolio' | 'reference';
  url: string;
  uploaded_at: string;
  status: 'pending' | 'approved' | 'rejected';
}

// ============================================================================
// PACKAGES
// ============================================================================

export type PackageTier = 'basic' | 'standard' | 'premium' | 'custom';

export interface Package {
  package_id: string;
  business_id: string;
  name: string;
  description: string | null;
  tier: PackageTier;
  price_min: number | null;
  price_max: number | null;
  inclusions: string[];
  exclusions: string[];
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface PackageTemplate {
  category: string;
  tier: PackageTier;
  name: string;
  typical_inclusions: string[];
  suggested_price_range: { min: number; max: number };
}

// ============================================================================
// MEDIA ASSETS
// ============================================================================

export type MediaType = 'photo' | 'video' | 'document' | 'external_url';

export interface MediaAsset {
  media_id: string;
  business_id: string;
  type: MediaType;
  url: string;
  thumbnail_url: string | null;
  title: string | null;
  alt_text: string | null;
  tags: string[];
  display_order: number;
  created_at: string;
}

export interface MediaUploadRequest {
  type: MediaType;
  file?: File;
  url?: string;
  title?: string;
  alt_text?: string;
  tags?: string[];
}

// ============================================================================
// AVAILABILITY
// ============================================================================

export interface Availability {
  availability_id: string;
  business_id: string;
  date: string; // YYYY-MM-DD
  is_available: boolean;
  slots_total: number | null;
  slots_booked: number;
  pricing_override: number | null;
  notes: string | null;
  created_at: string;
}

export interface AvailabilityUpdate {
  date: string;
  is_available?: boolean;
  slots_total?: number;
  pricing_override?: number;
  notes?: string;
}

// ============================================================================
// LEADS & INQUIRIES
// ============================================================================

export type LeadStatus = 'new' | 'replied' | 'quoted' | 'negotiating' | 'won' | 'lost';

export type LeadSource = 'inquiry_form' | 'manual' | 'referral' | 'phone' | 'whatsapp';

export interface Lead {
  lead_id: string;
  business_id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  event_date: string | null;
  event_city: string | null;
  budget_min: number | null;
  budget_max: number | null;
  message: string | null;
  status: LeadStatus;
  source: LeadSource;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  replied_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadWithMessages extends Lead {
  messages: Message[];
  quotes: Quote[];
}

export interface LeadStats {
  total: number;
  new: number;
  replied: number;
  quoted: number;
  won: number;
  lost: number;
  response_rate: number;
  win_rate: number;
}

// ============================================================================
// MESSAGES
// ============================================================================

export type MessageSenderType = 'business' | 'customer';

export type MessageChannel = 'portal' | 'email';

export interface Message {
  message_id: string;
  lead_id: string;
  sender_type: MessageSenderType;
  sender_id: string | null;
  body: string;
  sent_via: MessageChannel;
  email_sent_at: string | null;
  read_at: string | null;
  created_at: string;
}

export interface MessageComposer {
  lead_id: string;
  body: string;
  send_email: boolean;
}

// ============================================================================
// QUOTES & PROPOSALS
// ============================================================================

export type QuoteStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'expired' | 'declined';

export interface Quote {
  quote_id: string;
  business_id: string;
  lead_id: string;
  quote_number: string;
  status: QuoteStatus;
  subtotal: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  valid_until: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  accepted_at: string | null;
  magic_link_token: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuoteItem {
  item_id: string;
  quote_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  display_order: number;
}

export interface QuoteWithItems extends Quote {
  items: QuoteItem[];
  lead: Lead;
}

export interface QuoteBuilder {
  lead_id: string;
  items: Omit<QuoteItem, 'item_id' | 'quote_id'>[];
  tax_amount?: number;
  discount_amount?: number;
  notes?: string;
  terms?: string;
  valid_until?: string;
}

export interface QuoteStats {
  total: number;
  draft: number;
  sent: number;
  viewed: number;
  accepted: number;
  acceptance_rate: number;
  avg_value: number;
}

// ============================================================================
// REVIEWS & RATINGS
// ============================================================================

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  review_id: string;
  business_id: string;
  lead_id: string | null;
  user_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  photos: string[];
  status: ReviewStatus;
  vendor_reply: string | null;
  vendor_replied_at: string | null;
  is_verified_booking: boolean;
  created_at: string;
  updated_at: string;
}

export interface ReviewStats {
  total: number;
  average: number;
  distribution: { [key: number]: number }; // 1-5 stars
  pending: number;
  recent: Review[];
}

// ============================================================================
// TEAM & ACCESS
// ============================================================================

export type TeamRole = 'owner' | 'collaborator';

export interface TeamMember {
  member_id: string;
  business_id: string;
  user_id: string;
  role: TeamRole;
  invited_at: string;
  accepted_at: string | null;
}

export interface TeamMemberWithUser extends TeamMember {
  user: {
    email: string;
    name: string | null;
  };
}

// ============================================================================
// SAVED REPLIES & TEMPLATES
// ============================================================================

export interface SavedReply {
  reply_id: string;
  business_id: string;
  title: string;
  body: string;
  shortcut: string | null;
  created_at: string;
}

// ============================================================================
// AUDIT LOGS
// ============================================================================

export interface AuditLog {
  log_id: string;
  business_id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  changes: Record<string, any>;
  ts: string;
}

// ============================================================================
// DASHBOARD KPIs & METRICS
// ============================================================================

export interface DashboardOverview {
  profile: BusinessProfile;
  kpis: VendorKPIs;
  profile_health: ProfileHealth;
  recent_leads: Lead[];
  recent_activity: ActivityItem[];
  date_rush_insights: DateRushInsight[];
}

export interface VendorKPIs {
  period: '7d' | '30d' | '90d';
  views: number;
  views_trend: number;
  impressions: number;
  impressions_trend: number;
  ctr: number;
  ctr_trend: number;
  saves: number;
  saves_trend: number;
  inquiries: number;
  inquiries_trend: number;
  quotes_sent: number;
  quotes_accepted: number;
  win_rate: number;
  avg_response_time_hours: number;
  avg_rank_position: number;
  rank_trend: number;
}

export interface ProfileHealth {
  completeness: number;
  missing_items: string[];
  suggestions: string[];
  verification_status: VerificationStatus;
  last_updated: string;
}

export interface ActivityItem {
  type: 'lead' | 'message' | 'quote' | 'review' | 'booking';
  title: string;
  description: string;
  timestamp: string;
  link?: string;
}

export interface DateRushInsight {
  date: string;
  demand_level: 'low' | 'medium' | 'high' | 'peak';
  searches: number;
  inquiries: number;
  available_slots: number | null;
  suggestion: string;
}

// ============================================================================
// FILTERS & QUERIES
// ============================================================================

export interface LeadFilters {
  status?: LeadStatus[];
  date_from?: string;
  date_to?: string;
  city?: string;
  source?: LeadSource[];
  min_budget?: number;
  max_budget?: number;
  search?: string;
}

export interface QuoteFilters {
  status?: QuoteStatus[];
  date_from?: string;
  date_to?: string;
  min_value?: number;
  max_value?: number;
}

export interface AnalyticsQuery {
  business_id: string;
  date_from: string;
  date_to: string;
  granularity?: 'day' | 'week' | 'month';
}
