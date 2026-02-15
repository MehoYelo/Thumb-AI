import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 right-[-10%] h-72 w-72 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-20 text-center">
          <Image
            src="/assets/bloxious-logo.png"
            alt="Bloxious AI"
            width={64}
            height={64}
            className="mx-auto mb-6 h-16 w-16"
          />
          <h1 className="text-5xl md:text-6xl font-bold">
            Create thumbnails that
            <span className="bg-linear-to-r from-teal-600 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              {" "}
              pop on every platform
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Turn quick ideas into scroll-stopping visuals with a guided AI flow,
            reference images, and ready-to-download results.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/generate">Start Creating</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth">Sign In</Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span>Iterate</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
            <span>Export-ready formats</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" />
            <span>Built for creators</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Guided prompts",
              description:
                "Shape your thumbnail with structured prompts and visual cues.",
            },
            {
              title: "Fast iterations",
              description: "Go from concept to finished thumbnail in seconds.",
            },
            {
              title: "Creator-first output",
              description:
                "Download crisp images.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                <span className="text-sm font-semibold">+</span>
              </div>
              <h3 className="text-lg font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-10 md:px-12">
          <div className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold">
                Go from idea to gallery in minutes
              </h2>
              <p className="mt-3 text-muted-foreground">
                Generate, refine, and save every version. Your gallery keeps the
                best takes ready for download or edits.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/generate">Create a Thumbnail</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/gallery">View Gallery</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 Bloxious AI. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
