import StranicaBrenda, { parametriBrendova } from "@/components/StranicaBrenda";

export function generateStaticParams() {
  return parametriBrendova("dijelovi");
}

export default function DijeloviBrend({ params }: { params: { brand: string } }) {
  return <StranicaBrenda vrsta="dijelovi" brandId={params.brand} />;
}
