import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { APP_CONTEXT } from '@/config/app-context';
import type { Database } from '@/types/db';

// Browser client (anon key only)
const browserSupabase = createSupabaseClient<Database>(
  APP_CONTEXT.env.public.SUPABASE_URL || 'https://placeholder.supabase.co',
  APP_CONTEXT.env.public.SUPABASE_ANON_KEY || 'placeholder-anon-key'
);

/**
 * Returns the shared browser Supabase client. This should be used in client-side contexts
 * where the anon key is sufficient.
 */
export const supabase = browserSupabase;

export const getSupabaseClient = () => browserSupabase;

// Backwards compatibility export for existing imports expecting `createClient`
export const createClient = () => getSupabaseClient();

// Server-only admin client (service role key)
export const createServerClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('Server client cannot be used in browser environment');
  }
  
  const serviceKey = APP_CONTEXT.env.server?.SUPABASE_SERVICE_ROLE;
  if (!serviceKey) {
    console.warn('SUPABASE_SERVICE_ROLE not configured - using placeholder for development');
    // Return a placeholder client for development
    return createSupabaseClient<Database>(
      APP_CONTEXT.env.public.SUPABASE_URL || 'https://placeholder.supabase.co',
      'placeholder-service-key',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );
  }
  
  return createSupabaseClient<Database>(
    APP_CONTEXT.env.public.SUPABASE_URL || 'https://placeholder.supabase.co',
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
};