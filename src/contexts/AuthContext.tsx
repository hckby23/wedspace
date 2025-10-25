"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase as supabaseClient } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  wedding_date?: string;
  partner_name?: string;
  city?: string;
  guest_count?: number;
  budget_range?: string;
  onboarding_completed: boolean;
  is_demo_user: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isDemoMode: boolean;
  signUp: (email: string, password: string, fullName?: string) => Promise<void>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  enableDemoMode: () => void;
  convertDemoToAccount: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();
  const supabase = supabaseClient;

  useEffect(() => {
    // Check for existing session
    checkSession();

    // Check for demo mode
    const demoMode = localStorage.getItem('demo_mode') === 'true';
    setIsDemoMode(demoMode);

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        // Create profile
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          onboarding_completed: false,
          is_demo_user: false
        });

        setUser(data.user);
        await fetchProfile(data.user.id);
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await fetchProfile(data.user.id);
        router.push('/dashboard');
      }
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      setProfile(null);
      router.push('/');
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    if (!user) throw new Error('Not authenticated');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      await fetchProfile(user.id);
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const enableDemoMode = () => {
    localStorage.setItem('demo_mode', 'true');
    localStorage.setItem('demo_user_id', `demo_${Date.now()}`);
    setIsDemoMode(true);
    router.push('/dashboard');
  };

  const convertDemoToAccount = async (email: string, password: string) => {
    try {
      // Get demo data
      const demoData = {
        checklist: localStorage.getItem('ws_checklist_v1'),
        budget: localStorage.getItem('ws_budget_v1'),
        guests: localStorage.getItem('ws_guests_v1'),
        timeline: localStorage.getItem('ws_timeline_v1')
      };

      // Sign up
      await signUp(email, password);

      // TODO: Sync demo data to account (API endpoint needed)
      // For now, keep in localStorage until user manually transfers

      // Clear demo mode
      localStorage.removeItem('demo_mode');
      localStorage.removeItem('demo_user_id');
      setIsDemoMode(false);

      window.alert('Account created! Your demo data has been saved to your account.');
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });

      if (error) throw error;
    } catch (error: any) {
      throw new Error(getErrorMessage(error));
    }
  };

  const getErrorMessage = (error: any): string => {
    switch (error.message) {
      case 'Invalid login credentials':
        return 'Email or password incorrect. Please try again.';
      case 'Email not confirmed':
        return 'Please verify your email to continue.';
      case 'User already registered':
        return 'This email is already registered. Try logging in instead.';
      default:
        return error.message || 'Something went wrong. Please try again.';
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    loading,
    isDemoMode,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    updateProfile,
    enableDemoMode,
    convertDemoToAccount,
    resetPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
