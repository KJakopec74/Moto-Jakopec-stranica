import type { MetadataRoute } from "next";
import modelsData from "@/data/models.json";
import { brendovi, parametriKategorijaSvih } from "@/lib/sitemap-pomoc";
import { ADRESA_STRANICE } from "@/lib/stranica";
import { rabljena } from "@/lib/rabljena";

// =============================================================================
// sitemap.xml — popis svih stranica za Google (generira se pri svakom buildu,
// pa se novi modeli i brendovi dodaju automatski)
// =============================================================================

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const danas = new Date();

  // Glavne stranice
  const glavne = ["", "/motocikli/", "/oprema/", "/dijelovi/", "/rabljena/", "/akcije/", "/novosti/", "/servis/", "/kontakt/", "/privatnost/"].map(
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

  // Stranice kategorija i brendova opreme i dijelova
  const ostale = [
    ...parametriKategorijaSvih().map((putanja) => ({ url: `${ADRESA_STRANICE}${putanja}`, lastModified: danas, priority: 0.6 })),
    ...brendovi().map((putanja) => ({ url: `${ADRESA_STRANICE}${putanja}`, lastModified: danas, priority: 0.5 })),
  ];

  // Rabljena vozila u prodaji
  const rabljenaVozila = rabljena.filter((v) => !v.prodano).map((v) => ({
    url: `${ADRESA_STRANICE}/rabljena/${v.id}/`, lastModified: danas, priority: 0.6,
  }));

  return [...glavne, ...vozila, ...rabljenaVozila, ...ostale];
}
