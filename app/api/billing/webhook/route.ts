import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { CREDIT_PACKS } from "@/config/billing";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(apiKey);
};

const getWebhookSecret = () => {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("Missing STRIPE_WEBHOOK_SECRET");
  }
  return secret;
};

const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase service credentials");
  }
  return createClient(url, serviceKey);
};

export async function POST(req: Request) {
  let stripe: Stripe;
  let webhookSecret: string;
  let supabase: SupabaseClient;

  try {
    stripe = getStripe();
    webhookSecret = getWebhookSecret();
    supabase = getSupabase();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Billing webhook is not configured" },
      { status: 500 },
    );
  }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const packId = session.metadata?.packId;

    const pack = CREDIT_PACKS.find((p) => p.id === packId);

    if (userId && pack) {
      const { error } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: pack.credits,
      });

      if (error) {
        console.error("Credit update failed:", error);
        return NextResponse.json({ error: "DB error" }, { status: 500 });
      }

      console.log(`Added ${pack.credits} credits to user ${userId}`);
    }
  }

  return NextResponse.json({ received: true });
}
