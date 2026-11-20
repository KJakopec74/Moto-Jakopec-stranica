"use client";

// =============================================================================
// YouTubeVideo — video s YouTubea koji se učitava tek na klik.
// Do klika se prikazuje samo slika videa (stranica ostaje brza, a YouTube se
// ne učitava ako ga posjetitelj ne pokrene). Nakon klika: youtube-nocookie.com.
// Prima bilo koji oblik linka: youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID
// =============================================================================

import { useState } from "react";

export function youtubeId(link: string): string | null {
  const m = link.match(/(?:youtu\.be\/|v=|\/shorts\/|\/embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(link.trim()) ? link.trim() : null;
}

// samPokreni: video kreće sam, bez zvuka (preglednici drugačije ne dopuštaju), i vrti se u krug.
// Bez toga: kreće na klik, sa zvukom, i također se ponavlja.
export default function YouTubeVideo({ link, naslov, samPokreni = false }: { link: string; naslov: string; samPokreni?: boolean }) {
  const [pokrenut, postaviPokrenut] = useState(samPokreni);
  const id = youtubeId(link);
  if (!id) return null;

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden border" style={{ background: "#000", borderColor: "var(--line)" }}>
      {pokrenut ? (
        <iframe
          className="absolute inset-0 w-full h-full"
          // loop=1 + playlist=ID = ponavljanje u krug; mute=1 je nužan za samostalno pokretanje
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&rel=0&playsinline=1${samPokreni ? "&mute=1" : ""}`}
          title={naslov}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => postaviPokrenut(true)} className="absolute inset-0 w-full h-full group" aria-label={`Pokreni video: ${naslov}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt={naslov} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" loading="lazy" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-xl transition-transform group-hover:scale-110"
              style={{ background: "var(--green)" }}>
              <svg viewBox="0 0 24 24" className="w-8 h-8 sm:w-10 sm:h-10 ml-1" fill="white"><path d="M8 5v14l11-7z" /></svg>
            </span>
          </span>
          <span className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded" style={{ background: "rgba(0,0,0,.6)", color: "white" }}>
            ▶ Video · YouTube
          </span>
        </button>
      )}
    </div>
  );
}
