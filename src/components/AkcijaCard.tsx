"use client";

// =============================================================================
// AkcijaCard — kartica posebne akcije (akcije.xlsx): slike, stara i nova
// cijena, popust, opis, rok trajanja, gumbi za upit.
// =============================================================================

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Galerija from "@/components/Galerija";
import Cijena, { OznakaAkcije } from "@/components/Cijena";
import { GumbDodajUUpit } from "@/components/GumbiOdabira";
import { postotakPopusta } from "@/lib/cijena";
import { type PosebnaAkcija, istekla } from "@/lib/akcije";
import { datumHr } from "@/lib/novosti";

export default function AkcijaCard({ akcija }: { akcija: PosebnaAkcija }) {
  const [galerija, postaviGaleriju] = useState(false);
  const [aktivna, postaviAktivnu] = useState(0);
  const [skrivena, postaviSkrivenu] = useState(false);

  // Ako je rok akcije prošao od zadnje objave stranice — sakrij je
  useEffect(() => { postaviSkrivenu(istekla(akcija)); }, [akcija]);
  if (skrivena) return null;

  const cijene = { price: akcija.cijena || akcija.akcijska_cijena, akcijska_cijena: akcija.cijena ? akcija.akcijska_cijena : "" };
  const postotak = postotakPopusta(cijene);

  return (
    <div className="card flex flex-col overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
      <div className="relative aspect-[4/3]" style={{ background: "var(--bg2)" }}>
        {akcija.slike[0] ? (
          <button type="button" className="absolute inset-0 w-full h-full cursor-zoom-in"
            onClick={() => { postaviAktivnu(0); postaviGaleriju(true); }} aria-label={`Otvori slike: ${akcija.naziv}`}>
            <Image src={akcija.slike[0]} alt={akcija.naziv} fill className="object-contain p-2" sizes="(max-width: 768px) 100vw, 33vw" />
            {akcija.slike.length > 1 && (
              <span className="absolute bottom-3 right-3 text-white text-xs font-semibold px-2 py-1 rounded-full" style={{ background: "rgba(0,0,0,.55)" }}>
                {akcija.slike.length} slika
              </span>
            )}
          </button>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "var(--muted)" }}>Slika uskoro</div>
        )}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          <OznakaAkcije postotak={postotak} />
          {akcija.kategorija && (
            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: "rgba(255,255,255,.9)", color: "var(--text)" }}>
              {akcija.kategorija}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-base leading-tight mb-2" style={{ color: "var(--text)" }}>{akcija.naziv}</h3>
        <p className="text-sm whitespace-pre-line mb-3 flex-1" style={{ color: "var(--muted)" }}>{akcija.opis}</p>
        {akcija.vrijedi_do && (
          <p className="text-xs font-semibold mb-3" style={{ color: "#b42318" }}>Akcija vrijedi do {datumHr(akcija.vrijedi_do)}</p>
        )}
        <div className="flex items-center justify-between gap-2 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
          {akcija.cijena ? <Cijena {...cijene} /> : (
            <span className="font-bold text-lg" style={{ color: "#d92d20" }}>{akcija.akcijska_cijena}</span>
          )}
          <span className="flex items-center gap-1.5">
            <GumbDodajUUpit naziv={`${akcija.naziv} (akcija)`} mali />
            <Link href={`/kontakt?model=${encodeURIComponent(`${akcija.naziv} (akcija)`)}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "var(--green)", color: "white" }}>
              Upit ›
            </Link>
          </span>
        </div>
      </div>

      {galerija && (
        <Galerija slike={akcija.slike} naziv={akcija.naziv} aktivna={aktivna} promijeniAktivnu={postaviAktivnu} zatvori={() => postaviGaleriju(false)} />
      )}
    </div>
  );
}
