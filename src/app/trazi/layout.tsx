import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pretraživanje",
  description: "Pretražite Kawasaki vozila, opremu i dijelove u ponudi Moto Jakopec.",
  robots: { index: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
