"""
rabljena_excel_to_json.py — rabljena.xlsx → src/data/rabljena.json

Pokreće ga objavi.bat. Ako rabljena.xlsx još ne postoji, napravi ga (prazan,
s uputama) i završi — korisnik ga onda otvori i upiše vozila.
"""

import json, os, re
import openpyxl
from slike_kopiranje import kopiraj_slike, pripremi_mapu
from excel_sinkronizacija import osvjezi_ako_treba, zapamti
from vozila_excel_to_json import formatiraj_cijenu, parse_value, parse_bool
from rabljena_json_to_excel import main as napravi_excel, FIXED_COLS, EXCEL_PATH, JSON_PATH, ROOT_DIR

IMG_DIR = os.path.join(ROOT_DIR, "public", "images", "rabljena")


def slike_iz_mape(mapa):
    putanja = os.path.join(IMG_DIR, mapa)
    if not mapa or not os.path.isdir(putanja):
        return []
    pripremi_mapu(putanja)
    datoteke = sorted(f for f in os.listdir(putanja)
                      if os.path.splitext(f)[1].lower() in (".jpg", ".jpeg", ".png", ".webp"))
    return [f"/images/rabljena/{mapa}/{f}" for f in datoteke]


def u_broj(val):
    """12500 / "12.500" / "12 500 km" → 12500;  prazno → None"""
    if val is None or val == "":
        return None
    if isinstance(val, (int, float)):
        return int(val)
    znamenke = re.sub(r"[^0-9]", "", str(val))
    return int(znamenke) if znamenke else None


def main():
    if not os.path.exists(EXCEL_PATH):
        print("rabljena.xlsx ne postoji — radim prazan Excel s uputama...")
        napravi_excel()
        return

    osvjezi_ako_treba(EXCEL_PATH, JSON_PATH, napravi_excel, "rabljena.xlsx")

    wb = openpyxl.load_workbook(EXCEL_PATH)
    if "Rabljena" not in wb.sheetnames:
        print("GREŠKA: u rabljena.xlsx nema sheeta 'Rabljena'.")
        raise SystemExit(1)
    redovi = list(wb["Rabljena"].iter_rows(values_only=True))
    zaglavlje = [str(h).strip() if h is not None else "" for h in redovi[0]]
    dodatni = [h for h in zaglavlje if h and h not in FIXED_COLS]

    # Mape slika iz prethodne objave (ako je image_folder u Excelu ostao prazan,
    # vozilo zadržava svoju mapu i kad mu se promijeni naziv)
    stare_mape = {}
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, encoding="utf-8") as f:
            stare_mape = {x.get("id"): x.get("image_folder", "") for x in json.load(f)}

    vozila, iskoristeni_id = [], set()
    for br, red in enumerate(redovi[1:], start=2):
        d = {zaglavlje[i]: red[i] for i in range(min(len(zaglavlje), len(red))) if zaglavlje[i]}
        naziv = parse_value(d.get("name"))
        if not naziv:
            continue

        vid = u_broj(d.get("id"))
        if vid is None or vid in iskoristeni_id:
            vid = max(iskoristeni_id | {0}) + 1
            print(f"  red {br}: id prazan ili ponovljen → dodijeljen id {vid} (upiši ga u Excel)")
        iskoristeni_id.add(vid)

        mapa = str(parse_value(d.get("image_folder")) or "")
        if not mapa:
            mapa = stare_mape.get(vid, "")
        if not mapa:
            mapa = f"{vid:02d}-" + re.sub(r"[^a-z0-9]+", "-", str(naziv).lower()).strip("-")
        unos_slika = parse_value(d.get("slike"))
        if unos_slika:
            kopiraj_slike(unos_slika, os.path.join(IMG_DIR, mapa), naziv)
        slike = slike_iz_mape(mapa)
        if not slike:
            print(f"  UPOZORENJE: nema slika za '{naziv}' (mapa public/images/rabljena/{mapa}/)")

        specs = {}
        for k in dodatni:
            v = parse_value(d.get(k))
            if v is not None:
                specs[k] = str(v)

        cijena = formatiraj_cijenu(parse_value(d.get("price"))) or "Cijena na upit"
        vozila.append({
            "id":               vid,
            "name":             str(naziv),
            "brand":            str(parse_value(d.get("marka")) or ""),
            "category":         str(parse_value(d.get("category")) or ""),
            "godiste":          u_broj(d.get("godiste")),
            "kilometri":        u_broj(d.get("kilometri")),
            "price":            cijena,
            "license_category": str(parse_value(d.get("license_category")) or ""),
            "prodano":          parse_bool(d.get("prodano")),
            "description":      str(parse_value(d.get("description")) or ""),
            "image_folder":     mapa,
            "images":           slike,
            "specs":            specs,
        })

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(vozila, f, ensure_ascii=False, indent=2)
        f.write("\n")
    zapamti(EXCEL_PATH, JSON_PATH)
    u_prodaji = sum(1 for v in vozila if not v["prodano"])
    print(f"Rabljena vozila → {JSON_PATH}: {len(vozila)} (u prodaji {u_prodaji})")


if __name__ == "__main__":
    main()
