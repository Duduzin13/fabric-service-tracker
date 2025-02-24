import { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types';
<<<<<<< HEAD
import { getFromFirebase, saveToFirebase, deleteFromFirebase, updateInFirebase } from '@/lib/firebase';

interface ClientContextType {
  clients: Client[];
  refreshClients: () => Promise<void>;
  saveClient: (client: Client) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
=======
import { getClients } from '@/lib/localStorage';

interface ClientContextType {
  clients: Client[];
  refreshClients: () => void;
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

<<<<<<< HEAD
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
=======
  const refreshClients = () => {
    const updatedClients = getClients();
    setClients(updatedClients);
  };

  return (
    <ClientContext.Provider value={{ clients, refreshClients }}>
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
<<<<<<< HEAD
  if (!context) {
=======
  if (context === undefined) {
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
} 