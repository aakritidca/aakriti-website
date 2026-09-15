"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { UploadCloud, X, Star, GripVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedImage {
  id: string; // client-side temp id or db id
  url: string;
  altText: string;
  isCover: boolean;
}

interface PendingUpload {
  tempId: string;
  fileName: string;
  progress: "uploading" | "error";
}

export function ImageUploader({
  images,
  onChange,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      for (const file of fileArray) {
        const tempId = `pending-${Date.now()}-${Math.random()}`;
        setPending((p) => [...p, { tempId, fileName: file.name, progress: "uploading" }]);

        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.error || "Upload failed");
          }

          onChange([
            ...images,
            {
              id: `new-${Date.now()}-${Math.random()}`,
              url: data.url,
              altText: "",
              isCover: images.length === 0,
            },
          ]);
          setPending((p) => p.filter((item) => item.tempId !== tempId));
        } catch (err) {
          setPending((p) =>
            p.map((item) =>
              item.tempId === tempId ? { ...item, progress: "error" } : item
            )
          );
          toast.error(err instanceof Error ? err.message : "Upload failed");
        }
      }
    },
    [images, onChange]
  );

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files);
  }

  function removeImage(id: string) {
    const wasCover = images.find((img) => img.id === id)?.isCover;
    const remaining = images.filter((img) => img.id !== id);
    if (wasCover && remaining.length > 0) remaining[0].isCover = true;
    onChange(remaining);
  }

  function setCover(id: string) {
    onChange(images.map((img) => ({ ...img, isCover: img.id === id })));
  }

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragOverItem(e: React.DragEvent, index: number) {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...images];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragIndex.current = index;
    onChange(reordered);
  }

  function handleDragEnd() {
    dragIndex.current = null;
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed p-10 md:p-14 text-center cursor-pointer transition-colors",
          dragOver ? "border-teal-600 bg-teal-600/5" : "border-stone-300 bg-white hover:border-stone-400"
        )}
      >
        <UploadCloud className="mx-auto mb-3 text-stone-400" size={28} />
        <p className="text-[14.5px] text-stone-700 font-medium mb-1">
          Drag &amp; drop gallery images here
        </p>
        <p className="text-[13px] text-stone-500">
          PNG, JPG, WEBP up to 10MB — or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
      </div>

      {(images.length > 0 || pending.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-5">
          {images.map((img, index) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              className="relative group border border-line bg-white cursor-move"
            >
              <div className="relative h-24 bg-stone-100">
                <Image src={img.url} alt={img.altText || "Gallery image"} fill className="object-cover" />
              </div>
              {img.isCover && (
                <div className="absolute top-1.5 left-1.5 bg-teal-700 text-white text-[9px] font-medium px-1.5 py-0.5 flex items-center gap-1">
                  <Star size={9} fill="white" /> COVER
                </div>
              )}
              <div className="absolute top-1.5 right-1.5 flex gap-1">
                <button
                  type="button"
                  onClick={() => removeImage(img.id)}
                  className="w-5 h-5 bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <X size={11} />
                </button>
              </div>
              <div className="flex items-center justify-between px-1.5 py-1 bg-stone-50 border-t border-line">
                {!img.isCover ? (
                  <button
                    type="button"
                    onClick={() => setCover(img.id)}
                    className="text-[10px] text-stone-500 hover:text-teal-700"
                  >
                    Set as cover
                  </button>
                ) : (
                  <span className="text-[10px] text-transparent">.</span>
                )}
                <GripVertical size={12} className="text-stone-400" />
              </div>
            </div>
          ))}
          {pending.map((item) => (
            <div key={item.tempId} className="relative border border-line bg-stone-50 h-24 flex flex-col items-center justify-center gap-1.5">
              {item.progress === "uploading" ? (
                <Loader2 size={18} className="animate-spin text-stone-400" />
              ) : (
                <X size={18} className="text-error" />
              )}
              <span className="text-[10px] text-stone-500 px-2 truncate max-w-full">
                {item.progress === "uploading" ? "Uploading…" : "Failed"}
              </span>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && pending.length === 0 && (
        <p className="text-[13px] text-stone-500 mt-3">
          No images yet. Add at least one photo so this project has a cover image on the website.
        </p>
      )}
    </div>
  );
}
