"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function FeatureFlagToggle({ flags }: { flags: { key: string; value: string; description: string }[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const toggle = async (key: string, currentValue: string) => {
    const newValue = currentValue === "enabled" ? "disabled" : "enabled";
    setLoading(key);
    const res = await fetch("/api/feature-flags", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value: newValue }),
    });
    if (!res.ok) { toast.error("Failed to update"); setLoading(null); return; }
    toast.success(`${key} ${newValue}`);
    setLoading(null);
  };

  return (
    <div className="space-y-4">
      {flags.map((flag) => (
        <div key={flag.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
          <div>
            <p className="font-medium text-gray-900 text-sm">{flag.key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
            <p className="text-xs text-gray-400">{flag.description}</p>
          </div>
          <button
            onClick={() => toggle(flag.key, flag.value)}
            disabled={loading === flag.key}
            className={`relative w-12 h-6 rounded-full transition-colors ${flag.value === "enabled" ? "bg-green-500" : "bg-gray-300"}`}
          >
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${flag.value === "enabled" ? "translate-x-6" : ""}`} />
          </button>
        </div>
      ))}
    </div>
  );
}
