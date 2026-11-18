"use client";

// =============================================================================
// ServisForma — rezervacija termina za servis
// Zahtjev stiže na moto.jakopec@gmail.com preko Web3Forms (kao i obični upit).
// Termin NIJE automatski potvrđen — javljamo se kupcu i dogovaramo točan termin.
// =============================================================================

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { posaljiObrazac } from "@/lib/web3forms";

type StanjeForme = "uređivanje" | "slanje" | "poslano" | "greška";

const STIL_POLJA = { background: "var(--bg2)", border: "1px solid var(--line)", color: "var(--text)" };
const KLASA_POLJA = "w-full rounded-lg px-4 py-3 text-sm focus:outline-none transition-colors";
const KLASA_OZNAKE = "block text-sm mb-1.5";

// Vrste servisa koje kupac može označiti (može više)
const VRSTE_SERVISA = [
  "Redovni servis",
  "Prvi servis (1.000 km)",
  "Zamjena ulja i filtera",
  "Gume",
  "Kočnice",
  "Lanac i lančanici",
  "Priprema za sezonu / zimovanje",
  "Dijagnostika kvara",
  "Ugradnja opreme / dodataka",
  "Ostalo",
];

// Najraniji datum koji se može odabrati = sutra (format GGGG-MM-DD za <input type="date">)
function sutra() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function ServisForma() {
  const parametri = useSearchParams();
  const pocetniModel = parametri.get("model") || "";

  const [stanje, postaviStanje] = useState<StanjeForme>("uređivanje");
  const [porukaGreske, postaviPorukuGreske] = useState("");
  const [upozorenjeDatuma, postaviUpozorenjeDatuma] = useState("");

  // Subotom i nedjeljom ne radimo — upozori ako je odabran vikend
  function provjeriDatum(vrijednost: string) {
    if (!vrijednost) return postaviUpozorenjeDatuma("");
    const dan = new Date(vrijednost + "T12:00:00").getDay(); // 0 = nedjelja, 6 = subota
    postaviUpozorenjeDatuma(dan === 0 || dan === 6
      ? "Subotom i nedjeljom ne radimo — odaberite radni dan."
      : "");
  }

  async function posalji(dogadaj: React.FormEvent<HTMLFormElement>) {
    dogadaj.preventDefault();
    if (upozorenjeDatuma) return;

    const forma = dogadaj.currentTarget;
    const podaci = new FormData(forma);

    // Označene vrste servisa spajamo u jedan red da u mailu budu pregledne
    const vrste = podaci.getAll("vrsta_servisa").map(String);
    podaci.delete("vrsta_servisa");
    podaci.append("vrsta_servisa", vrste.length ? vrste.join(", ") : "nije označeno");

    const ime = String(podaci.get("ime") || "");
    const model = String(podaci.get("vozilo") || "");
    const datum = String(podaci.get("zeljeni_datum") || "");

    postaviStanje("slanje");
    const greska = await posaljiObrazac(
      podaci,
      `Rezervacija servisa: ${model || "vozilo"}${datum ? ` — ${datum.split("-").reverse().join(".")}.` : ""}`,
      `Web stranica (servis) — ${ime}`,
    );
    if (greska) {
      postaviStanje("greška");
      postaviPorukuGreske(greska);
    } else {
      postaviStanje("poslano");
      forma.reset();
    }
  }

  if (stanje === "poslano") {
    return (
      <div className="text-center py-10">
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-bold text-xl mb-2" style={{ color: "var(--green-dk)" }}>Zahtjev za servis je poslan!</h3>
        <p className="mb-6" style={{ color: "var(--muted)" }}>
          Javit ćemo vam se telefonom ili emailom da potvrdimo točan termin.
        </p>
        <button type="button" className="btn-outline" onClick={() => postaviStanje("uređivanje")}>
          Pošalji novi zahtjev
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={posalji} className="space-y-5">
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Ime i prezime *</label>
          <input name="ime" type="text" required placeholder="Ivan Horvat" className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
        <div>
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Telefon *</label>
          <input name="telefon" type="tel" required placeholder="+385 9x xxx xxxx" className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
      </div>

      <div>
        <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Email *</label>
        <input name="email" type="email" required placeholder="ivan@email.com" className={KLASA_POLJA} style={STIL_POLJA} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Vozilo (marka i model) *</label>
          <input name="vozilo" type="text" required defaultValue={pocetniModel} placeholder="npr. Kawasaki Z900"
            className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
        <div>
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Godište</label>
          <input name="godiste" type="number" min={1970} max={2030} placeholder="2022" className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Prijeđeni kilometri</label>
          <input name="kilometri" type="number" min={0} placeholder="12000" className={KLASA_POLJA} style={STIL_POLJA} />
        </div>
        <div>
          <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Željeni datum *</label>
          <input name="zeljeni_datum" type="date" required min={sutra()}
            onChange={(e) => provjeriDatum(e.target.value)} className={KLASA_POLJA} style={STIL_POLJA} />
          {upozorenjeDatuma && <p className="text-xs mt-1" style={{ color: "#b42318" }}>{upozorenjeDatuma}</p>}
        </div>
      </div>

      <fieldset>
        <legend className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Što treba napraviti?</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {VRSTE_SERVISA.map((v) => (
            <label key={v} className="flex items-center gap-2 text-sm rounded-lg px-3 py-2 cursor-pointer"
              style={{ background: "var(--bg2)", border: "1px solid var(--line)", color: "var(--text)" }}>
              <input type="checkbox" name="vrsta_servisa" value={v} />
              {v}
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <label className={KLASA_OZNAKE} style={{ color: "var(--muted)" }}>Napomena</label>
        <textarea name="poruka" rows={4} placeholder="Opišite kvar ili posebne želje…"
          className={`${KLASA_POLJA} resize-none`} style={STIL_POLJA} />
      </div>

      <label className="flex items-start gap-2 text-sm" style={{ color: "var(--muted)" }}>
        <input name="privola" type="checkbox" required value="Da" className="mt-1" />
        <span>
          Slažem se da Moto Jakopec koristi moje podatke isključivo za dogovor termina servisa
          (<a href="/privatnost" target="_blank" className="underline">politika privatnosti</a>).
        </span>
      </label>

      {stanje === "greška" && (
        <p className="text-sm rounded-lg px-4 py-3" style={{ background: "#fdecec", color: "#b42318" }}>{porukaGreske}</p>
      )}

      <button type="submit" disabled={stanje === "slanje"} className="btn-primary w-full justify-center disabled:opacity-60">
        {stanje === "slanje" ? "Šaljem…" : "Pošalji zahtjev za servis"}
      </button>
    </form>
  );
}
