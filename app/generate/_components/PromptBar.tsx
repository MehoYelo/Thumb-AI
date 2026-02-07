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
      className={`flex items-end gap-2 rounded-2xl border bg-white p-3 shadow-sm transition-colors ${isDragging ? "border-blue-500 bg-blue-50" : ""}`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileRef.current?.click()}
        className="shrink-0"
      >
        🖼️
      </Button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          setFile(f);
          onSubmit("", f); // 🔑 reference image yukarı çıkar
          setFile(undefined);
        }}
      />

      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your thumbnail..."
        className="min-h-[44px] resize-none border-0 shadow-none focus-visible:ring-0"
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

      <Button
        size="icon"
        className="shrink-0"
        onClick={() => {
          if (!prompt.trim()) return;
          onSubmit(prompt.trim());
          setPrompt("");
          setFile(undefined);
        }}
      >
        ↑
      </Button>
    </div>
  );
}
