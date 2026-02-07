"use client";

import Image from "next/image";

type Props = {
  files: File[];
  onRemove: (index: number) => void;
};

export function ReferenceImage({ files, onRemove }: Props) {
  if (files.length === 0) return null;

  return (
    <div className="mb-3 flex gap-3 overflow-x-auto">
      {files.map((file, i) => {
        const url = URL.createObjectURL(file);
        return (
          <div key={i} className="relative shrink-0">
            <Image
              src={url}
              alt="Reference image"
              width={80}
              height={80}
              className="h-20 w-20 rounded-lg object-cover border"
            />
            <button
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black text-white text-xs"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
