"use client";

// Gumbi "Usporedi" (vozila) i "Dodaj u upit" (bilo koji artikl)
// — rade i unutar kartice koja je link (ne otvaraju stranicu vozila).

import { usePopis, prebaci, NAJVISE_ZA_USPOREDBU } from "@/lib/odabir";

export function GumbUsporedi({ id, mali = false }: { id: number; mali?: boolean }) {
  const popis = usePopis("usporedba");
  const odabrano = popis.includes(String(id));
  const puno = !odabrano && popis.length >= NAJVISE_ZA_USPOREDBU;
  return (
    <button
      type="button"
      disabled={puno}
      title={puno ? "Najviše 3 vozila za usporedbu" : odabrano ? "Makni iz usporedbe" : "Dodaj u usporedbu"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); prebaci("usporedba", String(id)); }}
      className={`${mali ? "text-xs px-2 py-1" : "text-sm px-4 py-2"} rounded-full font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40`}
      style={odabrano
        ? { background: "var(--text)", color: "white" }
        : { background: "var(--surface)", color: "var(--muted)", border: "1px solid var(--line)" }}
    >
      <span className="inline-block w-3.5 h-3.5 rounded border flex items-center justify-center text-[10px] leading-none"
        style={{ borderColor: odabrano ? "white" : "var(--muted)" }}>{odabrano ? "✓" : ""}</span>
      Usporedi
    </button>
  );
}

export function GumbDodajUUpit({ naziv, mali = false }: { naziv: string; mali?: boolean }) {
  const popis = usePopis("upit");
  const odabrano = popis.includes(naziv);
  return (
    <button
      type="button"
      title={odabrano ? "Makni iz upita" : "Dodaj u zajednički upit"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); prebaci("upit", naziv); }}
      className={`${mali ? "text-xs px-2.5 py-1.5" : "text-sm px-4 py-2"} rounded-full font-semibold transition-colors`}
      style={odabrano
        ? { background: "var(--text)", color: "white" }
        : { background: "var(--surface)", color: "var(--green-dk)", border: "1px solid var(--green)" }}
    >
      {odabrano ? "✓ U upitu" : "+ U upit"}
    </button>
  );
}
