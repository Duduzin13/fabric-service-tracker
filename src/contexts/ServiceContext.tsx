import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Service } from '@/types';
import { getFromFirebase, saveToFirebase, deleteFromFirebase } from '@/lib/firebase';

interface ServiceContextType {
  services: Service[];
  refreshServices: (clientId: string) => Promise<void>;
  saveService: (service: Service) => Promise<void>;
  deleteService: (serviceId: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export function ServiceProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([]);
  const [currentClientId, setCurrentClientId] = useState<string | null>(null);

  const refreshServices = async (clientId: string) => {
    try {
      setCurrentClientId(clientId);
      const allServices = await getFromFirebase<Service>('services');
      const clientServices = allServices.filter(s => s.clientId === clientId);
      setServices(clientServices);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServices([]);
    }
  };

  // Limpa os serviços quando o componente é desmontado
  useEffect(() => {
    return () => {
      setServices([]);
      setCurrentClientId(null);
    };
  }, []);

  const saveService = async (service: Service) => {
    try {
      await saveToFirebase('services', service);
      if (currentClientId === service.clientId) {
        await refreshServices(service.clientId);
      }
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      throw error;
    }
  };

  const deleteService = async (serviceId: string) => {
    try {
      await deleteFromFirebase('services', serviceId);
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
