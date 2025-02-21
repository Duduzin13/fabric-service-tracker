import { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '@/types';
import { getClientServices } from '@/lib/localStorage';

interface ServiceContextType {
  services: Service[];
  refreshServices: (clientId: string) => void;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  const refreshServices = (clientId: string) => {
    const updatedServices = getClientServices(clientId);
    setServices(updatedServices);
  };

  return (
    <ServiceContext.Provider value={{ services, refreshServices }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
} 