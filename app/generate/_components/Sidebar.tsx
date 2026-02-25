"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditsBadge } from "@/components/billing/CreditsBadge";
import { GalleryButton } from "@/components/navigation/GalleryButton";
import { ProfileName } from "@/components/profile/ProfileName";
import { SettingsButton } from "@/components/profile/SettingsButton";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-65 border-r border-slate-800/80 bg-slate-950 p-4 text-slate-100 bg-[radial-gradient(900px_500px_at_-20%_-10%,rgba(16,185,129,0.12),transparent)]">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-100 transition-colors hover:text-emerald-300"
          >
            <Image
              src="/assets/bloxious-logo.png"
              alt="Bloxious AI"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            Bloxious AI
          </Link>
          <GalleryButton />
          {/* future settings */}
        </div>
        <div className="flex flex-col gap-4">
          <CreditsBadge />
          <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-2 ring-1 ring-slate-200/60">
            <ProfileName />
            <SettingsButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
