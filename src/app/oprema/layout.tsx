import type { Metadata } from "next";

export const metadata: Metadata = {
  // "template" mora biti i ovdje, inače podstranice (npr. pojedino vozilo) gube nastavak naslova
  title: {
    default: "Moto oprema — kacige, odjeća i ulja",
    template: "%s | Moto Jakopec Samobor",
  },
  description: "Moto oprema renomiranih brendova: Airoh, WIND, Progrip, Mitas, Motul, Valvoline. Moto Jakopec, Samobor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
