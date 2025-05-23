import { useState, useEffect } from "react";
import { useServices } from "@/contexts/ServiceContext";
import { useClients } from "@/contexts/ClientContext";
import { Service } from "@/types";
import { ServiceCard } from "./ServiceCard";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

export default function AllServices() {
  const { services } = useServices();
  const { clients } = useClients();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      const filtered = services.filter(service => {
        const client = clients.find(c => c.id === service.clientId);
        return (
          service.number.toString().includes(search) ||
          service.type.toLowerCase().includes(search) ||
          service.description.toLowerCase().includes(search) ||
          (client && client.name.toLowerCase().includes(search))
        );
      });
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services, clients]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por número, tipo, descrição ou cliente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
} 