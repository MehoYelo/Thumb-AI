import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export const createServerSupabase = async () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: async () => (await cookies()).getAll(),
        setAll: async (cookiesToSet) => {
          try {
            const cookieStore = await cookies();
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Handle error if needed
          }
        },
      },
    },
  );
