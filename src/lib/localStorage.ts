import { Service, Client } from '@/types';

// Funções para Serviços
export const getAllServices = (): Service[] => {
  const services = localStorage.getItem('services');
  return services ? JSON.parse(services) : [];
};

export const saveService = (service: Service): void => {
  const services = getAllServices();
  const index = services.findIndex(s => s.id === service.id);
  
  if (index >= 0) {
    services[index] = service;
  } else {
    services.push(service);
  }
  
  localStorage.setItem('services', JSON.stringify(services));
};

export const deleteService = (serviceId: string): void => {
  const services = getAllServices();
  const filteredServices = services.filter(s => s.id !== serviceId);
  localStorage.setItem('services', JSON.stringify(filteredServices));
};

// Funções para Clientes
export const getClients = (): Client[] => {
  const clients = localStorage.getItem('clients');
  return clients ? JSON.parse(clients) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === client.id);
  
  if (index >= 0) {
    clients[index] = client;
  } else {
    clients.push(client);
  }
  
  localStorage.setItem('clients', JSON.stringify(clients));
};

export const deleteClient = (clientId: string): void => {
  const clients = getClients();
  const filteredClients = clients.filter(c => c.id !== clientId);
  localStorage.setItem('clients', JSON.stringify(filteredClients));
};

export const isControlNumberUnique = (controlNumber: string): boolean => {
  const services = getAllServices();
  return !services.some(service => service.controlNumber === controlNumber);
};

export const searchServices = (searchTerm: string): Service[] => {
  const services = getAllServices();
  if (!searchTerm.trim()) return services;
  
  const search = searchTerm.toLowerCase().trim();
  
  return services.filter(service => {
    const serviceNumber = String(service.controlNumber)
      .replace('#', '')
      .toLowerCase();
      
    return (
      serviceNumber.includes(search) ||
      service.type.toLowerCase().includes(search) ||
      service.description.toLowerCase().includes(search)
    );
  });
}; 