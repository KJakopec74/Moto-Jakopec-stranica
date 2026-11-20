"""
akcije_json_to_excel.py — napravi akcije.xlsx iz src/data/akcije.json.
Ne treba ga pokretati ručno: akcije_excel_to_json.py (objavi.bat) ga pokrene sam.
"""

import json, os
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.datavalidation import DataValidation
from excel_sinkronizacija import zapamti, arhiviraj

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR   = os.path.join(SCRIPT_DIR, "..")
JSON_PATH  = os.path.join(ROOT_DIR, "src", "data", "akcije.json")
EXCEL_PATH = os.path.join(ROOT_DIR, "akcije.xlsx")

STUPCI = ["id", "naziv", "kategorija", "cijena", "akcijska_cijena", "opis", "slike",
          "image_folder", "vrijedi_do", "objavljeno"]
SIRINE = {"id": 5, "naziv": 35, "kategorija": 14, "cijena": 13, "akcijska_cijena": 16, "opis": 70,
          "slike": 35, "image_folder": 24, "vrijedi_do": 12, "objavljeno": 11}
KATEGORIJE = ["Vozila", "Oprema", "Dijelovi", "Ulja i kemija", "Servis", "Ostalo"]


def main():
    akcije = json.load(open(JSON_PATH, encoding="utf-8")) if os.path.exists(JSON_PATH) else []

    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "Akcije"
    for ci, ime in enumerate(STUPCI, start=1):
        c = ws.cell(row=1, column=ci, value=ime)
        c.font = Font(color="FFFFFF", bold=True)
        c.fill = PatternFill("solid", fgColor="B42318")       # crveno — akcije
        c.alignment = Alignment(horizontal="center", vertical="center")
        ws.column_dimensions[c.column_letter].width = SIRINE[ime]
    ws.freeze_panes = "C2"

    for ri, a in enumerate(akcije, start=2):
        red = {**a, "slike": "", "objavljeno": "DA" if a.get("objavljeno", True) else "NE",
               "vrijedi_do": a.get("vrijedi_do", "")}
        if red["vrijedi_do"]:                      # "2026-12-31" → "31.12.2026"
            g, m, d = red["vrijedi_do"].split("-")
            red["vrijedi_do"] = f"{int(d)}.{int(m)}.{g}"
        for ci, ime in enumerate(STUPCI, start=1):
            c = ws.cell(row=ri, column=ci, value=red.get(ime, ""))
            c.alignment = Alignment(vertical="top", wrap_text=(ime == "opis"))

    for stupac, vrijednosti in (("C", KATEGORIJE), ("J", ["DA", "NE"])):
        dv = DataValidation(type="list", formula1='"' + ",".join(vrijednosti) + '"', allow_blank=True)
        ws.add_data_validation(dv)
        dv.add(f"{stupac}2:{stupac}300")

    wu = wb.create_sheet("Upute")
    upute = [
        ("AKCIJE — UPUTE", ""),
        ("", ""),
        ("Nova akcija", "Dodaj red, popuni stupce, zatvori Excel i dvoklik na objavi.bat"),
        ("id", "Redni broj (1, 2, 3 …) — ne mijenjaj postojeće"),
        ("naziv", "Npr. Airoh Aviator 3 kaciga ili Motul 7100 10W-40 4 L"),
        ("kategorija", "Padajući izbornik: Vozila, Oprema, Dijelovi, Ulja i kemija, Servis, Ostalo"),
        ("cijena", "Redovna cijena (precrta se), npr. 149,90 — može ostati prazno"),
        ("akcijska_cijena", "Akcijska cijena, npr. 119,90 — popust u % izračuna se sam"),
        ("opis", "Opis proizvoda i akcije (novi red u ćeliji: Alt+Enter)"),
        ("slike", "Nazivi slika iz Preuzimanja, odvojeni ;  (npr. kaciga1.jpg; kaciga2.jpg) — kopiraju se same"),
        ("image_folder", "Može ostati prazno — mapa se napravi sama (public/images/akcije/...)"),
        ("vrijedi_do", "Zadnji dan akcije, npr. 31.12.2026 — nakon toga se akcija sama sakrije. Prazno = bez roka"),
        ("objavljeno", "NE = akcija je skrivena, ali ostaje u Excelu (za iduću sezonu)"),
        ("", ""),
        ("Napomena", "Za vozila i proizvode koji su već na stranici možeš umjesto ovoga samo upisati"),
        ("", "akcijsku cijenu u stupac akcijska_cijena u vozila.xlsx / proizvodi.xlsx."),
    ]
    for r, (a, b) in enumerate(upute, start=1):
        wu.cell(row=r, column=1, value=a).font = Font(bold=True, size=14 if r == 1 else 11)
        wu.cell(row=r, column=2, value=b)
    wu.column_dimensions["A"].width = 18
    wu.column_dimensions["B"].width = 95

    kopija = arhiviraj(EXCEL_PATH)
    if kopija:
        print(f"Stari Excel sačuvan kao: {kopija}")
    wb.save(EXCEL_PATH)
    zapamti(EXCEL_PATH, JSON_PATH)
    print(f"Spremljeno: {EXCEL_PATH}  (akcija: {len(akcije)})")


if __name__ == "__main__":
    main()
