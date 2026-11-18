// =============================================================================
// web3forms.ts — slanje obrazaca (upit, rezervacija servisa) na naš email
// -----------------------------------------------------------------------------
// Web3Forms (https://web3forms.com) poruku automatski proslijedi na
// moto.jakopec@gmail.com. Pristupni ključ je javan — smije biti vidljiv u
// pregledniku, on samo određuje na koji email stiže poruka.
// =============================================================================

const WEB3FORMS_ADRESA = "https://api.web3forms.com/submit";

export const PRISTUPNI_KLJUC =
  process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "d693c9a6-f17a-409d-8098-1a4d7970798f";

// Vraća prazan tekst ako je sve u redu, inače poruku o grešci za korisnika
export async function posaljiObrazac(podaci: FormData, naslov: string, posiljatelj: string): Promise<string> {
  podaci.append("access_key", PRISTUPNI_KLJUC);
  podaci.append("subject", naslov);
  podaci.append("from_name", posiljatelj);
  try {
    const odgovor = await fetch(WEB3FORMS_ADRESA, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: podaci,
    });
    const rezultat = await odgovor.json();
    return rezultat.success ? "" : "Slanje nije uspjelo. Pokušajte ponovno ili nas nazovite.";
  } catch {
    return "Nema veze s poslužiteljem. Provjerite internet i pokušajte ponovno.";
  }
}
