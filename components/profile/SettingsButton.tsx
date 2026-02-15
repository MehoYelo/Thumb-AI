"use client";

import Link from "next/link";
import { useSettingsModal } from "@/components/profile/SettingsModalProvider";

type SettingsButtonProps = {
  href?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export function SettingsButton({
  href,
  onClick,
  ariaLabel = "Open settings",
}: SettingsButtonProps) {
  const { openModal } = useSettingsModal();
  const className =
    "inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:scale-[1.02] hover:border-slate-300 hover:bg-slate-50 active:scale-[0.98]";

  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel} className={className}>
        <SettingsIcon />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick ?? openModal}
      aria-label={ariaLabel}
      className={className}
    >
      <SettingsIcon />
    </button>
  );
}

function SettingsIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M19.14 12.94c.04-.31.06-.63.06-.94s-.02-.63-.06-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.2 7.2 0 0 0-1.63-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54c-.57.23-1.12.54-1.63.94l-2.39-.96a.5.5 0 0 0-.6.22L2.7 8.84a.5.5 0 0 0 .12.64l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94L2.82 14.52a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.51.4 1.06.71 1.63.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.57-.23 1.12-.54 1.63-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58ZM12 15.5A3.5 3.5 0 1 1 12 8a3.5 3.5 0 0 1 0 7.5Z" />
    </svg>
  );
}
