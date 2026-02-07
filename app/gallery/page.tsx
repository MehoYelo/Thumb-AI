"use client";

import { useState, useEffect } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Button } from "@/components/ui/button";

type Image = {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  created_at: string;
};

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to view your gallery");
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from("images")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setImages(data || []);
      }
    } catch (err) {
      setError("Failed to load images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId: string) => {
    try {
      const image = images.find((img) => img.id === imageId);
      if (!image) return;

      // Extract filename from URL
      const urlParts = image.image_url.split("/");
      const filename = urlParts.slice(-2).join("/");

      // Delete from storage
      await supabase.storage.from("thumbnails").remove([filename]);

      // Delete from database
      await supabase.from("images").delete().eq("id", imageId);

      setImages(images.filter((img) => img.id !== imageId));
    } catch (err) {
      console.error("Failed to delete image:", err);
      setError("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading your gallery...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 pt-16 pb-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold mb-2">Your Thumbnails</h1>
        <p className="text-muted-foreground mb-8">
          {images.length} thumbnail{images.length !== 1 ? "s" : ""}
        </p>

        {images.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">
              No thumbnails yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <div
                key={image.id}
                className="rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-muted overflow-hidden">
                  <img
                    src={image.image_url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium line-clamp-2">
                      {image.prompt}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(image.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        const a = document.createElement("a");
                        a.href = image.image_url;
                        a.download = `thumbnail-${image.id}.png`;
                        a.click();
                      }}
                    >
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteImage(image.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
