import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client using the service role key
// Only use this in API routes and Server Components — never expose to the browser
export function getSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  return createClient(supabaseUrl, serviceRoleKey);
}
