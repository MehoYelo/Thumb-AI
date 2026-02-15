import Stripe from "stripe"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { CREDIT_PACKS } from "@/config/billing"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

// ⚠️ SERVICE ROLE KEY kullan
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    const userId = session.metadata?.userId
    const packId = session.metadata?.packId

    const pack = CREDIT_PACKS.find(p => p.id === packId)

    if (userId && pack) {
      const { error } = await supabase.rpc("increment_credits", {
        user_id: userId,
        amount: pack.credits,
      })

      if (error) {
        console.error("Credit update failed:", error)
        return NextResponse.json({ error: "DB error" }, { status: 500 })
      }

      console.log(`Added ${pack.credits} credits to user ${userId}`)
    }
  }

  return NextResponse.json({ received: true })
}
