"use client";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const [results, setResults] = useState<Array<{msg: string, type: string}>>([]);
  const [loading, setLoading] = useState(true);

  const add = (msg: string, type: string = "info") => setResults(prev => [...prev, {msg, type}]);

  useEffect(() => {
    async function check() {
      // Check env vars
      add("🔍 Checking Environment...", "header");
      add(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set (" + process.env.NEXT_PUBLIC_SUPABASE_URL.slice(0, 30) + "..." : "❌ NOT SET"}`, process.env.NEXT_PUBLIC_SUPABASE_URL ? "ok" : "error");
      add(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set (" + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.slice(0, 10) + "..." : "❌ NOT SET"}`, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "ok" : "error");

      // Check API
      add("", "spacer");
      add("🔍 Checking APIs...", "header");

      // Setup API
      try {
        const r = await fetch("/api/setup");
        const data = await r.json();
        add(`/api/setup: ${r.status} - ${data.message || data.hint || JSON.stringify(data).slice(0, 200)}`, r.ok ? "ok" : "error");
      } catch (e: any) {
        add(`/api/setup: Fetch failed - ${e.message}`, "error");
      }

      // Tutors API
      try {
        const r = await fetch("/api/tutors");
        if (r.ok) {
          const data = await r.json();
          add(`/api/tutors: ${r.status} - ${Array.isArray(data) ? data.length + " tutors found" : "unexpected format"}`, data?.length > 0 ? "ok" : "warn");
          if (Array.isArray(data) && data.length > 0) {
            add(`   First tutor: ${data[0]?.name}, subjects: ${data[0]?.subjects?.join(",")}`, "data");
          }
        } else {
          const err = await r.text();
          add(`/api/tutors: ${r.status} - ${err.slice(0, 200)}`, "error");
        }
      } catch (e: any) {
        add(`/api/tutors: Network error - ${e.message}`, "error");
      }

      // Subjects API
      try {
        const r = await fetch("/api/subjects");
        if (r.ok) {
          const data = await r.json();
          add(`/api/subjects: ${r.status} - ${Array.isArray(data) ? data.length + " subjects" : "unexpected"}`, data?.length > 0 ? "ok" : "warn");
        } else {
          add(`/api/subjects: ${r.status}`, "error");
        }
      } catch (e: any) {
        add(`/api/subjects: ${e.message}`, "error");
      }

      add("", "spacer");
      add("💡 If APIs return 500, check Vercel env vars have Supabase keys", "tip");
      add("💡 If APIs return empty (0 tutors), run seed-v3.sql in Supabase SQL editor", "tip");
      add("💡 Run schema-v3.sql first, then seed-v3.sql", "tip");

      setLoading(false);
    }
    check();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">🔍 API Diagnostics</h1>
      <p className="text-sm text-gray-500 mb-6">Visit this page after deployment to check if everything is connected</p>
      {loading ? (
        <div className="flex items-center gap-3"><div className="animate-spin h-5 w-5 border-4 border-indigo-600 border-t-transparent rounded-full" /><span className="text-gray-400 text-sm">Running diagnostics...</span></div>
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm space-y-1">
          {results.map((r, i) => {
            if (r.type === "spacer") return <div key={i} className="h-2" />;
            if (r.type === "header") return <div key={i} className="font-bold text-gray-800 text-base pt-2">{r.msg}</div>;
            if (r.type === "tip") return <div key={i} className="text-blue-600 text-xs pt-1">{r.msg}</div>;
            const color = r.type === "error" ? "text-red-600" : r.type === "warn" ? "text-amber-600" : r.type === "ok" ? "text-green-700" : r.type === "data" ? "text-indigo-600" : "text-gray-700";
            return <div key={i} className={color}>{r.msg}</div>;
          })}
        </div>
      )}
    </div>
  );
}
