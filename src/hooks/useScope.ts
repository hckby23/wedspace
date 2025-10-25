/**
 * useScope Hook
 * Manages personal vs wedding planning scope context using localStorage
 */

'use client';

import { useState, useEffect } from 'react';
import type { Scope } from '@/types/wedding';

interface ScopeState {
  scope: Scope;
  weddingId: string | null;
  weddingTitle: string | null;
}

const STORAGE_KEY = 'wedspace-scope-storage';

function loadFromStorage(): ScopeState {
  if (typeof window === 'undefined') {
    return { scope: 'personal', weddingId: null, weddingTitle: null };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load scope from storage:', error);
  }
  
  return { scope: 'personal', weddingId: null, weddingTitle: null };
}

function saveToStorage(state: ScopeState) {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save scope to storage:', error);
  }
}

// Convenience hook
export function useScope() {
  const [state, setState] = useState<ScopeState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const setPersonalScope = () => {
    setState({ scope: 'personal', weddingId: null, weddingTitle: null });
  };

  const setWeddingScope = (weddingId: string, title: string) => {
    setState({ scope: 'wedding', weddingId, weddingTitle: title });
  };

  const reset = () => {
    setState({ scope: 'personal', weddingId: null, weddingTitle: null });
  };

  return {
    scope: state.scope,
    weddingId: state.weddingId,
    weddingTitle: state.weddingTitle,
    isPersonal: state.scope === 'personal',
    isWedding: state.scope === 'wedding',
    setPersonalScope,
    setWeddingScope,
    reset,
    // For API calls
    getScopeParams: () => {
      if (state.scope === 'wedding' && state.weddingId) {
        return { weddingId: state.weddingId };
      }
      return {};
    }
  };
}
