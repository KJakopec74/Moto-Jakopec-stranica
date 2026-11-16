"""
slike_kopiranje.py — zajedničke funkcije za stupac "slike" u Excelu
(koriste ih proizvodi_excel_to_json.py i vozila_excel_to_json.py).

U stupac "slike" upisuju se nazivi preuzetih slika (traže se u Preuzimanjima,
na Radnoj površini i u mapi projekta) ili pune putanje, odvojeni točka-zarezom.
Slike se kopiraju u ciljnu mapu kao img_01, img_02 ... i smanje na najviše 1600 px.
"""

import os
from PIL import Image

ROOT_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")

# Mape u kojima tražimo sliku kad je upisan samo naziv datoteke
MAPE_ZA_TRAZENJE = [
    os.path.join(os.path.expanduser("~"), "Downloads"),   # Preuzimanja
    os.path.join(os.path.expanduser("~"), "Desktop"),     # Radna površina
    ROOT_DIR,                                              # mapa projekta
]

NAJVECA_STRANICA = 1600   # px — veće slike se smanje
KVALITETA_SLIKE  = 82     # za JPG i WebP

def pronadi_sliku(unos: str):
    """Vraća punu putanju do slike ili None ako ne postoji."""
    unos = unos.strip().strip('"')          # Windows "Kopiraj kao putanju" dodaje navodnike
    if os.path.isabs(unos) or os.sep in unos or "/" in unos:
        return unos if os.path.isfile(unos) else None
    for mapa in MAPE_ZA_TRAZENJE:
        putanja = os.path.join(mapa, unos)
        if os.path.isfile(putanja):
            return putanja
    return None

def spremi_sliku(izvor: str, odrediste_bez_ekstenzije: str) -> str:
    """
    Kopira sliku u odredište: smanji ako je prevelika i spremi u istom formatu
    (JPG, PNG ili WebP; ostali formati se pretvaraju u JPG). Vraća ime nove datoteke.
    """
    slika = Image.open(izvor)
    ext = os.path.splitext(izvor)[1].lower()
    if ext == ".jpeg":
        ext = ".jpg"
    if ext not in (".jpg", ".png", ".webp"):
        ext = ".jpg"

    # Smanji ako je bilo koja stranica veća od NAJVECA_STRANICA
    slika.thumbnail((NAJVECA_STRANICA, NAJVECA_STRANICA), Image.LANCZOS)

    # Obriši stare verzije iste slike s drugim nastavkom (npr. img_01.png → img_01.jpg)
    for stari_ext in (".jpg", ".png", ".webp"):
        stara = odrediste_bez_ekstenzije + stari_ext
        if stari_ext != ext and os.path.exists(stara):
            os.remove(stara)

    odrediste = odrediste_bez_ekstenzije + ext
    if ext == ".jpg":
        slika.convert("RGB").save(odrediste, "JPEG", quality=KVALITETA_SLIKE, optimize=True, progressive=True)
    elif ext == ".webp":
        slika.save(odrediste, "WEBP", quality=KVALITETA_SLIKE)
    else:
        slika.save(odrediste, "PNG", optimize=True)
    return os.path.basename(odrediste)

def kopiraj_slike(unos_slika, mapa: str, naziv: str):
    """
    Obradi stupac "slike" jednog proizvoda/vozila: kopira slike u zadanu mapu.
    Ispisuje upozorenja za slike koje ne postoje.
    """
    if not unos_slika:
        return
    os.makedirs(mapa, exist_ok=True)

    unosi = [u for u in str(unos_slika).split(";") if u.strip()]
    for redni_broj, unos in enumerate(unosi, start=1):
        izvor = pronadi_sliku(unos)
        cilj = os.path.join(mapa, f"img_{redni_broj:02d}")
        if izvor is None:
            # Ako je slika već ranije kopirana, ne treba je ponovo tražiti
            if any(os.path.exists(cilj + e) for e in (".jpg", ".png", ".webp")):
                continue
            print(f"  UPOZORENJE: slika '{unos.strip()}' za '{naziv}' nije pronađena")
            continue
        ime = spremi_sliku(izvor, cilj)
        print(f"  Slika: {naziv} ← {os.path.basename(izvor)}  →  {os.path.basename(mapa)}/{ime}")

