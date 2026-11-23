import type { Metadata } from "next";
import Link from "next/link";
import { FIRMA } from "@/lib/stranica";

// =============================================================================
// Politika privatnosti — objašnjava kupcima što radimo s podacima iz forme
// za upit i rezervaciju servisa (GDPR). Naziv obrta i OIB su u src/lib/stranica.ts.
// =============================================================================

export const metadata: Metadata = {
  title: "Politika privatnosti",
  description: "Kako Moto Jakopec prikuplja i koristi osobne podatke poslane putem web stranice.",
};

// Datum zadnje izmjene teksta — promijeniti kad se tekst mijenja
const DATUM_IZMJENE = "23. studenoga 2026.";

export default function PrivatnostPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="section-title mb-2">Politika privatnosti</h1>
      <p className="text-sm mb-10" style={{ color: "var(--muted)" }}>
        Zadnja izmjena: {DATUM_IZMJENE}
      </p>

      <div className="card p-6 sm:p-8 space-y-8 leading-relaxed" style={{ color: "var(--text)" }}>
        <Odjeljak naslov="1. Tko obrađuje vaše podatke">
          <p>
            Voditelj obrade osobnih podataka je <strong>{FIRMA.pravniNaziv}</strong>, Eugena Kvaternika 4,
            10430 Samobor, OIB {FIRMA.oib}. Za sva pitanja o vašim podacima javite nam se na{" "}
            <a href="mailto:moto.jakopec@gmail.com" className="underline">moto.jakopec@gmail.com</a>{" "}
            ili na telefon <a href="tel:+38513371059" className="underline">01/3371-059</a>.
          </p>
        </Odjeljak>

        <Odjeljak naslov="2. Koje podatke prikupljamo">
          <p>Kada nam pošaljete upit (stranica Kontakt) ili zahtjev za servis (stranica Servis), prikupljamo:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>ime i prezime,</li>
            <li>email adresu,</li>
            <li>broj telefona,</li>
            <li>vozila, proizvode ili artikle koji vas zanimaju te sadržaj poruke,</li>
            <li>kod rezervacije servisa: podatke o vozilu (model, godište, kilometri) i željeni termin.</li>
          </ul>
          <p>
            Stranica ne koristi kolačiće za praćenje ni oglašavanje i ne zahtijeva registraciju.
            Popis vozila za usporedbu i artikala za upit pamti se samo u vašem pregledniku
            (lokalna pohrana) i ne šalje nam se dok sami ne pošaljete upit.
          </p>
        </Odjeljak>

        <Odjeljak naslov="3. Zašto koristimo podatke">
          <p>
            Podatke koristimo isključivo kako bismo odgovorili na vaš upit, poslali vam ponudu ili
            dogovorili termin. Ne koristimo ih za slanje reklamnih poruka i ne prodajemo ih trećim
            stranama.
          </p>
          <p>
            Pravna osnova je vaša privola koju dajete označavanjem kućice prije slanja upita te
            poduzimanje radnji na vaš zahtjev prije sklapanja ugovora (čl. 6. st. 1. točke a) i b)
            Opće uredbe o zaštiti podataka — GDPR).
          </p>
        </Odjeljak>

        <Odjeljak naslov="4. Tko još ima pristup podacima">
          <p>Za rad stranice koristimo pouzdane vanjske usluge:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Web3Forms</strong> — prosljeđuje poruku iz forme na naš email;
            </li>
            <li>
              <strong>Google (Gmail)</strong> — u našem email sandučiću čuvamo primljene upite;
            </li>
            <li>
              <strong>Cloudflare</strong> — poslužitelj na kojem se nalazi web stranica;
            </li>
            <li>
              <strong>Google Maps</strong> — karta na stranici Kontakt (Google pritom može
              postaviti vlastite kolačiće).
            </li>
            <li>
              <strong>YouTube</strong> — videi se prikazuju preko youtube-nocookie.com (način
              s pojačanom privatnošću). Istaknuti video na početnoj stranici pokreće se sam,
              bez zvuka; videi na stranicama vozila učitavaju se tek kad ih pokrenete.
            </li>
          </ul>
        </Odjeljak>

        <Odjeljak naslov="5. Koliko dugo čuvamo podatke">
          <p>
            Podatke čuvamo onoliko dugo koliko je potrebno da odgovorimo na upit i dovršimo
            eventualnu kupnju ili uslugu. Nakon toga ih brišemo, osim ako ih moramo čuvati duže
            zbog zakonskih obveza (npr. računi).
          </p>
        </Odjeljak>

        <Odjeljak naslov="6. Vaša prava">
          <p>U svakom trenutku možete zatražiti:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>uvid u podatke koje imamo o vama,</li>
            <li>ispravak netočnih podataka,</li>
            <li>brisanje podataka,</li>
            <li>ograničenje obrade ili povlačenje privole.</li>
          </ul>
          <p>
            Zahtjev pošaljite na{" "}
            <a href="mailto:moto.jakopec@gmail.com" className="underline">moto.jakopec@gmail.com</a>.
            Ako smatrate da su vaša prava povrijeđena, možete podnijeti prigovor Agenciji za zaštitu
            osobnih podataka (AZOP),{" "}
            <a href="https://azop.hr" target="_blank" rel="noopener noreferrer" className="underline">
              azop.hr
            </a>.
          </p>
        </Odjeljak>
      </div>

      <div className="mt-8">
        <Link href="/kontakt" className="btn-outline">← Natrag na kontakt</Link>
      </div>
    </div>
  );
}

// Jedan odjeljak s naslovom i tekstom
function Odjeljak({ naslov, children }: { naslov: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-bold text-lg">{naslov}</h2>
      {children}
    </section>
  );
}
