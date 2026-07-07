const testimonials = [
  {
    name: "Fatima Hassan",
    role: "Parent",
    text: "TutorConnect helped my daughter improve her Quran recitation tremendously. The tutor is patient and knowledgeable.",
    rating: 5,
  },
  {
    name: "Omar Farooq",
    role: "Student",
    text: "I was struggling with Calculus until I found my tutor here. Now I'm getting A's! Highly recommend.",
    rating: 5,
  },
  {
    name: "Ayesha Begum",
    role: "Parent",
    text: "The trial class was free and my son loved his coding tutor. We signed up for the monthly package right away.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            What Our Students Say
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Hear from students and parents who found success with TutorConnect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < t.rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="text-gray-600 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
