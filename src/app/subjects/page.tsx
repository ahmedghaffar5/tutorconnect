import Link from "next/link";

const subjectImages: Record<string, string> = {
  Mathematics: "/images/stitch/landing_page-4.jpg",
  English: "/images/stitch/landing_page-10.jpg",
  Science: "/images/stitch/landing_page-11.jpg",
  "Computer Science": "/images/stitch/landing_page-5.jpg",
  Coding: "/images/stitch/tutor_search_discovery-5.jpg",
  Quran: "/images/stitch/resources_study_hub-0.jpg",
  Urdu: "/images/stitch/resources_study_hub-1.jpg",
  Physics: "/images/stitch/resources_study_hub-2.jpg",
  Chemistry: "/images/stitch/course_curriculum_enrollment-0.jpg",
  Biology: "/images/stitch/course_curriculum_enrollment-1.jpg",
};

const subjects = [
  { name: "Mathematics", desc: "Algebra, calculus, geometry, and more", slug: "mathematics", gradient: "from-blue-900/70 to-blue-500/30" },
  { name: "English", desc: "Grammar, literature, writing, and speaking", slug: "english", gradient: "from-amber-900/70 to-amber-500/30" },
  { name: "Science", desc: "General science and scientific methods", slug: "science", gradient: "from-emerald-900/70 to-emerald-500/30" },
  { name: "Computer Science", desc: "Programming, algorithms, and computing", slug: "computer-science", gradient: "from-indigo-900/70 to-indigo-500/30" },
  { name: "Coding", desc: "Web development, Python, JavaScript, and more", slug: "coding", gradient: "from-violet-900/70 to-violet-500/30" },
  { name: "Quran", desc: "Quran reading, memorization, and Tajweed", slug: "quran", gradient: "from-emerald-900/70 to-emerald-600/30" },
  { name: "Urdu", desc: "Urdu language and literature", slug: "urdu", gradient: "from-amber-900/70 to-amber-600/30" },
  { name: "Physics", desc: "Mechanics, thermodynamics, and electromagnetism", slug: "physics", gradient: "from-cyan-900/70 to-cyan-500/30" },
  { name: "Chemistry", desc: "Organic, inorganic, and physical chemistry", slug: "chemistry", gradient: "from-rose-900/70 to-rose-500/30" },
  { name: "Biology", desc: "Human biology, genetics, and ecology", slug: "biology", gradient: "from-lime-900/70 to-lime-500/30" },
];

const emojis: Record<string, string> = {
  Mathematics: "📐", English: "📖", Science: "🔬", "Computer Science": "💻",
  Coding: "👨‍💻", Quran: "📖", Urdu: "🌍", Physics: "⚡", Chemistry: "🧪", Biology: "🧬",
};

export default function SubjectsPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Explore Our Subjects</h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Find expert tutors across a wide range of subjects taught online</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {subjects.map((subject) => {
            const img = subjectImages[subject.name];
            return (
            <Link
              key={subject.name}
              href={`/subjects/${subject.slug}`}
              className="group cursor-pointer"
            >
              <div className="h-48 rounded-2xl overflow-hidden relative bg-gray-100">
                {img ? (
                  <img src={img} alt={subject.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${subject.gradient} flex items-center justify-center`}>
                    <span className="text-5xl">{emojis[subject.name]}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-4">
                  <span className="text-white text-xl font-bold">{subject.name}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 leading-relaxed">{subject.desc}</p>
            </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
