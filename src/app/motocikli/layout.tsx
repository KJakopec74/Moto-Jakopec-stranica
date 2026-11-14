import type { Metadata } from "next";

// Naslov i opis za stranicu s popisom vozila (sama stranica je klijentska pa ne može imati metadata)
export const metadata: Metadata = {
  // "template" mora biti i ovdje, inače podstranice (npr. pojedino vozilo) gube nastavak naslova
  title: {
    default: "Kawasaki motocikli, quadovi, Mule i Jet Ski — ponuda i cijene",
    template: "%s | Moto Jakopec Samobor",
  },
  description:
    "Kompletna ponuda novih Kawasaki vozila s cijenama: sport, naked, adventure, touring, offroad, quad, Mule i Jet Ski. Moto Jakopec, Samobor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
