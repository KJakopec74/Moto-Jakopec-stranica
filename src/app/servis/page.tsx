import type { Metadata } from "next";
import { Suspense } from "react";
import ServisForma from "@/components/ServisForma";
import { TELEFONI, RADNO_VRIJEME } from "@/lib/stranica";

export const metadata: Metadata = {
  title: "Servis — rezervacija termina",
  description:
    "Rezervirajte termin za servis motocikla, quada, Mule ili Jet Skija u Moto Jakopec, Samobor. Ovlašteni Kawasaki servis.",
};

// Kratki popis onoga što radimo — prikazuje se uz obrazac
const USLUGE = [
  "Redovni servisi Kawasaki vozila",
  "Zamjena ulja, filtera, guma, kočnica i lanca",
  "Dijagnostika i popravak kvarova",
  "Priprema za sezonu i zimovanje",
  "Ugradnja opreme i dodataka",
];

export default function ServisPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="section-title">Servis</h1>
        <p className="section-subtitle">
          Rezervirajte termin online — javit ćemo vam se i potvrditi točan dan i sat.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        {/* Obrazac */}
        <div className="card p-6 lg:col-span-3">
          <h2 className="font-bold text-xl mb-6" style={{ color: "var(--text)" }}>Zahtjev za termin</h2>
          {/* Suspense je potreban jer obrazac čita ?model= iz adrese */}
          <Suspense fallback={null}>
            <ServisForma />
          </Suspense>
        </div>

        {/* Informacije */}
        <div className="space-y-5 lg:col-span-2">
          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>Što radimo</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
              {USLUGE.map((u) => (
                <li key={u} className="flex gap-2">
                  <span style={{ color: "var(--green)" }}>✓</span>{u}
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>Radno vrijeme</h3>
            <ul className="space-y-1 text-sm">
              {RADNO_VRIJEME.map((r) => (
                <li key={r.dani} className="flex justify-between gap-4">
                  <span style={{ color: "var(--muted)" }}>{r.dani}</span>
                  <span className="font-medium" style={{ color: "var(--text)" }}>{r.sati}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-semibold mb-3" style={{ color: "var(--text)" }}>Radije telefonom?</h3>
            <ul className="space-y-1">
              {TELEFONI.map((t) => (
                <li key={t.poziv}>
                  <a href={`tel:${t.poziv}`} className="font-medium hover:underline" style={{ color: "var(--text)" }}>
                    {t.prikaz}
                  </a>
                  <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{t.vrsta}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
