import { Client, Service } from "@/types";

// Funções para Clientes
export function getClients(): Client[] {
  const clients = localStorage.getItem('clients');
  return clients ? JSON.parse(clients) : [];
}

export async function saveClient(client: Client) { 
  try {
    const clients = getClients();
    const existingIndex = clients.findIndex(c => c.id === client.id);
    
    if (existingIndex >= 0) {
      clients[existingIndex] = client;
    } else {
      clients.push(client);
    }
    
    localStorage.setItem('clients', JSON.stringify(clients));
    return client;
  } catch (error) {
    console.error('Erro ao salvar cliente:', error);
    throw error;
  }
}

export function deleteClient(clientId: string) {
  const clients = getClients();
  const filteredClients = clients.filter(c => c.id !== clientId);
  localStorage.setItem('clients', JSON.stringify(filteredClients));
  
  // Também remove os serviços do cliente
  const services = getAllServices();
  const filteredServices = services.filter(s => s.clientId !== clientId);
  localStorage.setItem('services', JSON.stringify(filteredServices));
}

// Funções para Serviços
export function getAllServices(): Service[] {
  const services = localStorage.getItem('services');
  return services ? JSON.parse(services) : [];
}

export function getClientServices(clientId: string): Service[] {
  const allServices = getAllServices();
  
  // Se clientId for 'all', retorna todos os serviços
  if (clientId === 'all') return allServices;
  
  // Senão, filtra pelos serviços do cliente específico
  return allServices.filter((service: Service) => service.clientId === clientId);
}

export async function saveService(service: Service) {
  try {
    const services = getAllServices();
    const existingIndex = services.findIndex(s => s.id === service.id);
    
    if (existingIndex >= 0) {
      services[existingIndex] = service;
    } else {
      services.push(service);
    }
    
    localStorage.setItem('services', JSON.stringify(services));
    return service;
  } catch (error) {
    console.error('Erro ao salvar serviço:', error);
    throw error;
  }
}

export function deleteService(serviceId: string) {
  const services = getAllServices();
  const filteredServices = services.filter(s => s.id !== serviceId);
  localStorage.setItem('services', JSON.stringify(filteredServices));
}

// Funções Auxiliares
export function clearAllData() {
  localStorage.removeItem('clients');
  localStorage.removeItem('services');
}

export function hasData(): boolean {
  return !!localStorage.getItem('clients') || !!localStorage.getItem('services');
}

export function isControlNumberUnique(controlNumber: string): boolean {
  const allServices = getAllServices();
  return !allServices.some(service => service.controlNumber === controlNumber);
}

export function searchServices(searchTerm: string): Service[] {
  const allServices = getAllServices();
  if (!searchTerm) return [];
  
  return allServices.filter(service => 
    service.controlNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
