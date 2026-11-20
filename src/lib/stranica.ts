// =============================================================================
// Osnovni podaci o stranici i firmi — koriste se za SEO (Google, dijeljenje
// linkova) na više mjesta. Ako se nešto promijeni (npr. telefon), mijenja se
// samo ovdje.
// =============================================================================

// Konačna adresa stranice (nakon spajanja domene)
export const ADRESA_STRANICE = "https://www.moto-jakopec.com";

export const FIRMA = {
  naziv: "Moto Jakopec",
  opis: "Ovlašteni Kawasaki zastupnik u Samoboru. Prodaja novih motocikala, quadova, Mule vozila i Jet Ski skutera, servis, rezervni dijelovi i oprema.",
  ulica: "Eugena Kvaternika 4",
  postanskiBroj: "10430",
  grad: "Samobor",
  drzava: "HR",
  telefon: "+38513371059",
  email: "moto.jakopec@gmail.com",
};

// Brojevi telefona — prikazuju se u zaglavlju, podnožju i na stranici Kontakt
export const TELEFONI = [
  { prikaz: "01/3371-059",  poziv: "+38513371059",  vrsta: "Tel/Fax" },
  { prikaz: "091/555-1655", poziv: "+385915551655", vrsta: "Mobitel" },
  { prikaz: "091/583-8951", poziv: "+385915838951", vrsta: "Mobitel" },
];

// Radno vrijeme — prikazuje se u podnožju i na stranici Kontakt
export const RADNO_VRIJEME = [
  { dani: "Ponedjeljak i srijeda",       sati: "10:00 – 18:00" },
  { dani: "Utorak, četvrtak i petak",    sati: "8:00 – 16:00" },
  { dani: "Subota i nedjelja",           sati: "ne radimo" },
];

// Brze poruke (plutajući gumb dolje desno): WhatsApp i Viber na ovaj mobitel.
// Broj u međunarodnom obliku BEZ + i razmaka. Za isključivanje stavi false.
export const BRZE_PORUKE = {
  broj: "385915551655",        // 091/555-1655
  prikaz: "091/555-1655",
  whatsapp: true,
  viber: true,
};

// Društvene mreže — upiši punu adresu profila (npr. "https://www.facebook.com/motojakopec").
// Prazno = ikona se ne prikazuje.
export const DRUSTVENE_MREZE = {
  facebook: "",
  instagram: "",
};
