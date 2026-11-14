import type { MetadataRoute } from "next";
import modelsData from "@/data/models.json";
import brandsData from "@/data/brands.json";
import { ADRESA_STRANICE } from "@/lib/stranica";

// =============================================================================
// sitemap.xml — popis svih stranica za Google (generira se pri svakom buildu,
// pa se novi modeli i brendovi dodaju automatski)
// =============================================================================

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const danas = new Date();

  // Glavne stranice
  const glavne = ["", "/motocikli/", "/oprema/", "/dijelovi/", "/kontakt/", "/privatnost/"].map(
    (putanja) => ({
      url: `${ADRESA_STRANICE}${putanja}`,
      lastModified: danas,
      priority: putanja === "" ? 1 : 0.8,
    })
  );

  // Stranica svakog vozila
  const vozila = (modelsData as { id: number }[]).map((m) => ({
    url: `${ADRESA_STRANICE}/motocikli/${m.id}/`,
    lastModified: danas,
    priority: 0.7,
  }));

  // Stranice brendova opreme i dijelova
  const brendovi = brandsData as { oprema: { brand_id: string }[]; dijelovi: { brand_id: string }[] };
  const oprema = brendovi.oprema.map((b) => ({
    url: `${ADRESA_STRANICE}/oprema/${b.brand_id}/`,
    lastModified: danas,
    priority: 0.5,
  }));
  const dijelovi = brendovi.dijelovi.map((b) => ({
    url: `${ADRESA_STRANICE}/dijelovi/${b.brand_id}/`,
    lastModified: danas,
    priority: 0.5,
  }));

  return [...glavne, ...vozila, ...oprema, ...dijelovi];
}
