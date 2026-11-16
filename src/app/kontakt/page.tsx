import type { Metadata } from "next";
import { Suspense } from "react";
import UpitForma from "@/components/UpitForma";
import { TELEFONI, RADNO_VRIJEME } from "@/lib/stranica";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Kontaktirajte Moto Jakopec — telefon, email ili posjetite nas u Samoboru.",
};

const INFO = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Adresa",
    value: "Eugena Kvaternika 4, 10430 Samobor (Mala Rakovica)",
    href: null,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Telefon",
    value: "",
    href: null,
    telefoni: true,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "moto.jakopec@gmail.com",
    href: "mailto:moto.jakopec@gmail.com",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: "Radno vrijeme",
    value: RADNO_VRIJEME.map((r) => `${r.dani}: ${r.sati}`).join("\n"),
    href: null,
  },
];

export default function KontaktPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="section-title">Kontakt</h1>
        <p className="section-subtitle">
          Javite nam se — odgovaramo što brže možemo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* Contact info */}
        <div className="space-y-5">
          {INFO.map((item) => (
            <div key={item.label} className="card p-5 flex items-start gap-4">
              <div className="shrink-0 mt-0.5" style={{ color: "var(--green)" }}>{item.icon}</div>
              <div>
                <div className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: "var(--muted)" }}>
                  {item.label}
                </div>
                {"telefoni" in item ? (
                  // Svi brojevi — klik na broj na mobitelu odmah zove
                  <ul className="space-y-1">
                    {TELEFONI.map((t) => (
                      <li key={t.poziv}>
                        <a href={`tel:${t.poziv}`} className="font-medium transition-colors hover:underline" style={{ color: "var(--text)" }}>
                          {t.prikaz}
                        </a>
                        <span className="text-xs ml-2" style={{ color: "var(--muted)" }}>{t.vrsta}</span>
                      </li>
                    ))}
                  </ul>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="font-medium transition-colors hover:underline"
                    style={{ color: "var(--text)" }}
                  >
                    {item.value}
                  </a>
                ) : (
                  <span className="font-medium" style={{ color: "var(--text)", whiteSpace: "pre-line" }}>{item.value}</span>
                )}
              </div>
            </div>
          ))}

          {/* Map embed */}
          <div className="card overflow-hidden">
            <iframe
              title="Moto Jakopec lokacija"
              src="https://www.google.com/maps?q=Ul.+Eugena+Kvaternika+4,+10430,+Mala+Rakovica&output=embed"
              width="100%"
              height="260"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Contact form */}
        <div className="card p-6">
          <h2 className="font-bold text-xl mb-6" style={{ color: "var(--text)" }}>Pošalji upit</h2>
          {/* Forma je klijentska komponenta; Suspense je potreban jer čita ?model= iz adrese */}
          <Suspense fallback={null}>
            <UpitForma />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
