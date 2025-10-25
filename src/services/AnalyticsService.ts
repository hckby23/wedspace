// ============================================================================
// ANALYTICS SERVICE - Query internal analytics data
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import type {
  VendorMetricsDaily,
  DateDemandDaily,
  RankingMetrics,
  FunnelMetrics,
  AnalyticsDashboardData,
  AnalyticsDateRange,
  SourceAttribution,
  TopSearch,
  DateRushHeatmap,
  DateRushSuggestion,
  RankingBreakdown,
  RankingTip,
} from '@/types/analytics';

export class AnalyticsService {
  // ============================================================================
  // VENDOR METRICS
  // ============================================================================

  static async getVendorMetrics(
    businessId: string,
    dateRange: AnalyticsDateRange
  ): Promise<VendorMetricsDaily[]> {
    const { data, error } = await supabase
      .from('vendor_metrics_daily')
      .select('*')
      .eq('business_id', businessId)
      .gte('date', dateRange.from)
      .lte('date', dateRange.to)
      .order('date');

    if (error) {
      console.error('Error fetching vendor metrics:', error);
      return [];
    }

    return data || [];
  }

  static async getVendorSummary(businessId: string, period: '7d' | '30d' | '90d') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const metrics = await this.getVendorMetrics(businessId, {
      from: fromDate.toISOString().split('T')[0],
      to: new Date().toISOString().split('T')[0],
    });

    const totals = metrics.reduce(
      (acc, m) => ({
        profile_views: acc.profile_views + m.profile_views,
        unique_visitors: acc.unique_visitors + m.unique_visitors,
        impressions: acc.impressions + m.impressions,
        clicks: acc.clicks + m.clicks,
        inquiries: acc.inquiries + m.inquiries,
      }),
      { profile_views: 0, unique_visitors: 0, impressions: 0, clicks: 0, inquiries: 0 }
    );

    const ctr = totals.impressions > 0 ? (totals.clicks / totals.impressions) * 100 : 0;

    return {
      ...totals,
      ctr,
      avg_daily_views: metrics.length > 0 ? totals.profile_views / metrics.length : 0,
      avg_daily_inquiries: metrics.length > 0 ? totals.inquiries / metrics.length : 0,
    };
  }

  // ============================================================================
  // RANKING INSIGHTS
  // ============================================================================

  static async getRankingMetrics(
    businessId: string,
    period: '7d' | '30d' | '90d'
  ): Promise<RankingMetrics> {
    // Query search_impressions for position data
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('search_impressions')
      .select('position, ts')
      .or(`vendor_id.eq.${businessId},venue_id.eq.${businessId}`)
      .gte('ts', fromDate.toISOString());

    if (error || !data || data.length === 0) {
      return {
        business_id: businessId,
        period,
        avg_position: 0,
        position_trend: 0,
        impression_weighted_ctr: 0,
        top_3_rate: 0,
      };
    }

    const positions = data.map((d) => d.position);
    const avgPosition = positions.reduce((sum, p) => sum + p, 0) / positions.length;
    const top3Count = positions.filter((p) => p <= 3).length;
    const top3Rate = (top3Count / positions.length) * 100;

    // Calculate trend (compare first half vs second half)
    const midpoint = Math.floor(positions.length / 2);
    const firstHalf = positions.slice(0, midpoint);
    const secondHalf = positions.slice(midpoint);
    const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
    const positionTrend = firstAvg - secondAvg; // negative means improvement

    return {
      business_id: businessId,
      period,
      avg_position: Math.round(avgPosition * 10) / 10,
      position_trend: Math.round(positionTrend * 10) / 10,
      impression_weighted_ctr: 0, // TODO: Calculate from clicks/impressions weighted by position
      top_3_rate: Math.round(top3Rate * 10) / 10,
    };
  }

  static async getRankingBreakdown(businessId: string): Promise<RankingBreakdown> {
    // Fetch business profile for scoring
    const { data: profile } = await supabase
      .from('business_profiles')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (!profile) {
      throw new Error('Business profile not found');
    }

    // Calculate ranking factors (simplified)
    const factors = {
      quality_score: 70, // Based on reviews
      fit_score: 80, // Based on location/category match
      value_score: 60, // Based on pricing vs category median
      activity_score: profile.profile_completeness || 0,
      popularity_score: 50, // Based on saves/views
      verification_score: profile.verification_status === 'verified' ? 100 : 0,
      availability_score: 50, // Based on open slots
    };

    const totalScore = Object.values(factors).reduce((sum, score) => sum + score, 0) / 7;

    const tips: RankingTip[] = [];

    if (factors.quality_score < 80) {
      tips.push({
        factor: 'quality_score',
        current_score: factors.quality_score,
        max_score: 100,
        impact: 'high',
        action: 'Encourage satisfied clients to leave reviews',
        estimated_improvement: 3,
      });
    }

    if (factors.verification_score === 0) {
      tips.push({
        factor: 'verification_score',
        current_score: 0,
        max_score: 100,
        impact: 'high',
        action: 'Complete verification by uploading documents',
        estimated_improvement: 5,
      });
    }

    if (factors.activity_score < 80) {
      tips.push({
        factor: 'activity_score',
        current_score: factors.activity_score,
        max_score: 100,
        impact: 'medium',
        action: 'Complete your profile (add photos, packages, availability)',
        estimated_improvement: 2,
      });
    }

    return {
      total_score: Math.round(totalScore),
      factors,
      position: 0, // TODO: Calculate actual position
      position_trend: 0,
      improvement_tips: tips,
    };
  }

  // ============================================================================
  // FUNNELS
  // ============================================================================

  static async getFunnelMetrics(
    businessId: string,
    period: '7d' | '30d' | '90d'
  ): Promise<FunnelMetrics> {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Fetch funnel stage counts
    const [impressions, clicks, views, inquiries, quotes] = await Promise.all([
      this.countEvents('search_impression', businessId, fromDate),
      this.countEvents('card_click', businessId, fromDate),
      this.countEvents('profile_view', businessId, fromDate),
      this.countInquiries(businessId, fromDate),
      this.countQuotes(businessId, fromDate),
    ]);

    const quotesAccepted = quotes.accepted;

    return {
      business_id: businessId,
      period,
      impressions,
      clicks,
      profile_views: views,
      inquiries,
      quotes_sent: quotes.sent,
      quotes_accepted: quotesAccepted,
      conversion_rates: {
        impression_to_click: impressions > 0 ? (clicks / impressions) * 100 : 0,
        click_to_view: clicks > 0 ? (views / clicks) * 100 : 0,
        view_to_inquiry: views > 0 ? (inquiries / views) * 100 : 0,
        inquiry_to_quote: inquiries > 0 ? (quotes.sent / inquiries) * 100 : 0,
        quote_to_accepted: quotes.sent > 0 ? (quotesAccepted / quotes.sent) * 100 : 0,
      },
    };
  }

  // ============================================================================
  // DATE RUSH (Demand Analytics)
  // ============================================================================

  static async getDateDemand(city: string, dateRange: AnalyticsDateRange): Promise<DateDemandDaily[]> {
    const { data, error } = await supabase
      .from('date_demand_daily')
      .select('*')
      .eq('city', city)
      .gte('date', dateRange.from)
      .lte('date', dateRange.to)
      .order('date');

    if (error) {
      console.error('Error fetching date demand:', error);
      return [];
    }

    return data || [];
  }

  static async getDateRushHeatmap(city: string, monthsAhead: number = 6): Promise<DateRushHeatmap> {
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + monthsAhead);

    const demand = await this.getDateDemand(city, {
      from: today.toISOString().split('T')[0],
      to: endDate.toISOString().split('T')[0],
    });

    // Calculate percentiles for demand_level
    const sortedBySearches = [...demand].sort((a, b) => b.searches - a.searches);
    const dates = demand.map((d) => {
      const percentile = (sortedBySearches.findIndex((sd) => sd.date === d.date) / sortedBySearches.length) * 100;
      let demandLevel: 'low' | 'medium' | 'high' | 'peak';
      if (percentile >= 90) demandLevel = 'peak';
      else if (percentile >= 70) demandLevel = 'high';
      else if (percentile >= 40) demandLevel = 'medium';
      else demandLevel = 'low';

      return {
        date: d.date,
        demand_level: demandLevel,
        searches: d.searches,
        inquiries: d.inquiries,
      };
    });

    return { city, dates };
  }

  static async getDateRushSuggestions(
    businessId: string,
    city: string
  ): Promise<DateRushSuggestion[]> {
    const heatmap = await this.getDateRushHeatmap(city, 3);

    // Fetch business availability
    const { data: availability } = await supabase
      .from('availability')
      .select('date, is_available, slots_total, slots_booked')
      .eq('business_id', businessId)
      .gte('date', new Date().toISOString().split('T')[0]);

    const availMap = new Map(availability?.map((a) => [a.date, a]) || []);

    const suggestions: DateRushSuggestion[] = [];

    heatmap.dates.forEach((d) => {
      const avail = availMap.get(d.date);

      if (d.demand_level === 'peak' && (!avail || !avail.is_available)) {
        suggestions.push({
          date: d.date,
          demand_level: d.demand_level,
          action: 'open_slots',
          reason: 'High demand date - consider opening availability',
        });
      } else if (d.demand_level === 'low' && avail?.is_available) {
        suggestions.push({
          date: d.date,
          demand_level: d.demand_level,
          action: 'offer_discount',
          reason: 'Low demand date - consider offering off-peak pricing',
        });
      }
    });

    return suggestions.slice(0, 5); // Top 5 suggestions
  }

  // ============================================================================
  // SOURCE ATTRIBUTION
  // ============================================================================

  static async getSourceAttribution(businessId: string, days: number = 30): Promise<SourceAttribution[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    // Query sessions with inquiries
    const { data, error } = await supabase
      .from('sessions')
      .select('utm_source, utm_medium, session_id')
      .gte('created_at', fromDate.toISOString());

    if (error || !data) return [];

    // Group by source/medium
    const grouped = new Map<string, { sessions: Set<string>; inquiries: number }>();

    data.forEach((s) => {
      const key = `${s.utm_source || 'direct'}|${s.utm_medium || 'none'}`;
      if (!grouped.has(key)) {
        grouped.set(key, { sessions: new Set(), inquiries: 0 });
      }
      grouped.get(key)!.sessions.add(s.session_id);
    });

    // Count inquiries per source (simplified - would need join with leads)
    const result: SourceAttribution[] = Array.from(grouped.entries()).map(([key, value]) => {
      const [source, medium] = key.split('|');
      return {
        source,
        medium: medium === 'none' ? null : medium,
        sessions: value.sessions.size,
        inquiries: value.inquiries,
        conversion_rate: value.sessions.size > 0 ? (value.inquiries / value.sessions.size) * 100 : 0,
      };
    });

    return result.sort((a, b) => b.sessions - a.sessions);
  }

  // ============================================================================
  // TOP SEARCHES
  // ============================================================================

  static async getTopSearches(city: string, days: number = 30): Promise<TopSearch[]> {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - days);

    const { data, error } = await supabase
      .from('searches')
      .select('query, search_id')
      .eq('city', city)
      .gte('ts', fromDate.toISOString())
      .not('query', 'is', null);

    if (error || !data) return [];

    // Group by query
    const queryMap = new Map<string, { searches: number; clicks: number }>();
    data.forEach((s) => {
      const query = s.query?.toLowerCase() || '';
      if (!query) return;
      if (!queryMap.has(query)) {
        queryMap.set(query, { searches: 0, clicks: 0 });
      }
      queryMap.get(query)!.searches++;
    });

    const result: TopSearch[] = Array.from(queryMap.entries())
      .map(([query, stats]) => ({
        query,
        searches: stats.searches,
        clicks: stats.clicks,
        ctr: stats.searches > 0 ? (stats.clicks / stats.searches) * 100 : 0,
      }))
      .sort((a, b) => b.searches - a.searches)
      .slice(0, 10);

    return result;
  }

  // ============================================================================
  // DASHBOARD DATA (Combined)
  // ============================================================================

  static async getDashboardData(
    businessId: string,
    period: '7d' | '30d' | '90d'
  ): Promise<AnalyticsDashboardData> {
    const [summary, ranking, funnel] = await Promise.all([
      this.getVendorSummary(businessId, period),
      this.getRankingMetrics(businessId, period),
      this.getFunnelMetrics(businessId, period),
    ]);

    // Fetch quotes for win rate
    const { data: quotes } = await supabase
      .from('quotes')
      .select('status')
      .eq('business_id', businessId);

    const quotesAccepted = quotes?.filter((q) => q.status === 'accepted').length || 0;
    const quotesSent = quotes?.filter((q) => q.status !== 'draft').length || 0;
    const winRate = quotesSent > 0 ? (quotesAccepted / quotesSent) * 100 : 0;

    return {
      overview: {
        impressions: summary.impressions,
        clicks: summary.clicks,
        ctr: summary.ctr,
        profile_views: summary.profile_views,
        saves: 0, // TODO: Implement
        inquiries: summary.inquiries,
        quotes_sent: quotesSent,
        win_rate: winRate,
      },
      trends: {
        impressions: { metric: 'impressions', data: [], total: summary.impressions, trend: 0 },
        clicks: { metric: 'clicks', data: [], total: summary.clicks, trend: 0 },
        profile_views: { metric: 'profile_views', data: [], total: summary.profile_views, trend: 0 },
        inquiries: { metric: 'inquiries', data: [], total: summary.inquiries, trend: 0 },
      },
      ranking,
      funnel,
      sources: [],
      top_searches: [],
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private static async countEvents(eventName: string, businessId: string, fromDate: Date): Promise<number> {
    const { data, error } = await supabase
      .from('events')
      .select('event_id', { count: 'exact', head: true })
      .eq('event_name', eventName)
      .or(`vendor_id.eq.${businessId},venue_id.eq.${businessId}`)
      .gte('ts', fromDate.toISOString());

    if (error) return 0;
    return (data as any) || 0;
  }

  private static async countInquiries(businessId: string, fromDate: Date): Promise<number> {
    const { data, error } = await supabase
      .from('leads')
      .select('lead_id', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .gte('created_at', fromDate.toISOString());

    if (error) return 0;
    return (data as any) || 0;
  }

  private static async countQuotes(businessId: string, fromDate: Date): Promise<{ sent: number; accepted: number }> {
    const { data } = await supabase
      .from('quotes')
      .select('status')
      .eq('business_id', businessId)
      .gte('created_at', fromDate.toISOString());

    if (!data) return { sent: 0, accepted: 0 };

    return {
      sent: data.filter((q) => q.status !== 'draft').length,
      accepted: data.filter((q) => q.status === 'accepted').length,
    };
  }

  // ============================================================================
  // REFRESH MATERIALIZED VIEWS
  // ============================================================================

  static async refreshAnalytics(): Promise<void> {
    try {
      await supabase.rpc('refresh_analytics_views');
    } catch (error) {
      console.error('Error refreshing analytics:', error);
    }
  }
}
