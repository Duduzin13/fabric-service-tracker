import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useClients } from "@/contexts/ClientContext";
import { formatDate } from "@/lib/utils";

export default function ClientList() {
  const { clients, refreshClients } = useClients();
  const navigate = useNavigate();

  useEffect(() => {
    refreshClients();
  }, []);

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
    </div>
  );
}
