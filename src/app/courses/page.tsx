import Link from "next/link";
import { Star, Clock, CheckCircle, Play, ChevronDown } from "lucide-react";

const modules = [
  { num: "01", title: "Foundation: React Deep Dive", lessons: [
    { title: "The Virtual DOM and Reconciliation", dur: "12:40" },
    { title: "Advanced Hooks: useMemo & useCallback", dur: "24:15" },
  ]},
  { num: "02", title: "The Next.js Revolution", lessons: [
    { title: "Server Components vs Client Components", dur: "45:20" },
    { title: "The App Router Architecture", dur: "38:10" },
  ]},
  { num: "03", title: "Data Fetching & Mutations", lessons: [
    { title: "Deep dive into Server Actions and React Suspense", dur: "" },
  ]},
];

const learnings = [
  "Master Next.js 14 App Router, Server Actions, and Streaming.",
  "Implement complex state management with Zustand and React Context.",
  "Optimizing images, fonts, and scripts for Core Web Vitals.",
  "Building a full-stack project with Prisma and Stripe.",
];

const features = [
  { icon: Play, text: "24 hours on-demand video" },
  { icon: CheckCircle, text: "12 downloadable resources" },
  { icon: Clock, text: "Full lifetime access" },
  { icon: Star, text: "Certificate of completion" },
];

export default function CoursesPage() {
  return (
    <div className="bg-[#f8f9ff] min-h-screen">
      <div className="bg-gray-900 text-white pt-16 pb-12">
        <div className="max-w-[1280px] mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4"><span>All Courses</span><span className="opacity-50">/</span><span className="text-indigo-300">Web Development</span><span className="opacity-50">/</span><span className="text-white">Next.js</span></nav>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mastering React & Next.js</h1>
              <p className="text-lg text-gray-300 max-w-2xl mb-6">A comprehensive journey from React hooks to Next.js 14 App Router. Build production-ready, SEO-optimized web applications.</p>
              <div className="flex flex-wrap gap-6 items-center text-gray-300">
                <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-emerald-400" /><span className="text-sm font-medium">24 Total Hours</span></div>
                <div className="flex items-center gap-2"><span className="text-xs font-bold bg-emerald-500 text-white px-2 py-1 rounded">A</span><span className="text-sm font-medium">Advanced Level</span></div>
                <div className="flex items-center gap-2"><Star className="h-5 w-5 text-amber-400 fill-amber-400" /><span className="text-sm font-medium">4.9 (2.4k reviews)</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white p-8 rounded-xl border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">What you&apos;ll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learnings.map((l) => (
                <div key={l} className="flex items-start gap-3"><CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" /><span className="text-gray-500 text-sm">{l}</span></div>
              ))}
            </div>
          </div>

          <div><h2 className="text-2xl font-bold text-gray-900 mb-6">Course Syllabus</h2>
            <div className="space-y-4">
              {modules.map((mod) => (
                <details key={mod.num} className="group bg-white border border-gray-100 rounded-xl overflow-hidden">
                  <summary className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 list-none">
                    <div className="flex items-center gap-4"><span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{mod.num}</span><span className="font-semibold">{mod.title}</span></div>
                    <ChevronDown className="h-5 w-5 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-5 bg-white border-t border-gray-100 space-y-3">
                    {mod.lessons.map((l) => (
                      <div key={l.title} className="flex items-center justify-between text-gray-500"><div className="flex items-center gap-2"><Play className="h-4 w-4" /><span className="text-sm">{l.title}</span></div>{l.dur && <span className="text-xs">{l.dur}</span>}</div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-300"><h2 className="text-xl font-bold mb-4">Prerequisites</h2><ul className="space-y-2 text-gray-500 text-sm list-disc list-inside"><li>Solid understanding of JavaScript (ES6+)</li><li>Basic knowledge of React components</li><li>Familiarity with CSS and Responsive Design</li><li>Node.js installed locally</li></ul></div>

          <div className="flex items-center gap-6 p-6 bg-indigo-50 rounded-xl">
            <img src="/images/stitch/course_curriculum_enrollment-1.jpg" alt="Instructor" className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover" />
            <div className="flex-1"><div className="flex items-center justify-between mb-2"><div><h3 className="text-lg font-bold text-gray-900">Alex Rivers</h3><p className="text-sm text-indigo-600">Senior Frontend Engineer @ Vercel</p></div><button className="px-4 py-1.5 border border-indigo-600 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-50">View Profile</button></div><p className="text-sm text-gray-500">Alex has over 10 years of experience building large-scale web applications.</p></div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="relative h-48 bg-gray-100"><img src="/images/stitch/course_curriculum_enrollment-0.jpg" alt="Course" className="w-full h-full object-cover" /></div>
              <div className="p-6 space-y-6">
                <div className="flex items-baseline gap-2"><span className="text-3xl font-bold text-gray-900">$149.99</span><span className="text-gray-400 line-through text-sm">$199.99</span><span className="text-emerald-600 font-bold text-sm">25% OFF</span></div>
                <div className="space-y-3"><button className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition-all">Enroll Now</button><button className="w-full py-3 border border-indigo-600 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all">Add to Favorites</button></div>
                <div><h4 className="text-sm font-bold mb-3">This course includes:</h4><ul className="space-y-2 text-gray-500 text-sm">{features.map((f) => (<li key={f.text} className="flex items-center gap-2"><f.icon className="h-4 w-4" />{f.text}</li>))}</ul></div>
                <div className="pt-4 border-t border-gray-100 flex items-center justify-center gap-8 text-center text-sm"><div><div className="font-bold text-gray-900">15.4k</div><div className="text-gray-400">Students</div></div><div className="w-px h-8 bg-gray-100"></div><div><div className="font-bold text-gray-900">Updated</div><div className="text-gray-400">May 2024</div></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
