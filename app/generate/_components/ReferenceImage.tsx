"use client";

import Image from "next/image";

type Props = {
  files: File[];
  onRemove: (index: number) => void;
};

export function ReferenceImage({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="flex gap-3 overflow-x-auto max-w-full">
      {files.map((file, i) => {
        const url = URL.createObjectURL(file);
        return (
          <div
            key={i}
            className="group relative shrink-0 animate-in fade-in zoom-in-95 duration-500"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative overflow-hidden rounded-2xl border-[3px] border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Image
                src={url}
                alt="Reference image"
                width={96}
                height={96}
                className="h-24 w-24 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-2.5 -right-2.5 w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 via-rose-500 to-red-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300 flex items-center justify-center font-bold text-sm border-[3px] border-white ring-2 ring-red-200/50 hover:rotate-90"
              aria-label="Remove image"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3.5}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        );
      })}
    </div>
  );
}
