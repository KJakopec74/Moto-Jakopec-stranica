# =============================================================================
# slike_smanji.py — smanjuje veličinu JPG slika bez vidljivog gubitka kvalitete
# -----------------------------------------------------------------------------
# Prolazi kroz mape public/images/vozila, oprema i dijelovi i svaku JPG sliku
# ponovno sprema s kvalitetom 80 (progresivni JPG). Naziv i dimenzije slike
# ostaju isti, pa models.json i products.json nije potrebno mijenjati.
#
# Slika se zamjenjuje SAMO ako je nova barem 20 % manja. Zato je skriptu
# sigurno pokretati više puta — već smanjene slike se preskaču.
#
# Pokretanje (iz glavne mape projekta):
#     py -X utf8 scripts/slike_smanji.py
#
# Potrebna biblioteka (samo prvi put):
#     pip install pillow
# =============================================================================

import io
import os

from PIL import Image

# --- Postavke ----------------------------------------------------------------

# Mape u kojima tražimo slike
MAPE_SA_SLIKAMA = [
    "public/images/vozila",
    "public/images/oprema",
    "public/images/dijelovi",
    "public/images/rabljena",
]

# Kvaliteta JPG-a (1–95). 80 je dobar omjer kvalitete i veličine.
KVALITETA = 80

# Najveća dopuštena širina slike u pikselima (veće slike se smanje)
NAJVECA_SIRINA = 1600

# Novu sliku spremamo samo ako je manja od ovog postotka stare veličine
PRAG_UŠTEDE = 0.80

# Ekstenzije koje obrađujemo
JPG_EKSTENZIJE = (".jpg", ".jpeg")


def smanji_sliku(putanja):
    """Ponovno sprema jednu sliku. Vraća (stara_velicina, nova_velicina)."""
    stara_velicina = os.path.getsize(putanja)

    # 1) Učitavamo sliku i pretvaramo u RGB (JPG ne podržava prozirnost)
    slika = Image.open(putanja)
    slika = slika.convert("RGB")

    # 2) Ako je slika preširoka, smanjujemo je uz očuvanje omjera stranica
    sirina, visina = slika.size
    if sirina > NAJVECA_SIRINA:
        nova_visina = int(visina * NAJVECA_SIRINA / sirina)
        slika = slika.resize((NAJVECA_SIRINA, nova_visina), Image.LANCZOS)

    # 3) Spremamo u memoriju da vidimo koliko će nova datoteka biti velika
    spremnik = io.BytesIO()
    slika.save(spremnik, "JPEG", quality=KVALITETA, optimize=True, progressive=True)
    nova_velicina = len(spremnik.getvalue())

    # 4) Zamjenjujemo datoteku samo ako je ušteda dovoljna
    if nova_velicina < stara_velicina * PRAG_UŠTEDE:
        with open(putanja, "wb") as datoteka:
            datoteka.write(spremnik.getvalue())
        return stara_velicina, nova_velicina

    # Inače ostavljamo original
    return stara_velicina, stara_velicina


def main():
    ukupno_prije = 0
    ukupno_poslije = 0
    broj_smanjenih = 0
    broj_preskocenih = 0

    for mapa in MAPE_SA_SLIKAMA:
        if not os.path.isdir(mapa):
            print(f"Mapa ne postoji, preskačem: {mapa}")
            continue

        # Prolazimo kroz sve podmape i datoteke
        for korijen, _, datoteke in os.walk(mapa):
            for ime in sorted(datoteke):
                if not ime.lower().endswith(JPG_EKSTENZIJE):
                    continue

                putanja = os.path.join(korijen, ime)
                try:
                    prije, poslije = smanji_sliku(putanja)
                except Exception as greska:
                    print(f"  GREŠKA: {putanja} — {greska}")
                    continue

                ukupno_prije += prije
                ukupno_poslije += poslije
                if poslije < prije:
                    broj_smanjenih += 1
                else:
                    broj_preskocenih += 1

    # Ispis rezultata
    print()
    print(f"Smanjeno slika:    {broj_smanjenih}")
    print(f"Preskočeno slika:  {broj_preskocenih} (već su dovoljno male)")
    print(f"Ukupno prije:      {ukupno_prije / 1_000_000:.1f} MB")
    print(f"Ukupno poslije:    {ukupno_poslije / 1_000_000:.1f} MB")
    if ukupno_prije > 0:
        print(f"Ušteda:            {100 - ukupno_poslije / ukupno_prije * 100:.0f} %")


if __name__ == "__main__":
    main()
