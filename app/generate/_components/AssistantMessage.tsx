import Image from "next/image";

type AssistantMessageProps = {
  text: string;
  image?: string;
  spec?: string;
  onImageClick?: () => void;
  onDownload?: () => void;
};

export function AssistantMessage({
  text,
  image,
  spec,
  onImageClick,
  onDownload,
}: AssistantMessageProps) {
  return (
    <div className="flex gap-5 items-start">
      {/* Premium AI Avatar */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 shadow-2xl shadow-indigo-500/40 ring-[6px] ring-white/80 backdrop-blur">
        <Image
          src="/assets/bloxious-logo.png"
          alt="Bloxious AI"
          width={28}
          height={28}
          className="h-7 w-7 drop-shadow-2xl"
        />
      </div>

      {/* Refined Message Content */}
      <div className="flex-1 space-y-5 min-w-0">
        <p className="text-base text-slate-700 leading-relaxed font-medium">
          {text}
        </p>

        {image && (
          <div className="space-y-4">
            <div
              className="group relative overflow-hidden rounded-3xl border-[3px] border-slate-200/80 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all duration-500 cursor-pointer bg-white max-w-[580px]"
              onClick={onImageClick}
            >
              <img
                src={image}
                alt="Generated thumbnail"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="rounded-full bg-white/90 backdrop-blur-sm px-6 py-3 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                    <span className="text-sm">View Full Size</span>
                  </div>
                </div>
              </div>
            </div>

            {onDownload && (
              <button
                onClick={onDownload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-slate-100 to-slate-50 hover:from-slate-200 hover:to-slate-100 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 text-sm font-medium text-slate-700 hover:scale-105 active:scale-95"
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
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download Image
              </button>
            )}
          </div>
        )}

        {spec && (
          <div className="rounded-3xl border-[3px] border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 p-5 shadow-xl">
            <div className="flex items-center gap-3 mb-4 text-amber-900">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <span className="text-sm font-black uppercase tracking-wider">
                Compiled Prompt
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-amber-900/90 leading-relaxed font-mono bg-white/50 p-4 rounded-xl border-2 border-amber-200/50">
              {spec}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
