// =============================================================================
// Cijena — prikaz cijene; kod akcije stara cijena je precrtana, nova crvena
// =============================================================================

import { imaAkciju, cijenaUBroj } from "@/lib/cijena";

interface Props {
  price: string;
  akcijska_cijena?: string;
  velicina?: "mala" | "srednja" | "velika";
}

const KLASE = {
  mala:    { nova: "font-bold text-base", stara: "text-xs" },
  srednja: { nova: "font-bold text-lg",   stara: "text-xs" },
  velika:  { nova: "text-4xl font-black", stara: "text-base" },
};

export const CRVENA = "#d92d20";

export default function Cijena({ price, akcijska_cijena, velicina = "srednja" }: Props) {
  const k = KLASE[velicina];
  if (!imaAkciju({ price, akcijska_cijena })) {
    return <span className={k.nova} style={{ color: "var(--green-dk)" }}>{price || "Cijena na upit"}</span>;
  }
  return (
    <span className="flex flex-col leading-tight">
      {/* stara cijena precrtana (ako je bila "Cijena na upit", ne prikazuje se) */}
      {cijenaUBroj(price) !== null && (
        <span className={`${k.stara} line-through`} style={{ color: "var(--muted)" }}>{price}</span>
      )}
      <span className={k.nova} style={{ color: CRVENA }}>{akcijska_cijena}</span>
    </span>
  );
}

// Crvena oznaka "AKCIJA -10%" za kartice
export function OznakaAkcije({ postotak }: { postotak: number | null }) {
  return (
    <span className="text-white text-xs font-bold px-2 py-1 rounded" style={{ background: CRVENA }}>
      AKCIJA{postotak ? ` −${postotak}%` : ""}
    </span>
  );
}
