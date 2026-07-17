import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Save to database
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { error: dbError } = await supabase.rpc("insert_contact_message", {
      p_name: name,
      p_email: email,
      p_message: message,
    });

    if (dbError) {
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Try to send email notification (optional - skip if SMTP not configured)
    const smtpEmail = process.env.SMTP_EMAIL;
    const smtpPass = process.env.SMTP_PASSWORD;

    if (smtpEmail && smtpPass) {
      try {
        const nodemailer = await import("nodemailer");
        const transporter = nodemailer.default.createTransport({
          service: "gmail",
          auth: { user: smtpEmail, pass: smtpPass },
        });
        await transporter.sendMail({
          from: smtpEmail,
          to: "ahmed.ghaffar555@gmail.com",
          subject: `New Contact Message from ${name}`,
          html: `
            <h2>New Contact Message</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p style="background:#f3f4f6;padding:16px;border-radius:8px;">${message}</p>
            <hr>
            <p style="color:#6b7280;font-size:12px;">Sent via TutorConnect Contact Form</p>
          `,
        });
      } catch {
        // Email failed but form submission succeeded - that's fine
        console.warn("Failed to send email notification");
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Something went wrong" },
      { status: 500 }
    );
  }
}
