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
   (proizvod može biti i bez brenda — npr. žmigavci, akumulatori)
   - `subcategory` = **kategorija** na stranici (Kacige, Naočale… / Motor, Auspusi, Kočnice…) — odaberi iz padajućeg izbornika
   - `skupina` = skupina unutar kategorije (npr. `Klipovi` u kategoriji Motor, `Pločice` u Kočnicama) —
     popis skupina je na listu **Upute** u Excelu; može ostati prazno
   - redoslijed i opisi kategorija te skupina upisani su u `src/data/kategorije.json`
3. Stupac `specifikacije` — tehnički podaci u obliku `Ključ: vrijednost; Ključ: vrijednost`
   (npr. `Promjer klipa: 95,97 mm; Kompresija: 12,5:1`) — na stranici se prikažu kao tablica
4. `price` — broj (`129`) ili ostavi prazno za "Cijena na upit"
5. **Slike** — preuzmi sliku sa stranice proizvođača (desni klik → *Spremi sliku kao…* → u mapu **Preuzimanja**)
   i u stupac `slike` upiši njezin naziv, npr. `aviator3.png`.
   - više slika odvoji točka-zarezom: `aviator3.png; aviator3-bok.png` — **prva je glavna**
   - slika s drugog mjesta: upiši cijelu putanju (u Exploreru *Shift + desni klik → Kopiraj kao putanju*)
   - `objavi.bat` slike sam kopira u pravu mapu, smanji ih i objavi; nakon toga ih iz Preuzimanja smiješ obrisati
6. Spremi, zatvori, dvoklik na **`objavi.bat`**

### Najjednostavnije: slike samo ubaci u mapu proizvoda

Svaki proizvod ima svoju mapu (naziv piše u Excelu, stupac `image_folder`):
`public\images\oprema\<mapa>\` ili `public\images\dijelovi\<mapa>\` — npr. `public\images\oprema\airoh-aviator-3\`.
Ubaci slike u nju (bilo koje ime) i pokreni `objavi.bat`. Slike se prikazuju abecednim redom imena —
prva je glavna (za redoslijed ih nazovi `1.jpg`, `2.jpg`, …).

### Ili preko Excela (stupac `slike`) — korak po korak

1. U Excelu filtriraj stupac `brand` (strelica u zaglavlju) na jedan brend, npr. `alpinestars`
2. Otvori stranicu proizvođača (adresa je u listu *Brendovi_Oprema* / *Brendovi_Dijelovi*, stupac `website`)
3. Nađi proizvod koji odgovara retku (npr. "Alpinestars motocross čizme" → neki njihov model čizama)
4. Desni klik na sliku → **Spremi sliku kao…** → mapa **Preuzimanja**, kratko ime bez razmaka,
   npr. `alpinestars-cizme.jpg` (ako se nudi `.webp`, i to je u redu)
5. U taj redak, u stupac `slike`, upiši `alpinestars-cizme.jpg` (više slika: `a.jpg; b.jpg` — prva je glavna)
6. Ponovi za ostale retke tog brenda, pa za sljedeći brend
7. Spremi i zatvori Excel → dvoklik na **`objavi.bat`** — za par minuta slike su online
8. Ako `objavi.bat` napiše *UPOZORENJE: slika ne postoji*, ime u Excelu ne odgovara imenu datoteke
   (provjeri nastavak `.jpg` / `.png` / `.webp`)

> Savjet: slika bijele ili prozirne pozadine izgleda najbolje. Ne treba je smanjivati — `objavi.bat` to radi sam.

### Logotipi brendova

Novi brendovi (JUST1, Alpinestars, THOR, FMF…) još nemaju logo — dok ga nemaju, na kartici piše naziv brenda.
Spremi logo (najbolje `.png` s prozirnom pozadinom ili `.svg`) kao `public\images\brendovi\<brand_id>.png`
(npr. `alpinestars.png`), u listu *Brendovi_…* u stupac `logo_folder` upiši `alpinestars` i pokreni `objavi.bat`.

> **Excel se nikad ne radi ručno iznova.** Isti Excel koristiš stalno — za cijene, opise, slike, nove proizvode.
> Ako se podaci promijene na GitHubu (npr. kad ih ja dopunim), `objavi.bat` to sam primijeti i Excel
> automatski osvježi (prethodni ostaje kao `*_stari.xlsx`). Staje samo ako si u međuvremenu i ti mijenjao Excel —
> tada ispiše što napraviti, da se ništa ne izgubi.

---

## 5. Akcije (snižene cijene)

1. U `vozila.xlsx` ili `proizvodi.xlsx` u stupac **akcijska_cijena** upiši novu, nižu cijenu (npr. `8990` ili `119,90`).
   Stupac `price` ostavi kakav jest: to je stara cijena, koja se na stranici prikaže precrtana.
2. Zatvori Excel i dvoklikni `objavi.bat`.

Na kartici se pojavi crvena oznaka **AKCIJA −10%** (postotak se izračuna sam).
Vozilo ili proizvod se pojavi i na stranici **Akcije**, a dok traje ijedna akcija, u izborniku se vidi i crveni link **Akcije** i sekcija na početnoj stranici.

**Kraj akcije:** obriši ćeliju `akcijska_cijena` i pokreni `objavi.bat`. Kad nema nijedne akcije, link Akcije sam nestane iz izbornika.

> Ako `vozila.xlsx` / `proizvodi.xlsx` još nema stupac `akcijska_cijena`, samo pokreni `objavi.bat` jednom (dok Excel nije mijenjan): Excel se sam osvježi s novim stupcem.

## 6. Rabljena vozila

Rabljena vozila imaju svoj Excel: **`rabljena.xlsx`**. Napravi se sam kad prvi put pokreneš `objavi.bat` (prazan, s listom **Upute**).

**Dodavanje vozila:**
1. Otvori `rabljena.xlsx` i u novi red upiši:
   - `id`: 1, 2, 3 …
   - `name`: npr. Kawasaki Z900
   - `marka`
   - `category`
   - `godiste`
   - `kilometri`: samo broj
   - `price`: broj; prazno znači „Cijena na upit”
   - `description`: stanje vozila
2. Slike: preuzete slike upiši u stupac `slike` (npr. `z900_1.jpg; z900_2.jpg`), kao kod novih vozila.
   Može i ovako: stavi ih ravno u mapu `public/images/rabljena/<image_folder>/`.
   `image_folder` može ostati prazan, mapa se napravi sama (npr. `01-kawasaki-z900`).
3. Dodatni podaci (Snaga, Boja, Broj vlasnika, Servisna knjiga, Registriran do …) su po želji, prazno se ne prikazuje.
   Možeš dodati i svoj stupac: upiši naziv u prvi red.
4. Zatvori Excel i dvoklikni `objavi.bat`.

**Prodano:** u stupcu `prodano` stavi `DA`. Vozilo ostaje na stranici s oznakom PRODANO, na kraju popisa.
Ako ga želiš potpuno maknuti, obriši cijeli red.

Dok nema nijednog vozila, stranica Rabljena vozila prikazuje poruku „Trenutno nemamo rabljenih vozila” s gumbom za upit.

## 7. Pregled prije objave (nije obavezno)

Dvoklik na **`pokreni_stranicu.bat`** → otvori se **http://localhost:3000**.
Stranica se sama osvježava kad nešto promijeniš. Za gašenje zatvori crni prozor.

---

## 8. Kad nešto ne radi

| Problem | Rješenje |
|---------|----------|
| `objavi.bat` javi grešku kod Excela | Excel mora biti **zatvoren** |
| **PAŽNJA: i vozila.xlsx (ili proizvodi.xlsx) i podaci na GitHubu promijenjeni su** | Rijetko: netko je mijenjao podatke na GitHubu dok si ti mijenjao Excel. Slijedi upute koje ispiše `objavi.bat` |
| Na stranici nema slika vozila | Provjeri da mapa u `public\images\vozila\` postoji i ima slike |
| Promjena nije online ni nakon 5 min | Cloudflare → Workers & Pages → moto-jakopec → **Deployments** — pogledaj je li build pao |
| Upiti s forme ne stižu | Provjeri spam u Gmailu; na web3forms.com provjeri postavke forme |

---

## 9. Važni računi

| Usluga | Čemu služi | Račun |
|--------|-----------|-------|
| GitHub | čuva kod stranice | KJakopec74 |
| Cloudflare | hosting (besplatno) | moto.jakopec@gmail.com |
| Web3Forms | šalje upite s forme na mail | moto.jakopec@gmail.com |
