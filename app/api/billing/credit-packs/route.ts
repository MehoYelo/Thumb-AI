import { NextResponse } from "next/server";
import Stripe from "stripe";
import { CREDIT_PACKS } from "@/config/billing";

const getStripe = () => {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    throw new Error("Missing STRIPE_SECRET_KEY");
  }
  return new Stripe(apiKey);
};

export async function GET() {
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

  const prices = await stripe.prices.list({
    lookup_keys: CREDIT_PACKS.map((p) => p.lookupKey),
    expand: ["data.product"],
  });

  const packs = prices.data.map((price) => {
    const config = CREDIT_PACKS.find((p) => p.lookupKey === price.lookup_key);

    return {
      id: config?.id,
      credits: config?.credits,
      price: (price.unit_amount ?? 0) / 100,
      currency: price.currency,
    };
  });

  return NextResponse.json(packs);
}
