interface SensorPageProps { params: { sensorId: string } }

export default function SensorPage({ params }: SensorPageProps) {
  return <div>Sensor {params.sensorId}</div>;
}
