"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Image = {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  created_at: string;
};

const ITEMS_PER_PAGE = 12;

export default function GalleryPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const fetchImagesPage = useCallback(
    async (pageNum: number) => {
      try {
        if (pageNum === 0) setLoading(true);
        else setLoadingMore(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Please log in to view your gallery");
          setLoading(false);
          return;
        }

        const {
          data,
          error: fetchError,
          count,
        } = await supabase
          .from("images")
          .select("*", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

        if (fetchError) {
          setError(fetchError.message);
        } else {
          if (pageNum === 0) {
            setImages(data || []);
            setTotalCount(count || 0);
          } else {
            setImages((prev) => [...prev, ...(data || [])]);
          }
          setHasMore((data?.length || 0) === ITEMS_PER_PAGE);
        }
      } catch (err) {
        setError("Failed to load images");
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [supabase],
  );

  useEffect(() => {
    fetchImagesPage(0);
  }, [fetchImagesPage]);

  const loadingMoreRef = useRef(loadingMore);
  const hasMoreRef = useRef(hasMore);
  const pageRef = useRef(page);

  useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0, rootMargin: "400px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadingMore, hasMore]);

  useEffect(() => {
    if (page > 0) {
      fetchImagesPage(page);
    }
  }, [page, fetchImagesPage]);

  const downloadImage = async (image: Image) => {
    try {
      setDownloadError(null);
      const response = await fetch(image.image_url);
      if (!response.ok) {
        throw new Error("Failed to download image");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `thumbnail-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setDownloadError("Download failed. Please try again.");
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

  if (loading && images.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#071b3a] via-[#163c82] to-[#5a7fd0] flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
        <p className="relative z-10 text-white/70">Loading your gallery...</p>
      </main>
    );
  }

  if (error && images.length === 0) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#071b3a] via-[#163c82] to-[#5a7fd0] flex items-center justify-center">
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:56px_56px]" />
        </div>
        <p className="relative z-10 text-red-400">{error}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#071b3a] via-[#163c82] to-[#5a7fd0] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>
      <div className="pointer-events-none absolute left-[-10%] top-[-20%] h-[420px] w-[420px] rounded-full bg-cyan-300/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-18%] right-[-8%] h-[520px] w-[520px] rounded-full bg-indigo-200/20 blur-[140px]" />

      <div className="relative z-10 mx-auto px-6 pt-16 pb-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-white">
                Your Thumbnails
              </h1>
              <p className="text-white/70">
                {totalCount} thumbnail{totalCount !== 1 ? "s" : ""}
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-white/30 bg-white/5 text-white hover:bg-white/15"
            >
              <Link href="/generate">Back to Generate</Link>
            </Button>
          </div>
          {downloadError && (
            <p className="mb-6 text-sm text-red-500">{downloadError}</p>
          )}

          {images.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/70 mb-4">
                No thumbnails yet. Create your first one!
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="rounded-2xl border border-white/15 bg-white/5 overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 backdrop-blur"
                  >
                    <div className="relative aspect-video bg-slate-800/50 overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-4 space-y-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium line-clamp-2 text-white">
                          {image.prompt}
                        </p>
                        <p className="text-xs text-white/60">
                          {new Date(image.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
                          onClick={() => downloadImage(image)}
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30"
                          variant="outline"
                          onClick={() => deleteImage(image.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              <div ref={observerTarget} className="mt-8 text-center">
                {loadingMore && (
                  <p className="text-white/70">Loading more...</p>
                )}
                {!hasMore && images.length > 0 && (
                  <p className="text-white/70 text-sm">
                    No more thumbnails to load
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
