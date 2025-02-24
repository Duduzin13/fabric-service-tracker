import { useEffect, useState } from "react";
import { useClients } from '@/contexts/ClientContext';
import { ClientCard } from "./ClientCard";
import { saveClient, deleteClient } from "@/lib/localStorage";
import { toast } from "sonner";
import { Client } from "@/types";

export default function ClientList() {
  const { clients, refreshClients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    refreshClients();
  }, []);

  const handleUpdateClient = async (updatedClient: Client) => {
    try {
      await saveClient(updatedClient);
      refreshClients();
      toast.success('Cliente atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar cliente');
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      deleteClient(clientId);
      refreshClients();
      toast.success('Cliente excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir cliente');
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Lista de Clientes</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar clientes..."
          className="w-full px-3 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onUpdate={handleUpdateClient}
            onDelete={handleDeleteClient}
          />
        ))}
      </div>
    </div>
  );
}
