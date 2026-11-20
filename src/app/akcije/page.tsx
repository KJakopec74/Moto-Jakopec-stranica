import type { Metadata } from "next";
import Link from "next/link";
import AkcijaCard from "@/components/AkcijaCard";
import { posebneAkcije } from "@/lib/akcije";

// =============================================================================
// /akcije — AKCIJSKA PONUDA: samo stavke koje su upisane u akcije.xlsx.
// (Vozila i proizvodi s akcijskom cijenom u vozila/proizvodi.xlsx ovdje se NE
//  prikazuju — oni imaju oznaku AKCIJA na svojim karticama.)
// =============================================================================

export const metadata: Metadata = {
  title: "Akcijska ponuda",
  description: "Akcijska ponuda Moto Jakopec, Samobor — snižene cijene opreme, dijelova i vozila.",
};

// Stavke grupirane po kategoriji (redoslijed kao u Excelu)
const kategorije = Array.from(new Set(posebneAkcije.map((a) => a.kategorija || "Ostalo")));

export default function AkcijePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <span className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-3" style={{ background: "#d92d20" }}>
          AKCIJA
        </span>
        <h1 className="section-title">Akcijska ponuda</h1>
        <p className="section-subtitle">Snižene cijene — dok traju zalihe.</p>
      </div>

      {posebneAkcije.length === 0 ? (
        <div className="card p-10 text-center max-w-2xl mx-auto">
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Trenutno nema aktivnih akcija.</p>
          <p className="mb-6" style={{ color: "var(--muted)" }}>Nazovite nas ili pošaljite upit — rado ćemo vam dati ponudu.</p>
          <Link href="/kontakt" className="btn-primary inline-flex">Pošaljite upit</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {kategorije.map((kat) => (
            <section key={kat}>
              {kategorije.length > 1 && (
                <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text)" }}>{kat}</h2>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {posebneAkcije.filter((a) => (a.kategorija || "Ostalo") === kat).map((a) => <AkcijaCard key={a.id} akcija={a} />)}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
