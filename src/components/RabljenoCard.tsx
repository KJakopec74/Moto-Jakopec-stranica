// =============================================================================
// RabljenoCard — kartica rabljenog vozila (godište, kilometri, cijena)
// =============================================================================

import Link from "next/link";
import Image from "next/image";
import type { RabljenoVozilo } from "@/types/rabljeno";
import { tisucice } from "@/lib/cijena";

export function kratkiPodaci(v: RabljenoVozilo): string[] {
  return [
    v.godiste ? String(v.godiste) : "",
    v.kilometri != null ? `${tisucice(v.kilometri)} km` : "",
    v.specs?.["Snaga"] ?? "",
  ].filter(Boolean);
}

export default function RabljenoCard({ vozilo }: { vozilo: RabljenoVozilo }) {
  const slika = vozilo.images?.[0];
  return (
    <Link
      href={`/rabljena/${vozilo.id}`}
      className="card group flex flex-col transition-all duration-300 hover:-translate-y-1"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,.06)", opacity: vozilo.prodano ? 0.7 : 1 }}
    >
      <div className="relative aspect-[16/9] overflow-hidden" style={{ background: "var(--bg2)" }}>
        {slika ? (
          <Image src={slika} alt={vozilo.name} fill sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "var(--muted)" }}>
            {!vozilo.prodano && "Slika uskoro"}
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="text-xs font-bold px-2 py-1 rounded" style={{ background: "var(--text)", color: "white" }}>
            RABLJENO
          </span>
          {vozilo.license_category && (
            <span className="text-xs font-semibold px-2 py-1 rounded" style={{ background: "rgba(255,255,255,.85)", color: "var(--text)" }}>
              {vozilo.license_category}
            </span>
          )}
        </div>
        {vozilo.prodano && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,.35)" }}>
            <span className="text-white text-xl font-black px-4 py-1 rounded border-2 border-white -rotate-6">PRODANO</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-bold text-base leading-tight" style={{ color: "var(--text)" }}>{vozilo.name}</h3>
          {vozilo.category && (
            <span className="text-xs font-medium px-2 py-0.5 rounded border shrink-0"
              style={{ background: "rgba(55,182,58,.1)", color: "var(--green-dk)", borderColor: "rgba(55,182,58,.25)" }}>
              {vozilo.category}
            </span>
          )}
        </div>
        <p className="text-sm font-medium mb-2" style={{ color: "var(--text)" }}>{kratkiPodaci(vozilo).join(" · ")}</p>
        <p className="text-sm line-clamp-2 flex-1 mb-4" style={{ color: "var(--muted)" }}>{vozilo.description}</p>
        <div className="flex items-center justify-between mt-auto pt-3 border-t" style={{ borderColor: "var(--line)" }}>
          <span className="font-bold text-lg" style={{ color: vozilo.prodano ? "var(--muted)" : "var(--green-dk)" }}>
            {vozilo.prodano ? "Prodano" : vozilo.price}
          </span>
          <span className="text-xs" style={{ color: "var(--muted)" }}>Više detalja ›</span>
        </div>
      </div>
    </Link>
  );
}
