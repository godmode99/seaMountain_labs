interface HubPageProps { params: { hubId: string } }

export default function HubPage({ params }: HubPageProps) {
  return <div>Hub {params.hubId}</div>;
}
