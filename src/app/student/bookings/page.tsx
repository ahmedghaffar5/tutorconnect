"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StudentBookings() {
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then((res: any) => {
      if (!res?.data?.user) router.push("/login?redirect=/student/bookings");
    });
  }, []);
  // Placeholder - full booking management coming in next phase
  return <div className="p-8 max-w-4xl mx-auto"><h1 className="text-2xl font-bold mb-4">My Bookings</h1><p className="text-gray-500">Booking management coming soon.</p></div>;
}
