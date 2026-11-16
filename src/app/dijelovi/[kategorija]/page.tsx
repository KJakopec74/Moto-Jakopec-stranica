import type { Metadata } from "next";
import StranicaKategorije, { parametriKategorija, nadiKategoriju } from "@/components/StranicaKategorije";

export function generateStaticParams() {
  return parametriKategorija("dijelovi");
}

export function generateMetadata({ params }: { params: { kategorija: string } }): Metadata {
  const k = nadiKategoriju("dijelovi", params.kategorija);
  return k ? { title: k.naziv, description: k.opis || undefined } : {};
}

export default function DijeloviKategorija({ params }: { params: { kategorija: string } }) {
  return <StranicaKategorije vrsta="dijelovi" slug={params.kategorija} />;
}
