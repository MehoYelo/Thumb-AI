import { NextResponse } from "next/server"
import Stripe from "stripe"
import { CREDIT_PACKS } from "@/config/billing"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function GET() {
  const prices = await stripe.prices.list({
    lookup_keys: CREDIT_PACKS.map(p => p.lookupKey),
    expand: ["data.product"],
  })

  const packs = prices.data.map(price => {
    const config = CREDIT_PACKS.find(
      p => p.lookupKey === price.lookup_key
    )

    return {
      id: config?.id,
      credits: config?.credits,
      price: (price.unit_amount ?? 0) / 100,
      currency: price.currency,
    }
  })

  return NextResponse.json(packs)
}
