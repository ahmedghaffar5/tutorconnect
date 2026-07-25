import Link from "next/link";
import { Search, Calendar, CreditCard, Video, MessageCircle, Star } from "lucide-react";

const steps = [
  { icon: Search, title: "Find Your Tutor", desc: "Browse qualified tutors by subject, level, and availability. Read reviews and compare rates.", color: "bg-indigo-100 text-indigo-600" },
  { icon: Calendar, title: "Book a Session", desc: "Choose a time that works for you. Book a free trial or a paid session instantly.", color: "bg-emerald-100 text-emerald-600" },
  { icon: CreditCard, title: "Pay Securely", desc: "Pay through our secure platform. Your payment is protected and only released after the lesson.", color: "bg-amber-100 text-amber-600" },
  { icon: Video, title: "Learn Online", desc: "Join your lesson from anywhere using our virtual classroom with video, chat, and shared whiteboard.", color: "bg-indigo-100 text-indigo-600" },
  { icon: MessageCircle, title: "Track Progress", desc: "Receive feedback, track your goals, and communicate with your tutor between sessions.", color: "bg-emerald-100 text-emerald-600" },
  { icon: Star, title: "Achieve Goals", desc: "Build confidence, improve grades, and master new skills with personalized one-on-one attention.", color: "bg-amber-100 text-amber-600" },
];

export default function HowItWorksPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="bg-indigo-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">How TutorConnect Works</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">Get started with personalized online tutoring in just a few simple steps.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="space-y-12">
          {steps.map((step, i) => (
            <div key={step.title} className="flex items-start gap-6">
              <div className="flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center bg-white shadow-md border border-gray-100">
                <step.icon className="h-7 w-7 text-indigo-600" />
              </div>
              <div className="flex-1 pt-2">
                <div className="flex items-center gap-3 mb-2"><span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Step {i + 1}</span><h3 className="text-xl font-bold text-gray-900">{step.title}</h3></div>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/tutors" className="inline-block bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Find Your Tutor Now</Link>
        </div>
      </div>
    </div>
  );
}
