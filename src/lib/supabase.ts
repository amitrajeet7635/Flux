import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Browser-side Supabase client (singleton pattern, lazy init)
let _client: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!_client) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    _client = createClient(supabaseUrl, supabaseAnonKey);
  }
  return _client;
}

// Lazy Proxy — defers createClient() until first property access.
// Safe to export at module level even when env vars are not yet available (SSR build-time).
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return getSupabaseBrowserClient()[prop as keyof SupabaseClient];
  },
});
