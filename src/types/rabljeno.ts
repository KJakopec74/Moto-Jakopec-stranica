// Rabljeno vozilo — podaci iz rabljena.xlsx (scripts/rabljena_excel_to_json.py)
export interface RabljenoVozilo {
  id: number;
  name: string;
  brand: string;               // marka (bilo koja, ne samo Kawasaki)
  category: string;
  godiste: number | null;
  kilometri: number | null;
  price: string;               // "6.900 €" ili "Cijena na upit"
  license_category: string;
  prodano: boolean;
  description: string;
  image_folder: string;
  images: string[];
  specs: Record<string, string>;
}
