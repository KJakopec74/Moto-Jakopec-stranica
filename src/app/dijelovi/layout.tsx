import type { Metadata } from "next";

export const metadata: Metadata = {
  // "template" mora biti i ovdje, inače podstranice (npr. pojedino vozilo) gube nastavak naslova
  title: {
    default: "Rezervni dijelovi za motocikle",
    template: "%s | Moto Jakopec Samobor",
  },
  description: "Rezervni dijelovi za motocikle: Pro-X, Wiseco, WRP, CHT, RK lanci, TRW Lucas, Denso. Moto Jakopec, Samobor.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
