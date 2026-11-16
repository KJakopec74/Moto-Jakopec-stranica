"use client";

// =============================================================================
// PregledKategorija — početna stranica Opreme / Dijelova
// -----------------------------------------------------------------------------
// Prikazuje pločice kategorija (Kacige, Naočale… / Motor, Auspusi…), tražilicu
// preko svih proizvoda i popis brendova.
// =============================================================================

import { useMemo, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import BrandsGrid from "@/components/BrandsGrid";
import { kategorije, proizvodiVrste, proizvodiKategorije, brendoviProizvoda, type Vrsta } from "@/lib/kategorije";

interface Props {
  vrsta: Vrsta;
  naslov: string;
  podnaslov: string;
}

export default function PregledKategorija({ vrsta, naslov, podnaslov }: Props) {
  const [pojam, postaviPojam] = useState("");
  const sviProizvodi = proizvodiVrste(vrsta);

  // Pločice: samo kategorije koje imaju barem jedan proizvod
  const plocice = kategorije(vrsta)
    .map((k) => {
      const proizvodi = proizvodiKategorije(vrsta, k);
      return { k, broj: proizvodi.length, brendovi: brendoviProizvoda(vrsta, proizvodi) };
    })
    .filter((p) => p.broj > 0);

  // Tražilica: naziv, opis, kategorija, skupina i brend
  const rezultati = useMemo(() => {
    const q = pojam.trim().toLowerCase();
    if (!q) return [];
    return sviProizvodi.filter((p) =>
      [p.name, p.description, p.subcategory, p.skupina, p.brand]
        .filter(Boolean)
        .some((t) => String(t).toLowerCase().includes(q))
    );
  }, [pojam, sviProizvodi]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="section-title">{naslov}</h1>
        <p className="section-subtitle">{podnaslov}</p>
      </div>

      {/* Tražilica */}
      <div className="relative mb-8">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--muted)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder={vrsta === "oprema" ? "Pretraži opremu..." : "Pretraži dijelove..."}
          value={pojam}
          onChange={(e) => postaviPojam(e.target.value)}
          className="w-full rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
        />
      </div>

      {pojam.trim() ? (
        // Rezultati pretrage
        <>
          <p className="text-sm mb-5" style={{ color: "var(--muted)" }}>
            Pronađeno <span className="font-semibold" style={{ color: "var(--green-dk)" }}>{rezultati.length}</span> proizvoda
          </p>
          {rezultati.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {rezultati.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-center py-16" style={{ color: "var(--muted)" }}>Nema rezultata za &quot;{pojam}&quot;</p>
          )}
        </>
      ) : (
        <>
          {/* Pločice kategorija */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {plocice.map(({ k, broj, brendovi }) => (
              <Link
                key={k.slug}
                href={`/${vrsta}/${k.slug}`}
                className="card group p-6 flex flex-col transition-all duration-300 hover:-translate-y-1"
                style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-xl font-bold" style={{ color: "var(--text)" }}>{k.naziv}</h2>
                  <span className="text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap"
                    style={{ background: "var(--bg)", color: "var(--green-dk)" }}>
                    {broj} {broj % 10 === 1 && broj % 100 !== 11 ? "proizvod" : "proizvoda"}
                  </span>
                </div>
                {k.opis && <p className="text-sm mb-4" style={{ color: "var(--muted)" }}>{k.opis}</p>}
                {brendovi.length > 0 && (
                  <p className="text-xs mt-auto pt-3 border-t" style={{ color: "var(--muted)", borderColor: "var(--line)" }}>
                    {brendovi.map((b) => b.name).join(" · ")}
                  </p>
                )}
                <span className="mt-3 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                  style={{ color: "var(--green)" }}>
                  Pogledaj
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          {/* Brendovi */}
          <BrandsGrid category={vrsta} />

          {plocice.length === 0 && (
            <div className="text-center py-24">
              <p className="text-lg" style={{ color: "var(--muted)" }}>Ponuda uskoro. Kontaktirajte nas za informacije.</p>
              <a href="/kontakt" className="btn-primary inline-flex mt-6">Kontaktirajte nas</a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
