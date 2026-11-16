// Pomoćne funkcije za sitemap.xml — putanje stranica kategorija i brendova
import { kategorije, proizvodiKategorije, brendovi as aktivniBrendovi, type Vrsta } from "@/lib/kategorije";

const VRSTE: Vrsta[] = ["oprema", "dijelovi"];

export function parametriKategorijaSvih(): string[] {
  return VRSTE.flatMap((v) =>
    kategorije(v).filter((k) => proizvodiKategorije(v, k).length > 0).map((k) => `/${v}/${k.slug}/`)
  );
}

export function brendovi(): string[] {
  return VRSTE.flatMap((v) => aktivniBrendovi(v).map((b) => `/${v}/brend/${b.brand_id}/`));
}
