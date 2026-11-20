import novostiData from "@/data/novosti.json";

export interface Novost {
  id: number;
  datum: string;       // "2026-11-20"
  naslov: string;
  tekst: string;
  slika: string;
  link: string;
  istaknuto: boolean;
  objavljeno: boolean;
}

// Samo objavljene, najnovije prve
export const novosti: Novost[] = (novostiData as Novost[])
  .filter((n) => n.objavljeno)
  .sort((a, b) => b.datum.localeCompare(a.datum));

export const istaknuteNovosti = novosti.filter((n) => n.istaknuto).slice(0, 3);

// "2026-11-20" → "20. 11. 2026."
export function datumHr(d: string) {
  const [g, m, dan] = d.split("-");
  return `${Number(dan)}. ${Number(m)}. ${g}.`;
}
