import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS. Server-only: used by order placement
 * and admin mutations. Never import from client components.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
