import { getClients, getClientServices, saveClient, saveService } from './localStorage';
import { Client, Service } from '@/types';

export const syncData = async () => {
  try {
    const clients = getClients();
    const services = clients.flatMap(client => getClientServices(client.id));

    // Aqui você pode adicionar a lógica de sincronização com o backend
    // Por exemplo, enviar para uma API ou banco de dados

    // Por enquanto, apenas salvamos localmente
    clients.forEach(client => saveClient(client));
    services.forEach(service => saveService(service));

    return Promise.resolve();
  } catch (error) {
    console.error('Erro na sincronização:', error);
    return Promise.reject(error);
  }
};