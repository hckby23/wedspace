// ============================================================================
// BUSINESS SERVICE - Vendor/Venue Dashboard Operations
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import type {
  BusinessProfile,
  Package,
  MediaAsset,
  MediaUploadRequest,
  Availability,
  AvailabilityUpdate,
  Lead,
  LeadFilters,
  LeadStats,
  Message,
  MessageComposer,
  Quote,
  QuoteWithItems,
  QuoteBuilder,
  QuoteStats,
  Review,
  ReviewStats,
  SavedReply,
  DashboardOverview,
  VendorKPIs,
  ProfileHealth,
} from '@/types/business';

// ============================================================================
// BUSINESS PROFILE
// ============================================================================

export class BusinessService {
  static async getBusinessProfile(userId: string): Promise<BusinessProfile | null> {
    const { data, error } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching business profile:', error);
      return null;
    }

    return data;
  }

  static async updateBusinessProfile(
    businessId: string,
    updates: Partial<BusinessProfile>
  ): Promise<BusinessProfile | null> {
    const { data, error } = await supabase
      .from('business_profiles')
      .update(updates)
      .eq('business_id', businessId)
      .select()
      .single();

    if (error) {
      console.error('Error updating business profile:', error);
      throw error;
    }

    return data;
  }

  static async publishProfile(businessId: string): Promise<void> {
    await this.updateBusinessProfile(businessId, { is_published: true });
  }

  static async unpublishProfile(businessId: string): Promise<void> {
    await this.updateBusinessProfile(businessId, { is_published: false });
  }

  // ============================================================================
  // PACKAGES
  // ============================================================================

  static async getPackages(businessId: string): Promise<Package[]> {
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('business_id', businessId)
      .order('display_order');

    if (error) {
      console.error('Error fetching packages:', error);
      return [];
    }

    return data || [];
  }

  static async createPackage(pkg: Omit<Package, 'package_id' | 'created_at' | 'updated_at'>): Promise<Package | null> {
    const { data, error } = await supabase
      .from('packages')
      .insert(pkg)
      .select()
      .single();

    if (error) {
      console.error('Error creating package:', error);
      throw error;
    }

    return data;
  }

  static async updatePackage(packageId: string, updates: Partial<Package>): Promise<Package | null> {
    const { data, error } = await supabase
      .from('packages')
      .update(updates)
      .eq('package_id', packageId)
      .select()
      .single();

    if (error) {
      console.error('Error updating package:', error);
      throw error;
    }

    return data;
  }

  static async deletePackage(packageId: string): Promise<void> {
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('package_id', packageId);

    if (error) {
      console.error('Error deleting package:', error);
      throw error;
    }
  }

  // ============================================================================
  // MEDIA ASSETS
  // ============================================================================

  static async getMediaAssets(businessId: string): Promise<MediaAsset[]> {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*')
      .eq('business_id', businessId)
      .order('display_order');

    if (error) {
      console.error('Error fetching media assets:', error);
      return [];
    }

    return data || [];
  }

  static async uploadMedia(businessId: string, request: MediaUploadRequest): Promise<MediaAsset | null> {
    let url = request.url;

    // If uploading a file, upload to Supabase Storage first
    if (request.file) {
      const fileExt = request.file.name.split('.').pop();
      const fileName = `${businessId}/${Date.now()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('business-media')
        .upload(fileName, request.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('business-media')
        .getPublicUrl(fileName);

      url = publicUrl;
    }

    // Create media record
    const { data, error } = await supabase
      .from('media_assets')
      .insert({
        business_id: businessId,
        type: request.type,
        url: url!,
        title: request.title,
        alt_text: request.alt_text,
        tags: request.tags || [],
        display_order: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating media asset:', error);
      throw error;
    }

    return data;
  }

  static async deleteMedia(mediaId: string): Promise<void> {
    const { error } = await supabase
      .from('media_assets')
      .delete()
      .eq('media_id', mediaId);

    if (error) {
      console.error('Error deleting media:', error);
      throw error;
    }
  }

  static async reorderMedia(mediaId: string, newOrder: number): Promise<void> {
    const { error } = await supabase
      .from('media_assets')
      .update({ display_order: newOrder })
      .eq('media_id', mediaId);

    if (error) {
      console.error('Error reordering media:', error);
      throw error;
    }
  }

  // ============================================================================
  // AVAILABILITY
  // ============================================================================

  static async getAvailability(businessId: string, startDate: string, endDate: string): Promise<Availability[]> {
    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('business_id', businessId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date');

    if (error) {
      console.error('Error fetching availability:', error);
      return [];
    }

    return data || [];
  }

  static async updateAvailability(
    businessId: string,
    updates: AvailabilityUpdate[]
  ): Promise<void> {
    const promises = updates.map((update) =>
      supabase.from('availability').upsert({
        business_id: businessId,
        date: update.date,
        is_available: update.is_available,
        slots_total: update.slots_total,
        pricing_override: update.pricing_override,
        notes: update.notes,
      })
    );

    await Promise.all(promises);
  }

  // ============================================================================
  // LEADS
  // ============================================================================

  static async getLeads(businessId: string, filters?: LeadFilters): Promise<Lead[]> {
    let query = supabase
      .from('leads')
      .select('*')
      .eq('business_id', businessId);

    if (filters) {
      if (filters.status?.length) {
        query = query.in('status', filters.status);
      }
      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }
      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }
      if (filters.city) {
        query = query.eq('event_city', filters.city);
      }
      if (filters.source?.length) {
        query = query.in('source', filters.source);
      }
      if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
      }
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching leads:', error);
      return [];
    }

    return data || [];
  }

  static async getLeadStats(businessId: string): Promise<LeadStats> {
    const leads = await this.getLeads(businessId);

    const stats: LeadStats = {
      total: leads.length,
      new: leads.filter((l) => l.status === 'new').length,
      replied: leads.filter((l) => l.status === 'replied').length,
      quoted: leads.filter((l) => l.status === 'quoted').length,
      won: leads.filter((l) => l.status === 'won').length,
      lost: leads.filter((l) => l.status === 'lost').length,
      response_rate: 0,
      win_rate: 0,
    };

    if (stats.total > 0) {
      const responded = stats.replied + stats.quoted + stats.won;
      stats.response_rate = (responded / stats.total) * 100;

      const completed = stats.won + stats.lost;
      if (completed > 0) {
        stats.win_rate = (stats.won / completed) * 100;
      }
    }

    return stats;
  }

  static async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    const { error } = await supabase
      .from('leads')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('lead_id', leadId);

    if (error) {
      console.error('Error updating lead status:', error);
      throw error;
    }
  }

  static async createManualLead(businessId: string, lead: Partial<Lead>): Promise<Lead | null> {
    const { data, error } = await supabase
      .from('leads')
      .insert({
        ...lead,
        business_id: businessId,
        source: 'manual',
        status: 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating manual lead:', error);
      throw error;
    }

    return data;
  }

  // ============================================================================
  // MESSAGES
  // ============================================================================

  static async getMessages(leadId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at');

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  }

  static async sendMessage(message: MessageComposer): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        lead_id: message.lead_id,
        sender_type: 'business',
        body: message.body,
        sent_via: 'portal',
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      throw error;
    }

    // TODO: If send_email is true, trigger email via Resend
    if (message.send_email) {
      // await EmailService.sendLeadReply(...)
    }

    return data;
  }

  // ============================================================================
  // QUOTES
  // ============================================================================

  static async getQuotes(businessId: string): Promise<Quote[]> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, lead:leads(*)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching quotes:', error);
      return [];
    }

    return data || [];
  }

  static async getQuoteWithItems(quoteId: string): Promise<QuoteWithItems | null> {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, items:quote_items(*), lead:leads(*)')
      .eq('quote_id', quoteId)
      .single();

    if (error) {
      console.error('Error fetching quote:', error);
      return null;
    }

    return data as any;
  }

  static async createQuote(businessId: string, builder: QuoteBuilder): Promise<QuoteWithItems | null> {
    // Calculate totals
    const subtotal = builder.items.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = builder.tax_amount || 0;
    const discountAmount = builder.discount_amount || 0;
    const total = subtotal + taxAmount - discountAmount;

    // Create quote
    const { data: quote, error: quoteError } = await supabase
      .from('quotes')
      .insert({
        business_id: businessId,
        lead_id: builder.lead_id,
        status: 'draft',
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total,
        notes: builder.notes,
        terms: builder.terms,
        valid_until: builder.valid_until,
        magic_link_token: this.generateMagicToken(),
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      throw quoteError;
    }

    // Create quote items
    const { error: itemsError } = await supabase
      .from('quote_items')
      .insert(
        builder.items.map((item, index) => ({
          quote_id: quote.quote_id,
          ...item,
          display_order: index,
        }))
      );

    if (itemsError) {
      console.error('Error creating quote items:', itemsError);
      throw itemsError;
    }

    return this.getQuoteWithItems(quote.quote_id);
  }

  static async sendQuote(quoteId: string): Promise<void> {
    const { error } = await supabase
      .from('quotes')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString(),
      })
      .eq('quote_id', quoteId);

    if (error) {
      console.error('Error sending quote:', error);
      throw error;
    }

    // TODO: Send email via Resend
  }

  static async getQuoteStats(businessId: string): Promise<QuoteStats> {
    const quotes = await this.getQuotes(businessId);

    const stats: QuoteStats = {
      total: quotes.length,
      draft: quotes.filter((q) => q.status === 'draft').length,
      sent: quotes.filter((q) => q.status === 'sent').length,
      viewed: quotes.filter((q) => q.status === 'viewed').length,
      accepted: quotes.filter((q) => q.status === 'accepted').length,
      acceptance_rate: 0,
      avg_value: 0,
    };

    const sent = stats.sent + stats.viewed + stats.accepted;
    if (sent > 0) {
      stats.acceptance_rate = (stats.accepted / sent) * 100;
    }

    if (quotes.length > 0) {
      stats.avg_value = quotes.reduce((sum, q) => sum + q.total, 0) / quotes.length;
    }

    return stats;
  }

  // ============================================================================
  // REVIEWS
  // ============================================================================

  static async getReviews(businessId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    return data || [];
  }

  static async getReviewStats(businessId: string): Promise<ReviewStats> {
    const reviews = await this.getReviews(businessId);

    const approved = reviews.filter((r) => r.status === 'approved');

    const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    approved.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });

    const average = approved.length > 0
      ? approved.reduce((sum, r) => sum + r.rating, 0) / approved.length
      : 0;

    return {
      total: approved.length,
      average,
      distribution,
      pending: reviews.filter((r) => r.status === 'pending').length,
      recent: approved.slice(0, 5),
    };
  }

  static async replyToReview(reviewId: string, reply: string): Promise<void> {
    const { error } = await supabase
      .from('reviews')
      .update({
        vendor_reply: reply,
        vendor_replied_at: new Date().toISOString(),
      })
      .eq('review_id', reviewId);

    if (error) {
      console.error('Error replying to review:', error);
      throw error;
    }
  }

  // ============================================================================
  // SAVED REPLIES
  // ============================================================================

  static async getSavedReplies(businessId: string): Promise<SavedReply[]> {
    const { data, error } = await supabase
      .from('saved_replies')
      .select('*')
      .eq('business_id', businessId)
      .order('title');

    if (error) {
      console.error('Error fetching saved replies:', error);
      return [];
    }

    return data || [];
  }

  static async createSavedReply(businessId: string, reply: Omit<SavedReply, 'reply_id' | 'business_id' | 'created_at'>): Promise<SavedReply | null> {
    const { data, error } = await supabase
      .from('saved_replies')
      .insert({
        business_id: businessId,
        ...reply,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating saved reply:', error);
      throw error;
    }

    return data;
  }

  // ============================================================================
  // DASHBOARD OVERVIEW
  // ============================================================================

  static async getDashboardOverview(businessId: string): Promise<DashboardOverview | null> {
    const [profile, leads, quotes, reviews] = await Promise.all([
      this.getBusinessProfile((await supabase.auth.getUser()).data.user!.id),
      this.getLeads(businessId),
      this.getQuotes(businessId),
      this.getReviews(businessId),
    ]);

    if (!profile) return null;

    // TODO: Fetch real KPIs from analytics aggregations
    const kpis: VendorKPIs = {
      period: '30d',
      views: 0,
      views_trend: 0,
      impressions: 0,
      impressions_trend: 0,
      ctr: 0,
      ctr_trend: 0,
      saves: 0,
      saves_trend: 0,
      inquiries: leads.length,
      inquiries_trend: 0,
      quotes_sent: quotes.filter((q) => q.status !== 'draft').length,
      quotes_accepted: quotes.filter((q) => q.status === 'accepted').length,
      win_rate: 0,
      avg_response_time_hours: 0,
      avg_rank_position: 0,
      rank_trend: 0,
    };

    const profile_health: ProfileHealth = {
      completeness: profile.profile_completeness,
      missing_items: this.getMissingProfileItems(profile),
      suggestions: [],
      verification_status: profile.verification_status,
      last_updated: profile.updated_at,
    };

    return {
      profile,
      kpis,
      profile_health,
      recent_leads: leads.slice(0, 5),
      recent_activity: [],
      date_rush_insights: [],
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private static generateMagicToken(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private static getMissingProfileItems(profile: BusinessProfile): string[] {
    const missing: string[] = [];

    if (!profile.description || profile.description.length < 50) {
      missing.push('Business description (min 50 characters)');
    }
    if (!profile.phone) missing.push('Phone number');
    if (!profile.website) missing.push('Website');
    if (profile.verification_status === 'unverified') {
      missing.push('Verification documents');
    }

    return missing;
  }
}
