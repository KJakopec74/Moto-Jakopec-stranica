import type { Metadata } from "next";
import Link from "next/link";
import RabljenoCard from "@/components/RabljenoCard";
import { rabljena } from "@/lib/rabljena";

export const metadata: Metadata = {
  title: "Rabljena vozila",
  description: "Rabljeni motocikli, quadovi i Jet Skiji u ponudi Moto Jakopec, Samobor — provjerena vozila iz našeg servisa.",
};

export default function RabljenaPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title">Rabljena vozila</h1>
        <p className="section-subtitle">Pregledana vozila u našoj ponudi — dođite pogledati ili nam pošaljite upit.</p>
      </div>

      {rabljena.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {rabljena.map((v) => <RabljenoCard key={v.id} vozilo={v} />)}
        </div>
      ) : (
        <div className="card p-10 text-center max-w-2xl mx-auto">
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>
            Trenutno nemamo rabljenih vozila u ponudi.
          </p>
          <p className="mb-6" style={{ color: "var(--muted)" }}>
            Javite nam što tražite — obavijestit ćemo vas čim stigne odgovarajuće vozilo.
          </p>
          <Link href="/kontakt?model=Rabljeno%20vozilo" className="btn-primary inline-flex">Pošaljite upit</Link>
        </div>
      )}
    </div>
  );
}
