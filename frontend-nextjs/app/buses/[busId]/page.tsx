type BusDetailsPageProps = {
  params: {
    busId: string;
  };
};

export default function BusDetailsPage({ params }: BusDetailsPageProps) {
  return <main>Bus Details: {params.busId}</main>;
}
