"use client";
import { createBrowserClient } from "@supabase/ssr";

export function LogoutButton() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={logout}
      className="group flex w-full items-center gap-2 rounded-lg border border-red-200 bg-linear-to-r from-red-50 to-rose-50 px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm transition-all hover:scale-[1.02] hover:border-red-300 hover:from-red-100 hover:to-rose-100 hover:shadow-md active:scale-[0.98]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
        viewBox="0 0 20 20"
        fill="currentColor"
      ></svg>
      Log out
    </button>
  );
}
