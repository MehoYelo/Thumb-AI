"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import femaleThumb from "@/assets/refs/characters/female.png";
import maleThumb from "@/assets/refs/characters/male.png";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const proofImages = useMemo(
    () => [
      femaleThumb,
      maleThumb,
      femaleThumb,
      maleThumb,
      femaleThumb,
      maleThumb,
    ],
    [],
  );
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [activeImage, setActiveImage] = useState<
    (typeof proofImages)[number] | null
  >(null);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) {
      return;
    }

    const scrollAmount = 0.5;
    const interval = window.setInterval(() => {
      if (!container) {
        return;
      }

      container.scrollLeft += scrollAmount;
      const maxScroll = container.scrollWidth - container.clientWidth;

      if (container.scrollLeft >= maxScroll) {
        container.scrollLeft = 0;
      }
    }, 16);

    return () => window.clearInterval(interval);
  }, []);

  const handleArrowScroll = (direction: "left" | "right") => {
    const container = carouselRef.current;
    if (!container) {
      return;
    }

    const delta = direction === "left" ? -320 : 320;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Sophisticated grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute left-[-5%] top-[-10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/15 via-cyan-500/10 to-transparent blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-gradient-to-tl from-indigo-500/15 via-purple-500/10 to-transparent blur-[140px]" />

      <header className="relative z-10">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
          <Link
            href="/"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight transition-colors hover:text-emerald-300"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-300 via-cyan-300 to-sky-300 shadow-lg shadow-emerald-500/30">
              <span className="text-xl text-slate-900">★</span>
            </span>
            RoThumbs
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 md:flex">
            <Link href="#features" className="transition hover:text-slate-50">
              Features
            </Link>
            <Link href="#pricing" className="transition hover:text-slate-50">
              Pricing
            </Link>
            <Link href="#faq" className="transition hover:text-slate-50">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              className="border-slate-700 bg-slate-800/80 text-slate-100 hover:bg-slate-700 hover:text-white"
            >
              <Link href="/auth">Log in</Link>
            </Button>
            <Button
              asChild
              className="border-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 text-slate-900 shadow-lg shadow-emerald-500/30 hover:from-emerald-200 hover:via-cyan-200 hover:to-sky-200"
            >
              <Link href="/generate">Start Creating</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-20 pt-16 text-center">
        <div className="flex items-center gap-3 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 shadow-lg shadow-emerald-500/20 backdrop-blur-sm">
          <span className="flex -space-x-2">
            {[
              "bg-red-400",
              "bg-orange-400",
              "bg-amber-300",
              "bg-emerald-400",
              "bg-sky-400",
            ].map((color, index) => (
              <span
                key={`${color}-${index}`}
                className={`h-6 w-6 rounded-full ring-2 ring-slate-900 ${color}`}
              />
            ))}
          </span>
          Trusted by 100+ Developers
        </div>

        <h1 className="mt-12 text-5xl font-black leading-tight tracking-tight sm:text-6xl md:text-7xl">
          Your Edge in{" "}
          <span className="relative inline-flex bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
            <span className="italic">Thumbnail</span>
          </span>
          <br />
          Creation
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300 sm:text-xl">
          Generate stunning, high-converting thumbnails in seconds.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="border-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 px-8 text-lg text-slate-900 shadow-lg shadow-emerald-500/30 hover:from-emerald-200 hover:via-cyan-200 hover:to-sky-200"
          >
            <Link href="/generate">Start creating today →</Link>
          </Button>
        </div>
      </section>

      <section className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-24">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Proof
          </p>
          <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Real thumbnails from creators
          </h2>
          <p className="mt-3 text-base text-slate-400 sm:text-lg">
            A quick scroll of results generated with RoThumbs.
          </p>
        </div>

        <div className="relative mt-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-950 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent" />

          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-2">
            <button
              type="button"
              onClick={() => handleArrowScroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-200 shadow-lg backdrop-blur transition hover:bg-slate-700"
              aria-label="Scroll left"
            >
              ←
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-2">
            <button
              type="button"
              onClick={() => handleArrowScroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-800/80 text-slate-200 shadow-lg backdrop-blur transition hover:bg-slate-700"
              aria-label="Scroll right"
            >
              →
            </button>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-hidden scroll-smooth"
          >
            {[...proofImages, ...proofImages].map((image, index) => (
              <button
                type="button"
                key={`proof-${index}`}
                onClick={() => setActiveImage(image)}
                className="flex h-36 w-60 flex-none items-center justify-center overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-[0_8px_32px_rgba(0,0,0,0.4)] backdrop-blur-sm transition hover:-translate-y-1 hover:border-emerald-500/50 hover:shadow-[0_12px_40px_rgba(16,185,129,0.2)]"
              >
                <Image
                  src={image}
                  alt="Generated thumbnail example"
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="relative z-10 w-full bg-slate-900/50 px-6 py-24 text-slate-100 backdrop-blur-sm"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 ring-1 ring-emerald-500/30">
              Features
            </div>
            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Everything to{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
                Stand Out
              </span>
            </h2>
            <p className="mt-4 text-base text-slate-400 sm:text-lg">
              Built by Roblox devs, for Roblox devs.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-emerald-500/50 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3v6" />
                  <path d="M12 15v6" />
                  <path d="M3 12h6" />
                  <path d="M15 12h6" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">
                Describe & Generate
              </h3>
              <p className="mt-2 text-sm text-slate-400">
                Type what you want. Get stunning thumbnails in seconds.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-purple-500/50 hover:shadow-[0_12px_40px_rgba(168,85,247,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="4" y="5" width="16" height="14" rx="2" />
                  <path d="M8 14l3-3 5 5" />
                  <path d="M9 9h.01" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">Upload & Transform</h3>
              <p className="mt-2 text-sm text-slate-400">
                Drop your screenshots. We will make them click-worthy.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-emerald-500/50 hover:shadow-[0_12px_40px_rgba(16,185,129,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 7l8-4 8 4-8 4-8-4z" />
                  <path d="M4 12l8 4 8-4" />
                  <path d="M4 17l8 4 8-4" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">Roblox-Optimized</h3>
              <p className="mt-2 text-sm text-slate-400">
                Perfect dimensions for icons, thumbnails, and banners.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-amber-500/50 hover:shadow-[0_12px_40px_rgba(251,191,36,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M4 18v-5a4 4 0 014-4h8a4 4 0 014 4v5" />
                  <circle cx="9" cy="9" r="2" />
                  <circle cx="15" cy="9" r="2" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">Team Collaboration</h3>
              <p className="mt-2 text-sm text-slate-400">
                Share projects with your team. Create together in real time.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-pink-500/50 hover:shadow-[0_12px_40px_rgba(236,72,153,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg shadow-pink-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 8v5l3 2" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">Save Hours</h3>
              <p className="mt-2 text-sm text-slate-400">
                2+ hours to 2 minutes. Focus on your game instead.
              </p>
            </div>

            <div className="group rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm transition hover:border-indigo-500/50 hover:shadow-[0_12px_40px_rgba(99,102,241,0.15)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 3l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-.5L12 3z" />
                </svg>
              </div>
              <h3 className="mt-5 text-lg font-semibold">Fresh Ideas</h3>
              <p className="mt-2 text-sm text-slate-400">
                Trending styles and compositions that convert players.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="pricing"
        className="relative z-10 w-full bg-slate-900/50 px-6 pb-28 pt-16 text-slate-100 backdrop-blur-sm"
      >
        <div className="mx-auto w-full max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 ring-1 ring-emerald-500/30">
            Pricing
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Simple{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-400 sm:text-lg">
            Start free. Upgrade when ready. No hidden fees.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4 text-sm font-semibold text-slate-400">
            <span>Monthly</span>
            <div className="relative h-7 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30">
              <span className="absolute right-1 top-1 h-5 w-5 rounded-full bg-white" />
            </div>
            <span className="text-slate-100">Yearly</span>
            <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
              Save 19%
            </span>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-700 text-slate-400">
                <span className="text-lg">☆</span>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-400">Free</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-100">
                $0.00
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / forever
                </span>
              </h3>
              <p className="mt-1 text-sm text-emerald-400">3 Credits / Month</p>
              <ul className="mt-6 space-y-2 text-sm text-slate-400">
                <li>Basic quality</li>
                <li>16:9 aspect ratio only</li>
                <li>Email support</li>
              </ul>
              <Button className="mt-6 w-full border-0 bg-slate-700 text-slate-100 hover:bg-slate-600">
                Start Free
              </Button>
            </div>

            <div className="relative flex flex-col rounded-2xl border border-emerald-500/50 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-sky-500/20 p-6 text-left shadow-[0_12px_48px_rgba(16,185,129,0.3)] backdrop-blur-sm ring-2 ring-emerald-500/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-1 text-xs font-semibold text-slate-900 shadow-lg shadow-emerald-500/40">
                Most Popular
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-900 shadow-lg shadow-emerald-500/40">
                <span className="text-lg">⚡</span>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-300">Pro</p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-50">
                $12.99
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / month
                </span>
              </h3>
              <p className="mt-1 text-sm text-slate-400">Billed annually</p>
              <p className="mt-1 text-sm text-emerald-400">
                100 Credits / Month
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-300">
                <li>HD quality output</li>
                <li>All aspect ratios</li>
                <li>Create projects</li>
                <li>Priority queue</li>
              </ul>
              <Button className="mt-6 w-full border-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 text-slate-900 shadow-lg shadow-emerald-500/30 hover:from-emerald-200 hover:via-cyan-200 hover:to-sky-200">
                Go Pro
              </Button>
            </div>

            <div className="flex flex-col rounded-2xl border border-slate-700/50 bg-slate-800/50 p-6 text-left shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30">
                <span className="text-lg">▣</span>
              </div>
              <p className="mt-6 text-sm font-semibold text-slate-400">
                Enterprise
              </p>
              <h3 className="mt-3 text-3xl font-semibold text-slate-100">
                $64.99
                <span className="text-sm font-medium text-slate-400">
                  {" "}
                  / month
                </span>
              </h3>
              <p className="mt-1 text-sm text-slate-400">Billed annually</p>
              <p className="mt-1 text-sm text-purple-400">
                500 Credits / Month
              </p>
              <ul className="mt-6 space-y-2 text-sm text-slate-400">
                <li>Quality selector (1K/2K/4K)</li>
                <li>Group chats & projects (5 users)</li>
                <li>Highest priority queue</li>
              </ul>
              <Button className="mt-6 w-full border-0 bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30 hover:from-purple-400 hover:to-indigo-500">
                Go Enterprise
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section
        id="faq"
        className="relative z-10 w-full bg-slate-950 px-6 pb-24 text-slate-100"
      >
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-400 ring-1 ring-emerald-500/30">
            FAQ
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Got{" "}
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent">
              Questions?
            </span>
          </h2>
        </div>

        <div className="mx-auto mt-10 w-full max-w-4xl space-y-4">
          {[
            "How do I get the best results?",
            "How does the credit system work?",
            "What aspect ratios are available?",
            "How do I contact support?",
          ].map((question, index) => (
            <div
              key={`${question}-${index}`}
              className="flex items-center justify-between rounded-2xl border border-slate-700/50 bg-slate-800/50 px-5 py-4 text-left shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-sm transition hover:border-emerald-500/50"
            >
              <span className="text-sm font-semibold text-slate-200">
                {question}
              </span>
              <span className="text-slate-400">⌄</span>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 w-full bg-slate-950 px-6 pb-20">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 via-cyan-500/20 to-sky-500/20 px-10 py-12 text-slate-100 shadow-[0_12px_48px_rgba(16,185,129,0.25)] backdrop-blur-sm md:flex-row">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300 ring-1 ring-emerald-500/30">
              AI Powered
            </div>
            <h3 className="mt-6 text-2xl font-bold sm:text-3xl">
              Create High-Quality Thumbnails in Seconds
            </h3>
          </div>
          <Button
            asChild
            size="lg"
            className="border-0 bg-gradient-to-r from-emerald-300 via-cyan-300 to-sky-300 text-slate-900 shadow-lg shadow-emerald-500/30 hover:from-emerald-200 hover:via-cyan-200 hover:to-sky-200"
          >
            <Link href="/generate">Start creating now →</Link>
          </Button>
        </div>
      </section>

      <footer className="relative z-10 w-full bg-slate-950 px-6 pb-14 pt-6 text-slate-400">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 border-t border-slate-800 pt-8 text-sm md:flex-row">
          <div className="flex items-center gap-3 font-semibold text-slate-200">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-300 via-cyan-300 to-sky-300 shadow-md shadow-emerald-500/30">
              <span className="text-slate-900">★</span>
            </span>
            RoThumbs
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="#" className="transition hover:text-slate-200">
              Privacy Policy
            </Link>
            <Link href="#" className="transition hover:text-slate-200">
              Terms of Use
            </Link>
            <Link href="#" className="transition hover:text-slate-200">
              Cookie Policy
            </Link>
            <Link href="/contact" className="transition hover:text-slate-200">
              Contact Us
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-slate-300">
              X
            </span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:bg-slate-700 hover:text-slate-300">
              ◎
            </span>
          </div>
        </div>
      </footer>

      {activeImage ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 p-6 backdrop-blur-xl"
          onClick={() => setActiveImage(null)}
        >
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setActiveImage(null)}
              className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-500/30 bg-slate-800/80 text-slate-200 backdrop-blur-sm transition hover:border-emerald-500/50 hover:bg-slate-700"
              aria-label="Close preview"
            >
              ✕
            </button>
            <div className="overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-800/50 shadow-[0_24px_60px_rgba(0,0,0,0.6)] backdrop-blur-sm">
              <Image
                src={activeImage}
                alt="Thumbnail preview"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
