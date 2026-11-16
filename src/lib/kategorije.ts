// =============================================================================
// kategorije.ts — kategorije i skupine opreme i dijelova
// -----------------------------------------------------------------------------
// Redoslijed, nazivi i opisi kategorija upisani su u src/data/kategorije.json.
// Ako u Excelu upišeš novu kategoriju (stupac subcategory) koje nema u
// kategorije.json, ona se ovdje automatski doda na kraj popisa.
// =============================================================================

import kategorijeData from "@/data/kategorije.json";
import productsData from "@/data/products.json";
import brandsData from "@/data/brands.json";
import type { Product } from "@/types/product";
import type { Brand, BrandsData } from "@/types/brand";

export type Vrsta = "oprema" | "dijelovi";

export interface Kategorija {
  naziv: string;       // npr. "Kočnice"
  slug: string;        // npr. "kocnice" (dio adrese stranice)
  opis: string;
  skupine: string[];   // redoslijed skupina unutar kategorije
}

const sviProizvodi = productsData as unknown as Product[];
const sviBrendovi = brandsData as unknown as BrandsData;

// "Lančanici i lanci" → "lancanici-i-lanci"
export function napraviSlug(tekst: string): string {
  return tekst
    .toLowerCase()
    .replace(/č|ć/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Svi proizvodi jedne vrste (Oprema ili Dijelovi)
export function proizvodiVrste(vrsta: Vrsta): Product[] {
  const kat = vrsta === "oprema" ? "Oprema" : "Dijelovi";
  return sviProizvodi.filter((p) => p.category === kat);
}

// Popis kategorija: one iz kategorije.json + nove upisane samo u Excelu
export function kategorije(vrsta: Vrsta): Kategorija[] {
  const definirane = (kategorijeData as Record<Vrsta, Omit<Kategorija, "slug">[]>)[vrsta] ?? [];
  const popis: Kategorija[] = definirane.map((k) => ({ ...k, slug: napraviSlug(k.naziv) }));

  for (const p of proizvodiVrste(vrsta)) {
    const naziv = p.subcategory || "Ostalo";
    if (!popis.some((k) => k.naziv === naziv)) {
      popis.push({ naziv, slug: napraviSlug(naziv), opis: "", skupine: [] });
    }
  }
  return popis;
}

// Proizvodi jedne kategorije, poredani po skupinama (redom iz kategorije.json)
export function proizvodiKategorije(vrsta: Vrsta, kategorija: Kategorija): Product[] {
  const proizvodi = proizvodiVrste(vrsta).filter((p) => (p.subcategory || "Ostalo") === kategorija.naziv);
  const red = (p: Product) => {
    const i = kategorija.skupine.indexOf(p.skupina ?? "");
    return i === -1 ? kategorija.skupine.length : i;
  };
  // sort je stabilan → unutar skupine ostaje redoslijed iz Excela
  return [...proizvodi].sort((a, b) => red(a) - red(b));
}

// Brendovi jedne vrste (samo aktivni)
export function brendovi(vrsta: Vrsta): Brand[] {
  return (sviBrendovi[vrsta] ?? []).filter((b) => b.active);
}

// Brendovi koji imaju barem jedan proizvod u zadanom popisu
export function brendoviProizvoda(vrsta: Vrsta, proizvodi: Product[]): Brand[] {
  const idevi = new Set(proizvodi.map((p) => p.brand).filter(Boolean));
  return brendovi(vrsta).filter((b) => idevi.has(b.brand_id));
}
