"use client";

// =============================================================================
// Galerija — prikaz slika preko cijelog ekrana (lightbox)
// -----------------------------------------------------------------------------
// Koriste je kartice proizvoda (oprema, dijelovi) i stranica motocikla.
// Upravljanje:
//   - strelice na ekranu ili tipke ← → na tipkovnici
//   - prelazak prstom lijevo/desno na mobitelu
//   - zatvaranje: X, tipka Esc ili klik na tamnu pozadinu
// =============================================================================

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";

interface Props {
  slike: string[];            // putanje slika
  naziv: string;              // naziv proizvoda (za opis slike)
  aktivna: number;            // indeks trenutno prikazane slike
  promijeniAktivnu: (indeks: number) => void;
  zatvori: () => void;
}

// Najmanji pomak prsta (u pikselima) koji se računa kao prelazak na drugu sliku
const PRAG_POMAKA = 50;

export default function Galerija({ slike, naziv, aktivna, promijeniAktivnu, zatvori }: Props) {
  const brojSlika = slike.length;
  const pocetakDodira = useRef<number | null>(null);

  // Prethodna / sljedeća slika (kružno — nakon zadnje dolazi prva)
  function prethodna() {
    promijeniAktivnu((aktivna - 1 + brojSlika) % brojSlika);
  }
  function sljedeca() {
    promijeniAktivnu((aktivna + 1) % brojSlika);
  }

  // Tipkovnica: ← → i Esc; dok je galerija otvorena, stranica iza se ne pomiče
  useEffect(() => {
    function naTipku(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prethodna();
      if (e.key === "ArrowRight") sljedeca();
      if (e.key === "Escape") zatvori();
    }
    window.addEventListener("keydown", naTipku);
    const staroPomicanje = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", naTipku);
      document.body.style.overflow = staroPomicanje;
    };
  });

  // Prelazak prstom (swipe)
  function dodirPocetak(e: React.TouchEvent) {
    pocetakDodira.current = e.touches[0].clientX;
  }
  function dodirKraj(e: React.TouchEvent) {
    if (pocetakDodira.current === null || brojSlika < 2) return;
    const pomak = e.changedTouches[0].clientX - pocetakDodira.current;
    if (pomak > PRAG_POMAKA) prethodna();
    if (pomak < -PRAG_POMAKA) sljedeca();
    pocetakDodira.current = null;
  }

  if (brojSlika === 0) return null;

  // Galerija se iscrtava izravno u <body> (portal), a ne unutar kartice:
  // kartica ima animaciju (transform) koja bi galeriju "zarobila" unutar sebe.
  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,.95)" }}
      onClick={zatvori}
      onTouchStart={dodirPocetak}
      onTouchEnd={dodirKraj}
      role="dialog"
      aria-label={`Galerija: ${naziv}`}
    >
      {/* Zatvori */}
      <button
        className="absolute top-4 right-4 text-white p-2 rounded-lg z-10"
        style={{ background: "rgba(255,255,255,.12)" }}
        onClick={zatvori}
        aria-label="Zatvori galeriju"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Strelice (samo ako ima više slika) */}
      {brojSlika > 1 && (
        <>
          <button
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg z-10"
            style={{ background: "rgba(255,255,255,.12)" }}
            onClick={(e) => { e.stopPropagation(); prethodna(); }}
            aria-label="Prethodna slika"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white p-3 rounded-lg z-10"
            style={{ background: "rgba(255,255,255,.12)" }}
            onClick={(e) => { e.stopPropagation(); sljedeca(); }}
            aria-label="Sljedeća slika"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Slika */}
      <div className="relative w-full h-[70vh] sm:h-[75vh] max-w-5xl mx-1 sm:mx-20" onClick={(e) => e.stopPropagation()}>
        <Image
          key={aktivna}
          src={slike[aktivna]}
          alt={`${naziv} — slika ${aktivna + 1}`}
          fill
          className="object-contain"
          sizes="100vw"
        />
      </div>

      {/* Sličice za brzi odabir + brojač */}
      <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2" onClick={(e) => e.stopPropagation()}>
        {brojSlika > 1 && (
          <div className="flex gap-2 overflow-x-auto max-w-full px-4">
            {slike.map((slika, i) => (
              <button
                key={slika}
                onClick={() => promijeniAktivnu(i)}
                className="relative w-14 h-10 shrink-0 rounded overflow-hidden border-2"
                style={{ borderColor: i === aktivna ? "var(--green)" : "transparent", opacity: i === aktivna ? 1 : 0.5 }}
                aria-label={`Slika ${i + 1}`}
              >
                <Image src={slika} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
        <span className="text-sm" style={{ color: "rgba(255,255,255,.6)" }}>
          {aktivna + 1} / {brojSlika}
        </span>
      </div>
    </div>,
    document.body
  );
}
