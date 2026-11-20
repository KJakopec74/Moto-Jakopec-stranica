// Posebne akcije iz akcije.xlsx (scripts/akcije_excel_to_json.py)
import akcijeData from "@/data/akcije.json";

export interface PosebnaAkcija {
  id: number;
  naziv: string;
  kategorija: string;
  cijena: string;            // redovna (precrta se); može biti prazno
  akcijska_cijena: string;
  opis: string;
  image_folder: string;
  slike: string[];
  vrijedi_do: string;        // "2026-12-31" ili ""
  objavljeno: boolean;
}

const danas = () => new Date().toISOString().slice(0, 10);

// Objavljene akcije kojima rok još nije prošao (u trenutku izrade stranice)
export const posebneAkcije: PosebnaAkcija[] = (akcijeData as PosebnaAkcija[])
  .filter((a) => a.objavljeno && (!a.vrijedi_do || a.vrijedi_do >= danas()));

// U pregledniku: je li rok prošao (stranica se ne gradi svaki dan, pa provjeravamo i ovdje)
export function istekla(a: PosebnaAkcija) {
  return !!a.vrijedi_do && a.vrijedi_do < danas();
}
