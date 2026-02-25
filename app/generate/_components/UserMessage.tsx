import Image from "next/image";

type Props = {
  text: string;
  refImages?: string[];
  onImageClick?: (img: string) => void;
};

export function UserMessage({ text, refImages, onImageClick }: Props) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] space-y-4">
        {refImages && refImages.length > 0 && (
          <div className="flex flex-wrap justify-end gap-3">
            {refImages.map((img, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-2xl border-[3px] border-slate-200/60 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer bg-white"
                onClick={() => onImageClick && onImageClick(img)}
              >
                <Image
                  src={img}
                  alt="Reference"
                  width={200}
                  height={200}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-3 right-3 w-10 h-10 rounded-xl bg-white/95 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100 shadow-xl border-2 border-white/50">
                  <svg
                    className="w-5 h-5 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="inline-block rounded-[1.75rem] bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 px-7 py-5 shadow-2xl shadow-indigo-500/40 text-white ring-4 ring-white/20 backdrop-blur">
          <p className="text-base leading-relaxed whitespace-pre-wrap font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
