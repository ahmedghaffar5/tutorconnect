export async function createClient() {
  const supabaseModule = await import("@supabase/supabase-js");
  return supabaseModule.createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
