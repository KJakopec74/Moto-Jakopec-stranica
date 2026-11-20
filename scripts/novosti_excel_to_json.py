"""
novosti_excel_to_json.py — novosti.xlsx → src/data/novosti.json (pokreće ga objavi.bat).
Ako novosti.xlsx ne postoji, napravi se prazan s uputama.
"""

import datetime, json, os, re
import openpyxl
from slike_kopiranje import kopiraj_slike, pripremi_mapu
from excel_sinkronizacija import osvjezi_ako_treba, zapamti
from vozila_excel_to_json import parse_value, parse_bool
from novosti_json_to_excel import main as napravi_excel, EXCEL_PATH, JSON_PATH, ROOT_DIR

IMG_DIR = os.path.join(ROOT_DIR, "public", "images", "novosti")


def u_datum(val) -> str:
    """Excel datum ili "20.11.2026" → "2026-11-20" (prazno → danas)"""
    if isinstance(val, (datetime.datetime, datetime.date)):
        return val.strftime("%Y-%m-%d")
    t = str(val or "").strip()
    m = re.match(r"(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})", t)
    if m:
        return f"{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    if re.match(r"\d{4}-\d{2}-\d{2}", t):
        return t[:10]
    return datetime.date.today().strftime("%Y-%m-%d")


def main():
    if not os.path.exists(EXCEL_PATH):
        print("novosti.xlsx ne postoji — radim prazan Excel s uputama...")
        napravi_excel()
        return
    osvjezi_ako_treba(EXCEL_PATH, JSON_PATH, napravi_excel, "novosti.xlsx")

    stare = {}
    if os.path.exists(JSON_PATH):
        stare = {n.get("id"): n for n in json.load(open(JSON_PATH, encoding="utf-8"))}

    redovi = list(openpyxl.load_workbook(EXCEL_PATH)["Novosti"].iter_rows(values_only=True))
    zaglavlje = [str(h).strip() if h else "" for h in redovi[0]]
    novosti, ids = [], set()
    for red in redovi[1:]:
        d = dict(zip(zaglavlje, red))
        naslov = parse_value(d.get("naslov"))
        if not naslov:
            continue
        try:
            nid = int(d.get("id"))
        except (TypeError, ValueError):
            nid = max(ids | {0}) + 1
        if nid in ids:
            nid = max(ids) + 1
        ids.add(nid)

        # Slika: nova iz stupca "slika" ili ona od prije
        mapa = f"{nid:02d}"
        unos = parse_value(d.get("slika"))
        slika = stare.get(nid, {}).get("slika", "")
        if unos:
            kopiraj_slike(unos, os.path.join(IMG_DIR, mapa), naslov)
            pripremi_mapu(os.path.join(IMG_DIR, mapa))
            datoteke = sorted(os.listdir(os.path.join(IMG_DIR, mapa)))
            if datoteke:
                slika = f"/images/novosti/{mapa}/{datoteke[0]}"

        objavljeno = d.get("objavljeno")
        novosti.append({
            "id": nid,
            "datum": u_datum(d.get("datum")),
            "naslov": str(naslov),
            "tekst": str(parse_value(d.get("tekst")) or ""),
            "slika": slika,
            "link": str(parse_value(d.get("link")) or ""),
            "istaknuto": parse_bool(d.get("istaknuto")),
            "objavljeno": True if objavljeno in (None, "") else parse_bool(objavljeno),
        })

    novosti.sort(key=lambda n: n["datum"], reverse=True)
    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(novosti, f, ensure_ascii=False, indent=2)
        f.write("\n")
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Novosti → {JSON_PATH}: {len(novosti)}")


if __name__ == "__main__":
    main()
