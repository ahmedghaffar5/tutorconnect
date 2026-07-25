import Link from "next/link";
import { CheckCircle, DollarSign, Calendar, Users, Star, Globe } from "lucide-react";

const benefits = [
  { icon: DollarSign, title: "Set Your Own Rates", desc: "You decide how much to charge per session. Keep 80% of every lesson." },
  { icon: Calendar, title: "Flexible Schedule", desc: "Teach when it suits you. Set your availability and get booked by students." },
  { icon: Users, title: "Global Student Base", desc: "Connect with learners from around the world looking for your expertise." },
  { icon: Star, title: "Build Your Reputation", desc: "Earn reviews and ratings. Top-rated tutors get featured placement." },
  { icon: Globe, title: "Teach from Anywhere", desc: "Our virtual classroom lets you teach from home, a cafe, or anywhere with internet." },
];

export default function BecomeATutorPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Become a Tutor</h1>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto mb-8">Share your knowledge, earn income, and make a difference in students&apos; lives.</p>
          <Link href="/apply" className="inline-block bg-white text-indigo-600 px-10 py-4 rounded-xl font-bold shadow-lg hover:bg-gray-100 transition-all text-lg">Apply Now</Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why Tutor with Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((b) => {
            const I = b.icon;
            return (<div key={b.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0"><I className="h-6 w-6 text-indigo-600" /></div><div><h3 className="font-semibold text-gray-900 mb-1">{b.title}</h3><p className="text-sm text-gray-500">{b.desc}</p></div></div></div>);
          })}
        </div>
        <div className="mt-12 bg-indigo-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-6">Complete your application in under 15 minutes. Our team reviews applications within 48 hours.</p>
          <Link href="/apply" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all">Start Your Application</Link>
        </div>
      </div>
    </div>
  );
}
