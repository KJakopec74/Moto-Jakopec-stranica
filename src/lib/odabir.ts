"use client";

// =============================================================================
// odabir.ts — popisi koje posjetitelj slaže dok pregledava stranicu:
//   • "usporedba" — do 3 vozila za usporedbu (id-evi vozila)
//   • "upit"      — artikli za jedan zajednički upit (nazivi)
// Pamte se u pregledniku (localStorage), pa ostaju i kad se prelazi sa stranice
// na stranicu. Ako preglednik ne dopušta spremanje, popis traje do zatvaranja.
// =============================================================================

import { useSyncExternalStore } from "react";

type Popis = "usporedba" | "upit";
const KLJUC = (p: Popis) => `moto-jakopec-${p}`;
export const NAJVISE_ZA_USPOREDBU = 3;

const uMemoriji: Record<Popis, string[]> = { usporedba: [], upit: [] };
const slusatelji = new Set<() => void>();
const prazno: string[] = [];
const zadnje: Record<Popis, { tekst: string; vrijednost: string[] }> = {
  usporedba: { tekst: "", vrijednost: prazno },
  upit: { tekst: "", vrijednost: prazno },
};

function procitaj(p: Popis): string[] {
  let tekst = "";
  try {
    tekst = window.localStorage.getItem(KLJUC(p)) ?? "";
  } catch {
    tekst = JSON.stringify(uMemoriji[p]);
  }
  // ista vrijednost → isti niz (inače bi React stalno iscrtavao)
  if (tekst === zadnje[p].tekst) return zadnje[p].vrijednost;
  let vrijednost: string[] = [];
  try {
    const v = JSON.parse(tekst || "[]");
    vrijednost = Array.isArray(v) ? v.map(String) : [];
  } catch {
    vrijednost = [];
  }
  zadnje[p] = { tekst, vrijednost };
  return vrijednost;
}

function spremi(p: Popis, vrijednost: string[]) {
  uMemoriji[p] = vrijednost;
  try {
    window.localStorage.setItem(KLJUC(p), JSON.stringify(vrijednost));
  } catch {
    /* preglednik ne dopušta spremanje — ostaje u memoriji */
  }
  slusatelji.forEach((f) => f());
}

function pretplati(f: () => void) {
  slusatelji.add(f);
  const naPromjenu = (e: StorageEvent) => { if (e.key?.startsWith("moto-jakopec-")) f(); };
  window.addEventListener("storage", naPromjenu);   // promjena u drugoj kartici preglednika
  return () => { slusatelji.delete(f); window.removeEventListener("storage", naPromjenu); };
}

// Hook: trenutni popis (na poslužitelju uvijek prazan)
export function usePopis(p: Popis): string[] {
  return useSyncExternalStore(pretplati, () => procitaj(p), () => prazno);
}

export function dodaj(p: Popis, stavka: string) {
  const sada = procitaj(p);
  if (sada.includes(stavka)) return;
  if (p === "usporedba" && sada.length >= NAJVISE_ZA_USPOREDBU) return;
  spremi(p, [...sada, stavka]);
}
export function makni(p: Popis, stavka: string) {
  spremi(p, procitaj(p).filter((s) => s !== stavka));
}
export function prebaci(p: Popis, stavka: string) {
  if (procitaj(p).includes(stavka)) makni(p, stavka); else dodaj(p, stavka);
}
export function isprazni(p: Popis) {
  spremi(p, []);
}
