"use client";

import { useState } from "react";

export type AspectRatio = "3:2" | "1:1";

interface AspectRatioOption {
  value: AspectRatio;
  label: string;
  description: string;
  icon: string;
}

const ASPECT_RATIOS: AspectRatioOption[] = [
  {
    value: "3:2",
    label: "3:2 Landscape",
    description: "Wide format",
    icon: "",
  },
  {
    value: "1:1",
    label: "1:1 Square",
    description: "Perfect square",
    icon: "",
  },
];

interface AspectRatioSelectorProps {
  value: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

export function AspectRatioSelector({
  value,
  onChange,
}: AspectRatioSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const currentOption = ASPECT_RATIOS.find((r) => r.value === value);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-700/60 bg-slate-800/90 hover:bg-slate-700 hover:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ratio:
          </span>
          <span className="text-sm font-black text-slate-200">
            {currentOption?.value}
          </span>
        </div>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full right-0 mb-3 w-56 rounded-xl border-2 border-slate-700 bg-slate-800/98 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="px-3 py-2 border-b border-slate-700 mb-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Format
              </p>
            </div>
            <div className="space-y-1">
              {ASPECT_RATIOS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`group/item w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                    value === option.value
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-500/30"
                      : "hover:bg-slate-700 text-slate-300 hover:text-white"
                  }`}
                >
                  <div className="flex-1 text-left">
                    <div className="font-bold text-sm">{option.label}</div>
                    <div
                      className={`text-xs ${
                        value === option.value
                          ? "text-indigo-200"
                          : "text-slate-500"
                      }`}
                    >
                      {option.description}
                    </div>
                  </div>
                  {value === option.value && (
                    <svg
                      className="w-4 h-4 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
