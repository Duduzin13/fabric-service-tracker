import { useEffect, useState } from "react";
import { Service, Client } from "@/types";
import { useServices } from '@/contexts/ServiceContext';
import { useClients } from '@/contexts/ClientContext';
import { toast } from "sonner";
import { ServiceCard } from "./ServiceCard";
import { Input } from "./ui/input";
import { formatDate } from "@/lib/utils";
import { generateServicePDF } from "@/lib/pdfGenerator";
import { useNavigate } from "react-router-dom";
import { getFromFirebase } from '@/lib/firebase';

export default function AllServices() {
  const { services, refreshServices, saveService, deleteService } = useServices();
  const { clients } = useClients();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  useEffect(() => {
    const loadAllServices = async () => {
      try {
        // Busca todos os serviços diretamente do Firebase
        const allServices = await getFromFirebase<Service>('services');
        setFilteredServices(allServices);
      } catch (error) {
        console.error('Erro ao carregar serviços:', error);
        toast.error('Erro ao carregar serviços');
      }
    };

    loadAllServices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = services.filter(service => {
        const client = clients.find(c => c.id === service.clientId);
        const searchLower = searchTerm.toLowerCase();
        
        return (
          service.controlNumber.toString().includes(searchTerm) ||
          service.type.toLowerCase().includes(searchLower) ||
          service.description.toLowerCase().includes(searchLower) ||
          client?.name.toLowerCase().includes(searchLower)
        );
      });
      setFilteredServices(filtered);
    } else {
      setFilteredServices(services);
    }
  }, [searchTerm, services, clients]);

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Tem certeza que deseja excluir este serviço?')) {
      return;
    }
    
    try {
      await deleteService(serviceId);
      // Recarrega todos os serviços após deletar
      const allServices = await getFromFirebase<Service>('services');
      setFilteredServices(allServices);
      toast.success('Serviço excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao deletar serviço:', error);
      toast.error('Erro ao excluir serviço');
    }
  };

  const handleDownload = async (service: Service) => {
    const client = clients.find(c => c.id === service.clientId);
    if (!client) {
      toast.error("Cliente não encontrado");
      return;
    }
    
    try {
      const blob = await generateServicePDF(client, service);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OS_${service.controlNumber}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF");
    }
  };

  const handlePrint = async (service: Service) => {
    const client = clients.find(c => c.id === service.clientId);
    if (!client) {
      toast.error("Cliente não encontrado");
      return;
    }
    
    try {
      const blob = await generateServicePDF(client, service);
      const url = URL.createObjectURL(blob);
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.contentWindow?.print();
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(url);
      }, 20000);
    } catch (error) {
      console.error('Erro ao imprimir:', error);
      toast.error('Erro ao abrir diálogo de impressão');
    }
  };

  const handleUpdateService = async (service: Service) => {
    try {
      await saveService(service);
      // Recarrega todos os serviços após atualizar
      const allServices = await getFromFirebase<Service>('services');
      setFilteredServices(allServices);
      toast.success('Serviço atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      toast.error('Erro ao atualizar serviço');
    }
  };

  const handleNavigateToClient = (clientId: string) => {
    navigate(`/client/${clientId}`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex justify-center gap-2 mb-4 sm:mb-6">
        <button
          onClick={() => navigate('/')}
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm:text-base"
        >
          Clientes
        </button>
        <button
          className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-primary text-white text-sm sm:text-base"
        >
          Todos os Serviços
        </button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Buscar por número do serviço, tipo, descrição ou cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service) => {
          const client = clients.find(c => c.id === service.clientId);
          if (!client) return null;

          return (
            <div
              key={service.id}
              className="bg-card p-4 rounded-lg border shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium">{service.type}</h3>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {client.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Criado em: {formatDate(service.createdAt)}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  #{service.controlNumber}
                </span>
              </div>
              
              <p className="text-sm mb-2">{service.description}</p>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleNavigateToClient(client.id)}
                  className="text-xs text-primary hover:underline"
                >
                  Ver cliente
                </button>
              </div>

              <ServiceCard
                service={service}
                client={client}
                onUpdate={handleUpdateService}
                onDelete={handleDeleteService}
                onDownload={handleDownload}
                onPrint={handlePrint}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
} 