import type { Metadata } from "next";
import Link from "next/link";
import MotorcycleCard from "@/components/MotorcycleCard";
import ProductCard from "@/components/ProductCard";
import type { Motorcycle } from "@/types/motorcycle";
import type { Product } from "@/types/product";
import modelsData from "@/data/models.json";
import productsData from "@/data/products.json";
import { imaAkciju } from "@/lib/cijena";
import AkcijaCard from "@/components/AkcijaCard";
import { posebneAkcije } from "@/lib/akcije";

export const metadata: Metadata = {
  title: "Akcije",
  description: "Akcijske cijene Kawasaki vozila, opreme i dijelova u Moto Jakopec, Samobor.",
};

const vozila = (modelsData as unknown as Motorcycle[]).filter(imaAkciju);
const proizvodi = (productsData as unknown as Product[]).filter(imaAkciju);

export default function AkcijePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="section-title">Akcije</h1>
        <p className="section-subtitle">Vozila, oprema i dijelovi po sniženim cijenama.</p>
      </div>

      {posebneAkcije.length + vozila.length + proizvodi.length === 0 ? (
        <div className="card p-10 text-center max-w-2xl mx-auto">
          <p className="text-lg font-semibold mb-2" style={{ color: "var(--text)" }}>Trenutno nema aktivnih akcija.</p>
          <p className="mb-6" style={{ color: "var(--muted)" }}>Nazovite nas ili pošaljite upit — rado ćemo vam dati ponudu.</p>
          <Link href="/kontakt" className="btn-primary inline-flex">Pošaljite upit</Link>
        </div>
      ) : (
        <div className="space-y-12">
          {posebneAkcije.length > 0 && (
            <section>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {posebneAkcije.map((a) => <AkcijaCard key={a.id} akcija={a} />)}
              </div>
            </section>
          )}
          {vozila.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text)" }}>Vozila ({vozila.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {vozila.map((m) => <MotorcycleCard key={m.id} bike={m} />)}
              </div>
            </section>
          )}
          {proizvodi.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text)" }}>Oprema i dijelovi ({proizvodi.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {proizvodi.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
