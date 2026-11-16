import type { Metadata } from "next";
import StranicaKategorije, { parametriKategorija, nadiKategoriju } from "@/components/StranicaKategorije";

export function generateStaticParams() {
  return parametriKategorija("oprema");
}

export function generateMetadata({ params }: { params: { kategorija: string } }): Metadata {
  const k = nadiKategoriju("oprema", params.kategorija);
  return k ? { title: k.naziv, description: k.opis || undefined } : {};
}

export default function OpremaKategorija({ params }: { params: { kategorija: string } }) {
  return <StranicaKategorije vrsta="oprema" slug={params.kategorija} />;
}
