<<<<<<< HEAD
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { formatDate } from "@/lib/utils";

export default function ClientList() {
  const { clients, refreshClients } = useClients();
  const navigate = useNavigate();
=======
import { useEffect, useState } from "react";
import { useClients } from '@/contexts/ClientContext';
import { ClientCard } from "./ClientCard";
import { saveClient, deleteClient } from "@/lib/localStorage";
import { toast } from "sonner";
import { Client } from "@/types";

export default function ClientList() {
  const { clients, refreshClients } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

  useEffect(() => {
    refreshClients();
  }, []);

<<<<<<< HEAD
  return (
    <div className="space-y-4">
      {clients.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">
          Nenhum cliente cadastrado
        </p>
      ) : (
        <div className="grid gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              onClick={() => navigate(`/client/${client.id}`)}
              className="p-4 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{client.name}</h3>
                <span className="text-sm text-muted-foreground">
                  {formatDate(client.createdAt)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>{client.address}</p>
                <p>{client.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
=======
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
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
    </div>
  );
}
