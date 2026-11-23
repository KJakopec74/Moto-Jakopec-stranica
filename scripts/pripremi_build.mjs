// =============================================================================
// pripremi_build.mjs — pokreće se automatski prije svakog builda (npm "prebuild").
// Nazive logotipa u public/images/brendovi/ pretvara u mala slova (Kite.png → kite.png).
// Razlog: Windows ne razlikuje velika i mala slova, a web poslužitelj razlikuje,
// pa bi logo s velikim slovom na stranici bio "nevidljiv".
// =============================================================================

import fs from "node:fs";
import path from "node:path";

const mapa = path.join(process.cwd(), "public", "images", "brendovi");
if (fs.existsSync(mapa)) {
  for (const ime of fs.readdirSync(mapa)) {
    const malo = ime.toLowerCase();
    if (ime === malo) continue;
    const cilj = path.join(mapa, malo);
    if (fs.existsSync(cilj) && fs.realpathSync(cilj) !== fs.realpathSync(path.join(mapa, ime))) {
      console.log(`  logo ${ime}: već postoji ${malo} — preskačem`);
      continue;
    }
    fs.renameSync(path.join(mapa, ime), cilj);
    console.log(`  logo: ${ime} → ${malo}`);
  }
}
