import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const logs: string[] = [];
  const add = (m: string) => logs.push(m);

  try {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return NextResponse.json({ error: "Missing Supabase env vars" });
    }

    // Try the RPC function first (works with anon key if created)
    add("Trying RPC seed function...");
    const anonClient = createClient(supabaseUrl, anonKey);
    const { data: rpcData, error: rpcError } = await anonClient.rpc("seed_platform_data");
    if (!rpcError && rpcData) {
      add("✅ RPC seed function succeeded!");
      return NextResponse.json({ success: true, method: "rpc", data: rpcData, logs });
    }
    add(`RPC failed: ${rpcError?.message || "unknown"}`);

    // Try service role key
    if (serviceKey) {
      add("Trying service role key...");
      const adminDb = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });
      const { error: testErr } = await adminDb.from("subjects").select("id").limit(1);
      if (!testErr) {
        add("Service role key works! Seeding directly...");
type LinkItem = [number, string[]];
        // Clear and seed using admin client
        const tables = ["notifications","audit_logs","reviews","submissions","grades","assignment_attachments","assignments","progress_records","learning_goals","booking_participants","booking_status_history","slot_holds","attendance_records","session_notes","tutor_product_prices","availability_rules","tutor_subjects","tutors","guardian_student_links","household_members","households","admin_permissions","bookings","contact_messages","teacher_applications","favorites"];
        for (const t of tables) { try { await adminDb.from(t).delete().neq("id", "00000000-0000-0000-0000-000000000000"); } catch {} }
        try { await adminDb.from("users").delete().neq("id", "00000000-0000-0000-0000-000000000000"); } catch {}

        const { data: admins } = await adminDb.from("users").insert({ full_name:"Admin User", email:"admin@tutorconnect.com", role:"admin", account_status:"active" }).select();
        if (admins?.[0]) await adminDb.from("admin_permissions").insert({ user_id: admins[0].id, admin_role:"super_admin" });

        const tutorEmails = [["Dr. Sarah Chen","sarah.chen@tutorconnect.com"],["Prof. James Wilson","james.wilson@tutorconnect.com"],["Ms. Elena Rodriguez","elena.r@tutorconnect.com"],["Dr. Michael Hart","michael.hart@tutorconnect.com"],["Prof. Alex Rivera","alex.rivera@tutorconnect.com"]];
        const tutorUserIds: string[] = [];
        for (const [name, email] of tutorEmails) {
          const { data: u } = await adminDb.from("users").insert({ full_name:name, email, role:"tutor", account_status:"active" }).select();
          if (u?.[0]?.id) tutorUserIds.push(u[0].id);
        }
        const tutorData = [
          {user_id:tutorUserIds[0],bio:"PhD in Mathematics from MIT.",hourly_rate:65,qualification:"PhD Math, MIT",experience_years:15,languages:"English, Mandarin"},
          {user_id:tutorUserIds[1]||tutorUserIds[0],bio:"Full-stack developer.",hourly_rate:55,qualification:"MSc CS, Stanford",experience_years:10,languages:"English"},
          {user_id:tutorUserIds[2]||tutorUserIds[0],bio:"Native Spanish speaker.",hourly_rate:45,qualification:"MA Linguistics",experience_years:8,languages:"Spanish, English, French"},
          {user_id:tutorUserIds[3]||tutorUserIds[0],bio:"PhD in Physics.",hourly_rate:60,qualification:"PhD Physics, Caltech",experience_years:12,languages:"English"},
          {user_id:tutorUserIds[4]||tutorUserIds[0],bio:"Software engineer.",hourly_rate:50,qualification:"BSc CS, MIT",experience_years:7,languages:"English, Hindi"},
        ];
        const tutors: any[] = [];
        for (const t of tutorData) { const { data:tp } = await adminDb.from("tutors").insert({...t,is_approved:true}).select(); if(tp?.[0]) tutors.push(tp[0]); }

        // Get subjects
        const { data: subs } = await adminDb.from("subjects").select("id,name");
        const subMap = Object.fromEntries((subs||[]).map((s:any)=>[s.name,s.id]));
        const links: LinkItem[] = [[0,["Mathematics","Physics"]],[1,["Computer Science","Coding"]],[2,["English","Urdu"]],[3,["Physics","Chemistry","Mathematics"]],[4,["Computer Science","Coding"]]];
        for (const [idx,subjs] of links) { for (const sub of subjs) { if(subMap[sub]&&tutors[idx]) await adminDb.from("tutor_subjects").insert({tutor_id:tutors[idx].id,subject_id:subMap[sub]}); } }

        // Students
        const { data: stds } = await adminDb.from("users").insert([
          {full_name:"Alex Johnson",email:"alex.j@example.com",role:"student",account_status:"active"},
          {full_name:"Maya Rivers",email:"maya.r@example.com",role:"student",account_status:"active"},
          {full_name:"Leo Rivers",email:"leo.r@example.com",role:"student",account_status:"active"},
        ]).select();
        const sIds = (stds||[]).map((u:any)=>u.id);

        // Parent
        const { data: prnt } = await adminDb.from("users").insert({full_name:"David Rivers",email:"david.r@example.com",role:"parent",account_status:"active"}).select();
        const pId = prnt?.[0]?.id;
        if(pId&&sIds.length>=2){
          const {data:hh}=await adminDb.from("households").insert({name:"Rivers Family",primary_billing_guardian_id:pId}).select();
          if(hh?.[0]){
            await adminDb.from("household_members").insert([{household_id:hh[0].id,user_id:pId,role_in_household:"guardian"},{household_id:hh[0].id,user_id:sIds[1],role_in_household:"student"},{household_id:hh[0].id,user_id:sIds[2],role_in_household:"student"}]);
            await adminDb.from("guardian_student_links").insert([{guardian_id:pId,student_id:sIds[1],relationship:"Father",is_billing_responsible:true},{guardian_id:pId,student_id:sIds[2],relationship:"Father",is_billing_responsible:true}]);
          }
        }

        // Bookings
        if(tutors[0]&&subMap["Mathematics"]&&sIds[0]) await adminDb.from("bookings").insert({student_id:sIds[0],tutor_id:tutors[0].id,subject_id:subMap["Mathematics"],booking_type:"trial",scheduled_at:new Date(Date.now()+2*86400000).toISOString(),status:"confirmed",student_name:"Alex Johnson"});
        if(tutors[3]&&subMap["Physics"]&&sIds[1]) await adminDb.from("bookings").insert({student_id:sIds[1],tutor_id:tutors[3].id,subject_id:subMap["Physics"],booking_type:"paid",scheduled_at:new Date(Date.now()+5*86400000).toISOString(),status:"confirmed",student_name:"Maya Rivers"});

        // Goals + Progress + Reviews + Notifications
        if(sIds[0]){await adminDb.from("learning_goals").insert([{student_id:sIds[0],title:"Ace SAT Math",target_date:"2026-12-15",status:"active",progress_pct:65},{student_id:sIds[0],title:"Complete AP Calculus",target_date:"2027-03-01",status:"active",progress_pct:30}]);await adminDb.from("progress_records").insert([{student_id:sIds[0],metric_type:"hours_studied",metric_value:24.5},{student_id:sIds[0],metric_type:"avg_score",metric_value:87}]);}
        if(sIds[1]){await adminDb.from("learning_goals").insert({student_id:sIds[1],title:"Master Quantum Physics",target_date:"2026-11-01",status:"active",progress_pct:45});await adminDb.from("progress_records").insert({student_id:sIds[1],metric_type:"hours_studied",metric_value:18.5});}
        if(sIds[2]) await adminDb.from("learning_goals").insert({student_id:sIds[2],title:"Improve Creative Writing",target_date:"2026-12-01",status:"active",progress_pct:70});
        if(tutors[0]&&sIds[0]) await adminDb.from("reviews").insert({student_id:sIds[0],tutor_id:tutors[0].id,rating:5,comment:"Dr.Chen is amazing!",is_approved:true});
        if(tutors[3]&&sIds[1]) await adminDb.from("reviews").insert({student_id:sIds[1],tutor_id:tutors[3].id,rating:4,comment:"Great tutor!",is_approved:true});
        if(admins?.[0]) await adminDb.from("audit_logs").insert({user_id:admins[0].id,action:"admin_session_started",entity_type:"session",entity_id:"s_001"});

        add("✅ Seed complete via service role key!");
        return NextResponse.json({success:true,method:"service_role",summary:{tutors:tutors.length,students:sIds.length,bookings:2},logs});
      }
      add(`Service role key test failed: ${testErr?.message}`);
    }

    // Both methods failed - provide clear instructions
    add("");
    add("╔══════════════════════════════════════════════════╗");
    add("║  TO FIX: Run this SQL in Supabase SQL Editor:   ║");
    add("╠══════════════════════════════════════════════════╣");
    add("║  1. Open supabase/rpc-seed.sql from project     ║");
    add("║  2. Copy and run it in Supabase SQL Editor      ║");
    add("║  3. Then refresh this page                      ║");
    add("╚══════════════════════════════════════════════════╝");
    add("");
    add("Alternative: Fix the SUPABASE_SERVICE_ROLE_KEY");
    add("1. Go to supabase.com → Project Settings → API");
    add("2. Copy the service_role key (LONGER key, not anon)");
    add("3. Paste in Vercel → Env Variables → SUPABASE_SERVICE_ROLE_KEY");
    add("4. Redeploy, then visit /api/seed again");

    return NextResponse.json({ error: "Cannot seed. See logs for instructions.", can_fix_via: ["rpc-seed.sql", "service_role_key"], logs });
  } catch (e: any) {
    return NextResponse.json({ error: e.message, logs }, { status: 500 });
  }
}
