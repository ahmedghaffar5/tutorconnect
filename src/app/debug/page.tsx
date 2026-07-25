"use client";
import { useEffect, useState } from "react";

export default function DebugPage() {
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const add = (msg: string) => setResults(prev => [...prev, msg]);

  useEffect(() => {
    async function check() {
      // Check 1: Can we reach the API?
      add("1. Checking /api/tutors...");
      try {
        const r = await fetch("/api/tutors");
        add(`   Status: ${r.status} ${r.statusText}`);
        if (r.ok) {
          const data = await r.json();
          add(`   Data type: ${typeof data}, isArray: ${Array.isArray(data)}, length: ${Array.isArray(data) ? data.length : "N/A"}`);
          if (Array.isArray(data) && data.length > 0) {
            add(`   First tutor: ${data[0].name} (${data[0].subjects?.join(", ")})`);
          }
        } else {
          const err = await r.text();
          add(`   Error: ${err.slice(0, 200)}`);
        }
      } catch (e: any) {
        add(`   Fetch failed: ${e.message}`);
      }

      // Check 2: Subjects API
      add("2. Checking /api/subjects...");
      try {
        const r = await fetch("/api/subjects");
        if (r.ok) {
          const data = await r.json();
          add(`   Subjects found: ${Array.isArray(data) ? data.length : 0}`);
        } else {
          add(`   Status: ${r.status}`);
        }
      } catch (e: any) {
        add(`   Failed: ${e.message}`);
      }

      setLoading(false);
    }
    check();
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 API Debug</h1>
      {loading ? (
        <div className="animate-spin h-6 w-6 border-4 border-indigo-600 border-t-transparent rounded-full" />
      ) : (
        <div className="bg-gray-50 rounded-xl p-6 font-mono text-sm space-y-2">
          {results.map((r, i) => (
            <div key={i} className={r.startsWith("   E") ? "text-red-600" : r.startsWith("   D") ? "text-green-600" : "text-gray-800"}>
              {r}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
