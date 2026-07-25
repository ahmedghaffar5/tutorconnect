import Link from "next/link";
import { CheckCircle, ArrowRight, Calendar, Monitor, Lightbulb, Timer, BookOpen } from "lucide-react";

export default function BookingConfirmationPage() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <main className="flex-grow pt-2xl pb-3xl px-md md:px-lg overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10"></div>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-xl">
          <div className="md:col-span-7 flex flex-col gap-xl">
            <div className="flex flex-col gap-sm">
              <div className="w-16 h-16 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mb-sm">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h1 className="font-display-lg text-on-surface">Booking Confirmed!</h1>
              <p className="font-body-lg text-on-surface-variant max-w-md">Your trial session is all set. We&apos;ve sent a confirmation email to your inbox.</p>
            </div>
            <div className="flex flex-wrap gap-md">
              <Link href="/dashboard" className="px-xl h-14 font-label-md bg-primary text-on-primary rounded-xl shadow-lg hover:bg-primary-container transition-all flex items-center gap-sm group">
                Go to Dashboard <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="px-xl h-14 font-label-md border-2 border-outline-variant text-on-surface rounded-xl hover:bg-surface-container-low transition-all flex items-center gap-sm">
                Add to Calendar
              </button>
            </div>
            <div className="mt-xl">
              <h2 className="font-headline-sm text-on-surface mb-lg">How to prepare for your session</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
                {[
                  { icon: Monitor, title: "Check Tech", desc: "Ensure your microphone, camera, and internet are working." },
                  { icon: BookOpen, title: "Material Prep", desc: "Have any textbooks or homework ready to share." },
                  { icon: Timer, title: "Join Early", desc: "Log in 5 minutes early to settle in before the start." },
                  { icon: Lightbulb, title: "Set Goals", desc: "Think about the top 3 concepts you'd like to master." },
                ].map((item) => (
                  <div key={item.title} className="bg-surface border border-outline-variant rounded-2xl p-lg flex flex-col gap-sm hover:shadow-md transition-shadow">
                    <item.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-label-md font-bold">{item.title}</h3>
                    <p className="font-body-sm text-on-surface-variant">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-5">
            <div className="sticky top-24">
              <div className="bg-surface-container-lowest shadow-xl rounded-2xl overflow-hidden border border-outline-variant">
                <div className="relative h-48 bg-primary flex items-end p-lg">
                  <div className="flex items-end gap-md">
                    <div className="w-20 h-20 rounded-full border-4 border-surface bg-primary-fixed flex items-center justify-center text-2xl font-bold text-on-primary-fixed shadow-lg">SH</div>
                    <div className="mb-1">
                      <h4 className="font-headline-sm text-on-primary">Sarah Henderson</h4>
                      <p className="font-label-sm text-on-primary-container">Mathematics Expert</p>
                    </div>
                  </div>
                </div>
                <div className="p-lg flex flex-col gap-lg bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">Session Details</p>
                      <h3 className="font-headline-sm text-on-surface">Calculus Fundamentals</h3>
                    </div>
                    <div className="bg-secondary-container px-sm py-1 rounded-full text-on-secondary-container font-label-sm">Trial Class</div>
                  </div>
                  <div className="grid grid-cols-2 gap-lg border-y border-outline-variant py-lg">
                    {[
                      { icon: Calendar, label: "Date", value: "Tuesday, Oct 24" },
                      { icon: Timer, label: "Time", value: "4:00 PM - 5:00 PM" },
                      { icon: Monitor, label: "Platform", value: "In-App Workspace" },
                      { icon: BookOpen, label: "Booking ID", value: "#TC-88219" },
                    ].map((item) => (
                      <div key={item.label} className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-on-surface-variant"><item.icon className="h-4 w-4" /><span className="font-label-sm">{item.label}</span></div>
                        <p className="font-label-md font-bold">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-sm">
                    <div className="flex justify-between font-body-sm text-on-surface-variant"><span>Session Fee</span><span>$0.00 (Trial)</span></div>
                    <div className="flex justify-between font-label-md font-bold pt-2 border-t border-outline-variant"><span>Total Paid</span><span className="text-secondary">$0.00</span></div>
                  </div>
                  <button className="w-full py-md font-label-md bg-secondary text-on-secondary rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-sm">
                    Message Sarah
                  </button>
                </div>
              </div>
              <div className="mt-lg p-md bg-surface-container-high rounded-xl border-l-4 border-primary flex gap-md">
                <p className="font-body-sm text-on-surface-variant">
                  Need to reschedule? You can change your booking time up to 24 hours before in your <Link href="/dashboard" className="text-primary font-bold underline">Dashboard</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
