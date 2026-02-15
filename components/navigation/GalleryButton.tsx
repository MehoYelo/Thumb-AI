"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function GalleryButton() {
  return (
    <Button asChild className="w-full" variant="outline">
      <Link href="/gallery">View Gallery</Link>
    </Button>
  );
}
