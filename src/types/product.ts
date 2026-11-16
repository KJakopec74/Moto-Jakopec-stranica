export type ProductCategory = "Oprema" | "Dijelovi";

export interface Product {
  id: number;
  name: string;
  category: ProductCategory;
  subcategory: string;      // kategorija, npr. "Kacige", "Motor", "Kočnice" (vidi kategorije.json)
  skupina?: string;         // skupina unutar kategorije, npr. "Klipovi" (Motor) ili "Pločice" (Kočnice)
  price: string;            // npr. "49,90 €" ili "Cijena na upit"
  description: string;
  image_folder: string;
  brand?: string;    // brand_id iz brands.json (npr. "airoh", "motul")
  images: string[];
  is_new?: boolean;
  // Tehnički podaci, npr. { "Kompatibilnost": "KX450 2019–2023", "Promjer klipa": "95,97 mm" }
  specs?: Record<string, string>;
}
