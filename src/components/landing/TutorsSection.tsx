import Link from "next/link";

const tutors = [
  {
    name: "Dr. Sarah Ahmed",
    subject: "Quran & Arabic",
    rating: 5,
    students: 120,
    image: null,
  },
  {
    name: "Prof. John Smith",
    subject: "Mathematics",
    rating: 5,
    students: 95,
    image: null,
  },
  {
    name: "Ms. Aisha Khan",
    subject: "English & Urdu",
    rating: 4,
    students: 78,
    image: null,
  },
];

export default function TutorsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Top Tutors
          </h2>
          <p className="mt-4 text-gray-600 text-lg">
            Learn from experienced and passionate educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-emerald-600">
                  {tutor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-center text-gray-900">
                {tutor.name}
              </h3>
              <p className="text-emerald-600 text-center text-sm font-medium mt-1">
                {tutor.subject}
              </p>
              <div className="flex items-center justify-center gap-1 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < tutor.rating ? "text-yellow-400" : "text-gray-200"
                    }`}
                  >
                    &#9733;
                  </span>
                ))}
              </div>
              <p className="text-center text-gray-500 text-sm mt-2">
                {tutor.students}+ students
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/tutors"
            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors inline-block"
          >
            View All Tutors
          </Link>
        </div>
      </div>
    </section>
  );
}
