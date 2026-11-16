import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import type { Brand, BrandsData } from "@/types/brand";
import brandsData from "@/data/brands.json";
import { kategorije, proizvodiKategorije, type Vrsta } from "@/lib/kategorije";

// =============================================================================
// StranicaBrenda — /oprema/brend/<brand_id> i /dijelovi/brend/<brand_id>
// Svi proizvodi jednog brenda, redom po kategorijama i skupinama.
// =============================================================================

const allBrands = brandsData as unknown as BrandsData;

export function parametriBrendova(vrsta: Vrsta) {
  return (allBrands[vrsta] ?? []).filter(b => b.active).map(b => ({ brand: b.brand_id }));
}

export default function StranicaBrenda({ vrsta, brandId }: { vrsta: Vrsta; brandId: string }) {
  const brand: Brand | undefined = (allBrands[vrsta] ?? []).find(b => b.brand_id === brandId);
  if (!brand) notFound();

  // Proizvodi brenda redom kategorija (i skupina unutar kategorije)
  const products = kategorije(vrsta).flatMap(k => proizvodiKategorije(vrsta, k)).filter(p => p.brand === brandId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Natrag */}
      <Link
        href={`/${vrsta}`}
        className="inline-flex items-center gap-2 text-sm mb-8 transition-colors hover:underline"
        style={{ color: "var(--muted)" }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {vrsta === "oprema" ? "Sva oprema" : "Svi dijelovi"}
      </Link>

      {/* Brand header */}
      <div className="flex items-center gap-6 mb-10">
        {brand.logo && (
          <div className="relative w-20 h-20 flex-shrink-0">
            <Image
              src={brand.logo}
              alt={brand.name}
              fill
              unoptimized={/\.(svg|ico)$/.test(brand.logo)}
              className="object-contain"
              sizes="80px"
              // tanki tamni obrub — da se vide i bijeli logotipi (npr. Airoh, Mitas)
              style={{ filter: "drop-shadow(0 0 0.6px rgba(0,0,0,.8)) drop-shadow(0 0 0.6px rgba(0,0,0,.8))" }}
            />
          </div>
        )}
        <div>
          <h1 className="section-title mb-1">{brand.name}</h1>
          {brand.website && (
            <a
              href={`https://${brand.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors hover:underline"
              style={{ color: "var(--muted)" }}
            >
              {brand.website}
            </a>
          )}
        </div>
      </div>

      {/* Proizvodi */}
      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-lg" style={{ color: "var(--muted)" }}>
            Nema proizvoda za ovaj brend. Kontaktirajte nas za dostupnost.
          </p>
          <a href="/kontakt" className="btn-primary inline-flex mt-6">
            Kontaktirajte nas
          </a>
        </div>
      ) : (
        // Sve kartice brenda u jednoj mreži (kategorija/skupina piše na svakoj kartici)
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
