import { createContext, useContext, useState, ReactNode } from 'react';
import { Client } from '@/types';
import { getClients } from '@/lib/localStorage';

interface ClientContextType {
  clients: Client[];
  refreshClients: () => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState<Client[]>([]);

  const refreshClients = () => {
    const updatedClients = getClients();
    setClients(updatedClients);
  };

  return (
    <ClientContext.Provider value={{ clients, refreshClients }}>
      {children}
    </ClientContext.Provider>
  );
}

export function useClients() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
} 