
import { useEffect, useState } from "react";
import { Service } from "@/types";
import { getClientServices } from "@/lib/localStorage";

interface ServiceListProps {
  clientId: string;
}

export default function ServiceList({ clientId }: ServiceListProps) {
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    setServices(getClientServices(clientId));
  }, [clientId]);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-4 bg-card text-card-foreground rounded-lg border shadow-sm animate-fade-in"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium">{service.name}</h3>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
              #{service.controlNumber}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
          <p className="text-xs text-muted-foreground">
            Criado em: {new Date(service.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
