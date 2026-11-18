"use client";

// =============================================================================
// /trazi — tražilica za cijelu stranicu (vozila, oprema, dijelovi)
// Sve se pretražuje u pregledniku iz podataka stranice, bez poslužitelja.
// =============================================================================

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MotorcycleCard from "@/components/MotorcycleCard";
import ProductCard from "@/components/ProductCard";
import type { Motorcycle } from "@/types/motorcycle";
import type { Product } from "@/types/product";
import type { BrandsData } from "@/types/brand";
import modelsData from "@/data/models.json";
import productsData from "@/data/products.json";
import brandsData from "@/data/brands.json";
import { kategorije, proizvodiKategorije, type Vrsta } from "@/lib/kategorije";

const vozila = modelsData as unknown as Motorcycle[];
const proizvodi = productsData as unknown as Product[];
const brendovi = brandsData as unknown as BrandsData;
const imeBrenda = (p: Product) =>
  (p.category === "Oprema" ? brendovi.oprema : brendovi.dijelovi).find((b) => b.brand_id === p.brand)?.name ?? "";

// "Ninja-650" i "ninja 650" trebaju dati isto; hrvatska slova mogu i bez kvačica (cizme = čizme)
function normaliziraj(t: string) {
  return t.toLowerCase()
    .replace(/[čć]/g, "c").replace(/š/g, "s").replace(/ž/g, "z").replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, " ").trim();
}
// Pogodak ako se svaka riječ upita nalazi u tekstu (i kad korisnik piše "z900" umjesto "z 900")
function odgovara(tekst: string, rijeci: string[]) {
  const n = normaliziraj(tekst);
  const zbijeno = n.replace(/ /g, "");
  return rijeci.every((r) => n.includes(r) || zbijeno.includes(r));
}

function Rezultati() {
  const parametri = useSearchParams();
  const [pojam, postaviPojam] = useState(parametri.get("q") ?? "");

  const rezultati = useMemo(() => {
    const rijeci = normaliziraj(pojam).split(" ").filter(Boolean);
    if (rijeci.length === 0) return null;
    const v = vozila.filter((m) =>
      odgovara(`${m.name} ${m.category} ${m.description} ${m.license_category ?? ""}`, rijeci));
    const p = proizvodi.filter((x) =>
      odgovara(`${x.name} ${x.description} ${x.subcategory} ${x.skupina ?? ""} ${imeBrenda(x)} ${x.category}`, rijeci));
    const k = (["oprema", "dijelovi"] as Vrsta[]).flatMap((vr) =>
      kategorije(vr)
        .filter((kat) => proizvodiKategorije(vr, kat).length > 0 &&
          odgovara(`${kat.naziv} ${kat.opis} ${kat.skupine.join(" ")}`, rijeci))
        .map((kat) => ({ vr, kat })));
    return { v, p, k };
  }, [pojam]);

  const nista = rezultati && rezultati.v.length + rezultati.p.length + rezultati.k.length === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-6">Pretraživanje</h1>
      <div className="relative mb-8">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--muted)" }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          autoFocus
          type="search"
          value={pojam}
          onChange={(e) => {
            postaviPojam(e.target.value);
            // adresa se osvježi da se rezultat može podijeliti (bez ponovnog učitavanja)
            const q = e.target.value.trim();
            window.history.replaceState(null, "", q ? `?q=${encodeURIComponent(q)}` : window.location.pathname);
          }}
          placeholder="Model, proizvod ili brend (npr. Z900, kaciga, klip, Motul)…"
          className="w-full rounded-xl pl-12 pr-4 py-4 text-base focus:outline-none"
          style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--text)" }}
        />
      </div>

      {!rezultati ? (
        <p style={{ color: "var(--muted)" }}>Upišite što tražite — pretražujemo vozila, opremu i dijelove.</p>
      ) : nista ? (
        <div className="text-center py-16">
          <p className="text-lg mb-4" style={{ color: "var(--muted)" }}>Nismo pronašli ništa za &quot;{pojam}&quot;.</p>
          <Link href={`/kontakt?model=${encodeURIComponent(pojam)}`} className="btn-primary inline-flex">
            Pošaljite nam upit — nabavljamo i ono čega nema na stranici
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {rezultati.k.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>Kategorije</h2>
              <div className="flex flex-wrap gap-2">
                {rezultati.k.map(({ vr, kat }) => (
                  <Link key={vr + kat.slug} href={`/${vr}/${kat.slug}`}
                    className="px-4 py-2 rounded-full text-sm font-medium"
                    style={{ background: "var(--surface)", border: "1px solid var(--line)", color: "var(--green-dk)" }}>
                    {vr === "oprema" ? "Oprema" : "Dijelovi"} → {kat.naziv}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {rezultati.v.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>Vozila ({rezultati.v.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {rezultati.v.map((m) => <MotorcycleCard key={m.id} bike={m} />)}
              </div>
            </section>
          )}
          {rezultati.p.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text)" }}>Oprema i dijelovi ({rezultati.p.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {rezultati.p.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

export default function TraziPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12" style={{ color: "var(--muted)" }}>Učitavanje…</div>}>
      <Rezultati />
    </Suspense>
  );
}
