"use client";

import { useState, useCallback } from 'react';
import { AIService, type AIRecommendation, type AISearchQuery } from '@/services/AIService';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getVenueRecommendations = useCallback(async (query: AISearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.getVenueRecommendations(query);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const getVendorRecommendations = useCallback(async (query: AISearchQuery) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.getVendorRecommendations(query);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const smartSearch = useCallback(async (query: string, type?: 'venue' | 'vendor') => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.smartSearch(query, type);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const findSimilarVenues = useCallback(async (imageUrl: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.findSimilarVenues(imageUrl);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const optimizeBudget = useCallback(async (requirements: {
    totalBudget: number;
    guestCount: number;
    eventType: string;
    priorities: string[];
    location: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.optimizeBudget(requirements);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTimeline = useCallback(async (eventDetails: {
    eventDate: string;
    eventType: string;
    guestCount: number;
    venue?: string;
    vendors?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.generateTimeline(eventDetails);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const matchVendors = useCallback(async (requirements: {
    eventType: string;
    budget: number;
    location: string;
    date: string;
    style?: string;
    preferences?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.matchVendors(requirements);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const predictPricing = useCallback(async (query: {
    type: 'venue' | 'vendor';
    category?: string;
    location: string;
    date: string;
    guestCount?: number;
    features?: string[];
  }) => {
    setLoading(true);
    setError(null);
    try {
      const result = await AIService.predictPricing(query);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { data: null, error: errorMsg, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getVenueRecommendations,
    getVendorRecommendations,
    smartSearch,
    findSimilarVenues,
    optimizeBudget,
    generateTimeline,
    matchVendors,
    predictPricing,
  };
}
