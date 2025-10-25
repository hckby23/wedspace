"use client";

export interface AIRecommendation {
  id: string;
  type: 'venue' | 'vendor';
  title: string;
  description: string;
  image: string;
  location: string;
  price: number;
  rating: number;
  matchScore: number;
  reasons: string[];
}

export interface AISearchQuery {
  query: string;
  filters?: {
    budget?: { min: number; max: number };
    location?: string;
    guestCount?: number;
    eventDate?: string;
    eventType?: string;
  };
  preferences?: {
    style?: string[];
    amenities?: string[];
    cuisine?: string[];
  };
}

export interface AIServiceResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export class AIService {
  private static API_BASE = '/api/ai';

  // Get AI-powered venue recommendations
  static async getVenueRecommendations(query: AISearchQuery): Promise<AIServiceResponse<AIRecommendation[]>> {
    try {
      const response = await fetch(`${this.API_BASE}/recommendations/venues`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Failed to get recommendations', success: false };
      }

      const recommendations = await response.json();
      return { data: recommendations, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Get AI-powered vendor recommendations
  static async getVendorRecommendations(query: AISearchQuery): Promise<AIServiceResponse<AIRecommendation[]>> {
    try {
      const response = await fetch(`${this.API_BASE}/recommendations/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Failed to get recommendations', success: false };
      }

      const recommendations = await response.json();
      return { data: recommendations, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered smart search
  static async smartSearch(query: string, type?: 'venue' | 'vendor'): Promise<AIServiceResponse<{
    results: AIRecommendation[];
    suggestions: string[];
    filters: Record<string, any>;
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, type }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Search failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI chat assistant
  static async chatWithAssistant(
    message: string,
    context?: {
      conversationId?: string;
      userPreferences?: Record<string, any>;
      currentPage?: string;
    }
  ): Promise<AIServiceResponse<{
    response: string;
    suggestions: string[];
    recommendations?: AIRecommendation[];
    conversationId: string;
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Chat failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered image matching
  static async findSimilarVenues(imageUrl: string): Promise<AIServiceResponse<AIRecommendation[]>> {
    try {
      const response = await fetch(`${this.API_BASE}/image-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Image matching failed', success: false };
      }

      const matches = await response.json();
      return { data: matches, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered budget optimization
  static async optimizeBudget(requirements: {
    totalBudget: number;
    guestCount: number;
    eventType: string;
    priorities: string[];
    location: string;
  }): Promise<AIServiceResponse<{
    breakdown: Record<string, { amount: number; percentage: number; suggestions: string[] }>;
    recommendations: AIRecommendation[];
    savings: { amount: number; tips: string[] };
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/budget-optimizer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Budget optimization failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered timeline generation
  static async generateTimeline(eventDetails: {
    eventDate: string;
    eventType: string;
    guestCount: number;
    venue?: string;
    vendors?: string[];
  }): Promise<AIServiceResponse<{
    timeline: Array<{
      phase: string;
      startDate: string;
      endDate: string;
      tasks: Array<{
        task: string;
        priority: 'high' | 'medium' | 'low';
        category: string;
        estimatedTime: string;
      }>;
    }>;
    milestones: Array<{
      date: string;
      title: string;
      description: string;
    }>;
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/timeline-generator`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventDetails),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Timeline generation failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered vendor matching
  static async matchVendors(requirements: {
    eventType: string;
    budget: number;
    location: string;
    date: string;
    style?: string;
    preferences?: string[];
  }): Promise<AIServiceResponse<{
    matches: AIRecommendation[];
    packages: Array<{
      name: string;
      vendors: string[];
      totalCost: number;
      savings: number;
      description: string;
    }>;
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/vendor-matching`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requirements),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Vendor matching failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // AI-powered price prediction
  static async predictPricing(query: {
    type: 'venue' | 'vendor';
    category?: string;
    location: string;
    date: string;
    guestCount?: number;
    features?: string[];
  }): Promise<AIServiceResponse<{
    predictedPrice: { min: number; max: number; average: number };
    factors: Array<{ factor: string; impact: number; description: string }>;
    trends: Array<{ period: string; change: number; reason: string }>;
    recommendations: string[];
  }>> {
    try {
      const response = await fetch(`${this.API_BASE}/price-prediction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(query),
      });

      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: error.message || 'Price prediction failed', success: false };
      }

      const result = await response.json();
      return { data: result, error: null, success: true };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        success: false
      };
    }
  }

  // Mock implementations for development
  static async getMockRecommendations(type: 'venue' | 'vendor'): Promise<AIRecommendation[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockVenues: AIRecommendation[] = [
      {
        id: '1',
        type: 'venue',
        title: 'Grand Palace Hotel',
        description: 'Luxurious banquet hall perfect for grand celebrations',
        image: '/img/venue-1.jpg',
        location: 'Delhi NCR',
        price: 150000,
        rating: 4.8,
        matchScore: 95,
        reasons: ['Perfect capacity for your guest count', 'Excellent catering options', 'Prime location']
      },
      {
        id: '2',
        type: 'venue',
        title: 'Royal Gardens',
        description: 'Beautiful outdoor venue with lush gardens',
        image: '/img/venue-2.jpg',
        location: 'Mumbai',
        price: 120000,
        rating: 4.6,
        matchScore: 88,
        reasons: ['Stunning outdoor setting', 'Great for photography', 'Flexible arrangements']
      }
    ];

    const mockVendors: AIRecommendation[] = [
      {
        id: '1',
        type: 'vendor',
        title: 'Elegant Photography',
        description: 'Professional wedding photography with cinematic style',
        image: '/img/vendor-1.jpg',
        location: 'Delhi NCR',
        price: 75000,
        rating: 4.9,
        matchScore: 92,
        reasons: ['Award-winning photographer', 'Cinematic style matches your preference', 'Excellent reviews']
      },
      {
        id: '2',
        type: 'vendor',
        title: 'Dream Decorators',
        description: 'Creative event decoration and design services',
        image: '/img/vendor-2.jpg',
        location: 'Mumbai',
        price: 85000,
        rating: 4.7,
        matchScore: 89,
        reasons: ['Innovative designs', 'Within your budget', 'Specializes in your event type']
      }
    ];

    return type === 'venue' ? mockVenues : mockVendors;
  }

  // Utility functions
  static formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  }

  static getMatchScoreColor(score: number): string {
    if (score >= 90) return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
    if (score >= 80) return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
    return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
  }

  static getMatchScoreLabel(score: number): string {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Good Match';
    if (score >= 70) return 'Fair Match';
    return 'Basic Match';
  }
}
