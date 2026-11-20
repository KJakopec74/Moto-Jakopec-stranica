"use client";

// =============================================================================
// /usporedba?v=12,22,24 — do tri vozila jedno uz drugo.
// Vozila se biraju gumbom "Usporedi" na karticama i stranici vozila.
// Adresa sadrži odabir, pa se usporedba može poslati nekome kao link.
// =============================================================================

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Motorcycle } from "@/types/motorcycle";
import modelsData from "@/data/models.json";
import Cijena from "@/components/Cijena";
import { usePopis, makni, dodaj, isprazni } from "@/lib/odabir";

const vozila = modelsData as unknown as Motorcycle[];

// Najvažniji podaci — uvijek na vrhu tablice, ovim redom
const GLAVNI_PODACI = [
  "Radni obujam", "Najveća snaga", "Najveći okretni moment", "Masa spremna za vožnju",
  "Visina sjedala", "Spremnik goriva", "Tip motora", "Mjenjač", "Potrošnja goriva", "Najveća brzina",
];
const PRESKOCI = new Set(["Izvor podataka", "Oznaka modela"]);

function Usporedba() {
  const parametri = useSearchParams();
  const odabrano = usePopis("usporedba");
  const [sviPodaci, postaviSviPodaci] = useState(false);

  // Link s ?v=… (npr. poslan nekome) — preuzmi taj odabir
  useEffect(() => {
    const izAdrese = (parametri.get("v") ?? "").split(",").filter(Boolean);
    if (izAdrese.length && izAdrese.join(",") !== odabrano.join(",")) {
      isprazni("usporedba");
      izAdrese.slice(0, 3).forEach((id) => dodaj("usporedba", id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parametri]);

  const lista = odabrano.map((id) => vozila.find((v) => String(v.id) === id)).filter(Boolean) as Motorcycle[];

  if (lista.length === 0) {
    return (
      <div className="card p-10 text-center max-w-2xl mx-auto">
        <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Još niste odabrali vozila za usporedbu.</p>
        <p className="mb-6" style={{ color: "var(--muted)" }}>
          Na karticama motocikala kliknite <b>Usporedi</b> kod 2 ili 3 modela.
        </p>
        <Link href="/motocikli" className="btn-primary inline-flex">Pregledaj motocikle</Link>
      </div>
    );
  }

  // Redovi tablice: glavni podaci pa (na zahtjev) svi ostali koje ima barem jedno vozilo
  const ostali = Array.from(new Set(lista.flatMap((v) => Object.keys(v.specs ?? {}))))
    .filter((k) => !GLAVNI_PODACI.includes(k) && !PRESKOCI.has(k));
  const redovi = [...GLAVNI_PODACI.filter((k) => lista.some((v) => v.specs?.[k])), ...(sviPodaci ? ostali : [])];
  const stupci = `minmax(130px,1fr) repeat(${lista.length}, minmax(180px,1.4fr))`;

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-[560px]">
        {/* Zaglavlje: slike, nazivi, cijene */}
        <div className="grid gap-3 mb-2" style={{ gridTemplateColumns: stupci }}>
          <div />
          {lista.map((v) => (
            <div key={v.id} className="card p-3 relative">
              <button type="button" onClick={() => makni("usporedba", String(v.id))} aria-label="Makni"
                className="absolute top-2 right-2 z-10 w-7 h-7 rounded-full text-sm" style={{ background: "rgba(255,255,255,.9)", color: "var(--muted)" }}>✕</button>
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-2" style={{ background: "var(--bg2)" }}>
                {v.images?.[0] && <Image src={v.images[0]} alt={v.name} fill className="object-cover" sizes="300px" />}
              </div>
              <Link href={`/motocikli/${v.id}`} className="font-bold leading-tight hover:underline block mb-1" style={{ color: "var(--text)" }}>{v.name}</Link>
              <Cijena price={v.price} akcijska_cijena={v.akcijska_cijena} velicina="mala" />
            </div>
          ))}
        </div>

        {/* Tablica podataka */}
        <div className="card overflow-hidden">
          {[["Kategorija", (v: Motorcycle) => v.category],
            ["Vozačka dozvola", (v: Motorcycle) => v.license_category || "A"],
            ["Paketi opreme", (v: Motorcycle) => (v.paketi ?? []).filter((p) => !p.naziv.startsWith("Posebna")).map((p) => p.naziv).join(", ") || "—"],
            ...redovi.map((k) => [k, (v: Motorcycle) => v.specs?.[k] || "—"] as const),
          ].map(([naslov, vrijednost], i) => (
            <div key={naslov as string} className="grid gap-3 px-3 py-2.5 text-sm" style={{ gridTemplateColumns: stupci, background: i % 2 ? "var(--surface)" : "var(--bg)" }}>
              <div className="font-medium" style={{ color: "var(--muted)" }}>{naslov as string}</div>
              {lista.map((v) => (
                <div key={v.id} style={{ color: "var(--text)" }}>{(vrijednost as (v: Motorcycle) => string)(v)}</div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button type="button" className="btn-outline" onClick={() => postaviSviPodaci(!sviPodaci)}>
            {sviPodaci ? "Prikaži samo glavne podatke" : `Prikaži sve podatke (${ostali.length} više)`}
          </button>
          {lista.length < 3 && <Link href="/motocikli" className="btn-outline">+ Dodaj još jedan model</Link>}
          <Link href={`/kontakt?model=${encodeURIComponent(lista.map((v) => v.name).join(" / "))}`} className="btn-primary">
            Pošalji upit za ove modele
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function UsporedbaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">Usporedba modela</h1>
      <p className="section-subtitle mb-8">Do tri modela jedan uz drugi.</p>
      <Suspense fallback={null}><Usporedba /></Suspense>
    </div>
  );
}
