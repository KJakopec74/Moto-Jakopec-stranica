import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usporedba modela",
  description: "Usporedite do tri Kawasaki modela jedan uz drugi — cijena, snaga, masa, visina sjedala i ostali podaci.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
