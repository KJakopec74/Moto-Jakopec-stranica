// =============================================================================
// cijena.ts — pomoćne funkcije za akcijske cijene
// =============================================================================

// "10.275 €" → 10275,  "149,90 €" → 149.9,  "Cijena na upit" → null
export function cijenaUBroj(tekst?: string): number | null {
  if (!tekst) return null;
  const cisto = tekst.replace(/[^0-9,.]/g, "");
  if (!/[0-9]/.test(cisto)) return null;
  const broj = Number(cisto.replace(/\./g, "").replace(",", "."));
  return Number.isFinite(broj) ? broj : null;
}

// Ima li artikl akciju (akcijska cijena upisana i različita od redovne)
export function imaAkciju(x: { price?: string; akcijska_cijena?: string }): boolean {
  return !!x.akcijska_cijena && x.akcijska_cijena.trim() !== "" && x.akcijska_cijena !== x.price;
}

// Popust u postocima (zaokruženo), ili null ako se ne može izračunati
export function postotakPopusta(x: { price?: string; akcijska_cijena?: string }): number | null {
  if (!imaAkciju(x)) return null;
  const stara = cijenaUBroj(x.price);
  const nova = cijenaUBroj(x.akcijska_cijena);
  if (!stara || !nova || nova >= stara) return null;
  return Math.round((1 - nova / stara) * 100);
}

// "12500" → "12.500"
export function tisucice(broj: number): string {
  return String(Math.round(broj)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
