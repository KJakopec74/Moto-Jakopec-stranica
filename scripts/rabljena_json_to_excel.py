"""
rabljena_json_to_excel.py — napravi rabljena.xlsx iz src/data/rabljena.json.

Ne treba ga pokretati ručno: rabljena_excel_to_json.py (i objavi.bat) sam
napravi Excel kad ga još nema ili kad su s GitHuba stigle nove promjene.
"""

import json, os, re
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation
from excel_sinkronizacija import zapamti

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.join(SCRIPT_DIR, "..")
JSON_PATH  = os.path.join(ROOT_DIR, "src", "data", "rabljena.json")
EXCEL_PATH = os.path.join(ROOT_DIR, "rabljena.xlsx")

# Osnovni stupci (svaki je posebno polje na stranici)
FIXED_COLS = ["id", "name", "marka", "category", "godiste", "kilometri", "price",
              "license_category", "prodano", "description", "image_folder", "slike"]

# Dodatni podaci — prikazuju se kao tablica; prazna polja se ne prikazuju.
# Korisnik može dodati i svoje stupce (npr. "Garancija") — i oni idu u tablicu.
ZADANI_PODACI = ["Radni obujam", "Snaga", "Boja", "Broj vlasnika",
                 "Servisna knjiga", "Registriran do", "Dodatna oprema"]

KATEGORIJE = ["Sport", "Naked", "Adventure", "Touring", "Classic", "Cruiser",
              "Offroad", "Skuter", "Električni", "Quad", "Mule", "Jet Ski"]

SIRINE = {"id": 5, "name": 30, "marka": 12, "category": 13, "godiste": 9, "kilometri": 11,
          "price": 13, "license_category": 10, "prodano": 9, "description": 55,
          "image_folder": 24, "slike": 35}


def main():
    vozila = []
    if os.path.exists(JSON_PATH):
        with open(JSON_PATH, encoding="utf-8") as f:
            vozila = json.load(f)

    # Dodatni stupci: zadani + svi koje već ima neko vozilo
    podaci = list(ZADANI_PODACI)
    for v in vozila:
        for k in (v.get("specs") or {}):
            if k not in podaci:
                podaci.append(k)
    zaglavlje = FIXED_COLS + podaci

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Rabljena"

    rub = Border(left=Side(style="thin", color="CCCCCC"), right=Side(style="thin", color="CCCCCC"),
                 bottom=Side(style="thin", color="CCCCCC"))
    for ci, ime in enumerate(zaglavlje, start=1):
        c = ws.cell(row=1, column=ci, value=ime)
        c.font = Font(color="FFFFFF", bold=True, size=10)
        c.fill = PatternFill("solid", fgColor="1B5E20" if ci <= len(FIXED_COLS) else "2E7D32")
        c.alignment = Alignment(horizontal="center", vertical="center")
        c.border = rub
        ws.column_dimensions[get_column_letter(ci)].width = SIRINE.get(ime, 18)
    ws.freeze_panes = "C2"
    ws.row_dimensions[1].height = 30

    for ri, v in enumerate(vozila, start=2):
        red = {
            "id": v.get("id"), "name": v.get("name", ""), "marka": v.get("brand", ""),
            "category": v.get("category", ""), "godiste": v.get("godiste"),
            "kilometri": v.get("kilometri"), "price": v.get("price", ""),
            "license_category": v.get("license_category", ""),
            "prodano": "DA" if v.get("prodano") else "NE",
            "description": v.get("description", ""), "image_folder": v.get("image_folder", ""),
            "slike": "",
        }
        for k in podaci:
            red[k] = (v.get("specs") or {}).get(k, "")
        for ci, ime in enumerate(zaglavlje, start=1):
            c = ws.cell(row=ri, column=ci, value=red.get(ime, ""))
            c.border = rub
            c.alignment = Alignment(vertical="center")

    # Padajući izbornici (vrijede za prvih 500 redova)
    def izbornik(stupac, vrijednosti):
        slovo = get_column_letter(zaglavlje.index(stupac) + 1)
        dv = DataValidation(type="list", formula1='"' + ",".join(vrijednosti) + '"', allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f"{slovo}2:{slovo}500")
    izbornik("category", KATEGORIJE)
    izbornik("prodano", ["NE", "DA"])
    izbornik("license_category", ["A1", "A2", "A2 (35 kW)"])

    # ── Upute ──
    wu = wb.create_sheet("Upute")
    upute = [
        ("RABLJENA VOZILA — UPUTE", ""),
        ("", ""),
        ("DODAVANJE VOZILA", "Dodaj novi red, popuni stupce, dvoklik na objavi.bat"),
        ("BRISANJE VOZILA", "Obriši cijeli red (ili stavi prodano = DA da ostane vidljivo kao PRODANO)"),
        ("", ""),
        ("id", "Redni broj — za novo vozilo upiši sljedeći broj (1, 2, 3 …); ne mijenjaj postojeće"),
        ("name", "Naziv koji se prikazuje, npr. Kawasaki Z900"),
        ("marka", "Kawasaki, Yamaha, KTM … (može biti bilo koja marka)"),
        ("category", "Padajući izbornik (Sport, Naked, Offroad, Quad …)"),
        ("godiste", "Godina proizvodnje, npr. 2019"),
        ("kilometri", "Samo broj, npr. 12500  (kod Jet Skija/quadova mogu biti i radni sati u dodatnim podacima)"),
        ("price", "Broj → 6.900 €  ·  prazno → Cijena na upit"),
        ("license_category", "A1, A2, A2 (35 kW) ili prazno (treba A)"),
        ("prodano", "NE = u prodaji  ·  DA = prikazuje se s oznakom PRODANO na kraju popisa"),
        ("description", "Opis stanja: servisi, oštećenja, što je zamijenjeno …"),
        ("image_folder", "Može ostati prazno — mapa se napravi sama (npr. 01-kawasaki-z900)"),
        ("slike", "Nazivi slika iz Preuzimanja (npr. z900_1.jpg; z900_2.jpg) — kopiraju se same; prva je glavna"),
        ("", ""),
        ("SVJETLIJI ZELENI STUPCI", "Dodatni podaci (snaga, boja, servisna knjiga …) — prazno se ne prikazuje."),
        ("", "Možeš dodati i svoj stupac (npr. Garancija) — samo upiši naziv u prvi red."),
        ("", ""),
        ("SLIKE", "Ili ih stavi ravno u mapu public/images/rabljena/<image_folder>/ — redoslijed po abecedi"),
    ]
    for r, (a, b) in enumerate(upute, start=1):
        wu.cell(row=r, column=1, value=a).font = Font(bold=True, size=14 if r == 1 else 11,
                                                      color="1B5E20" if r == 1 else "000000")
        wu.cell(row=r, column=2, value=b)
    wu.column_dimensions["A"].width = 26
    wu.column_dimensions["B"].width = 95

    # Postojeći Excel se ne briše — ostaje kao rabljena_stari.xlsx
    if os.path.exists(EXCEL_PATH):
        baza = EXCEL_PATH.replace(".xlsx", "_stari")
        novo, n = baza + ".xlsx", 2
        while os.path.exists(novo):
            novo, n = f"{baza}{n}.xlsx", n + 1
        try:
            os.replace(EXCEL_PATH, novo)
        except PermissionError:
            print("ZATVORI rabljena.xlsx pa pokreni ponovo.")
            raise SystemExit(1)
        print(f"Stari Excel sačuvan kao: {os.path.basename(novo)}")

    wb.save(EXCEL_PATH)
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Spremljeno: {EXCEL_PATH}  (rabljenih vozila: {len(vozila)})")


if __name__ == "__main__":
    main()
