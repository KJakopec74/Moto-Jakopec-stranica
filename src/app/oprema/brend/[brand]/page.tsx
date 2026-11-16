import StranicaBrenda, { parametriBrendova } from "@/components/StranicaBrenda";

export function generateStaticParams() {
  return parametriBrendova("oprema");
}

export default function OpremaBrend({ params }: { params: { brand: string } }) {
  return <StranicaBrenda vrsta="oprema" brandId={params.brand} />;
}
