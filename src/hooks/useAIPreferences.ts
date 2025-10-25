"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { AIPreferences, PreferenceUpdate } from '@/types/ai-preferences';

export function useAIPreferences() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<AIPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch preferences
  const fetchPreferences = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/ai/preferences');
      if (!response.ok) {
        throw new Error('Failed to fetch AI preferences');
      }
      const data = await response.json();
      setPreferences(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update preferences
  const updatePreferences = useCallback(async (updates: Partial<AIPreferences>) => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/preferences', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Update single preference
  const updatePreference = useCallback(async (update: PreferenceUpdate) => {
    return updatePreferences({ [update.category]: update.value });
  }, [updatePreferences]);

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    if (!user) {
      setError('User not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/preferences', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to reset preferences');
      }

      await fetchPreferences();
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [user, fetchPreferences]);

  // Load preferences on mount
  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences]);

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    updatePreference,
    resetToDefaults,
    refetch: fetchPreferences,
  };
}
