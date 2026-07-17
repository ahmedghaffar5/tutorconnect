import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const applicationId = formData.get("applicationId") as string;
    const documentType = formData.get("documentType") as string;

    if (!file || !applicationId || !documentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${applicationId}/${Date.now()}_${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("application_docs")
      .upload(fileName, file, { upsert: false });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: { publicUrl } } = supabase.storage
      .from("application_docs")
      .getPublicUrl(fileName);

    const { error: dbError } = await supabase.from("application_documents").insert({
      application_id: applicationId,
      document_type: documentType,
      file_url: publicUrl,
      file_name: file.name,
    });

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ url: publicUrl, fileName: file.name });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
