import Image from "next/image";

type Props = {
  text: string;
  image?: string;
  onImageClick?: () => void;
};

export function UserMessage({ text, image, onImageClick }: Props) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] space-y-2 text-right">
        <p className="rounded-xl bg-muted px-4 py-2 text-sm">{text}</p>

        {image && (
          <Image
            src={image}
            alt="Reference"
            width={200}
            height={200}
            className="ml-auto cursor-pointer rounded-lg border hover:opacity-80 transition-opacity"
            onClick={onImageClick}
          />
        )}
      </div>
    </div>
  );
}
