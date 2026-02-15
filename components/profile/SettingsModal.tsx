"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { resolveDisplayName } from "@/components/profile/profileUtils";
import { LogoutButton } from "@/components/auth/LogoutButton";

type SettingsModalProps = {
  open: boolean;
  onClose: () => void;
};

type ProfileSummary = {
  displayName: string;
  email: string;
  plan: string;
};

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const supabase = createClient();
  const [profile, setProfile] = useState<ProfileSummary | null>(null);

  useEffect(() => {
    if (!open) return;

    let active = true;

    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const displayName = resolveDisplayName(user);
      const email = user?.email ?? "";

      const { data: profileData } = await supabase
        .from("profiles")
        .select("plan")
        .single();

      const plan = profileData?.plan ?? "free";

      if (active) {
        setProfile({ displayName, email, plan });
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [open, supabase]);

  const avatarLetter = useMemo(() => {
    if (!profile?.displayName) return "?";
    return profile.displayName.trim().charAt(0).toUpperCase();
  }, [profile]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Settings</h2>
            <p className="text-sm text-slate-500">
              Manage your account preferences
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close settings"
          >
            <span className="text-lg">&times;</span>
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <Section title="Account">
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-500 text-sm font-semibold text-white">
                {avatarLetter}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-slate-900">
                  {profile?.email || "your@email.com"}
                </span>
                <span className="text-xs text-slate-500">
                  {profile?.plan || "free"} plan
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Display Name
                </p>
                <p className="text-sm font-semibold text-slate-900">
                  {profile?.displayName || "Account"}
                </p>
              </div>
              <PlaceholderIconButton ariaLabel="Edit display name" />
            </div>
          </Section>

          <Section title="Change">
            <div className="grid grid-cols-2 gap-3">
              <PlaceholderButton label="Email" />
              <PlaceholderButton label="Password" />
            </div>
          </Section>

          <Section title="Subscription">
            <div className="rounded-xl border border-slate-200 px-4 py-3">
              <p className="text-sm font-medium text-slate-900">Current Plan</p>
              <p className="text-xs text-slate-500">
                {profile?.plan || "free"} - coming soon
              </p>
            </div>
            <button
              type="button"
              disabled
              className="mt-3 w-full rounded-xl bg-orange-400/80 px-4 py-2.5 text-sm font-semibold text-white opacity-60"
            >
              Upgrade Plan (soon)
            </button>
            <div className="mt-3 flex items-center gap-2">
              <input
                disabled
                placeholder="Enter code"
                className="h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm text-slate-500"
              />
              <button
                type="button"
                disabled
                className="h-10 rounded-lg bg-slate-200 px-4 text-sm font-medium text-slate-500"
              >
                Redeem
              </button>
            </div>
          </Section>

          <div className="pt-2">
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

function Section({ title, children }: SectionProps) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

type PlaceholderButtonProps = {
  label: string;
};

function PlaceholderButton({ label }: PlaceholderButtonProps) {
  return (
    <button
      type="button"
      disabled
      className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500"
    >
      <span>{label}</span>
      <span className="text-xs text-slate-400">soon</span>
    </button>
  );
}

type PlaceholderIconButtonProps = {
  ariaLabel: string;
};

function PlaceholderIconButton({ ariaLabel }: PlaceholderIconButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-label={ariaLabel}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-300"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-4 w-4"
      >
        <path d="M16.862 4.487a1.5 1.5 0 0 1 2.12 0l.53.53a1.5 1.5 0 0 1 0 2.12l-9.9 9.9a1 1 0 0 1-.45.26l-3.66.98a.5.5 0 0 1-.62-.62l.98-3.66a1 1 0 0 1 .26-.45l9.9-9.9Zm-2.12 2.12-8.88 8.88-.45 1.68 1.68-.45 8.88-8.88-1.23-1.23Z" />
      </svg>
    </button>
  );
}
