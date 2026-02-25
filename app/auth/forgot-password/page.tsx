"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"

export default function ForgotPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      return setStatus("error")
    }

    setStatus("sent")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm shadow-xl">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>
            Enter your email and we’ll send you a reset link.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {status === "sent" ? (
            <p className="text-sm text-muted-foreground">
              Check your email for the reset link.
            </p>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={status === "loading"}
              />

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              <Button className="w-full" disabled={status === "loading"}>
                {status === "loading" ? "Sending..." : "Send reset link"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
