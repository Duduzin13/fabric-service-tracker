import { getClients, getClientServices, saveClient, saveService } from './localStorage';
<<<<<<< HEAD
=======
import { Client, Service } from '@/types';
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

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