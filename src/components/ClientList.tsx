
import { useEffect, useState } from "react";
import { Client } from "@/types";
import { getClients } from "@/lib/localStorage";

interface ClientListProps {
  onSelectClient?: (clientId: string) => void;
  selectedClientId?: string | null;
}

export default function ClientList({ onSelectClient, selectedClientId }: ClientListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setClients(getClients());
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="search"
          placeholder="Buscar clientes..."
          className="w-full px-3 py-2 border rounded-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className={`p-4 bg-card text-card-foreground rounded-lg border shadow-sm animate-fade-in cursor-pointer transition-all ${
              selectedClientId === client.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelectClient?.(client.id)}
          >
            <h3 className="font-medium mb-2">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.address}</p>
            <p className="text-sm text-muted-foreground">{client.phone}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
