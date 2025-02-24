import { createContext, useContext, useState, ReactNode } from 'react';
import { Service } from '@/types';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

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
    const servicesRef = collection(db, 'services');
    const q = query(servicesRef, where("clientId", "==", clientId));
    const querySnapshot = await getDocs(q);
    const servicesData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Service));
    setServices(servicesData);
  };

  const saveService = async (service: Service) => {
    await addDoc(collection(db, 'services'), service);
  };

  const updateService = async (service: Service) => {
    const { id, ...serviceData } = service;
    const serviceRef = doc(db, 'services', id);
    await updateDoc(serviceRef, serviceData);
  };

  const deleteService = async (serviceId: string) => {
    const serviceRef = doc(db, 'services', serviceId);
    await deleteDoc(serviceRef);
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
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
} 