"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function ResetPassword() {
  const router = useRouter();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [password, setPassword] = useState("");

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.auth.updateUser({ password });
    router.push("/auth");
  };

  return (
    <form onSubmit={handleUpdate} className="max-w-sm mx-auto mt-20 space-y-4">
      <input
        type="password"
        placeholder="New password"
        className="w-full border p-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="w-full bg-black text-white p-3 rounded">
        Update password
      </button>
    </form>
  );
}
