import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullName, phone } = await request.json();

    if (fullName) {
      const { error: rpcError } = await supabase.rpc("update_user_profile", {
        user_id: user.id,
        new_full_name: fullName,
        new_phone: phone || null,
      });

      if (rpcError) {
        return NextResponse.json({ error: rpcError.message }, { status: 500 });
      }

      await supabase.auth.updateUser({
        data: { full_name: fullName, phone: phone || "" },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
