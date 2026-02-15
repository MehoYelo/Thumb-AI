import type { User } from "@supabase/supabase-js";

type DisplayNameOptions = {
  fallbackName?: string;
};

export function resolveDisplayName(
  user: User | null | undefined,
  options: DisplayNameOptions = {},
) {
  const fallbackName = options.fallbackName ?? "Account";

  return (
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.user_metadata?.display_name ||
    user?.user_metadata?.preferred_username ||
    user?.email ||
    fallbackName
  );
}
