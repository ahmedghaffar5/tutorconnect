"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export default function AuditLogView({ logs }: { logs: any[] }) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = logs.filter((log) =>
    log.action?.toLowerCase().includes(search.toLowerCase()) ||
    log.entity_type?.toLowerCase().includes(search.toLowerCase()) ||
    log.users?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search audit logs..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 outline-none text-sm"
        />
      </div>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">No audit logs found</p>
        ) : (
          filtered.map((log) => (
            <div key={log.id} className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-gray-900">{log.users?.full_name || "System"}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-blue-600 font-medium">{log.action.replace(/_/g, " ")}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{new Date(log.created_at).toLocaleString()}</span>
                  {log.details && Object.keys(log.details).length > 0 && (
                    <button onClick={() => setExpanded(expanded === log.id ? null : log.id)}>
                      {expanded === log.id ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                    </button>
                  )}
                </div>
              </div>
              {expanded === log.id && log.details && (
                <pre className="mt-2 text-xs text-gray-500 bg-white rounded-lg p-2 overflow-x-auto">{JSON.stringify(log.details, null, 2)}</pre>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
