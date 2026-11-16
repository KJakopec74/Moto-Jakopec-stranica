// =============================================================================
// StranicaKategorije — /oprema/<kategorija> i /dijelovi/<kategorija>
// =============================================================================

import Link from "next/link";
import { notFound } from "next/navigation";
import KategorijaProizvodi from "@/components/KategorijaProizvodi";
import { kategorije, proizvodiKategorije, brendoviProizvoda, type Vrsta } from "@/lib/kategorije";

// Za statični izvoz: popis svih stranica kategorija koje imaju proizvode
export function parametriKategorija(vrsta: Vrsta) {
  return kategorije(vrsta)
    .filter((k) => proizvodiKategorije(vrsta, k).length > 0)
    .map((k) => ({ kategorija: k.slug }));
}

export function nadiKategoriju(vrsta: Vrsta, slug: string) {
  return kategorije(vrsta).find((k) => k.slug === slug);
}

export default function StranicaKategorije({ vrsta, slug }: { vrsta: Vrsta; slug: string }) {
  const kategorija = nadiKategoriju(vrsta, slug);
  if (!kategorija) notFound();

  const proizvodi = proizvodiKategorije(vrsta, kategorija);
  const brendovi = brendoviProizvoda(vrsta, proizvodi);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href={`/${vrsta}`} className="inline-flex items-center gap-2 text-sm mb-8 hover:underline" style={{ color: "var(--muted)" }}>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {vrsta === "oprema" ? "Sva oprema" : "Svi dijelovi"}
      </Link>

      <div className="mb-8">
        <h1 className="section-title">{kategorija.naziv}</h1>
        {kategorija.opis && <p className="section-subtitle">{kategorija.opis}</p>}
      </div>

      <KategorijaProizvodi proizvodi={proizvodi} brendovi={brendovi} />
    </div>
  );
}
