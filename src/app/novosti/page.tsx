import type { Metadata } from "next";
import Link from "next/link";
import KarticaNovosti from "@/components/KarticaNovosti";
import { novosti } from "@/lib/novosti";

export const metadata: Metadata = {
  title: "Novosti",
  description: "Novosti i obavijesti Moto Jakopec — novi Kawasaki modeli, akcije, radno vrijeme i događanja.",
};

export default function NovostiPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="section-title mb-2">Novosti</h1>
      <p className="section-subtitle mb-10">Novi modeli, akcije i obavijesti.</p>
      {novosti.length ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {novosti.map((n) => <KarticaNovosti key={n.id} novost={n} />)}
        </div>
      ) : (
        <div className="card p-10 text-center">
          <p className="mb-6" style={{ color: "var(--muted)" }}>Trenutno nema novih obavijesti.</p>
          <Link href="/motocikli" className="btn-primary inline-flex">Pogledaj ponudu</Link>
        </div>
      )}
    </div>
  );
}
