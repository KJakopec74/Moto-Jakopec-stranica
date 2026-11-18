"use client";

// =============================================================================
// UpitForma — forma za slanje upita kupca
// -----------------------------------------------------------------------------
// Upit se šalje preko servisa Web3Forms (https://web3forms.com), koji poruku
// automatski proslijedi na naš email (moto.jakopec@gmail.com).
//
// Pristupni ključ (access key) je javan — smije biti vidljiv u pregledniku,
// on samo određuje na koji email stiže poruka. Ključ je napravljen na
// web3forms.com s računom moto.jakopec@gmail.com.
// =============================================================================

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { PRISTUPNI_KLJUC, posaljiObrazac } from "@/lib/web3forms";

// Moguća stanja forme
type StanjeForme = "uređivanje" | "slanje" | "poslano" | "greška";

// Zajednički stil za sva polja unosa
const STIL_POLJA = {
  background: "var(--bg2)",
  border: "1px solid var(--line)",
  color: "var(--text)",
};
const KLASA_POLJA =
  "w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors";

export default function UpitForma() {
  // Ako je kupac došao s kartice vozila/proizvoda, naziv je u adresi: /kontakt?model=...
  const parametri = useSearchParams();
  const pocetniModel = parametri.get("model") || "";

  const [stanje, postaviStanje] = useState<StanjeForme>("uređivanje");
  const [porukaGreske, postaviPorukuGreske] = useState("");

  // Funkcija koja se poziva kad kupac klikne "Pošalji upit"
  async function posaljiUpit(dogadaj: React.FormEvent<HTMLFormElement>) {
    // Sprječavamo da preglednik sam ponovno učita stranicu
    dogadaj.preventDefault();

    // Provjera: je li pristupni ključ postavljen
    if (PRISTUPNI_KLJUC === "") {
      postaviStanje("greška");
      postaviPorukuGreske("Forma još nije podešena. Molimo nazovite nas ili pošaljite email.");
      return;
    }

    postaviStanje("slanje");

    // 1) Skupljamo podatke iz svih polja forme
    const forma = dogadaj.currentTarget;
    const podaci = new FormData(forma);

    // 2) Šaljemo podatke servisu Web3Forms (vidi src/lib/web3forms.ts)
    const ime = String(podaci.get("ime") || "");
    const model = String(podaci.get("model") || "");
    const greska = await posaljiObrazac(
      podaci,
      model ? `Novi upit s web stranice: ${model}` : "Novi upit s web stranice",
      `Web stranica — ${ime}`,
    );
    if (greska) {
      postaviStanje("greška");
      postaviPorukuGreske(greska);
    } else {
      postaviStanje("poslano");
      forma.reset();
    }
  }

  // ── Prikaz nakon uspješnog slanja ─────────────────────────────────────────
  if (stanje === "poslano") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-bold text-xl mb-2" style={{ color: "var(--green-dk)" }}>
          Upit je poslan!
        </h3>
        <p className="mb-6" style={{ color: "var(--muted)" }}>
          Hvala vam. Javit ćemo vam se u najkraćem mogućem roku.
        </p>
        <button type="button" className="btn-outline" onClick={() => postaviStanje("uređivanje")}>
          Pošalji novi upit
        </button>
      </div>
    );
  }

  // ── Prikaz forme ──────────────────────────────────────────────────────────
  return (
    <form onSubmit={posaljiUpit} className="space-y-4">
      {/* Skriveno polje protiv spam robota — ljudi ga ne vide i ne popunjavaju */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>Ime i prezime</label>
          <input name="ime" type="text" required placeholder="Ivan Horvat"
            className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
        <div>
          <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>Telefon</label>
          <input name="telefon" type="tel" placeholder="+385 9x xxx xxxx"
            className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>Email</label>
        <input name="email" type="email" required placeholder="ivan@email.com"
          className={KLASA_POLJA} style={STIL_POLJA} />
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>Model / proizvod koji vas zanima</label>
        <input name="model" type="text" defaultValue={pocetniModel} placeholder="npr. Kawasaki Z900"
          className={KLASA_POLJA} style={STIL_POLJA} />
      </div>

      <div>
        <label className="block text-sm mb-1.5" style={{ color: "var(--muted)" }}>Poruka</label>
        <textarea name="poruka" required rows={4} placeholder="Vaša poruka..."
          className={`${KLASA_POLJA} resize-none`} style={STIL_POLJA} />
      </div>

      {/* Privola za obradu osobnih podataka (GDPR) */}
      <label className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
        <input name="privola" type="checkbox" required value="Da" className="mt-1" />
        <span>
          Slažem se da Moto Jakopec koristi moje podatke isključivo kako bi odgovorio na ovaj upit
          (<a href="/privatnost" target="_blank" className="underline">politika privatnosti</a>).
        </span>
      </label>

      {/* Poruka o grešci */}
      {stanje === "greška" && (
        <p className="text-sm rounded-lg px-4 py-3" style={{ background: "#fdecec", color: "#b42318" }}>
          {porukaGreske}
        </p>
      )}

      <button type="submit" disabled={stanje === "slanje"}
        className="btn-primary w-full justify-center disabled:opacity-60">
        {stanje === "slanje" ? "Šaljem..." : "Pošalji upit"}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </form>
  );
}
