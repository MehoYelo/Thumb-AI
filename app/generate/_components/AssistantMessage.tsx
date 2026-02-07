import { Button } from "@/components/ui/button";

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
    <div className="flex gap-3">
      {/* AI icon */}
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white">
        🤖
      </div>

      {/* Message */}
      <div className="flex-1 space-y-3">
        <p className="text-sm text-muted-foreground">{text}</p>

        {image && (
          <div className="space-y-2">
            <img
              src={image}
              alt="Generated thumbnail"
              width={320}
              height={180}
              className="cursor-pointer rounded-xl border shadow-sm hover:opacity-80 transition-opacity"
              onClick={onImageClick}
            />
            {onDownload && (
              <Button variant="secondary" size="sm" onClick={onDownload}>
                Download
              </Button>
            )}
          </div>
        )}

        {spec && (
          <pre className="whitespace-pre-wrap rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
            {spec}
          </pre>
        )}
      </div>
    </div>
  );
}
