import { useParams } from 'react-router-dom';
import ServiceList from '@/components/ServiceList';

export default function Services() {
  const { clientId } = useParams();
  return <ServiceList clientId={clientId || ''} />;
} 