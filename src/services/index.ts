/**
 * Central Service Exports
 * Single point of import for all WedSpace services
 */

// AI Services
export { AIService } from './AIService';
export type { 
  AIRecommendation, 
  AISearchQuery, 
  AIServiceResponse 
} from './AIService';

export { OpenRouterService } from './OpenRouterService';
export type {
  OpenRouterMessage,
  OpenRouterFunction,
  OpenRouterRequest,
  OpenRouterResponse,
} from './OpenRouterService';

export { EnhancedAIAssistant } from './EnhancedAIAssistant';
export type {
  AssistantContext,
  AssistantResponse,
} from './EnhancedAIAssistant';

// Enhanced Search
export { EnhancedSearchService } from './EnhancedSearchService';

// Analytics
export { AnalyticsService } from './analytics';
export type { EventData } from './analytics';

// SEO
export { SEOService } from './seo';

// Export all hooks for convenience
export * from '../hooks/useAI';
export * from '../hooks/useAIAssistant';
export * from '../hooks/useAIPreferences';
export * from '../hooks/useAdmin';
export * from '../hooks/useAuth';
export * from '../hooks/useBookings';
export * from '../hooks/useFavorites';
export * from '../hooks/useListings';
export * from '../hooks/useNotifications';
export * from '../hooks/useVenues';
