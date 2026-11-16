"""
excel_sinkronizacija.py — drži Excel i JSON usklađenima bez ručnog posla.

Nakon svake uspješne objave pamti se vrijeme izmjene Excela (u datoteci
.excel_sinkronizacija.json, koja se ne šalje na GitHub).

Kad objavi.bat povuče s GitHuba promijenjeni JSON (npr. novi modeli):
  • Excel NIJE mijenjan od zadnje objave → Excel se AUTOMATSKI napravi iznova
    iz najnovijih podataka (stari ostaje kao *_stari.xlsx) i objava se nastavlja.
  • Excel JE mijenjan, a i JSON se promijenio → obje strane imaju izmjene;
    skripta staje da se ništa ne izgubi (ovo se događa vrlo rijetko).
"""

import json, os

ROOT_DIR   = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
STAMP_PATH = os.path.join(ROOT_DIR, ".excel_sinkronizacija.json")


def _ucitaj():
    try:
        with open(STAMP_PATH, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def zapamti(excel_path, json_path=None):
    """Zapamti da su Excel i JSON trenutno usklađeni."""
    vrijeme = os.path.getmtime(excel_path)
    if json_path and os.path.exists(json_path):
        os.utime(json_path, (vrijeme, vrijeme))
    stamp = _ucitaj()
    stamp[os.path.basename(excel_path)] = vrijeme
    with open(STAMP_PATH, "w", encoding="utf-8") as f:
        json.dump(stamp, f, indent=2)


def osvjezi_ako_treba(excel_path, json_path, napravi_excel, ime_excela):
    """
    Vrati True ako je Excel upravo automatski napravljen iznova (tada je
    JSON već najnoviji i pretvorba Excel → JSON nije potrebna).
    """
    if not os.path.exists(json_path):
        return False
    vrijeme_excela = os.path.getmtime(excel_path)
    if os.path.getmtime(json_path) <= vrijeme_excela + 2:
        return False          # JSON nije mijenjan izvana — sve normalno

    zapamceno = _ucitaj().get(os.path.basename(excel_path))
    excel_diran = zapamceno is not None and abs(zapamceno - vrijeme_excela) > 2

    if excel_diran:
        print(f"PAŽNJA: i {ime_excela} i podaci na GitHubu promijenjeni su od zadnje objave.")
        print("  Da se ništa ne izgubi, ništa nije prepisano.")
        print("  1) Zatvori Excel  2) preimenuj svoj Excel (npr. dodaj _moj na kraj imena)")
        print("  3) ponovo pokreni objavi.bat — napravit će se novi Excel s najnovijim podacima")
        print("  4) svoje izmjene iz starog Excela prepiši u novi i još jednom pokreni objavi.bat")
        raise SystemExit(2)

    print(f"Na GitHubu su stigle nove promjene — {ime_excela} se automatski osvježava...")
    napravi_excel()
    zapamti(excel_path, json_path)
    print(f"  {ime_excela} je osvježen (prethodni je sačuvan kao *_stari.xlsx).")
    if zapamceno is None:
        print("  Ako si u Excelu nešto mijenjao, a NISI objavio, prepiši to iz *_stari.xlsx.")
    return True
