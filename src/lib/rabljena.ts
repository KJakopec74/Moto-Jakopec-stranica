import rabljenaData from "@/data/rabljena.json";
import type { RabljenoVozilo } from "@/types/rabljeno";

// Sva rabljena vozila: prvo ona u prodaji (najnovija godišta prva), prodana na kraju
export const rabljena: RabljenoVozilo[] = [...(rabljenaData as unknown as RabljenoVozilo[])].sort(
  (a, b) => Number(a.prodano) - Number(b.prodano) || (b.godiste ?? 0) - (a.godiste ?? 0) || b.id - a.id
);
export const rabljenaUProdaji = rabljena.filter((v) => !v.prodano);
