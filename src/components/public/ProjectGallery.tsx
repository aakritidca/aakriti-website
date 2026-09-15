"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export interface GalleryImage {
  id: string;
  imageUrl: string;
  altText: string;
}

export function ProjectGallery({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const next = useCallback(
    () => setOpenIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setOpenIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (openIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, close, next, prev]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpenIndex(i)}
            className={`relative overflow-hidden bg-stone-100 cursor-zoom-in h-[220px] ${
              i === 0 ? "col-span-2 row-span-2 h-full min-h-[456px]" : ""
            }`}
          >
            <Image
              src={img.imageUrl}
              alt={img.altText || "Project photo"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
        >
          <button
            onClick={close}
            aria-label="Close gallery"
            className="absolute top-6 right-6 text-white/80 hover:text-white z-10"
          >
            <X size={28} />
          </button>
          <button
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 md:left-8 text-white/70 hover:text-white z-10"
          >
            <ChevronLeft size={36} />
          </button>
          <div className="relative w-[90vw] h-[80vh]">
            <Image
              src={images[openIndex].imageUrl}
              alt={images[openIndex].altText || "Project photo"}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
          </div>
          <button
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 md:right-8 text-white/70 hover:text-white z-10"
          >
            <ChevronRight size={36} />
          </button>
          <div className="absolute bottom-6 text-white/60 text-sm">
            {openIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
