import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BrzaPoruka from "@/components/BrzaPoruka";
import TrakaOdabira from "@/components/TrakaOdabira";
import modelsData from "@/data/models.json";
import productsData from "@/data/products.json";
import { imaAkciju } from "@/lib/cijena";
import { ADRESA_STRANICE, FIRMA, TELEFONI, DRUSTVENE_MREZE } from "@/lib/stranica";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  // Osnovna adresa — potrebna da linkovi na slike za dijeljenje budu potpuni
  metadataBase: new URL(ADRESA_STRANICE),
  title: {
    default: "Moto Jakopec — ovlašteni Kawasaki zastupnik, Samobor",
    template: "%s | Moto Jakopec Samobor",
  },
  description: FIRMA.opis,
  keywords: ["kawasaki", "motocikli", "moto jakopec", "samobor", "zagreb", "prodaja motocikala", "quad", "jet ski", "mule", "servis motocikala"],
  openGraph: {
    type: "website",
    locale: "hr_HR",
    siteName: "Moto Jakopec",
  },
};

// Podaci o firmi u obliku koji Google razumije (prikaz adrese, telefona i
// radnog vremena uz rezultate pretrage) — https://schema.org/MotorcycleDealer
const PODACI_ZA_GOOGLE = {
  "@context": "https://schema.org",
  "@type": "MotorcycleDealer",
  name: FIRMA.naziv,
  description: FIRMA.opis,
  url: ADRESA_STRANICE,
  logo: `${ADRESA_STRANICE}/logo-jakopec.png`,
  image: `${ADRESA_STRANICE}/opengraph-image.png`,
  telephone: FIRMA.telefon,
  // Mobiteli kao dodatni kontakti
  contactPoint: TELEFONI.filter((t) => t.vrsta === "Mobitel").map((t) => ({
    "@type": "ContactPoint", telephone: t.poziv, contactType: "sales",
  })),
  email: FIRMA.email,
  // Profili na društvenim mrežama (ako su upisani u stranica.ts)
  sameAs: Object.values(DRUSTVENE_MREZE).filter(Boolean),
  brand: { "@type": "Brand", name: "Kawasaki" },
  address: {
    "@type": "PostalAddress",
    streetAddress: FIRMA.ulica,
    postalCode: FIRMA.postanskiBroj,
    addressLocality: FIRMA.grad,
    addressCountry: FIRMA.drzava,
  },
  // Radno vrijeme: pon i sri 10–18, uto, čet i pet 8–16, subotom i nedjeljom zatvoreno
  // (dani koji nisu navedeni Google tumači kao neradne)
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Wednesday"], opens: "10:00", closes: "18:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Thursday", "Friday"], opens: "08:00", closes: "16:00" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hr" className={inter.variable}>
      <body className="min-h-screen flex flex-col" style={{background:"var(--bg)"}}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(PODACI_ZA_GOOGLE) }}
        />
        <Header imaAkcija={[...modelsData, ...productsData].some((x) => imaAkciju(x as { price?: string; akcijska_cijena?: string }))} />
        <main className="flex-1">{children}</main>
        <Footer />
        <TrakaOdabira />
        <BrzaPoruka />
      </body>
    </html>
  );
}
