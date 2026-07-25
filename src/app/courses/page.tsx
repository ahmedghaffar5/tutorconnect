import Link from "next/link";
import { Star, Clock, Play, ChevronDown, CheckCircle, Users, ArrowRight } from "lucide-react";

const modules = [
  { num: "01", title: "Foundation: React Deep Dive", duration: "2h 15m", lessons: [
    { title: "The Virtual DOM and Reconciliation", duration: "12:40" },
    { title: "Advanced Hooks: useMemo & useCallback", duration: "24:15" },
    { title: "Reading: React Concurrent Mode", duration: "10 min" },
  ]},
  { num: "02", title: "The Next.js Revolution", duration: "1h 30m", lessons: [
    { title: "Server Components vs Client Components", duration: "45:20" },
    { title: "The App Router Architecture", duration: "38:10" },
  ]},
  { num: "03", title: "Data Fetching & Mutations", duration: "2h", lessons: [
    { title: "Deep dive into Fetch API, Server Actions, and React Suspense", duration: "" },
  ]},
];

const learnings = [
  "Master Next.js 14 App Router, Server Actions, and Streaming.",
  "Implement complex state management with Zustand and React Context.",
  "Optimizing images, fonts, and scripts for Core Web Vitals.",
  "Building a full-stack e-commerce project with Prisma and Stripe.",
  "Advanced TypeScript patterns for enterprise React apps.",
  "Testing components with Vitest and Playwright.",
];

const features = [
  { icon: Play, text: "24 hours on-demand video" },
  { icon: CheckCircle, text: "12 downloadable resources" },
  { icon: Clock, text: "Full lifetime access" },
  { icon: Star, text: "Certificate of completion" },
];

export default function CoursesPage() {
  return (
    <div className="bg-background min-h-screen">
      <div className="bg-inverse-surface pt-3xl pb-2xl text-on-primary-container">
        <div className="max-w-container-max mx-auto px-lg grid grid-cols-1 lg:grid-cols-12 gap-xl items-center">
          <div className="lg:col-span-8">
            <nav className="flex items-center gap-2 mb-md text-on-primary-container/80 font-label-sm">
              <span>All Courses</span><span className="opacity-50">/</span><span>Web Development</span><span className="opacity-50">/</span><span className="text-on-primary-container">Next.js</span>
            </nav>
            <h1 className="font-display-lg text-on-primary-container mb-md">Mastering React & Next.js</h1>
            <p className="font-body-lg text-on-primary-container/90 max-w-2xl mb-xl">
              A comprehensive journey from React hooks to Next.js 14 App Router. Build production-ready, SEO-optimized web applications.
            </p>
            <div className="flex flex-wrap gap-lg items-center text-on-primary-container/80">
              <div className="flex items-center gap-2"><Clock className="h-5 w-5 text-secondary-container" /><span className="font-label-md">24 Total Hours</span></div>
              <div className="flex items-center gap-2"><span className="h-5 w-5 rounded bg-secondary-container flex items-center justify-center text-[10px] text-on-secondary-container font-bold">A</span><span className="font-label-md">Advanced Level</span></div>
              <div className="flex items-center gap-2"><Star className="h-5 w-5 text-tertiary fill-tertiary" /><span className="font-label-md">4.9 (2.4k reviews)</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-lg py-2xl grid grid-cols-1 lg:grid-cols-12 gap-xl">
        <div className="lg:col-span-8 space-y-3xl">
          <div className="bg-surface-container-lowest p-xl rounded-xl border border-outline-variant/30">
            <h2 className="font-headline-sm mb-xl">What you&apos;ll learn</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              {learnings.map((l) => (
                <div key={l} className="flex items-start gap-md"><CheckCircle className="h-5 w-5 text-secondary shrink-0 mt-0.5" /><span className="text-on-surface-variant">{l}</span></div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-headline-sm mb-xl">Course Syllabus</h2>
            <div className="space-y-md">
              {modules.map((mod) => (
                <details key={mod.num} className="group border border-outline-variant/30 rounded-xl overflow-hidden bg-surface-container-low">
                  <summary className="flex items-center justify-between p-lg cursor-pointer hover:bg-surface-container transition-colors list-none">
                    <div className="flex items-center gap-md">
                      <span className="bg-primary-container text-on-primary-container w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{mod.num}</span>
                      <span className="font-label-md font-bold">{mod.title}</span>
                    </div>
                    <ChevronDown className="h-5 w-5 text-on-surface-variant group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-lg bg-white border-t border-outline-variant/20 space-y-md">
                    {mod.lessons.map((lesson) => (
                      <div key={lesson.title} className="flex items-center justify-between text-on-surface-variant">
                        <div className="flex items-center gap-2"><Play className="h-4 w-4" /><span className="text-sm">{lesson.title}</span></div>
                        {lesson.duration && <span className="font-label-sm text-xs">{lesson.duration}</span>}
                      </div>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-high/30 p-xl rounded-xl border border-dashed border-outline">
            <h2 className="font-headline-sm mb-lg">Prerequisites</h2>
            <ul className="space-y-sm text-on-surface-variant list-disc list-inside">
              <li>Solid understanding of JavaScript (ES6+ features)</li>
              <li>Basic knowledge of React components and props</li>
              <li>Familiarity with CSS and Responsive Design concepts</li>
              <li>Node.js installed on your local development machine</li>
            </ul>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-xl">
            <div className="bg-white rounded-xl shadow-lg border border-outline-variant/50 overflow-hidden">
              <div className="relative h-48 bg-surface-container-highest flex items-center justify-center">
                <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-primary shadow-xl">▶</div>
              </div>
              <div className="p-xl space-y-xl">
                <div className="flex items-baseline gap-sm">
                  <span className="font-display-lg text-[36px] text-on-surface">$149.99</span>
                  <span className="text-on-surface-variant line-through font-label-md">$199.99</span>
                  <span className="text-secondary font-bold font-label-md">25% OFF</span>
                </div>
                <div className="space-y-md">
                  <button className="w-full py-md bg-primary text-on-primary font-bold rounded-xl shadow-sm hover:opacity-90 transition-all">Enroll Now</button>
                  <button className="w-full py-md border border-primary text-primary font-bold rounded-xl hover:bg-primary/5 transition-colors">Add to Favorites</button>
                </div>
                <div className="space-y-sm"><h4 className="font-label-md font-bold">This course includes:</h4>
                  <ul className="space-y-1 text-on-surface-variant text-sm">
                    {features.map((f) => (<li key={f.text} className="flex items-center gap-2"><f.icon className="h-4 w-4" />{f.text}</li>))}
                  </ul>
                </div>
                <div className="pt-md border-t border-outline-variant/30 flex items-center justify-center gap-xl text-on-surface-variant font-label-sm text-center">
                  <div><div className="font-bold text-on-surface">15.4k</div><div>Students</div></div>
                  <div className="w-px h-8 bg-outline-variant/50"></div>
                  <div><div className="font-bold text-on-surface">Updated</div><div>May 2024</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
