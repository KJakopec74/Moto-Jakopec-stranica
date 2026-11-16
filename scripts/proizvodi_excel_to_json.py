"""
Pretvara proizvodi.xlsx u:
  - src/data/products.json
  - src/data/brands.json

Pokreni nakon svake izmjene u Excelu:
    py -X utf8 scripts/proizvodi_excel_to_json.py

Stupac "specifikacije" piše se ovako (parovi odvojeni točka-zarezom):
    Kompatibilnost: KX450 2019–2023; Promjer klipa: 95,97 mm; Kompresija: 12,5:1

Stupac "slike" — nazivi ili putanje preuzetih slika, odvojeni točka-zarezom:
    aviator3.png; aviator3-bok.jpg
    C:/Users/Ime/Desktop/kaciga.webp   (ili s obrnutim kosim crtama)
Ako je upisan samo naziv datoteke, slika se traži u mapi Preuzimanja (Downloads).
Skripta slike kopira u public/images/<oprema|dijelovi>/<image_folder>/ kao
img_01, img_02 ... (redom kako su upisane) i smanji prevelike slike.

ZAŠTITA: ako je products.json noviji od Excela (npr. netko je na GitHubu
dodao proizvode), skripta NEĆE ništa prepisati, nego traži da se Excel
ponovno napravi iz najnovijih podataka (kreiraj_excel_predlozak.py).
"""

import json, os, re
import openpyxl
from slike_kopiranje import pripremi_mapu

SCRIPT_DIR   = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR     = os.path.join(SCRIPT_DIR, "..")
EXCEL_PATH   = os.path.join(ROOT_DIR, "proizvodi.xlsx")
JSON_PATH    = os.path.join(ROOT_DIR, "src", "data", "products.json")
BRANDS_PATH  = os.path.join(ROOT_DIR, "src", "data", "brands.json")
IMG_BASE     = os.path.join(ROOT_DIR, "public", "images")
BRENDOVI_DIR = os.path.join(ROOT_DIR, "public", "images", "brendovi")

LOGO_EXTS = [".svg", ".png", ".jpg", ".jpeg", ".ico", ".webp"]

def find_logo_path(logo_folder: str) -> str:
    """Pronađi stvarnu putanju loga — provjeri koji fajl postoji."""
    if not logo_folder:
        return ""
    for ext in LOGO_EXTS:
        path = os.path.join(BRENDOVI_DIR, f"{logo_folder}{ext}")
        if os.path.exists(path):
            return f"/images/brendovi/{logo_folder}{ext}"
    # Logo ne postoji → prazno (stranica tada prikaže naziv brenda)
    return ""

def _normaliziraj(tekst: str) -> str:
    """'RK Chains' → 'rkchains', 'pro-circuit' → 'procircuit' (za usporedbu imena)."""
    return "".join(z for z in str(tekst).lower() if z.isalnum())

def pronadi_logo(brand_id: str, naziv: str, logo_folder: str) -> str:
    """
    Pronađi logo brenda u public/images/brendovi/:
      1. datoteka iz stupca logo_folder (npr. airoh.png)
      2. datoteka nazvana po brand_id (npr. thor.png)
      3. datoteka nazvana slično brendu, npr. "RK Chains.png", "UFO plast.png",
         "Kite.png" — takva se automatski preimenuje u brand_id (rk.png, ufo.png,
         kite.png), jer web poslužitelj razlikuje velika i mala slova.
    """
    nadeno = find_logo_path(logo_folder) or find_logo_path(brand_id)
    if nadeno or not os.path.isdir(BRENDOVI_DIR):
        return nadeno
    trazeno_id, trazeno_ime = _normaliziraj(brand_id), _normaliziraj(naziv)
    for datoteka in sorted(os.listdir(BRENDOVI_DIR)):
        ime, ext = os.path.splitext(datoteka)
        if ext.lower() not in LOGO_EXTS:
            continue
        n = _normaliziraj(ime)
        if n in (trazeno_id, trazeno_ime) or (len(trazeno_id) >= 3 and n.startswith(trazeno_id)):
            novo = f"{brand_id}{ext.lower()}"
            os.rename(os.path.join(BRENDOVI_DIR, datoteka), os.path.join(BRENDOVI_DIR, novo))
            print(f"  Logo preimenovan: {datoteka}  →  {novo}")
            return f"/images/brendovi/{novo}"
    return ""

IMG_EXTS = {".jpg", ".jpeg", ".png", ".webp"}

def natural_sort_key(s):
    return [int(t) if t.isdigit() else t.lower() for t in re.split(r'(\d+)', s)]

def get_images(image_folder: str, category: str) -> list:
    if not image_folder:
        return []
    sub = category.lower() if category.lower() in ("oprema", "dijelovi") else "oprema"
    folder_path = os.path.join(IMG_BASE, sub, image_folder)
    if not os.path.isdir(folder_path):
        return []
    pripremi_mapu(folder_path)   # smanji prevelike slike, velike PNG → JPG
    files = [f for f in os.listdir(folder_path)
             if os.path.splitext(f)[1].lower() in IMG_EXTS]
    files.sort(key=natural_sort_key)
    return [f"/images/{sub}/{image_folder}/{f}" for f in files]

# ── Kopiranje slika iz stupca "slike" (zajednički modul) ────────────────────
from slike_kopiranje import kopiraj_slike as _kopiraj_u_mapu
from excel_sinkronizacija import osvjezi_ako_treba, zapamti
from kreiraj_excel_predlozak import main as napravi_proizvodi_excel

def kopiraj_slike(unos_slika, image_folder: str, category: str, naziv: str):
    """Kopira slike proizvoda u public/images/<oprema|dijelovi>/<image_folder>/."""
    if unos_slika and not image_folder:
        print(f"  UPOZORENJE: '{naziv}' ima slike, ali nema image_folder — slike preskočene")
        return
    sub = category.lower() if category.lower() in ("oprema", "dijelovi") else "oprema"
    _kopiraj_u_mapu(unos_slika, os.path.join(IMG_BASE, sub, image_folder), naziv)

def parse_bool(val) -> bool:
    if isinstance(val, bool): return val
    if isinstance(val, str):  return val.strip().upper() in ("TRUE", "DA", "1", "YES")
    if isinstance(val, (int, float)): return bool(val)
    return False

def parse_val(val):
    if val is None: return None
    if isinstance(val, str):
        s = val.strip()
        return s if s else None
    return val

def parse_specs(val) -> dict:
    """
    "Kompatibilnost: KX450 2019–2023; Kompresija: 12,5:1"
      → {"Kompatibilnost": "KX450 2019–2023", "Kompresija": "12,5:1"}
    Dijeli se samo na PRVOJ dvotočki, pa "12,5:1" ostaje cijelo.
    """
    specs = {}
    if not val:
        return specs
    for dio in str(val).split(";"):
        if ":" not in dio:
            continue
        kljuc, vrijednost = dio.split(":", 1)
        kljuc, vrijednost = kljuc.strip(), vrijednost.strip()
        if kljuc and vrijednost:
            specs[kljuc] = vrijednost
    return specs

def formatiraj_cijenu(val) -> str:
    """Broj → "1.234 €", prazno → "Cijena na upit", tekst ostaje kakav jest."""
    if val is None or (isinstance(val, str) and not val.strip()):
        return "Cijena na upit"
    if isinstance(val, str):
        t = val.strip()
        if t.replace(" ", "").isdigit():
            val = int(t.replace(" ", ""))
        else:
            return t
    if isinstance(val, (int, float)):
        if float(val).is_integer():
            return f"{int(val):,}".replace(",", ".") + " €"
        return f"{val:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".") + " €"
    return str(val)

# ── Čitanje brendova iz sheeta ───────────────────────────────────────────────
def read_brands(wb, sheet_name, category_key):
    """Čita sheet brendova i vraća listu dict objekata."""
    if sheet_name not in wb.sheetnames:
        print(f"  UPOZORENJE: Sheet '{sheet_name}' ne postoji — preskačem brendove za {category_key}")
        return []

    ws   = wb[sheet_name]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []

    headers = [str(h).strip() if h else "" for h in rows[0]]
    brands  = []

    for row in rows[1:]:
        d = {headers[i]: row[i] for i in range(len(headers)) if headers[i]}

        brand_id    = parse_val(d.get("brand_id"))
        name        = parse_val(d.get("name"))
        logo_folder = parse_val(d.get("logo_folder"))
        website     = parse_val(d.get("website"))
        active      = parse_bool(d.get("active", True))

        if not brand_id or not name:
            continue

        brands.append({
            "brand_id": brand_id,
            "name":     name,
            # Logo: naziv iz stupca logo_folder, a ako je prazan (ili te datoteke
            # nema) traži se datoteka nazvana po brendu, npr. brendovi/thor.png
            "logo":     pronadi_logo(str(brand_id), str(name), logo_folder),
            "website":  website or "",
            "active":   active,
        })

    return brands

# ── Main ─────────────────────────────────────────────────────────────────────
def main():
    if not os.path.exists(EXCEL_PATH):
        print(f"GREŠKA: {EXCEL_PATH} ne postoji.")
        print("Pokreni prvo: py -X utf8 scripts/kreiraj_excel_predlozak.py")
        return

    # ── 0. Ako su s GitHuba stigli promijenjeni proizvodi, a Excel nije diran
    #       od zadnje objave → Excel se sam napravi iznova (excel_sinkronizacija.py)
    if osvjezi_ako_treba(EXCEL_PATH, JSON_PATH, napravi_proizvodi_excel, "proizvodi.xlsx"):
        pass   # Excel je osvježen — nastavi s pretvorbom (slike iz mapa, logotipi…)
    vrijeme_excela = os.path.getmtime(EXCEL_PATH)

    wb = openpyxl.load_workbook(EXCEL_PATH)

    # Excel mora imati stupac "specifikacije" (novi predložak)
    if "Proizvodi" in wb.sheetnames:
        zaglavlje = [str(c.value).strip() if c.value else "" for c in wb["Proizvodi"][1]]
        if "specifikacije" not in zaglavlje or "skupina" not in zaglavlje:
            print("PAŽNJA: proizvodi.xlsx je stari predložak (nema stupac 'specifikacije' ili 'skupina').")
            print("  Excel se automatski radi iznova po novom predlošku...")
            napravi_proizvodi_excel()
            zapamti(EXCEL_PATH, JSON_PATH)
            wb = openpyxl.load_workbook(EXCEL_PATH)

    # ── 1. Brendovi ──────────────────────────────────────────────────────────
    oprema_brands   = read_brands(wb, "Brendovi_Oprema",   "oprema")
    dijelovi_brands = read_brands(wb, "Brendovi_Dijelovi", "dijelovi")

    brands_data = {
        "oprema":   oprema_brands,
        "dijelovi": dijelovi_brands,
    }

    os.makedirs(os.path.dirname(BRANDS_PATH), exist_ok=True)
    with open(BRANDS_PATH, "w", encoding="utf-8") as f:
        json.dump(brands_data, f, ensure_ascii=False, indent=2)

    print(f"Brendovi → {BRANDS_PATH}")
    print(f"  Oprema:   {len(oprema_brands)}")
    print(f"  Dijelovi: {len(dijelovi_brands)}")

    # ── 2. Proizvodi ─────────────────────────────────────────────────────────
    if "Proizvodi" not in wb.sheetnames:
        print("GREŠKA: Sheet 'Proizvodi' ne postoji!")
        return

    ws   = wb["Proizvodi"]
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        print("GREŠKA: Excel je prazan!")
        return

    headers  = [str(h).strip() if h else "" for h in rows[0]]
    products = []
    skipped  = 0

    for row_idx, row in enumerate(rows[1:], start=2):
        d = {headers[i]: row[i] for i in range(len(headers)) if headers[i]}

        name = parse_val(d.get("name"))
        if not name:
            skipped += 1
            continue

        raw_id = d.get("id")
        try:
            pid = int(raw_id) if raw_id is not None else row_idx - 1
        except (ValueError, TypeError):
            pid = row_idx - 1

        # category MORA biti pročitan PRIJE get_images()
        category     = parse_val(d.get("category")) or ""
        subcategory  = parse_val(d.get("subcategory")) or ""   # kategorija na stranici (npr. Motor)
        skupina      = parse_val(d.get("skupina")) or ""       # skupina unutar nje (npr. Klipovi)
        image_folder = parse_val(d.get("image_folder")) or ""
        kopiraj_slike(parse_val(d.get("slike")), image_folder, category, name)
        brand        = parse_val(d.get("brand")) or ""
        images       = get_images(image_folder, category)

        # Validacija kategorije
        if category not in ("Oprema", "Dijelovi"):
            print(f"  UPOZORENJE red {row_idx}: category='{category}' nije 'Oprema' ni 'Dijelovi' — preskačem")
            skipped += 1
            continue

        product = {
            "id":           pid,
            "name":         name,
            "category":     category,
            "subcategory":  subcategory,
            **({"skupina": skupina} if skupina else {}),
            "price":        formatiraj_cijenu(parse_val(d.get("price"))),
            "description":  parse_val(d.get("description")) or "",
            "image_folder": image_folder,
            "brand":        brand,
            "is_new":       parse_bool(d.get("is_new", False)),
            "images":       images,
            "specs":        parse_specs(d.get("specifikacije")),
        }
        products.append(product)

    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    # Zapamti da su Excel i JSON usklađeni (vidi excel_sinkronizacija.py)
    zapamti(EXCEL_PATH, JSON_PATH)

    oprema   = sum(1 for p in products if p["category"] == "Oprema")
    dijelovi = sum(1 for p in products if p["category"] == "Dijelovi")

    print(f"\nProizvodi → {JSON_PATH}")
    print(f"  Oprema:     {oprema}")
    print(f"  Dijelovi:   {dijelovi}")
    print(f"  Ukupno:     {len(products)}")
    if skipped:
        print(f"  Preskočeno: {skipped}")
    print()
    print("Sljedeći koraci:")
    print("  git add src/data/products.json src/data/brands.json public/images/")
    print("  git commit -m 'Ažurirani proizvodi i brendovi'")
    print("  git push")


if __name__ == "__main__":
    main()
