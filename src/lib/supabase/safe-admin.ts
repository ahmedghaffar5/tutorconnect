import { createClient } from "@supabase/supabase-js";

let _adminClient: any = null;
let _anonClient: any = null;

export function getSafeClient() {
  // Try admin client first (service role key)
  if (!_adminClient && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      _adminClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
      );
    } catch {}
  }

  if (_adminClient) return _adminClient;

  // Fall back to anon client
  if (!_anonClient) {
    _anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _anonClient;
}
