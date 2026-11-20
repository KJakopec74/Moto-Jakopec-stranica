// =============================================================================
// PaketiOpreme — paketi dodatne opreme na stranici vozila (Tourer, Performance…)
// Za svaki paket: nadoplata, ukupna cijena vozila s paketom i što paket sadrži.
// Klik na paket otvara popis opreme (<details>, radi bez JavaScripta).
// =============================================================================

import type { PaketOpreme } from "@/types/motorcycle";
import { cijenaUBroj, tisucice } from "@/lib/cijena";

interface Props {
  paketi: PaketOpreme[];
  cijenaVozila: string;     // cijena po kojoj se vozilo prodaje (akcijska ako postoji)
  nazivVozila: string;
}

export default function PaketiOpreme({ paketi, cijenaVozila, nazivVozila }: Props) {
  const osnovna = cijenaUBroj(cijenaVozila);

  return (
    <div className="mb-8">
      <h2 className="font-bold text-lg mb-1" style={{ color: "var(--text)" }}>Paketi opreme</h2>
      <p className="text-sm mb-3" style={{ color: "var(--muted)" }}>
        Vozilo možete uzeti i s tvornički složenim paketom originalne Kawasaki opreme. Kliknite paket za popis opreme.
      </p>
      <div className="space-y-2">
        {paketi.map((p) => {
          const nadoplata = cijenaUBroj(p.cijena);
          const ukupno = osnovna !== null && nadoplata !== null ? `${tisucice(osnovna + nadoplata)} €` : null;
          return (
            <details key={p.naziv} className="card group overflow-hidden" style={{ borderRadius: 16 }}>
              <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none">
                <span className="flex items-center gap-2 font-semibold" style={{ color: "var(--text)" }}>
                  <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" style={{ color: "var(--green)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  {p.naziv}
                </span>
                <span className="text-right leading-tight">
                  <span className="block font-bold" style={{ color: "var(--green-dk)" }}>
                    {nadoplata !== null ? `+ ${p.cijena}` : p.cijena}
                  </span>
                  {ukupno && <span className="block text-xs" style={{ color: "var(--muted)" }}>ukupno {ukupno}</span>}
                </span>
              </summary>
              <div className="px-4 pb-4 pt-1 text-sm border-t" style={{ borderColor: "var(--line)" }}>
                {p.sadrzaj.length > 0 ? (
                  <ul className="space-y-1.5 mt-2">
                    {p.sadrzaj.map((s) => (
                      <li key={s} className="flex gap-2" style={{ color: "var(--text)" }}>
                        <span style={{ color: "var(--green)" }}>✓</span>{s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2" style={{ color: "var(--muted)" }}>Sadržaj paketa na upit — javite nam se.</p>
                )}
                <a href={`/kontakt?model=${encodeURIComponent(`${nazivVozila} — paket ${p.naziv}`)}`}
                  className="inline-block mt-3 text-xs font-semibold hover:underline" style={{ color: "var(--green-dk)" }}>
                  Pošalji upit za {nazivVozila} {p.naziv} ›
                </a>
              </div>
            </details>
          );
        })}
      </div>
    </div>
  );
}
