"use client";

import { useState, useRef, useEffect } from "react";
import { PromptBar } from "./_components/PromptBar";
import { UserMessage } from "./_components/UserMessage";
import { AssistantMessage } from "./_components/AssistantMessage";
import { ReferenceImage } from "./_components/ReferenceImage";

type Message =
  | { id: string; role: "user"; text: string }
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
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (prompt: string, file?: File) => {
    // ref ekleme
    if (file) {
      setReferenceImages((prev) => [...prev, file]);
      return;
    }

    const userId = crypto.randomUUID();
    const aiId = crypto.randomUUID();

    setMessages((m) => [
      ...m,
      { id: userId, role: "user", text: prompt },
      {
        id: aiId,
        role: "assistant",
        text: "Compiling your idea… 🧠",
        loading: true,
      },
    ]);

    /* ---------- 1️⃣ COMPILE ---------- */
    const compileForm = new FormData();
    compileForm.append("prompt", prompt);
    referenceImages.forEach((img) => {
      compileForm.append("image", img);
    });

    const compileRes = await fetch("/api/compile", {
      method: "POST",
      body: compileForm,
    });

    const { spec } = await compileRes.json();

    /* ---------- 2️⃣ GENERATE ---------- */
    setMessages((m) =>
      m.map((msg) =>
        msg.id === aiId ? { ...msg, text: "Generating thumbnail… 🎨" } : msg,
      ),
    );

    const generateForm = new FormData();
    generateForm.append("spec", spec);
    referenceImages.forEach((img) => {
      generateForm.append("images", img);
    });

    const genRes = await fetch("/api/generate", {
      method: "POST",
      body: generateForm,
    });

    const data = await genRes.json();

    setMessages((m) =>
      m.map((msg) =>
        msg.id === aiId
          ? {
              id: aiId,
              role: "assistant",
              text: "Here's your thumbnail! 🎨",
              image: data.imageUrl,
              spec, // DEBUG
            }
          : msg,
      ),
    );

    setReferenceImages([]);
  };

  return (
    <main className="flex min-h-screen flex-col px-6 pt-16 pb-32">
      {/* Hero */}
      {messages.length === 0 && (
        <div className="mt-32 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-xl bg-blue-500" />
          <h1 className="text-4xl font-bold">
            What thumbnail will you create today?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Describe your vision or upload reference images
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {messages.map((msg) =>
          msg.role === "user" ? (
            <UserMessage key={msg.id} text={msg.text} />
          ) : (
            <AssistantMessage
              key={msg.id}
              text={msg.text}
              image={msg.image}
              spec={msg.spec}
              onImageClick={() => msg.image && setLightboxImage(msg.image)}
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
          ),
        )}

        <div ref={bottomRef} />
      </div>

      {/* Fixed PromptBar */}
      <div className="fixed bottom-0 left-65 right-0 border-t bg-white/80 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl p-4">
          <ReferenceImage
            files={referenceImages}
            onRemove={(i) =>
              setReferenceImages((imgs) => imgs.filter((_, idx) => idx !== i))
            }
          />
          <PromptBar onSubmit={handleSubmit} />
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setLightboxImage(null)}
        >
          <img
            src={lightboxImage}
            alt="Fullscreen view"
            className="max-h-[90vh] max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}
