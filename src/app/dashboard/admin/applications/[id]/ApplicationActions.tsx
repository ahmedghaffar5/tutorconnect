"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ApplicationActions({ applicationId, currentStatus }: { applicationId: string; currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const updateStatus = async (status: string) => {
    if (status === "rejected" && !reason) { toast.error("Please provide a reason"); return; }
    setLoading(true);
    const res = await fetch(`/api/applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, rejection_reason: status === "rejected" ? reason : null }),
    });
    const data = await res.json();
    if (data.error) { toast.error(data.error); setLoading(false); return; }
    toast.success(`Application ${status}`);
    router.refresh();
    setLoading(false);
  };

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const note = new FormData(form).get("note") as string;
    setLoading(true);
    await fetch("/api/applications/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId, note, noteType: "review" }),
    });
    toast.success("Note added");
    form.reset();
    router.refresh();
    setLoading(false);
  };

  const statusColors: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700",
    more_info_requested: "bg-orange-100 text-orange-700", interview_scheduled: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6">
      {/* Status Update */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <button onClick={() => updateStatus("under_review")} disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Mark Under Review</button>
          <button onClick={() => updateStatus("approved")} disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">Approve</button>
          <button onClick={() => updateStatus("more_info_requested")} disabled={loading} className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600">Request Info</button>
          <button onClick={() => updateStatus("interview_scheduled")} disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">Schedule Interview</button>
        </div>
        <div>
          <textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={2} placeholder="Reason (required for rejection)" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm resize-none" />
          <button onClick={() => updateStatus("rejected")} disabled={loading} className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Reject</button>
        </div>
      </div>

      {/* Add Note */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Add Review Note</h3>
        <form onSubmit={addNote} className="flex gap-2">
          <input name="note" placeholder="Write a note..." required className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm" />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Add</button>
        </form>
      </div>
    </div>
  );
}
