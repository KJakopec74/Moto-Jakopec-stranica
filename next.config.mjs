/** @type {import('next').NextConfig} */
const nextConfig = {
  // Statični izvoz: "npm run build" napravi gotove HTML datoteke u mapi "out/",
  // koje Cloudflare Pages besplatno poslužuje (nema potrebe za serverom).
  output: "export",

  // Svaka stranica dobije svoju mapu (npr. /kontakt/index.html) — radi bolje na Cloudflareu
  trailingSlash: true,

  images: {
    // Bez servera nema automatske optimizacije slika, pa se slike poslužuju kakve jesu
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "www.kawasaki.eu" },
      { protocol: "https", hostname: "www.dks.si" },
    ],
  },
};

export default nextConfig;
