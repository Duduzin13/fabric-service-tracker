import { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '@/types';
<<<<<<< HEAD
import { saveToFirebase, getFromFirebase, updateInFirebase, deleteFromFirebase } from '@/lib/firebase';

interface ServiceContextType {
  services: Service[];
  refreshServices: (clientId: string) => Promise<void>;
  saveService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
=======
import { getClientServices } from '@/lib/localStorage';

interface ServiceContextType {
  services: Service[];
  refreshServices: (clientId: string) => void;
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

<<<<<<< HEAD
  const refreshServices = async (clientId: string) => {
    const allServices = await getFromFirebase('services') as Service[];
    const clientServices = allServices.filter(s => s.clientId === clientId);
    setServices(clientServices);
  };

  const saveService = async (service: Service) => {
    await saveToFirebase('services', service);
  };

  const updateService = async (service: Service) => {
    const { id, ...data } = service;
    await updateInFirebase('services', id, data);
  };

  const deleteService = async (serviceId: string) => {
    await deleteFromFirebase('services', serviceId);
  };

  return (
    <ServiceContext.Provider value={{ 
      services, 
      refreshServices,
      saveService,
      updateService,
      deleteService
    }}>
=======
  const refreshServices = (clientId: string) => {
    const updatedServices = getClientServices(clientId);
    setServices(updatedServices);
  };

  return (
    <ServiceContext.Provider value={{ services, refreshServices }}>
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
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