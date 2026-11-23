import Link from "next/link";

// Stranica koja se prikaže kad adresa ne postoji (npr. stari ili krivo upisan link)
export default function NijePronadeno() {
  const linkovi = [
    { href: "/motocikli", naziv: "Motocikli" },
    { href: "/oprema", naziv: "Oprema" },
    { href: "/dijelovi", naziv: "Dijelovi" },
    { href: "/akcije", naziv: "Akcije" },
    { href: "/kontakt", naziv: "Kontakt" },
  ];
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-7xl font-black mb-4" style={{ color: "var(--green)" }}>404</div>
      <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "var(--text)" }}>Stranica nije pronađena</h1>
      <p className="mb-8" style={{ color: "var(--muted)" }}>
        Adresa je možda promijenjena ili krivo upisana. Pokušajte s tražilicom ili krenite od početne stranice.
      </p>
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Link href="/" className="btn-primary">Početna stranica</Link>
        <Link href="/trazi" className="btn-outline">Pretraživanje</Link>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        {linkovi.map((l) => (
          <Link key={l.href} href={l.href} className="hover:underline" style={{ color: "var(--green-dk)" }}>{l.naziv}</Link>
        ))}
      </div>
    </div>
  );
}
