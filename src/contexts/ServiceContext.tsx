import { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '@/types';
import { saveToFirebase, getFromFirebase, updateInFirebase, deleteFromFirebase } from '@/lib/firebase';

interface ServiceContextType {
  services: Service[];
  refreshServices: (clientId: string) => Promise<void>;
  saveService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);

  const refreshServices = async (clientId: string) => {
    try {
      const allServices = await getFromFirebase<Service>('services');
      const clientServices = allServices.filter(s => s.clientId === clientId);
      setServices(clientServices);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      throw error;
    }
  };

  const saveService = async (service: Service) => {
    try {
      await saveToFirebase('services', service);
      await refreshServices(service.clientId);
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      throw error;
    }
  };

  const updateService = async (service: Service) => {
    try {
      const { id, ...data } = service;
      await updateInFirebase('services', id, data);
      await refreshServices(service.clientId);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      await deleteFromFirebase('services', serviceId);
      // Recarrega a lista após deletar
      const currentClientId = services[0]?.clientId;
      if (currentClientId) {
        await refreshServices(currentClientId);
      }
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      throw error;
    }
  };

  return (
    <ServiceContext.Provider value={{ 
      services, 
      refreshServices,
      saveService,
      updateService,
      deleteService
    }}>
      {children}
    </ServiceContext.Provider>
  );
}

export function useServices() {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
} 
