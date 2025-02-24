import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { Client } from "@/types";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import ClientForm from "./ClientForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function ClientList() {
  const navigate = useNavigate();
  const { clients, refreshClients, deleteClient } = useClients();
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    return (
      client.name.toLowerCase().includes(search) ||
      client.phone.includes(search) ||
      client.address.toLowerCase().includes(search)
    );
  });

  useEffect(() => {
    refreshClients();
  }, []);

  const handleDeleteClient = async (clientId: string) => {
    if (confirm("Tem certeza que deseja excluir este cliente?")) {
      try {
        await deleteClient(clientId);
        toast.success("Cliente excluído com sucesso!");
      } catch (error) {
        console.error(error);
        toast.error("Erro ao excluir cliente");
      }
    }
  };

  const handleClientClick = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Buscar por nome, telefone ou endereço..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />

      <Dialog open={!!editingClient} onOpenChange={() => setEditingClient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          {editingClient && (
            <ClientForm 
              initialData={editingClient} 
              onSubmit={() => {
                setEditingClient(null);
                refreshClients();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {filteredClients.length === 0 ? (
        <p className="text-center text-muted-foreground">
          {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
        </p>
      ) : (
        filteredClients.map((client) => (
          <div
            key={client.id}
            className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div 
                onClick={() => handleClientClick(client.id)}
                className="cursor-pointer flex-1"
              >
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.address}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingClient(client);
                  }}
                >
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClient(client.id);
                  }}
                >
                  Excluir
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

