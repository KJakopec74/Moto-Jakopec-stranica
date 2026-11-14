# Moto Jakopec — Claude kontekst

Kawasaki dealerstvo Samobor, Hrvatska. Katalog motocikala, opreme i dijelova.

## Tehnologije

- **Next.js 14** App Router, TypeScript, Tailwind CSS
- **Cloudflare Workers** hosting (besplatno, `wrangler.jsonc`; adresa moto-jakopec.moto-jakopec.workers.dev, kasnije www.moto-jakopec.com), automatski deploy iz GitHub (`KJakopec74/Moto-Jakopec-stranica`)
- Statični izvoz (`output: "export"` u next.config.mjs) — build ide u mapu `out/`, nema servera ni API ruta
- **Web3Forms** za slanje upita s forme (`src/components/UpitForma.tsx`), javni ključ upisan u komponentu (račun moto.jakopec@gmail.com)
- **Python + openpyxl** za upravljanje podacima (lokalno, ne deployaju se)

## Struktura podataka

```
src/data/
  models.json     ← sva vozila (78 Kawasaki modela)
  products.json   ← oprema (10 modela) i dijelovi (10 skupina po brendu: klipovi, klipnjače, kvačilo…), cijena na upit
  brands.json     ← brendovi { "oprema": [...], "dijelovi": [...] }

public/images/
  vozila/{model-folder}/   ← slike vozila
  oprema/{item-folder}/    ← slike opreme
  dijelovi/{item-folder}/  ← slike dijelova
  brendovi/{brand_id}.png  ← logoti brendova
```

## Python skripte (u scripts/)

| Skripta | Opis |
|---------|------|
| `vozila_scraper_dks.py` | Scrapa vozila s dks.si → models.json |
| `vozila_json_to_excel.py` | models.json → vozila.xlsx (inicijalizacija) |
| `vozila_excel_to_json.py` | vozila.xlsx → models.json (nakon izmjena) |
| `vozila_sync_slike.py` | Sinkronizira putanje slika disk ↔ models.json |
| `kreiraj_excel_predlozak.py` | Dodaje sheetove Brendovi u proizvodi.xlsx |
| `proizvodi_json_to_excel.py` | products.json → proizvodi.xlsx (inicijalizacija) |
| `proizvodi_excel_to_json.py` | proizvodi.xlsx → products.json + brands.json |
| `slike_smanji.py` | Smanjuje JPG slike (kvaliteta 80) — pokrenuti nakon dodavanja novih slika |

## Excel datoteke (.gitignore)

- `vozila.xlsx` — upravljanje vozilima
- `proizvodi.xlsx` — upravljanje opremom, dijelovima i brendovima

### Struktura proizvodi.xlsx

**Sheet "Proizvodi"** stupci:
`id | name | category | subcategory | price | description | image_folder | slike | is_new | brand | specifikacije`

- `slike`: nazivi (traže se u ~/Downloads, ~/Desktop, mapi projekta) ili pune putanje, odvojeni `;` → skripta kopira u `public/images/<kat>/<image_folder>/img_NN.<ext>` (max 1600 px, JPG/PNG/WebP); već kopirane slike se ne traže ponovno

- `specifikacije`: `Ključ: vrijednost; Ključ: vrijednost` → u JSON-u `specs` (objekt), prikazuje se kao tablica na kartici
- `price`: broj → "1.234 €", prazno → "Cijena na upit"
- Zaštita: `proizvodi_excel_to_json.py` odbija raditi ako je products.json noviji od Excela ili Excel nema stupac `specifikacije`; `kreiraj_excel_predlozak.py` tada arhivira stari Excel (`proizvodi_stari.xlsx`) i radi novi iz JSON-a

- `category`: mora biti točno `Oprema` ili `Dijelovi`
- `brand`: brand_id iz sheeta Brendovi_Oprema / Brendovi_Dijelovi (npr. `airoh`, `motul`)

**Sheet "Brendovi_Oprema"** stupci:
`brand_id | name | logo_folder | website | active`

**Sheet "Brendovi_Dijelovi"** stupci:
`brand_id | name | logo_folder | website | active`

## Brendovi

### Oprema
| brand_id | Naziv |
|----------|-------|
| airoh | Airoh |
| ufo | UFO Plast (bez loga) |
| wind | WIND Raceware |
| progrip | Progrip |
| mitas | Mitas |
| motul | Motul |
| valvoline | Valvoline |

### Dijelovi
| brand_id | Naziv |
|----------|-------|
| prox | Pro-X Racing Parts |
| wiseco | Wiseco |
| vertex | Vertex (bez loga) |
| ufo | UFO Plast (bez loga) |
| wrp | WRP |
| cht | CHT Sprockets |
| rk | RK Chains (bez loga — stari je bio krivi) |
| trw | TRW Lucas |
| denso | Denso |

## Navigacija (Header.tsx)

```
Početna | Motocikli | Quad | Mule | Jet Ski | Oprema | Dijelovi | Kontakt
```

- `Quad`, `Mule`, `Jet Ski` → `/motocikli?category=X` (SPECIAL_CATEGORIES u motocikli/page.tsx)
- `/oprema` → lista s BrandsGrid + filter
- `/oprema/{brand_id}` → proizvodi jednog brenda grupirani po subcategory
- `/dijelovi/{brand_id}` → isto za dijelove

## Tijek rada — dodavanje proizvoda

1. Otvori `proizvodi.xlsx`
2. Popuni red u sheetu "Proizvodi" (category mora biti `Oprema` ili `Dijelovi`)
3. Stavi slike u `public/images/oprema/{image_folder}/` ili `public/images/dijelovi/{image_folder}/`
4. Stavi logo brenda u `public/images/brendovi/{brand_id}.png`
5. Pokreni: `py -X utf8 scripts/proizvodi_excel_to_json.py` i `py -X utf8 scripts/slike_smanji.py`
6. `git add . && git commit -m "Dodan proizvod" && git push`

## Tijek rada — ažuriranje vozila

1. `py -X utf8 scripts/vozila_json_to_excel.py` (samo jednom za inicijalizaciju)
2. Uredi `vozila.xlsx`
3. `py -X utf8 scripts/vozila_excel_to_json.py`
4. ili samo dvoklik na `objavi.bat`

## Dizajn sistem (globals.css)

```css
--bg:       #edf3ed   /* pozadina */
--surface:  #ffffff   /* kartice */
--text:     #111611
--muted:    #5b655d
--green:    #37b63a   /* primarna boja */
--green-dk: #218e28
--radius:   26px
```

Amber (`#f59e0b`) se koristi za hover efekte na brendovima.

## Važne napomene

- Website čita SAMO `models.json`, `products.json` i `brands.json` — Excel i Python su lokalni alati
- `vozila.xlsx` i `proizvodi.xlsx` su u `.gitignore` — ne commitaju se
- Slike moraju biti u `public/images/`; optimizacija slika je isključena (`unoptimized: true`) jer nema servera
- Gumbi "Pošalji upit" vode na `/kontakt?model=<naziv>` pa se polje Model popuni automatski
- `SPECIAL_CATEGORIES = ["Quad", "Mule", "Jet Ski"]` — ove kategorije idu u posebne nav linkove, ne pod "Motocikli"
- Scraper `vozila_scraper_dks.py` koristi HR prijevode iz SL_HR rječnika — jednom u JSON-u, sve je na hrvatskom

## Cloudflare Workers postavke

| Postavka | Vrijednost |
|----------|------------|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` (čita `wrangler.jsonc`, objavljuje mapu `out/`) |

(Pages je zbog Cloudflareove greške napušten — stari Pages projekt treba obrisati.)

## SEO i ostalo

- `src/lib/stranica.ts` — adresa stranice (`ADRESA_STRANICE`) i podaci o firmi; koriste ih layout (JSON-LD MotorcycleDealer), sitemap i robots
- `src/app/sitemap.ts`, `src/app/robots.ts` — generiraju se pri buildu (`dynamic = "force-static"`)
- `src/app/icon.png`, `apple-icon.png`, `opengraph-image.png` — ikona i slika za dijeljenje
- `public/logo-jakopec.png` — logo s prozirnom pozadinom (bijelo pretvoreno u prozirno)
- `/privatnost` — politika privatnosti (GDPR), link u footeru i u formi

## Datoteke za korisnika (Windows)

- `objavi.bat` — git pull → Excel → JSON → smanjivanje slika → commit → push
- `pokreni_stranicu.bat` — npm install (prvi put) + npm run dev + otvara localhost:3000
- `UPUTE.md` — upute za održavanje na hrvatskom

## Proizvodi — napomene

- Podaci (dimenzije, kompatibilnost, šifre) provjereni u trgovinama/distributerima (studeni 2026.); bez slika — kartica tada prikazuje siluetu loga brenda i "Slika uskoro"
- Slike: `public/images/{oprema|dijelovi}/{image_folder}/img_01.jpg` → `proizvodi_excel_to_json.py` ih sam pokupi
- Dijelovi su SKUPINE (npr. Pro-X Klipni kompleti), ne proizvod po modelu motora — modeli i primjeri dimenzija su u specs; kupac šalje upit s modelom
