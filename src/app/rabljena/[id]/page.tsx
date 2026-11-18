import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import BikeGallery from "@/components/BikeGallery";
import { rabljena } from "@/lib/rabljena";
import { tisucice } from "@/lib/cijena";
import { TELEFONI } from "@/lib/stranica";

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  // Statični izvoz traži barem jednu stranicu — dok nema vozila, radi se prazna "0"
  return rabljena.length ? rabljena.map((v) => ({ id: String(v.id) })) : [{ id: "0" }];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const v = rabljena.find((x) => x.id === Number(id));
  if (!v) return { title: "Vozilo nije pronađeno", robots: { index: false } };
  const dio = [v.godiste, v.kilometri != null ? `${tisucice(v.kilometri)} km` : null].filter(Boolean).join(", ");
  return {
    title: `${v.name}${dio ? ` (${dio})` : ""} — rabljeno`,
    description: `${v.description} ${v.prodano ? "Prodano." : `Cijena: ${v.price}.`} Moto Jakopec, Samobor.`,
    openGraph: { title: v.name, description: v.description, images: v.images?.[0] ? [v.images[0]] : undefined },
  };
}

export default async function RabljenoDetaljiPage({ params }: Props) {
  const { id } = await params;
  const v = rabljena.find((x) => x.id === Number(id));
  if (!v) notFound();

  const glavni = [
    ["Marka", v.brand],
    ["Godište", v.godiste ? String(v.godiste) : ""],
    ["Prijeđeno", v.kilometri != null ? `${tisucice(v.kilometri)} km` : ""],
    ["Vozačka kategorija", v.license_category],
  ].filter(([, x]) => x);
  const ostalo = Object.entries(v.specs ?? {});
  const naziv = `${v.name}${v.godiste ? ` (${v.godiste})` : ""} — rabljeno`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--muted)" }}>
        <Link href="/" className="hover:underline">Početna</Link>
        <span>/</span>
        <Link href="/rabljena" className="hover:underline">Rabljena vozila</Link>
        <span>/</span>
        <span style={{ color: "var(--text)" }}>{v.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div><BikeGallery images={v.images} name={v.name} /></div>

        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--text)", color: "white" }}>RABLJENO</span>
            {v.category && (
              <span className="text-xs font-medium px-3 py-1 rounded-full border"
                style={{ background: "rgba(55,182,58,.08)", color: "var(--green-dk)", borderColor: "rgba(55,182,58,.25)" }}>
                {v.category}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3" style={{ color: "var(--text)" }}>{v.name}</h1>
          <p className="leading-relaxed mb-6 whitespace-pre-line" style={{ color: "var(--muted)" }}>{v.description}</p>

          <div className="card p-5 mb-6">
            <div className="text-sm mb-1" style={{ color: "var(--muted)" }}>Cijena</div>
            <div className="text-4xl font-black" style={{ color: v.prodano ? "var(--muted)" : "var(--green-dk)" }}>
              {v.prodano ? "Prodano" : v.price}
            </div>
          </div>

          {!v.prodano && (
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href={`/kontakt?model=${encodeURIComponent(naziv)}`} className="btn-primary flex-1 justify-center">Pošalji upit</Link>
              <a href={`tel:${TELEFONI[0].poziv}`} className="btn-outline flex-1 justify-center">Nazovi nas</a>
            </div>
          )}

          {(glavni.length > 0 || ostalo.length > 0) && (
            <div>
              <h2 className="font-bold text-lg mb-3" style={{ color: "var(--text)" }}>Podaci o vozilu</h2>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {[...glavni, ...ostalo].map(([k, x], i) => (
                      <tr key={k} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--surface)" }}>
                        <td className="px-4 py-2.5 font-medium w-1/2" style={{ color: "var(--muted)" }}>{k}</td>
                        <td className="px-4 py-2.5" style={{ color: "var(--text)" }}>{x}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t" style={{ borderColor: "var(--line)" }}>
        <Link href="/rabljena" className="text-sm" style={{ color: "var(--muted)" }}>‹ Natrag na rabljena vozila</Link>
      </div>
    </div>
  );
}
