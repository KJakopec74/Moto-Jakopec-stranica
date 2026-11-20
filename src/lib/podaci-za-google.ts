// =============================================================================
// Strukturirani podaci (schema.org) — Google iz njih u rezultatima pretrage
// može prikazati naziv, sliku i cijenu vozila ("Kawasaki Z 900 — 11.194 €").
// =============================================================================

import { ADRESA_STRANICE, FIRMA } from "@/lib/stranica";
import { cijenaUBroj } from "@/lib/cijena";

interface Ulaz {
  naziv: string;
  opis: string;
  slike: string[];
  putanja: string;          // npr. "/motocikli/22/"
  cijena?: string;          // "11.194 €" ili "Cijena na upit"
  marka?: string;
  rabljeno?: boolean;
  prodano?: boolean;
  sifra?: string;           // oznaka modela
}

export function proizvodZaGoogle(u: Ulaz) {
  const broj = cijenaUBroj(u.cijena);
  const podaci: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: u.naziv,
    description: u.opis,
    image: u.slike.slice(0, 3).map((s) => ADRESA_STRANICE + s),
    brand: { "@type": "Brand", name: u.marka || "Kawasaki" },
    url: ADRESA_STRANICE + u.putanja,
    ...(u.sifra ? { sku: u.sifra } : {}),
  };
  // Ponuda samo kad je cijena poznata ("Cijena na upit" Google ne prihvaća)
  if (broj !== null) {
    podaci.offers = {
      "@type": "Offer",
      price: broj.toFixed(2),
      priceCurrency: "EUR",
      url: ADRESA_STRANICE + u.putanja,
      itemCondition: u.rabljeno ? "https://schema.org/UsedCondition" : "https://schema.org/NewCondition",
      ...(u.prodano ? { availability: "https://schema.org/SoldOut" } : {}),
      seller: { "@type": "Organization", name: FIRMA.naziv },
    };
  }
  return podaci;
}
