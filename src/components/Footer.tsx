"use client";

import Link from "next/link";
import { TELEFONI, RADNO_VRIJEME, DRUSTVENE_MREZE, FIRMA } from "@/lib/stranica";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="mt-20 border-t" style={{background:"var(--bg2)", borderColor:"var(--line)"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image
                src="/logo-jakopec.png"
                alt="Moto Jakopec"
                width={140}
                height={49}
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
              Ovlašteni Kawasaki zastupnik za Hrvatsku. Prodaja novih motocikala,
              servis, rezervni dijelovi i oprema.
            </p>
            {/* Društvene mreže — prikazuju se samo ako su upisane u src/lib/stranica.ts */}
            {(DRUSTVENE_MREZE.facebook || DRUSTVENE_MREZE.instagram) && (
              <div className="flex gap-3 mt-4">
                {DRUSTVENE_MREZE.facebook && (
                  <a href={DRUSTVENE_MREZE.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "#1877F2" }}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v2H7v4h2v7h4v-7h3l1-4h-4V9c0-.6.4-1 1-1z" /></svg>
                  </a>
                )}
                {DRUSTVENE_MREZE.instagram && (
                  <a href={DRUSTVENE_MREZE.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: "linear-gradient(45deg,#F58529,#DD2A7B,#8134AF)" }}>
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Navigacija</h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: "/",          label: "Početna" },
                { href: "/motocikli", label: "Motocikli" },
                { href: "/oprema",    label: "Oprema" },
                { href: "/dijelovi",  label: "Dijelovi" },
                { href: "/rabljena",  label: "Rabljena vozila" },
                { href: "/akcije",    label: "Akcije" },
                { href: "/novosti",   label: "Novosti" },
                { href: "/usporedba", label: "Usporedba modela" },
                { href: "/servis",    label: "Servis" },
                { href: "/trazi",     label: "Pretraživanje" },
                { href: "/kontakt",   label: "Kontakt" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="transition-colors"
                    style={{ color: "var(--muted)" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "var(--green-dk)")}
                    onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4" style={{ color: "var(--text)" }}>Kontakt</h3>
            <ul className="space-y-2 text-sm" style={{ color: "var(--muted)" }}>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--green)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Eugena Kvaternika 4, 10430 Samobor
              </li>
              {TELEFONI.map((t) => (
                <li key={t.poziv} className="flex items-center gap-2">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--green)" }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <a href={`tel:${t.poziv}`} className="transition-colors hover:text-green-700">
                    {t.prikaz}
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--green)" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:moto.jakopec@gmail.com" className="transition-colors hover:text-green-700">
                  moto.jakopec@gmail.com
                </a>
              </li>
            </ul>
            <h3 className="font-semibold mt-6 mb-3" style={{ color: "var(--text)" }}>Radno vrijeme</h3>
            <ul className="space-y-1 text-sm" style={{ color: "var(--muted)" }}>
              {RADNO_VRIJEME.map((r) => (
                <li key={r.dani}>
                  {r.dani}: <span style={{ color: "var(--text)" }}>{r.sati}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs border-t" style={{ color: "var(--muted)", borderColor: "var(--line)" }}>
          <p>© {new Date().getFullYear()} {FIRMA.pravniNaziv} · OIB {FIRMA.oib}</p>
          <div className="flex items-center gap-4">
            <Link href="/privatnost" className="hover:underline">Politika privatnosti</Link>
            <span>Ovlašteni Kawasaki zastupnik</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
