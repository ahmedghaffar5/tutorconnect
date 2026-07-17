import Link from "next/link";
import { ArrowLeft, BookOpen, Users, GraduationCap } from "lucide-react";

const subjectData: Record<string, { name: string; description: string; tutorCount: number }> = {
  mathematics: { name: "Mathematics", description: "Algebra, calculus, geometry, statistics, and more. Master math with expert guidance.", tutorCount: 2 },
  english: { name: "English", description: "Grammar, literature, creative writing, speaking skills. Improve your English fluency.", tutorCount: 2 },
  science: { name: "Science", description: "General science, scientific methods, and experimental learning for curious minds.", tutorCount: 2 },
  "computer-science": { name: "Computer Science", description: "Programming fundamentals, algorithms, data structures, and computing theory.", tutorCount: 2 },
  coding: { name: "Coding", description: "Web development, Python, JavaScript, React, and more. Build real projects.", tutorCount: 2 },
  quran: { name: "Quran", description: "Quran reading, memorization (Hifz), Tajweed rules, and Tafseer for all levels.", tutorCount: 2 },
  urdu: { name: "Urdu", description: "Urdu language, literature, poetry, and creative writing from beginner to advanced.", tutorCount: 2 },
  physics: { name: "Physics", description: "Mechanics, thermodynamics, electromagnetism, optics, and modern physics.", tutorCount: 2 },
  chemistry: { name: "Chemistry", description: "Organic, inorganic, physical chemistry, and chemical reactions explained simply.", tutorCount: 2 },
  biology: { name: "Biology", description: "Human biology, genetics, ecology, cell biology, and life sciences.", tutorCount: 2 },
};

export async function generateStaticParams() {
  return Object.keys(subjectData).map((slug) => ({ slug }));
}

export default async function SubjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const subject = subjectData[slug];

  if (!subject) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Subject not found</h1>
        <Link href="/subjects" className="text-blue-600 hover:underline mt-4 inline-block">
          View all subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/subjects" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" /> All Subjects
        </Link>

        <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 md:p-12 text-white">
          <span className="text-blue-200 font-semibold text-sm tracking-wide uppercase">Subject</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2">{subject.name}</h1>
          <p className="mt-4 text-lg text-blue-100 max-w-xl">{subject.description}</p>
          <div className="mt-6 flex items-center gap-6 text-sm text-blue-200">
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" /> {subject.tutorCount} Tutors
            </span>
            <span className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" /> All Levels
            </span>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Find a Tutor</h2>
            <p className="mt-2 text-gray-500">
              Browse qualified {subject.name} tutors and choose the one that fits your learning style.
            </p>
            <Link
              href={`/tutors?subject=${slug}`}
              className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              View {subject.name} Tutors
            </Link>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 hover:shadow-md transition-shadow">
            <GraduationCap className="h-8 w-8 text-blue-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900">Book a Trial</h2>
            <p className="mt-2 text-gray-500">
              Not sure yet? Book a free 30-minute trial class with any {subject.name} tutor.
            </p>
            <Link
              href={`/book-trial?subject=${slug}`}
              className="mt-6 inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Book Trial Class
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
