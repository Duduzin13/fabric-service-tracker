
import { Client, Service } from "@/types";

const CLIENTS_KEY = "upholstery-clients";
const SERVICES_KEY = "upholstery-services";

export const getClients = (): Client[] => {
  const clients = localStorage.getItem(CLIENTS_KEY);
  return clients ? JSON.parse(clients) : [];
};

export const saveClient = (client: Client): void => {
  const clients = getClients();
  clients.push(client);
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
};

export const getServices = (): Service[] => {
  const services = localStorage.getItem(SERVICES_KEY);
  return services ? JSON.parse(services) : [];
};

export const saveService = (service: Service): void => {
  const services = getServices();
  services.push(service);
  localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
};

export const getClientServices = (clientId: string): Service[] => {
  return getServices().filter((service) => service.clientId === clientId);
};
