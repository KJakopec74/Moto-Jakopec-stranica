"use client";

import Link from "next/link";
import { TELEFONI } from "@/lib/stranica";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";

const navLinks = [
  { href: "/",                            label: "Početna" },
  { href: "/motocikli",                   label: "Motocikli" },
  { href: "/motocikli?category=Quad",     label: "Quad" },
  { href: "/motocikli?category=Mule",     label: "Mule" },
  { href: "/motocikli?category=Jet+Ski",  label: "Jet Ski" },
  { href: "/rabljena",                    label: "Rabljena" },
  { href: "/oprema",                      label: "Oprema" },
  { href: "/dijelovi",                    label: "Dijelovi" },
  { href: "/akcije",                      label: "Akcije" },   // prikazuje se samo dok traje neka akcija
  { href: "/servis",                      label: "Servis" },
  { href: "/kontakt",                     label: "Kontakt" },
];

function HeaderInner({ imaAkcija }: { imaAkcija: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const linkovi = navLinks.filter((l) => l.href !== "/akcije" || imaAkcija);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    const [path, query] = href.split("?");
    if (pathname !== path) return false;
    if (!query) return !searchParams.get("category");
    const param = new URLSearchParams(query);
    return searchParams.get("category") === param.get("category");
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur border-b" style={{background:"rgba(237,243,237,0.95)", borderColor:"var(--line)"}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo-jakopec.png"
              alt="Moto Jakopec"
              width={140}
              height={49}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {linkovi.filter((l) => l.href !== "/").map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "font-semibold"
                    : "hover:bg-black/5"
                }`}
                style={
                  isActive(link.href)
                    ? { color: "var(--green-dk)", background: "rgba(55,182,58,0.1)" }
                    : { color: link.href === "/akcije" ? "#d92d20" : "var(--text)" }
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Telefon + tražilica */}
          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            <a
              href="tel:+38513371059"
              className="hidden xl:flex text-sm items-center gap-1 transition-colors mr-2"
              style={{ color: "var(--muted)" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--green-dk)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              01/3371-059
            </a>
            {/* Tražilica za cijelu stranicu (vozila, oprema, dijelovi) */}
            <Link href="/trazi" aria-label="Pretraživanje" title="Pretraživanje"
              className="p-2 rounded-lg transition-colors hover:bg-black/5"
              style={{ color: pathname === "/trazi" ? "var(--green-dk)" : "var(--text)" }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden p-2 transition-colors"
            style={{ color: "var(--muted)" }}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden border-t py-4 space-y-1" style={{borderColor:"var(--line)"}}>
            {linkovi.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors`}
                style={
                  isActive(link.href)
                    ? { color: "var(--green-dk)", background: "rgba(55,182,58,0.1)" }
                    : { color: link.href === "/akcije" ? "#d92d20" : "var(--text)" }
                }
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 px-4 text-sm space-y-1" style={{ color: "var(--muted)" }}>
              {TELEFONI.map((t) => (
                <a key={t.poziv} href={`tel:${t.poziv}`} className="block py-1" style={{ color: "var(--text)" }}>
                  📞 {t.prikaz} <span className="text-xs" style={{ color: "var(--muted)" }}>{t.vrsta}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

// imaAkcija: ima li ijedno vozilo/proizvod akcijsku cijenu (računa se u layout.tsx)
export default function Header({ imaAkcija = false }: { imaAkcija?: boolean }) {
  return (
    <Suspense fallback={null}>
      <HeaderInner imaAkcija={imaAkcija} />
    </Suspense>
  );
}
