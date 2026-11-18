"""
Pretvara vozila.xlsx natrag u models.json.

Pokreni nakon svake izmjene u Excelu:
    py -X utf8 scripts/vozila_excel_to_json.py

Što radi:
  - Čita vozila.xlsx (sheet "Vozila")
  - Fiksni stupci → osnovni podaci vozila
  - Ostali stupci → specs (prazne ćelije se preskaču)
  - image_folder → automatski učitava slike iz public/images/vozila/{folder}/
  - Sprema src/data/models.json
"""

import json, os, re
import openpyxl
from slike_kopiranje import kopiraj_slike, pripremi_mapu
from excel_sinkronizacija import osvjezi_ako_treba, zapamti
from vozila_json_to_excel import main as napravi_vozila_excel

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.join(SCRIPT_DIR, "..")
EXCEL_PATH = os.path.join(ROOT_DIR, "vozila.xlsx")
JSON_PATH  = os.path.join(ROOT_DIR, "src", "data", "models.json")
IMG_DIR    = os.path.join(ROOT_DIR, "public", "images", "vozila")

FIXED_COLS = {"id", "name", "category", "license_category",
              "is_new", "price", "akcijska_cijena", "description", "image_folder", "slike"}

# ── Sortiranje slika ──────────────────────────────────────────────────────────
def img_sort_key(fname: str) -> str:
    """
    Prioritet:
      _STU_ / bocna prednji kraj desno  → 0_
      _STV_ / bocna prednji kraj lijevo → 2_
      _ACT_                             → 3_
      FT (detail shot motorcycles)      → 7_
      _DET_                             → 8_
      sve ostalo                        → 5_
    """
    u = fname.upper()
    if "_STU_" in u:  return "0_" + fname
    if "_STV_" in u:  return "2_" + fname
    if "_ACT_" in u:  return "3_" + fname
    if re.search(r'FT\d*\.(jpg|png|webp)$', u): return "7_" + fname
    if "_DET_" in u:  return "8_" + fname
    return "5_" + fname

def get_images(image_folder: str) -> list:
    if not image_folder:
        return []
    folder_path = os.path.join(IMG_DIR, image_folder)
    if not os.path.isdir(folder_path):
        return []
    pripremi_mapu(folder_path)   # smanji prevelike slike, velike PNG → JPG
    exts = {".jpg", ".jpeg", ".png", ".webp"}
    files = [f for f in os.listdir(folder_path)
             if os.path.splitext(f)[1].lower() in exts]
    files.sort(key=img_sort_key)
    return [f"/images/vozila/{image_folder}/{f}" for f in files]

# ── Parsiranje vrijednosti ─────────────────────────────────────────────────────
def parse_bool(val) -> bool:
    if isinstance(val, bool):
        return val
    if isinstance(val, str):
        return val.strip().upper() in ("TRUE", "DA", "1", "YES")
    if isinstance(val, (int, float)):
        return bool(val)
    return False

def parse_value(val):
    """Vraća čistu vrijednost ili None ako je prazno."""
    if val is None:
        return None
    if isinstance(val, str):
        stripped = val.strip()
        return stripped if stripped else None
    return val

def formatiraj_cijenu(val) -> str:
    """
    Pretvara cijenu u jednak oblik za sva vozila: "10.275 €".

    Primjeri:
      10275          → "10.275 €"
      10275.5        → "10.275,50 €"
      "10275"        → "10.275 €"
      "15.263 €"     → "15.263 €"   (već je dobro, ostaje isto)
      "Cijena na upit" → "Cijena na upit"
    """
    if val is None:
        return ""

    # Ako je tekst koji je zapravo samo broj (npr. "10275"), pretvori ga u broj
    if isinstance(val, str):
        tekst = val.strip()
        if tekst.replace(" ", "").isdigit():
            val = int(tekst.replace(" ", ""))
        else:
            return tekst  # već formatirano ili "Cijena na upit"

    # Broj → hrvatski format: točka za tisućice, zarez za decimale
    if isinstance(val, (int, float)):
        if float(val).is_integer():
            s = f"{int(val):,}".replace(",", ".")
        else:
            s = f"{val:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        return f"{s} €"

    return str(val)


def formatiraj_akciju(val) -> str:
    """Akcijska cijena: prazno → "" (nema akcije); 8990 → "8.990 €"; "8.990" → "8.990 €"."""
    t = formatiraj_cijenu(val)
    if t and "€" not in t and any(z.isdigit() for z in t):
        t = t + " €"
    return t


# ── Glavni dio ────────────────────────────────────────────────────────────────
def mape_iz_postojeceg_jsona() -> dict:
    """
    Iz postojećeg models.json čita koja mapa slika pripada kojem vozilu (po id-u).
    Koristi se kao rezerva ako je u Excelu stupac image_folder prazan ili kriv.
    """
    mape = {}
    if not os.path.exists(JSON_PATH):
        return mape
    with open(JSON_PATH, encoding="utf-8") as f:
        stari_modeli = json.load(f)
    for m in stari_modeli:
        slike = m.get("images", [])
        if not slike:
            continue
        # "/images/vozila/52-kx-112/img_01.jpg" → "52-kx-112"
        dijelovi = slike[0].split("/")
        if len(dijelovi) >= 5 and dijelovi[2] == "vozila":
            mape[m.get("id")] = dijelovi[3]
    return mape


def main():
    if not os.path.exists(EXCEL_PATH):
        print(f"GREŠKA: Datoteka nije pronađena: {EXCEL_PATH}")
        print("Pokreni prvo: py -X utf8 scripts/vozila_json_to_excel.py")
        return

    # ── Ako su s GitHuba stigla promijenjena vozila, a Excel nije diran od
    #    zadnje objave → Excel se sam napravi iznova (vidi excel_sinkronizacija.py)
    if osvjezi_ako_treba(EXCEL_PATH, JSON_PATH, napravi_vozila_excel, "vozila.xlsx"):
        pass   # Excel je osvježen — nastavi s pretvorbom (slike iz mapa, logotipi…)
    vrijeme_excela = os.path.getmtime(EXCEL_PATH)

    wb = openpyxl.load_workbook(EXCEL_PATH)
    if "Vozila" not in wb.sheetnames:
        print("GREŠKA: Sheet 'Vozila' ne postoji u Excel datoteci!")
        return

    ws = wb["Vozila"]
    rows = list(ws.iter_rows(values_only=True))

    if not rows:
        print("GREŠKA: Excel je prazan!")
        return

    # Zaglavlje
    headers = [str(h).strip() if h is not None else "" for h in rows[0]]
    spec_cols = [h for h in headers if h and h not in FIXED_COLS]

    print(f"Stupci: {len(headers)} ({len(spec_cols)} spec stupaca)")

    models = []
    skipped = 0

    # Rezervne mape slika iz postojećeg models.json (ako je image_folder u Excelu kriv)
    rezervne_mape = mape_iz_postojeceg_jsona()

    for row_idx, row in enumerate(rows[1:], start=2):
        row_dict = {headers[i]: row[i] for i in range(len(headers)) if headers[i]}

        # Preskoči potpuno prazne redove
        name = parse_value(row_dict.get("name"))
        if not name:
            skipped += 1
            continue

        # Osnovni podaci
        raw_id = row_dict.get("id")
        try:
            model_id = int(raw_id) if raw_id is not None else row_idx - 1
        except (ValueError, TypeError):
            model_id = row_idx - 1

        image_folder = str(parse_value(row_dict.get("image_folder")) or "")

        # Ako mapa iz Excela ne postoji (prazno ili npr. "vozila"), uzmi mapu iz starog JSON-a
        if not os.path.isdir(os.path.join(IMG_DIR, image_folder)) or image_folder in ("", "vozila"):
            image_folder = rezervne_mape.get(model_id, "")

        # Stupac "slike": kopiraj preuzete slike u mapu vozila.
        # Ako vozilo još nema mapu, napravi je iz id-a i naziva (npr. "79-ninja-h2").
        unos_slika = parse_value(row_dict.get("slike"))
        if unos_slika:
            if not image_folder:
                kratko = re.sub(r"^kawasaki\s+", "", str(name), flags=re.I)
                image_folder = f"{model_id:02d}-" + re.sub(r"[^a-z0-9]+", "-", kratko.lower()).strip("-")
            kopiraj_slike(unos_slika, os.path.join(IMG_DIR, image_folder), name)

        images = get_images(image_folder)
        if not images:
            print(f"  UPOZORENJE: nema slika za '{name}' (image_folder = '{image_folder}')")

        model = {
            "id":               model_id,
            "name":             name,
            "brand":            "Kawasaki",  # sva vozila su Kawasaki
            "category":         parse_value(row_dict.get("category")) or "",
            "license_category": parse_value(row_dict.get("license_category")) or "",
            "is_new":           parse_bool(row_dict.get("is_new", False)),
            "price":            formatiraj_cijenu(parse_value(row_dict.get("price"))),
            # Akcija: prazno = nema akcije; inače nova cijena (stara se prikaže precrtana)
            "akcijska_cijena":  formatiraj_akciju(parse_value(row_dict.get("akcijska_cijena"))),
            "description":      parse_value(row_dict.get("description")) or "",
            "images":           images,
        }

        # Specs — samo neprazna polja
        specs = {}
        for key in spec_cols:
            val = parse_value(row_dict.get(key))
            if val is not None:
                specs[key] = str(val)
        if specs:
            model["specs"] = specs

        models.append(model)

    # Spremi JSON
    os.makedirs(os.path.dirname(JSON_PATH), exist_ok=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(models, f, ensure_ascii=False, indent=2)

    # Zapamti da su Excel i JSON usklađeni (vidi excel_sinkronizacija.py)
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Spremljeno: {JSON_PATH}")
    print(f"  Vozila: {len(models)}")
    if skipped:
        print(f"  Preskočeni prazni redovi: {skipped}")
    print()
    print("Sljedeći koraci:")
    print("  git add src/data/models.json")
    print("  git commit -m 'Ažurirani podaci vozila'")
    print("  git push")

if __name__ == "__main__":
    main()
