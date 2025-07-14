interface ActuatorPageProps { params: { actuatorId: string } }

export default function ActuatorPage({ params }: ActuatorPageProps) {
  return <div>Actuator {params.actuatorId}</div>;
}
