import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { toast } from "sonner";

export default function ClientList() {
  const navigate = useNavigate();
  const { clients, refreshClients, deleteClient } = useClients();

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
      {clients.length === 0 ? (
        <p className="text-center text-muted-foreground">Nenhum cliente cadastrado</p>
      ) : (
        clients.map((client) => (
          <div
            key={client.id}
            className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div onClick={() => handleClientClick(client.id)}>
                <h3 className="font-medium">{client.name}</h3>
                <p className="text-sm text-muted-foreground">{client.address}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClient(client.id);
                }}
                className="text-destructive hover:text-destructive/70 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
