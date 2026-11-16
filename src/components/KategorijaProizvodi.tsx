"use client";

// =============================================================================
// KategorijaProizvodi — proizvodi jedne kategorije (npr. Motor, Kočnice)
// -----------------------------------------------------------------------------
// Gumbi za filtriranje po brendu i po skupini; proizvodi su prikazani po
// skupinama (npr. Klipovi, Klipnjače…) s naslovom iznad svake skupine.
// =============================================================================

import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types/product";
import type { Brand } from "@/types/brand";

interface Props {
  proizvodi: Product[];   // već poredani po skupinama
  brendovi: Brand[];      // brendovi koji imaju proizvode u ovoj kategoriji
}

const SVE = "Sve";

function Gumb({ aktivan, onClick, children }: { aktivan: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
      style={aktivan
        ? { background: "var(--green)", color: "white", boxShadow: "0 4px 12px rgba(55,182,58,.3)" }
        : { background: "var(--surface)", border: "1px solid var(--line)", color: "var(--muted)" }}
    >
      {children}
    </button>
  );
}

export default function KategorijaProizvodi({ proizvodi, brendovi }: Props) {
  const [brend, postaviBrend] = useState(SVE);
  const [skupina, postaviSkupinu] = useState(SVE);

  // Skupine redom kako dolaze proizvodi
  const skupine = Array.from(new Set(proizvodi.map((p) => p.skupina).filter(Boolean))) as string[];

  const filtrirani = proizvodi.filter(
    (p) => (brend === SVE || p.brand === brend) && (skupina === SVE || p.skupina === skupina)
  );

  // Grupiranje po skupini (proizvodi bez skupine idu na kraj, bez naslova)
  const grupe: { naziv: string; proizvodi: Product[] }[] = [];
  for (const p of filtrirani) {
    const naziv = p.skupina ?? "";
    let g = grupe.find((x) => x.naziv === naziv);
    if (!g) grupe.push((g = { naziv, proizvodi: [] }));
    g.proizvodi.push(p);
  }

  return (
    <>
      <div className="mb-8 space-y-3">
        {skupine.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <Gumb aktivan={skupina === SVE} onClick={() => postaviSkupinu(SVE)}>Sve skupine</Gumb>
            {skupine.map((s) => (
              <Gumb key={s} aktivan={skupina === s} onClick={() => postaviSkupinu(s)}>{s}</Gumb>
            ))}
          </div>
        )}
        {brendovi.length > 1 && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs font-semibold uppercase tracking-widest mr-1" style={{ color: "var(--muted)" }}>Brend:</span>
            <Gumb aktivan={brend === SVE} onClick={() => postaviBrend(SVE)}>Svi</Gumb>
            {brendovi.map((b) => (
              <Gumb key={b.brand_id} aktivan={brend === b.brand_id} onClick={() => postaviBrend(b.brand_id)}>{b.name}</Gumb>
            ))}
          </div>
        )}
      </div>

      {filtrirani.length === 0 ? (
        <p className="text-center py-16" style={{ color: "var(--muted)" }}>Nema proizvoda za odabrani filter.</p>
      ) : (
        <div className="space-y-12">
          {grupe.map((g) => (
            <section key={g.naziv || "ostalo"}>
              {g.naziv && grupe.length > 1 && (
                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>{g.naziv}</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {g.proizvodi.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
