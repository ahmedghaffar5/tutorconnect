// Built-in demo data - displays when database is empty
// This ensures all 19 Stitch screens show content immediately

export const demoData = {
  tutors: [
    { id: "demo-1", name: "Dr. Sarah Chen", subjects: ["Mathematics", "Physics"], rate: 65, experience: 15, bio: "PhD in Mathematics from MIT. 15+ years teaching experience. Specializing in calculus, linear algebra, and statistics.", rating: 4.9, reviews: 128, students: 84, qualification: "PhD Mathematics, MIT", languages: "English, Mandarin" },
    { id: "demo-2", name: "Prof. James Wilson", subjects: ["Computer Science", "Coding"], rate: 55, experience: 10, bio: "Full-stack developer and educator. Expert in React, Node.js, Python, and system design.", rating: 5.0, reviews: 95, students: 62, qualification: "MSc Computer Science, Stanford", languages: "English" },
    { id: "demo-3", name: "Ms. Elena Rodriguez", subjects: ["English", "Urdu", "Languages"], rate: 45, experience: 8, bio: "Native Spanish speaker with MA in Linguistics. Teaching languages for 8 years.", rating: 4.8, reviews: 210, students: 115, qualification: "MA Linguistics, Barcelona", languages: "Spanish, English, French" },
    { id: "demo-4", name: "Dr. Michael Hart", subjects: ["Physics", "Chemistry", "Mathematics"], rate: 60, experience: 12, bio: "PhD in Physics, published researcher. Making science accessible to all students.", rating: 4.9, reviews: 156, students: 98, qualification: "PhD Physics, Caltech", languages: "English" },
    { id: "demo-5", name: "Prof. Alex Rivera", subjects: ["Computer Science", "Coding"], rate: 50, experience: 7, bio: "Software engineer teaching coding to beginners and advanced students.", rating: 4.7, reviews: 72, students: 41, qualification: "BSc Computer Science, MIT", languages: "English, Hindi" },
  ],
  subjects: [
    "Mathematics", "English", "Science", "Computer Science", "Coding",
    "Quran", "Urdu", "Physics", "Chemistry", "Biology", "Arabic", "History",
  ],
  bookings: [
    { id: "b1", subject: "Mathematics", status: "confirmed", date: new Date(Date.now() + 2*86400000).toISOString(), type: "trial", tutorName: "Dr. Sarah Chen" },
    { id: "b2", subject: "Physics", status: "confirmed", date: new Date(Date.now() + 5*86400000).toISOString(), type: "paid", tutorName: "Dr. Michael Hart" },
    { id: "b3", subject: "English", status: "pending", date: new Date(Date.now() + 7*86400000).toISOString(), type: "paid", tutorName: "Ms. Elena Rodriguez" },
    { id: "b4", subject: "Coding", status: "completed", date: new Date(Date.now() - 3*86400000).toISOString(), type: "paid", tutorName: "Prof. Alex Rivera" },
    { id: "b5", subject: "Chemistry", status: "completed", date: new Date(Date.now() - 10*86400000).toISOString(), type: "trial", tutorName: "Dr. Michael Hart" },
  ],
  goals: [
    { id: "g1", title: "Ace SAT Math", progress: 65, target: "Dec 2026" },
    { id: "g2", title: "Complete AP Calculus", progress: 30, target: "Mar 2027" },
    { id: "g3", title: "Learn Python Programming", progress: 50, target: "Feb 2027" },
  ],
  progress: [
    { metric: "Hours Studied", value: "24.5h", pct: 60 },
    { metric: "Avg Score", value: "87%", pct: 87 },
    { metric: "Sessions Completed", value: "12", pct: 70 },
  ],
  messages: [
    { name: "Dr. Sarah Chen", msg: "Great session today! Keep practicing the derivatives.", time: "2h ago", unread: true },
    { name: "Support Team", msg: "Your tutor application has been received.", time: "1d ago", unread: false },
    { name: "Maya Rivers", msg: "Can we reschedule tomorrow's lesson?", time: "3h ago", unread: true },
  ],
  children: [
    { name: "Maya Rivers", age: "Year 9", subjects: "Calculus & Physics", progress: 85 },
    { name: "Leo Rivers", age: "Year 5", subjects: "English & Creative Writing", progress: 60 },
  ],
  reviews: [
    { name: "Alex J.", rating: 5, text: "Dr. Chen is amazing! She makes complex math concepts easy to understand." },
    { name: "Maya R.", rating: 4, text: "Great tutor! Helped me prepare for my physics exam." },
    { name: "Leo R.", rating: 5, text: "Elena is very patient and makes learning fun!" },
  ],
  admin: {
    stats: { tutors: 5, pendingApps: 3, revenue: 12580, students: 3, bookings: 5 },
    pendingTutors: [
      { name: "Dr. Elena Rodriguez", email: "elena@example.com", subject: "Physics", date: "Oct 24" },
      { name: "Jameson Carter", email: "jameson@example.com", subject: "Cloud Architecture", date: "Oct 25" },
      { name: "Sarah Bloom", email: "sarah@example.com", subject: "Digital Painting", date: "Oct 26" },
    ],
    auditLogs: [
      { action: "Admin Session Started", user: "Admin", time: "2 mins ago" },
      { action: "Application Approved", user: "Reviewer", time: "15 mins ago", detail: "Tutor: Mark Henderson" },
      { action: "Payout Failed", user: "System", time: "42 mins ago", detail: "Trans ID: #TX-9912" },
      { action: "System Update Applied", user: "Admin", time: "1 hour ago", detail: "Version 4.2.1" },
      { action: "New Course Published", user: "Content Team", time: "3 hours ago", detail: "Python for Data Science" },
    ],
  },
};

export function getDemoTutorImage(index: number): string {
  const images = [
    "/images/stitch/landing_page-6.jpg",
    "/images/stitch/landing_page-7.jpg",
    "/images/stitch/landing_page-8.jpg",
    "/images/stitch/landing_page-9.jpg",
    "/images/stitch/tutor_search_discovery-3.jpg",
  ];
  return images[index % images.length];
}

export function getDemoAvatar(name: string): string {
  const colors = ["bg-indigo-100 text-indigo-600", "bg-emerald-100 text-emerald-600", "bg-amber-100 text-amber-600", "bg-rose-100 text-rose-600", "bg-cyan-100 text-cyan-600"];
  const idx = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[idx];
}
