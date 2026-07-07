"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

const tutors = [
  { id: "1", name: "Dr. Sarah Ahmed", subjects: ["Quran & Arabic"] },
  { id: "2", name: "Prof. John Smith", subjects: ["Mathematics"] },
  { id: "3", name: "Ms. Aisha Khan", subjects: ["English", "Urdu"] },
  { id: "4", name: "Dr. Ahmed Raza", subjects: ["Physics", "Chemistry"] },
  { id: "5", name: "Mr. David Chen", subjects: ["Coding", "Computer Science"] },
];

const subjects = [
  "Mathematics", "English", "Science", "Computer Science", "Coding",
  "Quran", "Urdu", "Physics", "Chemistry", "Biology",
];

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const preselectedTutor = searchParams.get("tutor") || "";
  const preselectedType = searchParams.get("type") || "trial";

  const [form, setForm] = useState({
    tutorId: preselectedTutor,
    subject: "",
    bookingType: preselectedType,
    date: "",
    time: "",
    studentName: "",
    studentAge: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Please login first");
      const params = searchParams.toString();
      router.push(`/login?redirect=/book-trial${params ? `?${params}` : ""}`);
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      student_id: user.id,
      tutor_id: form.tutorId,
      subject: form.subject,
      booking_type: form.bookingType,
      scheduled_at: `${form.date}T${form.time}`,
      status: "pending",
      student_name: form.studentName,
      student_age: form.studentAge ? parseInt(form.studentAge) : null,
      notes: form.notes,
    });

    if (error) {
      toast.error("Booking failed. Please try again.");
      setLoading(false);
      return;
    }

    toast.success("Booking submitted! We'll confirm shortly.");
    router.push("/dashboard");
  };

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {form.bookingType === "trial" ? "Book a Free Trial" : "Book a Class"}
          </h1>
          <p className="mt-2 text-gray-600">
            {form.bookingType === "trial"
              ? "Try a free 30-minute session with any tutor"
              : "Schedule a paid tutoring session"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Tutor</label>
              <select
                value={form.tutorId}
                onChange={(e) => setForm({ ...form, tutorId: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white"
              >
                <option value="">Choose a tutor</option>
                {tutors.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} - {t.subjects.join(", ")}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white"
              >
                <option value="">Choose a subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
              <select
                value={form.bookingType}
                onChange={(e) => setForm({ ...form, bookingType: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none bg-white"
              >
                <option value="trial">Free Trial</option>
                <option value="paid">Paid Class ($25)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                placeholder="Student's full name"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student Age (optional)</label>
              <input
                type="number"
                value={form.studentAge}
                onChange={(e) => setForm({ ...form, studentAge: e.target.value })}
                placeholder="Age"
                min={1}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Any specific requirements or topics you'd like to cover"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : form.bookingType === "trial" ? "Book Free Trial" : "Book & Pay"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function BookTrialPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading...</div>}>
      <BookingForm />
    </Suspense>
  );
}
