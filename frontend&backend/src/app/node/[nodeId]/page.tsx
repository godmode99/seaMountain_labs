interface NodePageProps { params: { nodeId: string } }

export default function NodePage({ params }: NodePageProps) {
  return <div>Node {params.nodeId}</div>;
}
