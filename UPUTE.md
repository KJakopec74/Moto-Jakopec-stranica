# Moto Jakopec — upute za održavanje stranice

Stranica: **https://moto-jakopec.moto-jakopec.workers.dev** (kasnije **www.moto-jakopec.com**)

Svaka promjena ide istim putem:

```
Excel / slike na računalu  →  objavi.bat  →  GitHub  →  Cloudflare (online za ~2 min)
```

---

## 1. Priprema računala (samo jednom)

Otvori **Command Prompt** i upiši redom:

```
winget install OpenJS.NodeJS.LTS
winget install Git.Git
winget install Python.Python.3.12
```

Zatvori i ponovo otvori Command Prompt, pa:

```
cd %USERPROFILE%\Desktop
git clone https://github.com/KJakopec74/Moto-Jakopec-stranica
cd Moto-Jakopec-stranica
pip install openpyxl pillow
py -X utf8 scripts/vozila_json_to_excel.py
py -X utf8 scripts/kreiraj_excel_predlozak.py
```

U mapi `Desktop\Moto-Jakopec-stranica` sada su **`vozila.xlsx`** i **`proizvodi.xlsx`**.

> Kod prve objave git traži prijavu na GitHub — prijavi se kao **KJakopec74**.

---

## 2. Promjena cijena i podataka o vozilima

1. Otvori **`vozila.xlsx`** — svaki red je jedno vozilo.
2. Promijeni što treba:

| Stupac | Što upisati |
|--------|-------------|
| `price` | samo broj (`12490`) ili `Cijena na upit` — format "12.490 €" složi se sam |
| `is_new` | `TRUE` = prikazuje se na početnoj stranici |
| `description` | kratki opis |
| ostali stupci | tehničke specifikacije |

3. **Spremi i zatvori** Excel.
4. Dvoklik na **`objavi.bat`**.

⚠️ Ne povlači kvadratić u kutu ćelije prema dolje (Excel tada ponavlja uzorak) i ne sortiraj samo jedan stupac.

---

## 3. Slike vozila

- Slike su u `public\images\vozila\<mapa-vozila>\`
- Prikazuju se **abecednim redom naziva** — **`img_01.jpg` je glavna slika** (na kartici)
- Za promjenu redoslijeda preimenuj datoteke (`img_01`, `img_02`, …)
- Nove slike samo ubaci u mapu — `objavi.bat` ih sam smanji
- **Ili preko Excela:** u stupac **`slike`** u `vozila.xlsx` upiši nazive preuzetih slika
  odvojene točka-zarezom (npr. `versys900_1.jpg; versys900_2.jpg`). Slike se traže u
  *Preuzimanjima*, na *Radnoj površini* i u mapi projekta (može i puna putanja).
  `objavi.bat` ih kopira u mapu iz stupca `image_folder` kao `img_01`, `img_02` …
  i smanji. Nakon objave stupac `slike` možeš isprazniti.

---

## 4. Oprema i dijelovi

1. Otvori **`proizvodi.xlsx`**, sheet **Proizvodi**
2. `category` mora biti točno `Oprema` ili `Dijelovi`, `brand` npr. `airoh`, `motul`
3. Stupac `specifikacije` — tehnički podaci u obliku `Ključ: vrijednost; Ključ: vrijednost`
   (npr. `Promjer klipa: 95,97 mm; Kompresija: 12,5:1`) — na stranici se prikažu kao tablica
4. `price` — broj (`129`) ili ostavi prazno za "Cijena na upit"
5. **Slike** — preuzmi sliku sa stranice proizvođača (desni klik → *Spremi sliku kao…* → u mapu **Preuzimanja**)
   i u stupac `slike` upiši njezin naziv, npr. `aviator3.png`.
   - više slika odvoji točka-zarezom: `aviator3.png; aviator3-bok.png` — **prva je glavna**
   - slika s drugog mjesta: upiši cijelu putanju (u Exploreru *Shift + desni klik → Kopiraj kao putanju*)
   - `objavi.bat` slike sam kopira u pravu mapu, smanji ih i objavi; nakon toga ih iz Preuzimanja smiješ obrisati
6. Spremi, zatvori, dvoklik na **`objavi.bat`**

> Ako `objavi.bat` javi da je **products.json noviji od Excela**, netko je promijenio proizvode na GitHubu.
> Pokreni `py -X utf8 scripts/kreiraj_excel_predlozak.py` — napravi novi Excel s najnovijim podacima
> (stari ostaje kao `proizvodi_stari.xlsx`), pa ponovi izmjenu i `objavi.bat`.

---

## 5. Pregled prije objave (nije obavezno)

Dvoklik na **`pokreni_stranicu.bat`** → otvori se **http://localhost:3000**.
Stranica se sama osvježava kad nešto promijeniš. Za gašenje zatvori crni prozor.

---

## 6. Kad nešto ne radi

| Problem | Rješenje |
|---------|----------|
| `objavi.bat` javi grešku kod Excela | Excel mora biti **zatvoren** |
| **PAŽNJA: models.json je noviji od vozila.xlsx** | Na GitHubu su promijenjena vozila (npr. dodani novi modeli). Zatvori Excel i pokreni `py -X utf8 scripts/vozila_json_to_excel.py` — stari Excel ostaje sačuvan kao `vozila_stari.xlsx`. Zatim ponovo `objavi.bat` |
| Na stranici nema slika vozila | Provjeri da mapa u `public\images\vozila\` postoji i ima slike |
| Promjena nije online ni nakon 5 min | Cloudflare → Workers & Pages → moto-jakopec → **Deployments** — pogledaj je li build pao |
| Upiti s forme ne stižu | Provjeri spam u Gmailu; na web3forms.com provjeri postavke forme |

---

## 7. Važni računi

| Usluga | Čemu služi | Račun |
|--------|-----------|-------|
| GitHub | čuva kod stranice | KJakopec74 |
| Cloudflare | hosting (besplatno) | moto.jakopec@gmail.com |
| Web3Forms | šalje upite s forme na mail | moto.jakopec@gmail.com |
