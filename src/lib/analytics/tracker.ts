// ============================================================================
// CLIENT-SIDE ANALYTICS TRACKER (Internal, Supabase-only)
// Free-tier optimized with batching, sampling, and retry logic
// ============================================================================

import { supabase } from '@/integrations/supabase/client';
import type {
  AnalyticsConfig,
  TrackerState,
  EventPayload,
  PageviewPayload,
  SearchPayload,
  ImpressionPayload,
  ClickPayload,
  ProfileViewPayload,
  SessionInit,
} from '@/types/analytics';

// ============================================================================
// DEFAULT CONFIGURATION
// ============================================================================

const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  sample_rate: 0.5, // Sample 50% of impressions to stay within free tier
  batch_size: 10,
  batch_interval_ms: 5000, // Flush every 5 seconds
  retry_attempts: 3,
  debug: process.env.NODE_ENV === 'development',
};

// ============================================================================
// TRACKER CLASS
// ============================================================================

class AnalyticsTracker {
  private config: AnalyticsConfig;
  private state: TrackerState;
  private flushTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.state = this.loadState();
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  async initialize(sessionInit?: Partial<SessionInit>): Promise<void> {
    if (this.isInitialized) return;

    // Get or create anon_id
    if (!this.state.anon_id) {
      this.state.anon_id = this.generateAnonId();
    }

    // Check for authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      this.state.user_id = user.id;
    }

    // Create session if needed
    if (!this.state.session_id || this.isSessionExpired()) {
      await this.createSession(sessionInit);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        this.state.user_id = session.user.id;
        this.updateSession({ user_id: session.user.id });
      } else if (event === 'SIGNED_OUT') {
        this.state.user_id = null;
      }
      this.saveState();
    });

    // Start flush timer
    this.startFlushTimer();

    // Flush on page unload
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => this.flush());
    }

    this.isInitialized = true;
    this.log('Analytics tracker initialized', this.state);
  }

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  private async createSession(sessionInit?: Partial<SessionInit>): Promise<void> {
    const session: SessionInit = {
      anon_id: this.state.anon_id,
      device: this.getDevice(),
      browser: this.getBrowser(),
      os: this.getOS(),
      lang: navigator.language,
      tz_offset: new Date().getTimezoneOffset(),
      utm_source: this.getUTMParam('utm_source'),
      utm_medium: this.getUTMParam('utm_medium'),
      utm_campaign: this.getUTMParam('utm_campaign'),
      utm_content: this.getUTMParam('utm_content'),
      utm_term: this.getUTMParam('utm_term'),
      referer: document.referrer || null,
      landing_path: window.location.pathname,
      is_demo: this.state.is_demo,
      ...sessionInit,
    };

    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert(session)
        .select('session_id')
        .single();

      if (error) throw error;

      this.state.session_id = data.session_id;
      this.saveState();
      this.log('Session created', data.session_id);
    } catch (error) {
      this.log('Error creating session', error);
    }
  }

  private async updateSession(updates: { user_id: string }): Promise<void> {
    if (!this.state.session_id) return;

    try {
      await supabase
        .from('sessions')
        .update({
          user_id: updates.user_id,
          last_activity_at: new Date().toISOString(),
        })
        .eq('session_id', this.state.session_id);
      
      this.log('Session updated with user_id');
    } catch (error) {
      this.log('Error updating session', error);
    }
  }

  private isSessionExpired(): boolean {
    const lastFlush = this.state.last_flush;
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
    return Date.now() - lastFlush > SESSION_TIMEOUT;
  }

  // ============================================================================
  // EVENT TRACKING
  // ============================================================================

  track(event: EventPayload): void {
    if (!this.config.enabled) return;

    const enrichedEvent: EventPayload = {
      ...event,
      properties: {
        ...event.properties,
        _session_id: this.state.session_id,
        _user_id: this.state.user_id,
        _anon_id: this.state.anon_id,
        _timestamp: Date.now(),
      },
    };

    this.state.queue.push(enrichedEvent);
    this.saveState();

    this.log('Event tracked', enrichedEvent);

    // Flush if batch size reached
    if (this.state.queue.length >= this.config.batch_size) {
      this.flush();
    }
  }

  // ============================================================================
  // SPECIALIZED TRACKING METHODS
  // ============================================================================

  trackPageview(payload: PageviewPayload): void {
    this.track({
      event_name: 'page_view',
      properties: payload,
    });
  }

  trackSearch(payload: SearchPayload): string {
    const search_id = this.generateId();
    this.track({
      event_name: 'search_performed',
      city: payload.city,
      category: payload.category,
      properties: {
        ...payload,
        search_id,
      },
    });
    return search_id;
  }

  trackImpressions(payload: ImpressionPayload): void {
    // Sample impressions to stay within free tier
    if (Math.random() > this.config.sample_rate) return;

    payload.impressions.forEach((impression) => {
      this.track({
        event_name: 'search_impression',
        listing_id: impression.listing_id,
        vendor_id: impression.vendor_id,
        venue_id: impression.venue_id,
        properties: {
          search_id: payload.search_id,
          position: impression.position,
        },
      });
    });
  }

  trackClick(payload: ClickPayload): void {
    this.track({
      event_name: 'card_click',
      listing_id: payload.listing_id,
      properties: payload,
    });
  }

  trackProfileView(payload: ProfileViewPayload): void {
    this.track({
      event_name: 'profile_view',
      listing_id: payload.listing_id,
      vendor_id: payload.vendor_id,
      venue_id: payload.venue_id,
      properties: {
        source: payload.source || 'direct',
      },
    });
  }

  trackInquiry(listing_id: string, properties?: Record<string, any>): void {
    this.track({
      event_name: 'inquiry_submitted',
      listing_id,
      properties,
    });
  }

  // ============================================================================
  // FLUSHING & PERSISTENCE
  // ============================================================================

  async flush(): Promise<void> {
    if (this.state.queue.length === 0) return;

    const events = [...this.state.queue];
    this.state.queue = [];
    this.state.last_flush = Date.now();
    this.saveState();

    try {
      const { error } = await supabase.from('events').insert(
        events.map((event) => ({
          event_name: event.event_name,
          session_id: this.state.session_id,
          user_id: this.state.user_id,
          anon_id: this.state.anon_id,
          listing_id: event.listing_id,
          vendor_id: event.vendor_id,
          venue_id: event.venue_id,
          city: event.city,
          category: event.category,
          properties: event.properties,
        }))
      );

      if (error) throw error;

      this.log(`Flushed ${events.length} events`);
    } catch (error) {
      this.log('Error flushing events', error);
      // Re-queue events for retry
      this.state.queue.unshift(...events);
      this.saveState();
    }
  }

  private startFlushTimer(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.batch_interval_ms);
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  private loadState(): TrackerState {
    if (typeof window === 'undefined') {
      return this.getDefaultState();
    }

    try {
      const saved = localStorage.getItem('analytics_state');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      this.log('Error loading state', error);
    }

    return this.getDefaultState();
  }

  private saveState(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem('analytics_state', JSON.stringify(this.state));
    } catch (error) {
      this.log('Error saving state', error);
    }
  }

  private getDefaultState(): TrackerState {
    return {
      session_id: null,
      anon_id: this.generateAnonId(),
      user_id: null,
      is_demo: false,
      queue: [],
      last_flush: Date.now(),
    };
  }

  // ============================================================================
  // UTILITIES
  // ============================================================================

  private generateAnonId(): string {
    return `anon_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private getUTMParam(param: string): string | null {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  private getDevice(): string {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  private getBrowser(): string {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    return 'Other';
  }

  private getOS(): string {
    if (typeof window === 'undefined') return 'unknown';
    const ua = navigator.userAgent;
    if (ua.includes('Win')) return 'Windows';
    if (ua.includes('Mac')) return 'macOS';
    if (ua.includes('Linux')) return 'Linux';
    if (ua.includes('Android')) return 'Android';
    if (ua.includes('iOS')) return 'iOS';
    return 'Other';
  }

  private log(...args: any[]): void {
    if (this.config.debug) {
      console.log('[Analytics]', ...args);
    }
  }

  // ============================================================================
  // PUBLIC API
  // ============================================================================

  setDemoMode(isDemo: boolean): void {
    this.state.is_demo = isDemo;
    this.saveState();
  }

  reset(): void {
    this.state = this.getDefaultState();
    this.saveState();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics_state');
    }
    this.log('Tracker reset');
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const analytics = new AnalyticsTracker();

// ============================================================================
// CONVENIENCE HOOKS
// ============================================================================

export function useAnalytics() {
  return analytics;
}
