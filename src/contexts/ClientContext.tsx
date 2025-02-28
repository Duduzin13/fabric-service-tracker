import { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types';
import { getFromFirebase, saveToFirebase, deleteFromFirebase } from '@/lib/firebase';

interface ClientContextType {
  clients: Client[];
  refreshClients: () => Promise<void>;
  saveClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  const refreshClients = async () => {
    const data = await getFromFirebase<Client>('clients');
    setClients(data);
  };

  const saveClient = async (client: Client) => {
    await saveToFirebase('clients', client);
    await refreshClients();
  };

  const deleteClient = async (clientId: string) => {
    await deleteFromFirebase('clients', clientId);
    await refreshClients();
  };

  return (
    <ClientContext.Provider value={{ 
      clients, 
      refreshClients,
      saveClient,
      deleteClient 
    }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
} 
