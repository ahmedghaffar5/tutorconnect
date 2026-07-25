import { NextResponse } from "next/server";

export async function GET() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    supabase_url: url ? `${url.substring(0, 30)}...` : "❌ MISSING",
    anon_key: anonKey ? `${anonKey.substring(0, 15)}...` : "❌ MISSING",
    service_role_key: serviceKey ? `✅ Set (${serviceKey.substring(0, 15)}...)` : "❌ MISSING - Add this in Vercel env vars!",
    note: "If service_role_key is missing, the seed API cannot insert data. Add it in Vercel dashboard → Settings → Environment Variables."
  });
}
