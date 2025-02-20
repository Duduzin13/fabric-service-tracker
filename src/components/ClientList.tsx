
import { useEffect, useState } from "react";
import { Client } from "@/types";
import { getClients } from "@/lib/localStorage";

export default function ClientList() {
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
            className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm animate-fade-in"
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
