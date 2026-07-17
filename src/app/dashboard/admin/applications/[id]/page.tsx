import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, BookOpen, DollarSign, Globe, Award, FileText, User } from "lucide-react";
import ApplicationActions from "./ApplicationActions";

export default async function ApplicationReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("users").select("role, admin_role").eq("id", user.id).maybeSingle();
  const meta = user.user_metadata as Record<string, string> | undefined;
  const userRole = profile?.role || meta?.role || "student";
  if (userRole !== "admin" && !profile?.admin_role) redirect("/dashboard");

  const admin = createAdminClient();
  const { data: app } = await admin.from("teacher_applications").select("*").eq("id", id).single();
  const { data: notes } = await admin.from("admin_notes").select("*, users(full_name)").eq("application_id", id).order("created_at", { ascending: false });

  if (!app) return <div className="py-20 text-center"><h1 className="text-2xl font-bold text-gray-900">Application not found</h1><Link href="/dashboard/admin" className="text-blue-600 hover:underline mt-4 inline-block">Back to Dashboard</Link></div>;

  const statusColors: Record<string, string> = {
    submitted: "bg-yellow-100 text-yellow-700", under_review: "bg-blue-100 text-blue-700",
    more_info_requested: "bg-orange-100 text-orange-700", interview_scheduled: "bg-purple-100 text-purple-700",
    approved: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700",
  };

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-4"><span className="text-blue-600">{icon}</span>{title}</h3>
      {children}
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="mb-2"><span className="text-xs text-gray-400 uppercase tracking-wide">{label}</span><p className="text-gray-900">{value || "-"}</p></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link href="/dashboard/admin" className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${statusColors[app.status] || "bg-gray-100"}`}>
            {app.status?.replace("_", " ").replace(/\b\w/g, (c: string) => c.toUpperCase())}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Section title="Personal Information" icon={<User className="h-5 w-5" />}>
              <div className="grid grid-cols-2 gap-4"><Field label="Full Name" value={app.full_name} /><Field label="Email" value={app.email} /><Field label="Phone" value={app.phone} /><Field label="Gender" value={app.gender} /><Field label="Date of Birth" value={app.date_of_birth} /><Field label="Country" value={app.country} /><Field label="City" value={app.city} /><Field label="Address" value={app.address} /></div>
            </Section>

            <Section title="Qualifications" icon={<Award className="h-5 w-5" />}>
              <div className="grid grid-cols-2 gap-4"><Field label="Qualification" value={app.qualification} /><Field label="Institution" value={app.institution} /><Field label="Graduation Year" value={app.graduation_year} /><Field label="Specialization" value={app.specialization} /><Field label="Experience" value={`${app.years_experience} years`} /><Field label="Certificates" value={app.teaching_certificates} /><Field label="Other Certifications" value={app.other_certifications} /></div>
            </Section>

            <Section title="Subjects & Rates" icon={<DollarSign className="h-5 w-5" />}>
              <div className="flex flex-wrap gap-2 mb-4">{app.subjects_taught?.map((s: string) => <span key={s} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">{s}</span>)}</div>
              <div className="grid grid-cols-3 gap-4"><Field label="Hourly Rate" value={app.hourly_rate ? `$${app.hourly_rate}` : "-"} /><Field label="Monthly Rate" value={app.monthly_rate ? `$${app.monthly_rate}` : "-"} /><Field label="Languages" value={app.languages} /></div>
            </Section>

            <Section title="Bio & Availability" icon={<FileText className="h-5 w-5" />}>
              <p className="text-gray-600 text-sm mb-4">{app.bio || "-"}</p>
              <Field label="Availability" value={app.availability} />
            </Section>

            <Section title="References" icon={<Globe className="h-5 w-5" />}>
              <div className="grid grid-cols-3 gap-4"><Field label="Name" value={app.reference_name} /><Field label="Contact" value={app.reference_contact} /><Field label="Relationship" value={app.reference_relationship} /></div>
            </Section>

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Review Notes</h3>
              {notes && notes.length > 0 ? <div className="space-y-3">{notes.map((n: any) => <div key={n.id} className="bg-gray-50 rounded-xl p-4"><div className="flex items-center justify-between text-sm"><span className="font-medium text-gray-700">{n.users?.full_name || "Admin"}</span><span className="text-gray-400">{new Date(n.created_at).toLocaleDateString()}</span></div><p className="mt-1 text-gray-600">{n.note}</p><span className="inline-block mt-1 text-xs text-gray-400">{n.note_type}</span></div>)}</div> : <p className="text-gray-400 text-sm">No notes yet</p>}
            </div>
          </div>

          <div className="space-y-6">
            <ApplicationActions applicationId={id} currentStatus={app.status} />

            {/* Application Meta */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-gray-400">Submitted</span><p className="text-gray-900">{app.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "-"}</p></div>
                <div><span className="text-gray-400">Last Updated</span><p className="text-gray-900">{app.updated_at ? new Date(app.updated_at).toLocaleDateString() : "-"}</p></div>
                <div><span className="text-gray-400">Application ID</span><p className="text-gray-900 text-xs break-all">{app.id}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
