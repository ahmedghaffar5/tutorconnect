import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature") || "";

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { user_id, booking_id } = session.metadata || {};

    if (user_id && booking_id) {
      await supabase.from("payments").insert({
        user_id,
        booking_id,
        amount: (session.amount_total || 0) / 100,
        currency: session.currency?.toUpperCase() || "USD",
        stripe_payment_id: session.id,
        status: "paid",
      });

      await supabase
        .from("bookings")
        .update({ status: "confirmed" })
        .eq("id", booking_id);
    }
  }

  return NextResponse.json({ received: true });
}
