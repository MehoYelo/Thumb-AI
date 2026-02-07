"use client";

import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { CreditsBadge } from "@/components/billing/CreditsBadge";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-65 border-r bg-white p-4">
      <div className="flex h-full flex-col justify-between">
        <div>
          <Link
            href="/"
            className="inline-block text-xl font-bold hover:opacity-80 transition-opacity"
          >
            ✨ Thumb AI
          </Link>
          {/* future settings */}
        </div>
        <div className="flex flex-col gap-4">
          <CreditsBadge />
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
