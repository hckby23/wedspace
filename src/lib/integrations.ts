/**
 * WedSpace Integration Hub
 * Central point for all service interconnections
 */

// Service imports
import { AIService } from '@/services/AIService';
import { OpenRouterService } from '@/services/OpenRouterService';
import { EnhancedAIAssistant } from '@/services/EnhancedAIAssistant';
import { AnalyticsService } from '@/services/analytics';
import { SEOService } from '@/services/seo';

// Hook imports
import { useAI } from '@/hooks/useAI';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useAIPreferences } from '@/hooks/useAIPreferences';
import { useAdmin } from '@/hooks/useAdmin';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites } from '@/hooks/useFavorites';
import { useListings } from '@/hooks/useListings';
import { useNotifications } from '@/hooks/useNotifications';
import { useBusinessDashboard } from '@/hooks/useBusinessDashboard';

/**
 * Integration Configuration
 */
export const INTEGRATIONS = {
  // AI Services
  ai: {
    service: AIService,
    assistant: EnhancedAIAssistant,
    router: OpenRouterService,
  },
  
  // Analytics
  analytics: AnalyticsService,
  
  // SEO
  seo: SEOService,
  
  // Hooks
  hooks: {
    useAI,
    useAIAssistant,
    useAIPreferences,
    useAdmin,
    useAuth,
    useBookings,
    useFavorites,
    useListings,
    useNotifications,
    useBusinessDashboard,
  },
} as const;

/**
 * Page-specific integration requirements
 */
export const PAGE_INTEGRATIONS = {
  // Home page
  '/': ['ai', 'analytics', 'seo'],
  
  // Venues
  '/venues': ['ai', 'analytics', 'listings', 'favorites'],
  '/venues/[id]': ['ai', 'analytics', 'bookings', 'favorites', 'reviews'],
  
  // Vendors
  '/vendors': ['ai', 'analytics', 'listings', 'favorites'],
  '/vendors/[id]': ['ai', 'analytics', 'bookings', 'favorites', 'reviews'],
  
  // Search
  '/search': ['ai', 'analytics', 'listings'],
  
  // Planning Tools
  '/planning': ['ai', 'analytics', 'auth'],
  '/tools/checklist': ['ai', 'analytics', 'auth'],
  '/tools/budget': ['ai', 'analytics', 'auth'],
  '/tools/timeline': ['ai', 'analytics', 'auth'],
  '/tools/guests': ['ai', 'analytics', 'auth'],
  
  // Dashboard
  '/dashboard': ['ai', 'analytics', 'auth', 'bookings', 'notifications'],
  
  // Business Dashboards
  '/vendor/dashboard': ['analytics', 'auth', 'business', 'bookings'],
  '/venue/dashboard': ['analytics', 'auth', 'business', 'bookings'],
  '/admin/dashboard': ['analytics', 'auth', 'admin'],
  
  // Community
  '/community': ['analytics', 'auth'],
  '/ideas': ['ai', 'analytics'],
  '/real-weddings': ['analytics'],
} as const;

/**
 * Feature flags for progressive rollout
 */
export const FEATURE_FLAGS = {
  aiAssistant: true,
  aiRecommendations: true,
  aiImageMatch: true,
  aiSmartSort: true,
  dynamicPricing: true,
  realTimeNotifications: true,
  advancedAnalytics: true,
  multimodalSearch: true,
  vendorScorecard: true,
  negotiationSystem: true,
} as const;

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

/**
 * Get required integrations for a page
 */
export function getPageIntegrations(path: string): string[] {
  return PAGE_INTEGRATIONS[path as keyof typeof PAGE_INTEGRATIONS] || [];
}

/**
 * Unified error handling
 */
export class IntegrationError extends Error {
  constructor(
    public service: string,
    public operation: string,
    public originalError: Error
  ) {
    super(`${service}.${operation} failed: ${originalError.message}`);
    this.name = 'IntegrationError';
  }
}

/**
 * Service health check
 */
export async function checkServiceHealth() {
  const health = {
    database: false,
    ai: false,
    analytics: false,
    timestamp: new Date().toISOString(),
  };

  try {
    // Check database (Supabase)
    const dbResponse = await fetch('/api/health/database');
    health.database = dbResponse.ok;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check AI service
    const aiResponse = await fetch('/api/health/ai');
    health.ai = aiResponse.ok;
  } catch (error) {
    console.error('AI health check failed:', error);
  }

  try {
    // Check analytics
    health.analytics = true; // Internal service
  } catch (error) {
    console.error('Analytics health check failed:', error);
  }

  return health;
}

/**
 * Initialize integrations for a page
 */
export function initializePageIntegrations(path: string) {
  const requiredIntegrations = getPageIntegrations(path);
  
  // Track page view
  if (requiredIntegrations.includes('analytics')) {
    AnalyticsService.trackEvent('page_view', { path });
  }
  
  // Initialize SEO
  if (requiredIntegrations.includes('seo')) {
    // SEO will be handled by metadata in layout/page
  }
  
  return requiredIntegrations;
}

export default INTEGRATIONS;
