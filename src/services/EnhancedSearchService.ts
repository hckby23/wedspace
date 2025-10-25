import { createClient } from '@/integrations/supabase/client';
import { AIService } from './AIService';
import type { Database } from '@/types/db';

type Listing = Database['public']['Tables']['listings']['Row'];

export interface SearchFilters {
  query?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  guestCount?: number;
  eventDate?: string;
  amenities?: string[];
  venueType?: string;
  category?: string;
}

export interface SearchResult {
  listings: Listing[];
  suggestions: string[];
  filters: SearchFilters;
  totalCount: number;
  aiInsights?: {
    interpretation: string;
    recommendations: string[];
  };
}

export class EnhancedSearchService {
  private supabase = createClient();

  // Enhanced search with NLP processing
  async search(filters: SearchFilters): Promise<SearchResult> {
    try {
      // Process natural language query with AI
      let processedFilters = { ...filters };
      if (filters.query) {
        const aiResponse = await AIService.smartSearch(filters.query);
        if (aiResponse.success && aiResponse.data) {
          // Merge AI-extracted filters
          processedFilters = {
            ...processedFilters,
            ...aiResponse.data.filters
          };
        }
      }

      // Build Supabase query
      let query = this.supabase
        .from('listings')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      // Apply filters
      if (processedFilters.location) {
        query = query.ilike('city', `%${processedFilters.location}%`);
      }

      if (processedFilters.minPrice) {
        query = query.gte('base_price', processedFilters.minPrice);
      }

      if (processedFilters.maxPrice) {
        query = query.lte('base_price', processedFilters.maxPrice);
      }

      if (processedFilters.minRating) {
        query = query.gte('rating', processedFilters.minRating);
      }

      // Full-text search on title and description
      if (processedFilters.query) {
        query = query.or(`title.ilike.%${processedFilters.query}%,description.ilike.%${processedFilters.query}%`);
      }

      // Execute query
      const { data, error, count } = await query;

      if (error) throw error;

      // Generate AI insights
      let aiInsights;
      if (filters.query) {
        aiInsights = {
          interpretation: this.interpretQuery(filters.query),
          recommendations: await this.getRecommendations(filters)
        };
      }

      return {
        listings: data || [],
        suggestions: this.generateSuggestions(filters),
        filters: processedFilters,
        totalCount: count || 0,
        aiInsights
      };
    } catch (error) {
      console.error('Search error:', error);
      return {
        listings: [],
        suggestions: [],
        filters,
        totalCount: 0
      };
    }
  }

  // Natural language query interpretation
  private interpretQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    // Budget indicators
    if (lowerQuery.includes('cheap') || lowerQuery.includes('affordable') || lowerQuery.includes('budget')) {
      return 'Looking for budget-friendly options';
    }
    
    if (lowerQuery.includes('luxury') || lowerQuery.includes('premium') || lowerQuery.includes('high-end')) {
      return 'Looking for premium/luxury options';
    }

    // Location patterns
    if (lowerQuery.match(/in\s+\w+/)) {
      return 'Searching by location';
    }

    // Capacity indicators
    if (lowerQuery.match(/\d+\s*(guests?|people)/)) {
      return 'Searching based on guest capacity';
    }

    return 'General search';
  }

  // Generate smart suggestions
  private generateSuggestions(filters: SearchFilters): string[] {
    const suggestions: string[] = [];

    if (filters.location) {
      suggestions.push(`Wedding venues in ${filters.location}`);
      suggestions.push(`Best rated in ${filters.location}`);
    }

    if (filters.minPrice && filters.maxPrice) {
      suggestions.push(`Options under ₹${filters.maxPrice}`);
    }

    if (filters.guestCount) {
      suggestions.push(`For ${filters.guestCount} guests`);
    }

    suggestions.push('Popular venues near me');
    suggestions.push('Top rated vendors');

    return suggestions.slice(0, 5);
  }

  // Get AI-powered recommendations
  private async getRecommendations(filters: SearchFilters): Promise<string[]> {
    const recommendations: string[] = [];

    if (filters.minPrice && filters.minPrice < 50000) {
      recommendations.push('Consider off-season dates for better rates');
    }

    if (filters.guestCount && filters.guestCount > 300) {
      recommendations.push('Large venues often offer better per-head rates');
    }

    if (filters.eventDate) {
      recommendations.push('Book 6-8 months in advance for best availability');
    }

    return recommendations;
  }

  // Search by availability
  async searchByAvailability(date: string, location?: string): Promise<Listing[]> {
    try {
      // Get available listings for the date
      const { data: availableSlots } = await this.supabase
        .from('availability_calendar')
        .select('listing_id')
        .eq('date', date)
        .eq('status', 'available');

      if (!availableSlots || availableSlots.length === 0) {
        return [];
      }

      const listingIds = availableSlots.map(slot => slot.listing_id);

      let query = this.supabase
        .from('listings')
        .select('*')
        .in('id', listingIds)
        .eq('status', 'active');

      if (location) {
        query = query.ilike('city', `%${location}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Availability search error:', error);
      return [];
    }
  }

  // Trending searches
  async getTrendingSearches(limit = 10): Promise<string[]> {
    // In production, this would query an analytics table
    // For now, return static trending searches
    return [
      'Wedding venues in Delhi',
      'Beach wedding in Goa',
      'Budget banquet halls',
      'Luxury hotels for weddings',
      'Outdoor wedding venues',
      'Farm venues near Mumbai',
      'Palace weddings Rajasthan',
      'Small intimate venues',
      'Destination wedding packages',
      'Traditional wedding halls'
    ].slice(0, limit);
  }

  // Recent searches (would be user-specific in production)
  async getRecentSearches(userId: string, limit = 5): Promise<string[]> {
    // In production, query user's search history
    return [];
  }
}

export const enhancedSearchService = new EnhancedSearchService();
