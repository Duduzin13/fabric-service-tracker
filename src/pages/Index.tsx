<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import { Search } from "lucide-react";
import { getFromFirebase } from "@/lib/firebase";
import { Service } from "@/types";

export default function Index() {
=======
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import ServiceForm from "@/components/ServiceForm";
import ServiceList from "@/components/ServiceList";
import { Search } from "lucide-react";
import { searchServices } from "@/lib/localStorage";
import { Service } from "@/types";
import { ServiceCard } from "@/components/ServiceCard";

export default function Index() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'clients' | 'services'>('clients');
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const handleSelectClient = (clientId: string) => {
    setSelectedClientId(clientId);
    setActiveView('services');
  };

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = searchServices(searchTerm);
      setSearchResults(results);
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
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

        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar serviço por número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm"
            />
            
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md border shadow-lg max-h-[60vh] sm:max-h-96 overflow-auto z-50">
                {searchResults.map(service => (
                  <div 
                    key={service.id}
                    onClick={() => handleServiceClick(service)}
                    className="p-2 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">#{service.controlNumber}</span>
                      <span className="text-sm text-muted-foreground">{service.type}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {service.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
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
