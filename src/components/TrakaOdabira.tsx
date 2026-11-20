"use client";

// =============================================================================
// TrakaOdabira — traka dolje na ekranu kad je kupac nešto odabrao:
// vozila za usporedbu i/ili artikle za zajednički upit.
// =============================================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePopis, isprazni } from "@/lib/odabir";

export default function TrakaOdabira() {
  const usporedba = usePopis("usporedba");
  const upit = usePopis("upit");
  const putanja = usePathname();
  const naUsporedbi = putanja.startsWith("/usporedba");
  const naKontaktu = putanja.startsWith("/kontakt");

  const prikaziUsporedbu = usporedba.length > 0 && !naUsporedbi;
  const prikaziUpit = upit.length > 0 && !naKontaktu;
  if (!prikaziUsporedbu && !prikaziUpit) return null;

  return (
    <div className="fixed bottom-5 left-4 right-24 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 flex flex-wrap gap-2 justify-center print:hidden">
      {prikaziUsporedbu && (
        <div className="flex items-center gap-1 rounded-full shadow-lg pl-4 pr-1 py-1 text-sm" style={{ background: "var(--text)", color: "white" }}>
          <span>Usporedba: <b>{usporedba.length}</b>/3</span>
          <Link href={`/usporedba?v=${usporedba.join(",")}`} className="ml-2 px-3 py-1.5 rounded-full font-semibold"
            style={{ background: "var(--green)" }}>
            Usporedi ›
          </Link>
          <button type="button" onClick={() => isprazni("usporedba")} aria-label="Očisti usporedbu" className="px-2 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
      {prikaziUpit && (
        <div className="flex items-center gap-1 rounded-full shadow-lg pl-4 pr-1 py-1 text-sm" style={{ background: "var(--text)", color: "white" }}>
          <span>U upitu: <b>{upit.length}</b></span>
          <Link href="/kontakt#upit" className="ml-2 px-3 py-1.5 rounded-full font-semibold" style={{ background: "var(--green)" }}>
            Pošalji upit ›
          </Link>
        </div>
      )}
    </div>
  );
}
