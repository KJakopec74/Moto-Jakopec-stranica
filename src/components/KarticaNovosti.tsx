import Link from "next/link";
import Image from "next/image";
import { type Novost, datumHr } from "@/lib/novosti";

// Jedna obavijest; "kratko" = na početnoj (tekst skraćen na 3 retka)
export default function KarticaNovosti({ novost, kratko = false }: { novost: Novost; kratko?: boolean }) {
  return (
    <article id={`novost-${novost.id}`} className="card overflow-hidden flex flex-col scroll-mt-24">
      {novost.slika && (
        <div className="relative aspect-[16/9]" style={{ background: "var(--bg2)" }}>
          <Image src={novost.slika} alt={novost.naslov} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <time className="text-xs mb-1" style={{ color: "var(--muted)" }} dateTime={novost.datum}>{datumHr(novost.datum)}</time>
        <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: "var(--text)" }}>{novost.naslov}</h3>
        <p className={`text-sm whitespace-pre-line flex-1 ${kratko ? "line-clamp-3" : ""}`} style={{ color: "var(--muted)" }}>
          {novost.tekst}
        </p>
        <div className="flex gap-4 mt-3 text-sm font-semibold">
          {kratko && (
            <Link href={`/novosti#novost-${novost.id}`} className="hover:underline" style={{ color: "var(--green-dk)" }}>Pročitaj ›</Link>
          )}
          {novost.link && (
            <Link href={novost.link} className="hover:underline" style={{ color: "var(--green-dk)" }}>
              {novost.link.startsWith("/akcije") ? "Pogledaj akcije ›" : "Saznaj više ›"}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
