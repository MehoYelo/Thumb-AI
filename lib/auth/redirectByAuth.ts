import { createServerSupabase } from "./../supabase/server";
import { redirect } from "next/navigation";

export async function requireAuth(redirectTo: string = "/auth") {
  const supabase = await createServerSupabase();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  console.log("requireAuth - User:", user ? "EXISTS" : "NULL");
  console.log("requireAuth - Email:", user?.email);

  if (!user || error) redirect(redirectTo);
}

export async function requireNoAuth(redirectTo: string = "/generate") {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect(redirectTo);
}
