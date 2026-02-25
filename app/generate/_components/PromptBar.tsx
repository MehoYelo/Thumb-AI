"use client";
import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function PromptBar({
  onSubmit,
}: {
  onSubmit: (p: string, f?: File) => void;
}) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState<File>();
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    const imageFile = Array.from(files).find((f) =>
      f.type.startsWith("image/"),
    );

    if (imageFile) {
      setFile(imageFile as File);
      onSubmit("", imageFile as File);
      setFile(undefined);
    }
  };

  return (
    <div
      className={`group relative flex items-end gap-3 rounded-xl border-2 bg-slate-800/90 p-3 shadow-xl transition-all duration-300 ${
        isDragging
          ? "border-indigo-500 bg-gradient-to-br from-indigo-900/50 to-blue-900/50 shadow-[0_10px_30px_rgba(99,102,241,0.3)] scale-[1.01] ring-2 ring-indigo-500/30"
          : "border-slate-700/60 hover:border-slate-600 hover:shadow-2xl"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 backdrop-blur-sm z-10">
          <div className="text-center px-6 py-4 rounded-xl bg-slate-800/90 backdrop-blur-sm shadow-xl border-2 border-indigo-500">
            <svg
              className="w-12 h-12 mx-auto mb-2 text-indigo-400 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm font-bold text-indigo-300">
              Drop your image here
            </p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, or WebP</p>
          </div>
        </div>
      )}

      <button
        onClick={() => fileRef.current?.click()}
        className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-700 hover:bg-indigo-600 border border-slate-600 hover:border-indigo-500 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
        aria-label="Upload image"
      >
        <svg
          className="w-5 h-5 text-slate-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          onSubmit("", f);
          setFile(undefined);
        }}
      />

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your thumbnail vision..."
        className="min-h-[44px] max-h-[150px] resize-none border-0 bg-transparent px-2 text-base placeholder:text-slate-500 text-slate-100 focus-visible:ring-0 focus-visible:outline-none leading-relaxed"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!prompt.trim()) return;
            onSubmit(prompt.trim());
            setPrompt("");
            setFile(undefined);
          }
        }}
      />

      <button
        onClick={() => {
          if (!prompt.trim()) return;
          onSubmit(prompt.trim());
          setPrompt("");
          setFile(undefined);
        }}
        disabled={!prompt.trim()}
        className="shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-800 text-white shadow-lg shadow-indigo-500/30 disabled:shadow-none transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        aria-label="Send"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
