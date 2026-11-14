"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import Galerija from "@/components/Galerija";

interface Props {
  images: string[];
  name: string;
}

export default function BikeGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);


  if (images.length === 0) {
    return (
      <div className="aspect-video rounded-xl border flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg2)", borderColor: "var(--line)" }}>
        <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--muted)" }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Slika uskoro</p>
      </div>
    );
  }

  return (
    <>
      {/* Main image */}
      <div className="relative aspect-video rounded-xl overflow-hidden border mb-3 group" style={{ background: "var(--bg2)", borderColor: "var(--line)" }}>
        {/* Klik na glavnu sliku otvara galeriju preko cijelog ekrana */}
        <button type="button" className="absolute inset-0 w-full h-full cursor-zoom-in" onClick={() => setLightbox(true)} aria-label="Povećaj sliku">
          <Image
            key={active}
            src={images[active]}
            alt={`${name} - slika ${active + 1}`}
            fill
            className="object-contain transition-opacity duration-200"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={active === 0}
          />
        </button>

        {/* Zoom button */}
        <button
          onClick={() => setLightbox(true)}
          className="absolute top-3 right-3 text-white p-2 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
          style={{ background: "rgba(0,0,0,.5)" }}
          title="Povećaj"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,.5)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white p-2 rounded-lg md:opacity-0 md:group-hover:opacity-100 transition-opacity"
              style={{ background: "rgba(0,0,0,.5)" }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs px-2 py-1 rounded-full pointer-events-none" style={{ background: "rgba(0,0,0,.5)" }}>
            {active + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative w-20 h-14 shrink-0 rounded-lg overflow-hidden border-2 transition-all"
              style={{
                borderColor: i === active ? "var(--green)" : "var(--line)",
                opacity: i === active ? 1 : 0.55,
              }}
            >
              <Image src={img} alt={`${name} thumbnail ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Galerija preko cijelog ekrana */}
      {lightbox && (
        <Galerija
          slike={images}
          naziv={name}
          aktivna={active}
          promijeniAktivnu={setActive}
          zatvori={() => setLightbox(false)}
        />
      )}
    </>
  );
}
