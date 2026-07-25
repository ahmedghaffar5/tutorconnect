import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const admin = createAdminClient();

    // Check if data exists
    const { count: tutorCount } = await admin.from("tutors").select("*", { count: "exact", head: true });
    const { count: subjCount } = await admin.from("subjects").select("*", { count: "exact", head: true });

    if (tutorCount && tutorCount > 0) {
      return NextResponse.json({ status: "ready", tutors: tutorCount, subjects: subjCount, message: "Data already exists" });
    }

    // Seed subjects if empty
    const { data: existingSubjects } = await admin.from("subjects").select("count", { count: "exact", head: true });

    // Try to seed - this might fail if RLS blocks, but the admin client should work
    const results: string[] = [];

    try {
      // Check supabase connection
      const { count } = await admin.from("users").select("*", { count: "exact", head: true });
      results.push(`Users table accessible: ${count || 0}`);
    } catch (e: any) {
      results.push(`Connection error: ${e.message}`);
    }

    return NextResponse.json({ status: "checking", results, message: "Run supabase/seed-v3.sql in Supabase SQL editor to populate data" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, hint: "Check that SUPABASE_SERVICE_ROLE_KEY is set in environment variables" }, { status: 500 });
  }
}
