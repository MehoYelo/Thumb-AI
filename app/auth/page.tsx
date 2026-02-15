"use client";

import Image from "next/image";
import { createBrowserClient } from "@supabase/ssr";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;

export default function AuthPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${BASE_URL}/auth/callback` },
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-linear-to-b from-blue-900 via-blue-700 to-blue-100 px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white/10 p-8 backdrop-blur-xl shadow-xl text-center">
        <Image
          src="/assets/bloxious-logo.png"
          alt="Bloxious AI"
          width={40}
          height={40}
          className="mx-auto mb-4 h-10 w-10"
        />
        <h1 className="text-2xl font-semibold text-white">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-white/70">
          Get started with Bloxious AI for free
        </p>

        <button
          onClick={signInWithGoogle}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black hover:bg-white/90"
        >
          <span className="text-lg">G</span>
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-white/60">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </main>
  );
}
