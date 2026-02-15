"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { resolveDisplayName } from "@/components/profile/profileUtils";

type ProfileNameProps = {
  fallbackName?: string;
};

export function ProfileName({ fallbackName = "Account" }: ProfileNameProps) {
  const supabase = createClient();
  const [name, setName] = useState(fallbackName);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const displayName = resolveDisplayName(data.user, { fallbackName });

      if (active) setName(displayName);
    };

    load();

    return () => {
      active = false;
    };
  }, [supabase, fallbackName]);

  return (
    <span className="truncate text-sm font-medium text-slate-900">{name}</span>
  );
}
