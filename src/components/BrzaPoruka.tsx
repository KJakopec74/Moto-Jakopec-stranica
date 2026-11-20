"use client";

// =============================================================================
// BrzaPoruka — plutajući gumb dolje desno: WhatsApp, Viber ili poziv.
// Poruka se unaprijed popuni stranicom na kojoj je kupac (npr. "Zanima me Z 900").
// Broj i uključivanje: BRZE_PORUKE u src/lib/stranica.ts
// =============================================================================

import { useState } from "react";
import { BRZE_PORUKE } from "@/lib/stranica";

export default function BrzaPoruka() {
  const [otvoreno, postaviOtvoreno] = useState(false);
  if (!BRZE_PORUKE.whatsapp && !BRZE_PORUKE.viber) return null;

  // Tekst poruke: naslov trenutne stranice bez " | Moto Jakopec Samobor"
  function tekstPoruke() {
    const naslov = document.title.split("|")[0].trim();
    const naPocetnoj = window.location.pathname === "/";
    return naPocetnoj ? "Pozdrav, imam pitanje: " : `Pozdrav, zanima me: ${naslov} (${window.location.href})`;
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2 print:hidden">
      {otvoreno && (
        <div className="p-2 flex flex-col gap-1 shadow-xl border" style={{ borderRadius: 16, minWidth: 210, background: "#ffffff", borderColor: "var(--line)" }}>
          <p className="text-xs px-3 pt-1 pb-2" style={{ color: "var(--muted)" }}>
            Pišite nam — {BRZE_PORUKE.prikaz}
          </p>
          {BRZE_PORUKE.whatsapp && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.open(`https://wa.me/${BRZE_PORUKE.broj}?text=${encodeURIComponent(tekstPoruke())}`, "_blank");
              }}
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm hover:bg-black/5"
              style={{ color: "var(--text)" }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: "#25D366" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
                  <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.6.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z" />
                </svg>
              </span>
              WhatsApp
            </a>
          )}
          {BRZE_PORUKE.viber && (
            <a
              href={`viber://chat?number=%2B${BRZE_PORUKE.broj}`}
              className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm hover:bg-black/5"
              style={{ color: "var(--text)" }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: "#7360F2" }}>
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden>
                  <path d="M11.4 2C7.9 2 3 2.9 3 9.6v2.3c0 4.4 2.2 6.3 4.3 7v2.6c0 .5.6.7.9.4l2.2-2.4h1c3.5 0 8.6-.9 8.6-7.6V9.6C20 2.9 14.9 2 11.4 2zm4.2 12.6c-.4.5-1 .9-1.6.8a12.6 12.6 0 0 1-6.2-6.2c-.1-.6.3-1.2.8-1.6.3-.2.7-.2.9.1l1 1.4c.2.3.2.7-.1.9l-.4.3c.4 1.2 1.3 2.1 2.5 2.5l.3-.4c.2-.3.6-.3.9-.1l1.4 1c.3.2.4.6.1.9z" />
                </svg>
              </span>
              Viber
            </a>
          )}
          <a href={`tel:+${BRZE_PORUKE.broj}`}
            className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm hover:bg-black/5" style={{ color: "var(--text)" }}>
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ background: "var(--green)" }}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            Nazovi
          </a>
        </div>
      )}
      <button
        type="button"
        onClick={() => postaviOtvoreno(!otvoreno)}
        aria-label={otvoreno ? "Zatvori" : "Pošalji poruku (WhatsApp, Viber)"}
        className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
        style={{ background: "#25D366" }}
      >
        {otvoreno ? (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.4-4 8-9 8a9.9 9.9 0 01-4.3-1L3 20l1.4-3.7A7.4 7.4 0 013 12c0-4.4 4-8 9-8s9 3.6 9 8z" /></svg>
        )}
      </button>
    </div>
  );
}
