import Link from "next/link";
import { Star, BookOpen, Clock, DollarSign, Award, Globe } from "lucide-react";

const tutorData: Record<string, {
  name: string; subject: string; bio: string; rating: number; reviews: number;
  rate: number; experience: number; qualification: string; languages: string;
  image: string | null;
}> = {
  "1": {
    name: "Dr. Sarah Ahmed",
    subject: "Quran & Arabic",
    bio: "PhD in Islamic Studies with 10+ years of teaching experience. Specializing in Quran recitation, Tajweed, and memorization. I have taught students of all ages from beginners to advanced levels.",
    rating: 5,
    reviews: 24,
    rate: 30,
    experience: 10,
    qualification: "PhD in Islamic Studies",
    languages: "Arabic, English, Urdu",
    image: null,
  },
  "2": {
    name: "Prof. John Smith",
    subject: "Mathematics",
    bio: "Professor of Mathematics with expertise in Algebra, Calculus, and Statistics. Making math easy and enjoyable for students of all levels.",
    rating: 5,
    reviews: 18,
    rate: 35,
    experience: 15,
    qualification: "MSc Mathematics, PhD candidate",
    languages: "English",
    image: null,
  },
  "3": {
    name: "Ms. Aisha Khan",
    subject: "English & Urdu",
    bio: "Masters in English Literature. Expert in creative writing, grammar, and exam preparation. Helping students excel in their language skills.",
    rating: 4,
    reviews: 15,
    rate: 25,
    experience: 8,
    qualification: "MA English Literature",
    languages: "English, Urdu, Hindi",
    image: null,
  },
  "4": {
    name: "Dr. Ahmed Raza",
    subject: "Physics & Chemistry",
    bio: "PhD in Physics with extensive teaching experience. Making science concepts crystal clear with practical examples and demonstrations.",
    rating: 5,
    reviews: 20,
    rate: 35,
    experience: 12,
    qualification: "PhD in Physics",
    languages: "English, Urdu",
    image: null,
  },
  "5": {
    name: "Mr. David Chen",
    subject: "Coding & Computer Science",
    bio: "Full-stack developer specializing in Python, JavaScript, and Web Development. Teaching coding since 2016. I make programming fun and accessible.",
    rating: 5,
    reviews: 22,
    rate: 40,
    experience: 9,
    qualification: "BSc Computer Science",
    languages: "English, Mandarin",
    image: null,
  },
};

export async function generateStaticParams() {
  return Object.keys(tutorData).map((id) => ({ id }));
}

export default async function TutorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tutor = tutorData[id];

  if (!tutor) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Tutor not found</h1>
        <Link href="/tutors" className="text-emerald-600 hover:underline mt-4 inline-block">
          View all tutors
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/tutors" className="text-emerald-600 hover:underline text-sm">
          &larr; All Tutors
        </Link>

        <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                <span className="text-3xl font-bold text-emerald-600">
                  {tutor.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900">{tutor.name}</h1>
                <p className="text-emerald-600 font-medium mt-1">{tutor.subject}</p>

                <div className="flex items-center justify-center md:justify-start gap-1 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-lg ${i < tutor.rating ? "text-yellow-400" : "text-gray-200"}`}>&#9733;</span>
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({tutor.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <p className="mt-8 text-gray-600 leading-relaxed">{tutor.bio}</p>

            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Hourly Rate</p>
                  <p className="font-semibold text-gray-900">${tutor.rate}/hr</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  <p className="font-semibold text-gray-900">{tutor.experience} years</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  <p className="font-semibold text-gray-900 text-sm">{tutor.qualification}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Languages</p>
                  <p className="font-semibold text-gray-900 text-sm">{tutor.languages}</p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href={`/book-trial?tutor=${id}`}
                className="flex-1 text-center bg-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-700 transition-colors"
              >
                Book a Free Trial
              </Link>
              <Link
                href={`/book-trial?tutor=${id}&type=paid`}
                className="flex-1 text-center bg-white text-gray-700 py-4 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-emerald-600 hover:text-emerald-600 transition-colors"
              >
                Book Paid Class
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
