import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServerSupabase } from "@/lib/supabase/server";
import { CREDIT_PACKS } from "@/config/billing";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(apiKey);
};

export async function POST(req: Request) {
  let stripe: Stripe;

  try {
    stripe = getStripe();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Billing is not configured" },
      { status: 500 },
    );
  }

  const supabase = await createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await req.json();
  const pack = CREDIT_PACKS.find((p) => p.id === id);

  if (!pack) {
    return NextResponse.json({ error: "Invalid pack" }, { status: 400 });
  }

  const prices = await stripe.prices.list({
    lookup_keys: [pack.lookupKey],
  });

  const price = prices.data[0];

  const origin = req.headers.get("origin");

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: price.id, quantity: 1 }],
    success_url: `${origin}/success`,
    cancel_url: `${origin}/billing`,
    metadata: {
      userId: user.id,
      packId: pack.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
