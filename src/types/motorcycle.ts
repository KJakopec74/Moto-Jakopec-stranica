export interface Motorcycle {
  id: number;
  name: string;
  brand: string;
  category: string;
  purpose?: string;
  license_category?: string;
  is_new?: boolean;
  description: string;
  price: string;
  akcijska_cijena?: string;   // prazno = nema akcije; inače nova cijena (price se precrta)
  price_2024?: string;
  price_2025?: string;
  price_2026?: string;
  images: string[];
  // Paketi opreme (Tourer, Performance…): cijena = nadoplata na cijenu vozila
  paketi?: PaketOpreme[];
  specs: Record<string, string>;
}

export interface PaketOpreme {
  naziv: string;       // npr. "Tourer"
  cijena: string;      // nadoplata, npr. "1.460 €" ili "Cijena na upit"
  sadrzaj: string[];   // što paket sadrži (prazno = sadržaj na upit)
}

export type Category =
  | "Sve"
  | "Sport"
  | "Naked"
  | "Adventure"
  | "Touring"
  | "Classic"
  | "Cruiser"
  | "Offroad"
  | "Električni"
  | "Quad"
  | "Mule"
  | "Jet Ski";

export const CATEGORIES: Category[] = [
  "Sve",
  "Sport",
  "Naked",
  "Adventure",
  "Touring",
  "Classic",
  "Cruiser",
  "Offroad",
  "Električni",
  "Quad",
  "Mule",
  "Jet Ski",
];
