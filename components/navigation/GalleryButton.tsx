"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GalleryButton() {
  return (
    <Button
      asChild
      size="lg"
      variant="outline"
      className="w-full border-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 text-slate-900 shadow-none transition hover:from-emerald-200 hover:via-cyan-200 hover:to-sky-200 focus-visible:ring-emerald-400/40"
    >
      <Link href="/gallery">View Gallery</Link>
    </Button>
  );
}
