"""
novosti_json_to_excel.py — napravi novosti.xlsx iz src/data/novosti.json.
Ne treba ga pokretati ručno: novosti_excel_to_json.py (objavi.bat) ga pokrene sam.
"""

import json, os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from excel_sinkronizacija import zapamti, arhiviraj

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.join(SCRIPT_DIR, "..")
JSON_PATH  = os.path.join(ROOT_DIR, "src", "data", "novosti.json")
EXCEL_PATH = os.path.join(ROOT_DIR, "novosti.xlsx")

STUPCI = ["id", "datum", "naslov", "tekst", "slika", "link", "istaknuto", "objavljeno"]
SIRINE = {"id": 5, "datum": 12, "naslov": 40, "tekst": 80, "slika": 30, "link": 30, "istaknuto": 10, "objavljeno": 11}


def main():
    novosti = json.load(open(JSON_PATH, encoding="utf-8")) if os.path.exists(JSON_PATH) else []

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Novosti"
    for ci, ime in enumerate(STUPCI, start=1):
        c = ws.cell(row=1, column=ci, value=ime)
        c.font = Font(color="FFFFFF", bold=True)
        c.fill = PatternFill("solid", fgColor="1B5E20")
        c.alignment = Alignment(horizontal="center", vertical="center")
        ws.column_dimensions[c.column_letter].width = SIRINE[ime]
    ws.freeze_panes = "A2"

    for ri, n in enumerate(novosti, start=2):
        red = {**n, "slika": "", "istaknuto": "DA" if n.get("istaknuto") else "NE",
               "objavljeno": "DA" if n.get("objavljeno", True) else "NE"}
        for ci, ime in enumerate(STUPCI, start=1):
            c = ws.cell(row=ri, column=ci, value=red.get(ime, ""))
            c.alignment = Alignment(vertical="top", wrap_text=(ime == "tekst"))

    for stupac in ("G", "H"):     # istaknuto, objavljeno
        dv = DataValidation(type="list", formula1='"DA,NE"', allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f"{stupac}2:{stupac}300")

    wu = wb.create_sheet("Upute")
    upute = [
        ("NOVOSTI — UPUTE", ""),
        ("", ""),
        ("Nova obavijest", "Dodaj red, popuni stupce, zatvori Excel i dvoklik na objavi.bat"),
        ("id", "Redni broj (1, 2, 3 …) — ne mijenjaj postojeće"),
        ("datum", "Datum objave, npr. 20.11.2026 — najnovije se prikazuju prve"),
        ("naslov", "Kratki naslov, npr. Stigli modeli 2027."),
        ("tekst", "Tekst obavijesti (novi red u ćeliji: Alt+Enter)"),
        ("slika", "Naziv slike iz Preuzimanja (npr. novost.jpg) — kopira se sama; može ostati prazno"),
        ("link", "Po želji: adresa na koju vodi gumb, npr. /akcije ili /motocikli/22"),
        ("istaknuto", "DA = prikazuje se i na početnoj stranici (najviše 3 najnovije)"),
        ("objavljeno", "NE = obavijest je skrivena (npr. stara akcija), ali ostaje u Excelu"),
    ]
    for r, (a, b) in enumerate(upute, start=1):
        wu.cell(row=r, column=1, value=a).font = Font(bold=True, size=14 if r == 1 else 11)
        wu.cell(row=r, column=2, value=b)
    wu.column_dimensions["A"].width = 18
    wu.column_dimensions["B"].width = 90

    kopija = arhiviraj(EXCEL_PATH)
    if kopija:
        print(f"Stari Excel sačuvan kao: {kopija}")
    wb.save(EXCEL_PATH)
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Spremljeno: {EXCEL_PATH}  (novosti: {len(novosti)})")


if __name__ == "__main__":
    main()
