import { Star } from "lucide-react";

const testimonials = [
  { name: "Fatima Hassan", role: "Parent", initials: "FH", quote: "TutorConnect helped my daughter improve her Quran recitation tremendously. The tutor is patient and knowledgeable. Highly recommend!", color: "bg-indigo-100 text-indigo-600" },
  { name: "Omar Farooq", role: "Student", initials: "OF", quote: "I was struggling with Calculus until I found my tutor here. Now I'm getting A's! The one-on-one attention made all the difference.", color: "bg-emerald-100 text-emerald-600" },
  { name: "Ayesha Begum", role: "Parent", initials: "AB", quote: "The trial class was free and my son loved his coding tutor. We signed up for the monthly package right away. Best decision ever!", color: "bg-amber-100 text-amber-600" },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What Our Students Say</h2>
          <p className="text-base text-gray-500">Hear from students and parents who found success with TutorConnect</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl text-center border border-gray-100 shadow-sm">
              <div className={`w-16 h-16 ${t.color} rounded-full flex items-center justify-center mx-auto mb-6 text-xl font-bold`}>{t.initials}</div>
              <div className="flex justify-center gap-0.5 mb-4">{Array.from({ length: 5 }).map((_, i) => (<Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />))}</div>
              <p className="text-base text-gray-500 leading-relaxed">"{t.quote}"</p>
              <div className="mt-6"><p className="text-sm font-bold text-gray-900">{t.name}</p><p className="text-xs text-gray-400">{t.role}</p></div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-gray-100 rounded-full -z-0"></div>
    </section>
  );
}
