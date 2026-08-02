"use client";

import { useRef, useState } from "react";
import { createUploadUrls } from "@/lib/admin-actions";

export interface UploadedImage {
  path: string;
  thumb_path: string;
  previewUrl: string; // local object URL for instant display
}

async function compressTo(
  file: File,
  maxWidth: number,
  quality: number
): Promise<Blob> {
  const { default: imageCompression } = await import("browser-image-compression");
  return imageCompression(file, {
    maxWidthOrHeight: maxWidth,
    initialQuality: quality,
    fileType: "image/webp",
    useWebWorker: true,
  });
}

function storagePublicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/product-images/${path}`;
}

/**
 * Camera/gallery photo picker: compresses on the phone (WebP 1600w master +
 * 400w thumb), uploads via signed URLs, shows instant previews. First photo
 * is the cover.
 */
export function PhotoUploader({
  images,
  onChange,
  demo,
}: {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  demo: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);

    if (demo) {
      // Preview-only: show the photo locally so the flow can be felt.
      const added = [...files].map((f) => {
        const url = URL.createObjectURL(f);
        return { path: "", thumb_path: "", previewUrl: url };
      });
      onChange([...images, ...added]);
      return;
    }

    setBusy(true);
    try {
      for (const file of [...files]) {
        const [master, thumb] = await Promise.all([
          compressTo(file, 1600, 0.8),
          compressTo(file, 400, 0.75),
        ]);
        const urls = await createUploadUrls();
        if (!urls.ok) throw new Error(urls.error);

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const [up1, up2] = await Promise.all([
          supabase.storage
            .from("product-images")
            .uploadToSignedUrl(urls.master.path, urls.master.token, master, {
              contentType: "image/webp",
            }),
          supabase.storage
            .from("product-images")
            .uploadToSignedUrl(urls.thumb.path, urls.thumb.token, thumb, {
              contentType: "image/webp",
            }),
        ]);
        if (up1.error || up2.error) throw new Error("Upload failed");

        onChange([
          ...images,
          {
            path: urls.master.path,
            thumb_path: urls.thumb.path,
            previewUrl: storagePublicUrl(urls.thumb.path),
          },
        ]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed — try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={img.previewUrl}
              alt=""
              className="h-24 w-24 rounded-xl object-cover shadow-warm"
            />
            {i === 0 && (
              <span className="absolute left-1 top-1 rounded bg-cocoa/80 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-cream">
                Cover
              </span>
            )}
            <button
              type="button"
              onClick={() => onChange(images.filter((_, j) => j !== i))}
              aria-label="Remove photo"
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-berry text-xs font-bold text-white shadow"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-cocoa/25 text-cocoa-light transition-colors hover:border-caramel hover:text-caramel disabled:opacity-50"
        >
          <span className="text-2xl leading-none">+</span>
          <span className="text-[0.65rem] font-semibold">
            {busy ? "Uploading…" : "Add photo"}
          </span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && (
        <p className="mt-2 text-xs font-medium text-berry">{error}</p>
      )}
    </div>
  );
}
