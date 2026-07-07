import Link from "next/link";

const subjectData: Record<string, { name: string; description: string }> = {
  mathematics: { name: "Mathematics", description: "Algebra, calculus, geometry, and more" },
  english: { name: "English", description: "Grammar, literature, writing, and speaking" },
  science: { name: "Science", description: "General science and scientific methods" },
  "computer-science": { name: "Computer Science", description: "Programming, algorithms, and computing" },
  coding: { name: "Coding", description: "Web development, Python, JavaScript, and more" },
  quran: { name: "Quran", description: "Quran reading, memorization, and Tajweed" },
  urdu: { name: "Urdu", description: "Urdu language and literature" },
  physics: { name: "Physics", description: "Mechanics, thermodynamics, and electromagnetism" },
  chemistry: { name: "Chemistry", description: "Organic, inorganic, and physical chemistry" },
  biology: { name: "Biology", description: "Human biology, genetics, and ecology" },
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
        <Link href="/subjects" className="text-emerald-600 hover:underline mt-4 inline-block">
          View all subjects
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/subjects" className="text-emerald-600 hover:underline text-sm">
          &larr; All Subjects
        </Link>

        <div className="mt-6">
          <h1 className="text-4xl font-bold text-gray-900">{subject.name}</h1>
          <p className="mt-4 text-lg text-gray-600">{subject.description}</p>
        </div>

        <div className="mt-12 bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900">Find a {subject.name} Tutor</h2>
          <p className="mt-2 text-gray-600">
            Browse qualified tutors for {subject.name} and book a free trial class.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/tutors?subject=${slug}`}
              className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
            >
              View Tutors
            </Link>
            <Link
              href="/book-trial"
              className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-emerald-600 transition-colors"
            >
              Book Trial Class
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
