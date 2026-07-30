"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/images";

/**
 * Hotel photo grid with a lightbox. Images are admin-ordered; the first is
 * given priority since it is usually above the fold on the detail page.
 */
export function HotelGallery({
  images,
  title,
  alt,
}: {
  images: string[];
  title: string;
  alt: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  if (images.length === 0) return null;

  const close = () => setOpen(null);
  const step = (delta: number) =>
    setOpen((i) => (i === null ? null : (i + delta + images.length) % images.length));

  return (
    <>
      <h2 className="mt-12 text-2xl">{title}</h2>
      <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.map((src, i) => (
          <li key={`${src}-${i}`}>
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`${alt} — photo ${i + 1}`}
              className="group relative block aspect-4/3 w-full overflow-hidden rounded-xl bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 640px) 30vw, 45vw"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                priority={i === 0}
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          tabIndex={-1}
          onClick={close}
          onKeyDown={(e) => {
            if (e.key === "Escape") close();
            if (e.key === "ArrowRight") step(1);
            if (e.key === "ArrowLeft") step(-1);
          }}
          ref={(node) => node?.focus()}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute end-4 top-4 rounded-full bg-canvas/10 p-2 text-canvas hover:bg-canvas/20"
          >
            <X className="size-5" />
          </button>
          <div
            className="relative h-[80vh] w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[open]}
              alt={`${alt} — ${open + 1} / ${images.length}`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          <span className="absolute bottom-6 text-sm text-canvas/70">
            {open + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
