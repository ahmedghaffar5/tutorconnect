import Link from "next/link";
import { Star } from "lucide-react";

const tutors = [
  {
    id: "1",
    name: "Dr. Sarah Ahmed",
    subject: "Quran & Arabic",
    bio: "PhD in Islamic Studies with 10+ years of teaching experience. Specializing in Quran recitation, Tajweed, and memorization.",
    rating: 5,
    reviews: 24,
    rate: 30,
    experience: 10,
    image: null,
  },
  {
    id: "2",
    name: "Prof. John Smith",
    subject: "Mathematics",
    bio: "Professor of Mathematics with expertise in Algebra, Calculus, and Statistics. Making math easy and enjoyable.",
    rating: 5,
    reviews: 18,
    rate: 35,
    experience: 15,
    image: null,
  },
  {
    id: "3",
    name: "Ms. Aisha Khan",
    subject: "English & Urdu",
    bio: "Masters in English Literature. Expert in creative writing, grammar, and exam preparation.",
    rating: 4,
    reviews: 15,
    rate: 25,
    experience: 8,
    image: null,
  },
  {
    id: "4",
    name: "Dr. Ahmed Raza",
    subject: "Physics & Chemistry",
    bio: "PhD in Physics. Making science concepts crystal clear with practical examples.",
    rating: 5,
    reviews: 20,
    rate: 35,
    experience: 12,
    image: null,
  },
  {
    id: "5",
    name: "Mr. David Chen",
    subject: "Coding & Computer Science",
    bio: "Full-stack developer specializing in Python, JavaScript, and Web Development. Teaching coding since 2016.",
    rating: 5,
    reviews: 22,
    rate: 40,
    experience: 9,
    image: null,
  },
];

export default function TutorsPage() {
  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Our Tutors</h1>
          <p className="mt-4 text-gray-600 text-lg">
            Learn from experienced and qualified educators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-bold text-emerald-600">
                      {tutor.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-emerald-600 font-medium">{tutor.subject}</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 text-sm leading-relaxed">{tutor.bio}</p>

                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-700">{tutor.rating}.0</span>
                    <span>({tutor.reviews})</span>
                  </div>
                  <span>{tutor.experience} yrs exp</span>
                </div>

                <div className="mt-4 text-lg font-bold text-gray-900">
                  ${tutor.rate}
                  <span className="text-sm font-normal text-gray-500">/hr</span>
                </div>
              </div>

              <div className="px-6 pb-6 flex gap-3">
                <Link
                  href={`/tutors/${tutor.id}`}
                  className="flex-1 text-center py-2.5 border-2 border-gray-200 rounded-xl font-medium text-gray-700 hover:border-emerald-600 hover:text-emerald-600 transition-colors text-sm"
                >
                  View Profile
                </Link>
                <Link
                  href={`/book-trial?tutor=${tutor.id}`}
                  className="flex-1 text-center py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors text-sm"
                >
                  Book Trial
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
