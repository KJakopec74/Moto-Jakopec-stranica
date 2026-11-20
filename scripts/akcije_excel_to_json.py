"""
akcije_excel_to_json.py — akcije.xlsx → src/data/akcije.json (pokreće ga objavi.bat).
Ako akcije.xlsx ne postoji, napravi se prazan s uputama.
"""

import json, os, re
import openpyxl
from slike_kopiranje import kopiraj_slike, pripremi_mapu
from excel_sinkronizacija import osvjezi_ako_treba, zapamti
from vozila_excel_to_json import parse_value, parse_bool, formatiraj_akciju
from novosti_excel_to_json import u_datum
from akcije_json_to_excel import main as napravi_excel, EXCEL_PATH, JSON_PATH, ROOT_DIR

IMG_DIR = os.path.join(ROOT_DIR, "public", "images", "akcije")


def slike_iz_mape(mapa):
    put = os.path.join(IMG_DIR, mapa)
    if not os.path.isdir(put):
        return []
    pripremi_mapu(put)
    return [f"/images/akcije/{mapa}/{f}" for f in sorted(os.listdir(put))
            if os.path.splitext(f)[1].lower() in (".jpg", ".jpeg", ".png", ".webp")]


def main():
    if not os.path.exists(EXCEL_PATH):
        print("akcije.xlsx ne postoji — radim prazan Excel s uputama...")
        napravi_excel()
        return
    osvjezi_ako_treba(EXCEL_PATH, JSON_PATH, napravi_excel, "akcije.xlsx")

    stare = {}
    if os.path.exists(JSON_PATH):
        stare = {a.get("id"): a for a in json.load(open(JSON_PATH, encoding="utf-8"))}

    redovi = list(openpyxl.load_workbook(EXCEL_PATH)["Akcije"].iter_rows(values_only=True))
    zaglavlje = [str(h).strip() if h else "" for h in redovi[0]]
    akcije, ids = [], set()
    for red in redovi[1:]:
        d = dict(zip(zaglavlje, red))
        naziv = parse_value(d.get("naziv"))
        if not naziv:
            continue
        try:
            aid = int(d.get("id"))
        except (TypeError, ValueError):
            aid = max(ids | {0}) + 1
            print(f"  '{naziv}': id prazan → dodijeljen {aid} (upiši ga u Excel)")
        if aid in ids:
            aid = max(ids) + 1
        ids.add(aid)

        mapa = str(parse_value(d.get("image_folder")) or stare.get(aid, {}).get("image_folder", ""))
        if not mapa:
            mapa = f"{aid:02d}-" + re.sub(r"[^a-z0-9]+", "-", str(naziv).lower()).strip("-")[:40]
        unos = parse_value(d.get("slike"))
        if unos:
            kopiraj_slike(unos, os.path.join(IMG_DIR, mapa), naziv)
        slike = slike_iz_mape(mapa)
        if not slike:
            print(f"  UPOZORENJE: nema slika za akciju '{naziv}' (mapa public/images/akcije/{mapa}/)")

        vrijedi = parse_value(d.get("vrijedi_do"))
        objavljeno = d.get("objavljeno")
        akcije.append({
            "id": aid,
            "naziv": str(naziv),
            "kategorija": str(parse_value(d.get("kategorija")) or ""),
            "cijena": formatiraj_akciju(parse_value(d.get("cijena"))),
            "akcijska_cijena": formatiraj_akciju(parse_value(d.get("akcijska_cijena"))) or "Cijena na upit",
            "opis": str(parse_value(d.get("opis")) or ""),
            "image_folder": mapa,
            "slike": slike,
            "vrijedi_do": u_datum(vrijedi) if vrijedi else "",
            "objavljeno": True if objavljeno in (None, "") else parse_bool(objavljeno),
        })

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(akcije, f, ensure_ascii=False, indent=2)
        f.write("\n")
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Akcije → {JSON_PATH}: {len(akcije)}")


if __name__ == "__main__":
    main()
