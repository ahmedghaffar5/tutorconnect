import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Fatima Hassan",
    role: "Parent",
    initials: "FH",
    quote: "TutorConnect helped my daughter improve her Quran recitation tremendously. The tutor is patient and knowledgeable. Highly recommend!",
    color: "bg-primary-fixed text-on-primary-fixed",
  },
  {
    name: "Omar Farooq",
    role: "Student",
    initials: "OF",
    quote: "I was struggling with Calculus until I found my tutor here. Now I'm getting A's! The one-on-one attention made all the difference.",
    color: "bg-secondary-container text-on-secondary-container",
  },
  {
    name: "Ayesha Begum",
    role: "Parent",
    initials: "AB",
    quote: "The trial class was free and my son loved his coding tutor. We signed up for the monthly package right away. Best decision ever!",
    color: "bg-tertiary-fixed text-on-tertiary-fixed",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-3xl bg-surface-container-low overflow-hidden relative">
      <div className="max-w-container-max mx-auto px-lg relative z-10">
        <div className="text-center mb-3xl">
          <h2 className="font-headline-md text-on-surface mb-sm">What Our Students Say</h2>
          <p className="font-body-md text-on-surface-variant">Hear from students and parents who found success with TutorConnect</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-card p-xl rounded-3xl text-center">
              <div className={`w-16 h-16 ${t.color} rounded-full flex items-center justify-center mx-auto mb-lg text-xl font-bold`}>
                {t.initials}
              </div>
              <div className="flex justify-center gap-0.5 mb-md">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-tertiary fill-tertiary" />
                ))}
              </div>
              <p className="font-body-md text-on-surface-variant leading-relaxed">"{t.quote}"</p>
              <div className="mt-lg">
                <p className="font-label-md font-bold text-on-surface">{t.name}</p>
                <p className="font-label-sm text-on-surface-variant">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] border border-outline-variant/30 rounded-full -z-0"></div>
    </section>
  );
}
