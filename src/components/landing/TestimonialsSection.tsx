import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Hassan",
    role: "Parent",
    text: "TutorConnect helped my daughter improve her Quran recitation tremendously. The tutor is patient and knowledgeable. Highly recommend!",
    rating: 5,
    initials: "FH",
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Omar Farooq",
    role: "Student",
    text: "I was struggling with Calculus until I found my tutor here. Now I'm getting A's! The one-on-one attention made all the difference.",
    rating: 5,
    initials: "OF",
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Ayesha Begum",
    role: "Parent",
    text: "The trial class was free and my son loved his coding tutor. We signed up for the monthly package right away. Best decision ever!",
    rating: 5,
    initials: "AB",
    color: "bg-purple-100 text-purple-600",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">Testimonials</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            What Our Students Say
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            Hear from students and parents who found success with TutorConnect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed text-sm">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-5 pt-4 border-t border-gray-200 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center`}>
                  <span className="text-sm font-bold">{t.initials}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
