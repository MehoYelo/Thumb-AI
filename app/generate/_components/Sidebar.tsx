"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditsBadge } from "@/components/billing/CreditsBadge";
import { GalleryButton } from "@/components/navigation/GalleryButton";
import { ProfileName } from "@/components/profile/ProfileName";
import { SettingsButton } from "@/components/profile/SettingsButton";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-65 border-r bg-white p-4">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
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
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
            <ProfileName />
            <SettingsButton />
          </div>
        </div>
      </div>
    </aside>
  );
}
