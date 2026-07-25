import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, Monitor, Lightbulb, Timer, BookOpen } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen flex flex-col">
      <main className="flex-grow pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3"><CheckCircle className="h-8 w-8" /></div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Booking Confirmed!</h1>
              <p className="text-lg text-gray-500 max-w-md">Your trial session with Sarah Jenkins is all set. We&apos;ve sent a confirmation email to your inbox.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/dashboard" className="px-8 h-14 text-sm font-semibold bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-all flex items-center gap-2 group">
                Go to Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-8 h-14 text-sm font-semibold border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2">Add to Calendar</button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">How to prepare for your session</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { icon: Monitor, title: "Check Tech", desc: "Ensure your microphone, camera, and internet are working." },
                  { icon: BookOpen, title: "Material Prep", desc: "Have any textbooks or homework ready to share." },
                  { icon: Timer, title: "Join Early", desc: "Log in 5 minutes early to settle in." },
                  { icon: Lightbulb, title: "Set Goals", desc: "Think about the top 3 concepts you'd like to master." },
                ].map((item) => (
                  <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
                    <item.icon className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
                <div className="relative h-48 bg-indigo-600 flex items-end p-6">
                  <div className="flex items-end gap-4">
                    <img src="/images/stitch/booking_confirmation-0.jpg" alt="Sarah Jenkins" className="w-20 h-20 rounded-full border-4 border-white shadow-lg object-cover" />
                    <div className="mb-1"><h4 className="text-xl font-bold text-white">Sarah Jenkins</h4><p className="text-sm text-indigo-200">Mathematics Expert</p></div>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex justify-between items-start"><div><p className="text-xs text-gray-400 uppercase tracking-wider">Session Details</p><h3 className="text-xl font-bold text-gray-900 mt-1">Calculus Fundamentals</h3></div><div className="bg-emerald-100 px-3 py-1 rounded-full text-emerald-700 text-xs font-semibold">Trial Class</div></div>
                  <div className="grid grid-cols-2 gap-6 border-y border-gray-100 py-6">
                    {[
                      { icon: Calendar, label: "Date", value: "Tuesday, Oct 24" },
                      { icon: Timer, label: "Time", value: "4:00 PM - 5:00 PM" },
                      { icon: Monitor, label: "Platform", value: "In-App Workspace" },
                      { icon: BookOpen, label: "Booking ID", value: "#TC-88219" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1"><div className="flex items-center gap-1 text-gray-400"><item.icon className="h-4 w-4" /><span className="text-xs">{item.label}</span></div><p className="text-sm font-bold text-gray-900">{item.value}</p></div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2"><div className="flex justify-between text-sm text-gray-500"><span>Session Fee</span><span>$0.00 (Trial)</span></div><div className="flex justify-between font-bold pt-2 border-t border-gray-100"><span>Total Paid</span><span className="text-emerald-600">$0.00</span></div></div>
                  <button className="w-full py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-all">Message Sarah</button>
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-xl border-l-4 border-indigo-600 flex gap-3">
                <p className="text-sm text-gray-600">Need to reschedule? You can change your booking time up to 24 hours before in your <Link href="/dashboard" className="text-indigo-600 font-bold underline">Dashboard</Link>.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
