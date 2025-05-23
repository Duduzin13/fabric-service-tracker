import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import { Search, ListChecks } from "lucide-react";
import { getFromFirebase } from "@/lib/firebase";
import { Service } from "@/types";
import { Button } from "@/components/ui/button";

export default function Index() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const searchServices = async () => {
        const services = await getFromFirebase<Service>('services');
        const filtered = services.filter(service => {
          const serviceNumber = String(service.controlNumber)
            .replace('#', '')
            .toLowerCase();
          const search = searchTerm.toLowerCase();
          
          return (
            serviceNumber.includes(search) ||
            service.type.toLowerCase().includes(search) ||
            service.description.toLowerCase().includes(search)
          );
        });
        setSearchResults(filtered);
      };
      searchServices();
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleServiceClick = (service: Service) => {
    navigate(`/client/${service.clientId}?serviceId=${service.id}`);
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-6">
        <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-primary text-white text-sm sm:text-base">
          Clientes
        </button>

        <div className="flex justify-between items-center mb-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar por nome, telefone ou endereço..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
          </div>
          <Button
            onClick={() => navigate('/services')}
            className="ml-4 flex items-center gap-2"
          >
            <ListChecks className="h-4 w-4" />
            Todos os Serviços
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Novo Cliente</h2>
          <ClientForm />
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Lista de Clientes</h2>
          <ClientList />
        </div>
      </div>
    </div>
  );
}

