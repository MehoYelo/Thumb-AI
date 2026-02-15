"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCreditsModal } from "@/components/billing/CreditsModalProvider";

export function CreditsBadge() {
  const supabase = createClient();
  const [credits, setCredits] = useState(0);
  const [plan, setPlan] = useState("free");
  const { openModal } = useCreditsModal();

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("credits, plan")
        .single();

      if (data) {
        setCredits(data.credits);
        setPlan(data.plan);
      }
    };
    load();
  }, [supabase]);

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-linear-to-r from-amber-50 to-orange-50 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex flex-1 items-center gap-3">
          <span className="text-2xl">✨</span>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-amber-900">
              {credits} Credits
            </span>
            <span className="text-xs capitalize text-amber-700 opacity-75">
              {plan} Plan
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-amber-400 px-2 py-1 text-sm font-medium text-white hover:bg-amber-500 transition-colors"
          aria-label="Buy more credits"
        >
          +
        </button>
      </div>
    </>
  );
}
