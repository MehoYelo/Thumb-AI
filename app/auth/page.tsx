"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

type Status = "idle" | "loading" | "error";

export default function AuthPage() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [mode, setMode] = useState<"login" | "register">("login");
  const [status, setStatus] = useState<Status>("idle");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${BASE_URL}/auth/callback` },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    if (!email || !password) {
      setError("Email and password required");
      return setStatus("error");
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return setStatus("error");
      }

      router.push("/generate");
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${BASE_URL}/auth/callback`,
        },
      });

      if (error) {
        setError(error.message);
        return setStatus("error");
      }

      router.push("/auth/check-email");
    }

    setStatus("idle");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-900 via-blue-700 to-blue-100 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-2xl border border-white/20 text-center">
        <Image
          src="/assets/bloxious-logo.png"
          alt="Bloxious AI"
          width={40}
          height={40}
          className="mx-auto mb-4"
        />

        <h1 className="text-2xl font-semibold text-white">
          {mode === "login" ? "Welcome back" : "Create account"}
        </h1>

        {/* Toggle */}
        <div className="mt-4 flex rounded-xl bg-white/10 p-1">
          {["login", "register"].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m as "login" | "register")}
              className={`flex-1 rounded-lg py-2 text-sm transition ${
                mode === m
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {m === "login" ? "Login" : "Register"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-3 text-left">
          <input
            type="email"
            placeholder="Email"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-white/20 px-4 py-3 text-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/60 transition disabled:opacity-60"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              disabled={status === "loading"}
              className="w-full rounded-xl bg-white/20 px-4 py-3 pr-12 text-sm text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/60 transition disabled:opacity-60"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-xl bg-black py-3 text-sm font-medium text-white transition hover:bg-black/80 active:scale-[0.98] disabled:opacity-50"
          >
            {status === "loading"
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </button>
        </form>

        <div className="my-6 h-px bg-white/20" />

        <button
          onClick={signInWithGoogle}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-medium text-black transition hover:bg-white/90 active:scale-[0.98]"
        >
          <span className="text-lg font-semibold">G</span>
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-white/60">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </main>
  );
}
