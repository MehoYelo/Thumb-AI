"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { PromptBar } from "./_components/PromptBar";
import { UserMessage } from "./_components/UserMessage";
import { AssistantMessage } from "./_components/AssistantMessage";
import { ReferenceImage } from "./_components/ReferenceImage";
import {
  AspectRatioSelector,
  type AspectRatio,
} from "@/app/generate/_components/AspectRatioSelector";
import { createClient } from "@/lib/supabase/client";

type Message =
  | { id: string; role: "user"; text: string; refImages?: string[] }
  | {
      id: string;
      role: "assistant";
      text: string;
      image?: string;
      spec?: string;
      loading?: boolean;
    };

export default function GeneratePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [referenceImages, setReferenceImages] = useState<File[]>([]);
  const [referenceImageUrls, setReferenceImageUrls] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("3:2");
  const [isAdmin, setIsAdmin] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data } = await supabase.from("profiles").select("role").single();

      if (data?.role === "admin") {
        setIsAdmin(true);
      }
    };
    checkAdmin();
  }, [supabase]);

  const handleSubmit = async (prompt: string, file?: File) => {
    // ref ekleme
    if (file) {
      setReferenceImages((prev) => [...prev, file]);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImageUrls((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
      return;
    }

    const userId = crypto.randomUUID();
    const aiId = crypto.randomUUID();

    // Store current reference images before clearing
    const currentRefImages = [...referenceImageUrls];

    // Clear references immediately when sending
    setReferenceImages([]);
    setReferenceImageUrls([]);

    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text: prompt, refImages: currentRefImages },
      {
        id: aiId,
        role: "assistant",
        text: "Compiling your idea… 🧠",
        loading: true,
      },
    ]);

    /* ---------- 1️⃣ COMPILE + GENERATE ---------- */
    const compileForm = new FormData();
    compileForm.append("prompt", prompt);
    compileForm.append("aspectRatio", aspectRatio);
    referenceImages.forEach((img) => {
      compileForm.append("image", img);
    });

    const compileRes = await fetch("/api/compile", {
      method: "POST",
      body: compileForm,
    });

    const { spec, imageUrl } = await compileRes.json();

    setMessages((m) =>
      m.map((msg) =>
        msg.id === aiId
          ? {
              id: aiId,
              role: "assistant",
              text: "Here's your thumbnail! 🎨",
              image: imageUrl,
              spec, // DEBUG
            }
          : msg,
      ),
    );
  };

  return (
    <main className="relative flex min-h-screen flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sophisticated grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e540_1px,transparent_1px),linear-gradient(to_bottom,#4f46e540_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]" />

      {/* Ambient glow effects */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDuration: "6s", animationDelay: "2s" }}
      />

      <div className="relative px-4 sm:px-6 pt-16 pb-32">
        {/* Elevated Hero */}
        {messages.length === 0 && (
          <div className="mt-20 mb-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/40 mb-10 animate-in zoom-in duration-700 ring-8 ring-indigo-500/20 backdrop-blur">
              <Image
                src="/assets/bloxious-logo.png"
                alt="Bloxious AI"
                width={48}
                height={48}
                className="w-12 h-12 drop-shadow-2xl"
              />
            </div>
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-indigo-200 to-blue-200 bg-clip-text text-transparent mb-6 leading-tight tracking-tight">
              Create Stunning
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text">
                Thumbnails
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-medium">
              Describe your vision and watch AI transform it into a
              <br />
              professional Roblox thumbnail in seconds
            </p>
            <div className="mt-10 inline-flex items-center gap-8 text-sm">
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-700">
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse shadow-lg shadow-green-500/50" />
                <span className="font-semibold text-slate-200">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-700">
                <span className="text-lg">⚡</span>
                <span className="font-semibold text-slate-200">Instant</span>
              </div>
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-800/80 backdrop-blur-sm shadow-lg border border-slate-700">
                <span className="text-lg">✨</span>
                <span className="font-semibold text-slate-200">
                  Pro Quality
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Refined Messages Container */}
        <div className="mx-auto w-full max-w-5xl">
          <div className="space-y-12">
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                {msg.role === "user" ? (
                  <UserMessage
                    text={msg.text}
                    refImages={msg.refImages}
                    onImageClick={(img) => setLightboxImage(img)}
                  />
                ) : (
                  <AssistantMessage
                    text={msg.text}
                    image={msg.image}
                    spec={devMode && isAdmin ? msg.spec : undefined}
                    onImageClick={() =>
                      msg.image && setLightboxImage(msg.image)
                    }
                    onDownload={
                      msg.image
                        ? () => {
                            const a = document.createElement("a");
                            a.href = msg.image || "";
                            a.download = "thumbnail.png";
                            a.click();
                          }
                        : undefined
                    }
                  />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>
      </div>

      {/* Premium Gradient Fade */}
      <div className="pointer-events-none fixed bottom-0 left-65 right-0 z-40 h-32 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent" />

      {/* Premium Fixed PromptBar Container */}
      <div className="fixed bottom-0 left-65 right-0 z-50 border-t border-slate-700/50 bg-slate-900/95 backdrop-blur-2xl shadow-[0_-8px_32px_rgba(0,0,0,0.4)]">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-3">
          {/* Elevated Controls Row */}
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3 flex-1">
              <ReferenceImage
                files={referenceImages}
                onRemove={(i) => {
                  setReferenceImages((imgs) =>
                    imgs.filter((_, idx) => idx !== i),
                  );
                  setReferenceImageUrls((urls) =>
                    urls.filter((_, idx) => idx !== i),
                  );
                }}
              />
              {isAdmin && (
                <button
                  onClick={() => setDevMode(!devMode)}
                  className={`group relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    devMode
                      ? "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/40 scale-105"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:scale-105 border border-slate-700 shadow-lg"
                  }`}
                  title="Toggle developer mode"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="uppercase tracking-wider">Dev</span>
                  </span>
                </button>
              )}
            </div>
            <AspectRatioSelector
              value={aspectRatio}
              onChange={setAspectRatio}
            />
          </div>

          {/* Enhanced Prompt Bar */}
          <PromptBar onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Premium Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-8 right-8 w-14 h-14 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-lg border-2 border-white/30 flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:rotate-90 active:scale-95 group"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 transition-transform group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="relative max-w-[95vw] max-h-[95vh] animate-in zoom-in-95 duration-500">
            <img
              src={lightboxImage}
              alt="Fullscreen view"
              className="max-h-[95vh] max-w-[95vw] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] ring-4 ring-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </main>
  );
}
