"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Search, Send } from "lucide-react";

export default function StudentMessages() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  useEffect(() => {
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) { router.push("/login?redirect=/student/messages"); return; }
      setUser(res.data.user);
    });
  }, []);

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;

  return (
    <div className="bg-[#f8f9ff] min-h-screen flex">
      <div className="w-80 bg-white border-r border-gray-200 p-4">
        <h2 className="text-lg font-bold mb-4">Messages</h2>
        <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" /><input className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-sm outline-none" placeholder="Search..." /></div>
        <p className="text-sm text-gray-400 text-center py-8">No conversations yet. Book a tutor to get started.</p>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Select a conversation to start messaging</div>
    </div>
  );
}
