"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

export default function SubjectManager({ subjects }: { subjects: { id: string; name: string; description?: string; icon?: string }[] }) {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [list, setList] = useState(subjects);

  const addSubject = async () => {
    if (!newName) return;
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc }),
    });
    const data = await res.json();
    if (data.error) { toast.error(data.error); return; }
    setList([...list, data]);
    setNewName(""); setNewDesc("");
    toast.success("Subject added");
  };

  const deleteSubject = async (id: string) => {
    const res = await fetch(`/api/subjects?id=${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error("Failed to delete"); return; }
    setList(list.filter((s) => s.id !== id));
    toast.success("Subject removed");
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Subject name" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm" />
        <input value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Description (optional)" className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none text-sm" />
        <button onClick={addSubject} className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((s) => (
          <div key={s.id} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
            <span>{s.name}</span>
            <button onClick={() => deleteSubject(s.id)} className="text-gray-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
