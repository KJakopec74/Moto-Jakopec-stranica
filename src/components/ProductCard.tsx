"use client";

// =============================================================================
// ProductCard — kartica jednog proizvoda (oprema ili dijelovi)
// -----------------------------------------------------------------------------
// Prikazuje sliku (ili logo brenda dok slika ne postoji), naziv, kratki opis,
// tehničke podatke (specs) i gumb "Pošalji upit" koji vodi na formu.
// =============================================================================

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Galerija from "@/components/Galerija";
import type { Product } from "@/types/product";
import Cijena, { OznakaAkcije } from "@/components/Cijena";
import { GumbDodajUUpit } from "@/components/GumbiOdabira";
import { imaAkciju, postotakPopusta } from "@/lib/cijena";
import type { BrandsData } from "@/types/brand";
import brandsData from "@/data/brands.json";

interface Props {
  product: Product;
}

// Pronađi brend proizvoda (za logo i naziv) u odgovarajućoj listi
function pronadiBrend(product: Product) {
  const svi = brandsData as unknown as BrandsData;
  const lista = product.category === "Oprema" ? svi.oprema : svi.dijelovi;
  return (lista ?? []).find((b) => b.brand_id === product.brand);
}

export default function ProductCard({ product }: Props) {
  const slike = product.images ?? [];
  const imageSrc = slike[0] ?? null;

  // Galerija: je li otvorena i koja je slika prikazana
  const [galerijaOtvorena, postaviGalerijaOtvorena] = useState(false);
  const [aktivnaSlika, postaviAktivnuSliku] = useState(0);
  const brend = pronadiBrend(product);
  const specifikacije = Object.entries(product.specs ?? {});

  return (
    <div
      className="card group flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 8px 30px rgba(55,182,58,.18)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,.06)")}
    >
      {/* Slika */}
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg2)" }}>
        {imageSrc ? (
          // Klik na sliku otvara galeriju sa svim slikama proizvoda
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-zoom-in"
            onClick={() => { postaviAktivnuSliku(0); postaviGalerijaOtvorena(true); }}
            aria-label={`Otvori slike: ${product.name}`}
          >
            <Image
              src={imageSrc}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500 p-2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Oznaka broja slika (samo ako ih ima više) */}
            {slike.length > 1 && (
              <span className="absolute bottom-3 right-3 flex items-center gap-1 text-white text-xs font-semibold px-2 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,.55)" }}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {slike.length}
              </span>
            )}
          </button>
        ) : (
          // Dok proizvod nema sliku: logo brenda (ili naziv brenda) i natpis
          <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
            {brend?.logo ? (
              // Logo sivo i prigušeno, s tankim obrubom — vidljiv i kad je originalni logo bijel
              <div className="relative w-2/3 h-1/2" style={{ filter: "grayscale(1) drop-shadow(0 0 0.6px rgba(0,0,0,.8))", opacity: 0.45 }}>
                <Image
                  src={brend.logo}
                  alt={brend.name}
                  fill
                  unoptimized={/\.(svg|ico)$/.test(brend.logo)}
                  className="object-contain"
                  sizes="200px"
                />
              </div>
            ) : brend ? (
              <span className="text-2xl font-black tracking-wide opacity-50 text-center" style={{ color: "var(--text)" }}>
                {brend.name}
              </span>
            ) : (
              // Proizvod bez brenda: obična ikona slike
              <svg className="w-14 h-14 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--muted)" }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
            <span className="text-xs" style={{ color: "var(--muted)" }}>Slika uskoro</span>
          </div>
        )}

        {/* Oznake */}
        <div className="absolute top-3 left-3 flex gap-2 pointer-events-none">
          {imaAkciju(product) && <OznakaAkcije postotak={postotakPopusta(product)} />}
          {product.is_new && (
            <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ background: "var(--green)" }}>
              NOVO
            </span>
          )}
          {(product.skupina || product.subcategory) && (
            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: "rgba(255,255,255,.85)", color: "var(--text)" }}>
              {product.skupina || product.subcategory}
            </span>
          )}
        </div>
      </div>

      {/* Sadržaj */}
      <div className="p-4 flex flex-col flex-1">
        {brend && (
          <span className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--green-dk)" }}>
            {brend.name}
          </span>
        )}
        <h3 className="font-bold text-base leading-tight mb-2" style={{ color: "var(--text)" }}>
          {product.name}
        </h3>

        <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
          {product.description}
        </p>

        {/* Tehnički podaci */}
        {specifikacije.length > 0 && (
          <dl className="text-xs mb-4 rounded-lg overflow-hidden border" style={{ borderColor: "var(--line)" }}>
            {specifikacije.map(([kljuc, vrijednost], i) => (
              <div
                key={kljuc}
                className="grid grid-cols-[40%_60%] gap-2 px-3 py-1.5"
                style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--surface)" }}
              >
                <dt style={{ color: "var(--muted)" }}>{kljuc}</dt>
                <dd className="font-medium" style={{ color: "var(--text)" }}>{vrijednost}</dd>
              </div>
            ))}
          </dl>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--line)" }}>
          <Cijena price={product.price} akcijska_cijena={product.akcijska_cijena} velicina="mala" />
          <span className="flex items-center gap-1.5">
          <GumbDodajUUpit naziv={(brend ? brend.name + " " : "") + product.name} mali />
          <Link
            href={`/kontakt?model=${encodeURIComponent((brend ? brend.name + " " : "") + product.name)}`}
            className="text-xs font-semibold flex items-center gap-1 px-3 py-1.5 rounded-full transition-colors"
            style={{ background: "var(--green)", color: "white" }}
          >
            Upit
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          </span>
        </div>
      </div>

      {/* Galerija preko cijelog ekrana */}
      {galerijaOtvorena && (
        <Galerija
          slike={slike}
          naziv={product.name}
          aktivna={aktivnaSlika}
          promijeniAktivnu={postaviAktivnuSliku}
          zatvori={() => postaviGalerijaOtvorena(false)}
        />
      )}
    </div>
  );
}
