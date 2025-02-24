import { useEffect, useState, useRef } from "react";
import { Service, Client } from "@/types";
import { useServices } from '@/contexts/ServiceContext';
import { toast } from "sonner";
import { ServiceCard } from "./ServiceCard";
import { useNavigate, useSearchParams } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import { getClients, saveService, deleteService } from "@/lib/localStorage";
import { generateServicePDF } from "@/lib/pdfGenerator";
<<<<<<< HEAD
import { Input } from "./ui/input";
import { formatDate } from "@/lib/utils";
=======
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

interface ServiceListProps {
  clientId: string;
}

export default function ServiceList({ clientId }: ServiceListProps) {
<<<<<<< HEAD
  const { services, refreshServices, deleteService } = useServices();
=======
  const { services, refreshServices } = useServices();
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
  const navigate = useNavigate();
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [searchParams] = useSearchParams();
  const serviceToScrollId = searchParams.get('serviceId');
  const serviceRef = useRef<HTMLDivElement>(null);
<<<<<<< HEAD
  const [searchTerm, setSearchTerm] = useState("");
=======
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

  const scrollToServiceMobile = (serviceId: string) => {
    setTimeout(() => {
      const element = document.querySelector(`[data-service-id="${serviceId}"]`);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        element.classList.add('animate-pulse');
        setTimeout(() => {
          element.classList.remove('animate-pulse');
        }, 2000);
      }
    }, 300);
  };

  const scrollToServiceDesktop = (element: HTMLDivElement) => {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    element.classList.add('animate-pulse');
    setTimeout(() => {
      element.classList.remove('animate-pulse');
    }, 2000);
  };

  useEffect(() => {
    if (clientId) {
<<<<<<< HEAD
      console.log('Carregando serviços para cliente:', clientId);
      console.log('Serviços carregados:', services);
=======
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
      refreshServices(clientId);
      const clients = getClients();
      const foundClient = clients.find(c => c.id === clientId);
      setCurrentClient(foundClient || null);
    }
  }, [clientId]);

  useEffect(() => {
    if (serviceToScrollId && services.length > 0) {
      const isMobile = window.innerWidth < 768;
      
      if (isMobile) {
        scrollToServiceMobile(serviceToScrollId);
      } else if (serviceRef.current) {
        scrollToServiceDesktop(serviceRef.current);
      }
    }
  }, [serviceToScrollId, services]);

  const handleSubmitService = async (service: Service) => {
    try {
      await saveService(service);
      refreshServices(clientId);
      toast.success('Serviço salvo com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar serviço');
      console.error(error);
    }
  };

  const handleUpdateService = (updatedService: Service) => {
    try {
      saveService(updatedService);
      if (clientId) refreshServices(clientId);
      toast.success('Serviço atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar serviço');
    }
  };

<<<<<<< HEAD
  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
=======
  const handleDeleteService = (serviceId: string) => {
    try {
      deleteService(serviceId);
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
      if (clientId) refreshServices(clientId);
      toast.success('Serviço excluído com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir serviço');
    }
  };

  const handleDownload = async (service: Service) => {
    if (!currentClient) {
      toast.error("Cliente não encontrado");
      return;
    }
    
    try {
      const pdfBlob = await generateServicePDF(currentClient, service);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `ordem-de-servico-${service.controlNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(pdfUrl);
      toast.success("PDF gerado com sucesso!");
    } catch {
      toast.error("Erro ao gerar PDF");
    }
  };

  const handlePrint = async (service: Service) => {
    if (!currentClient) {
      toast.error("Cliente não encontrado");
      return;
    }
    
    try {
      const pdfBlob = await generateServicePDF(currentClient, service);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = pdfUrl;
      document.body.appendChild(iframe);
      
      iframe.onload = () => {
        iframe.contentWindow?.print();
      };

      window.onafterprint = () => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(pdfUrl);
        window.onafterprint = null;
      };
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error("Erro ao gerar PDF para impressão");
    }
  };

<<<<<<< HEAD
  const handleServiceClick = (serviceId: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('serviceId', serviceId);
    navigate(`/services/${clientId}?${searchParams.toString()}`);
  };

  const filteredServices = services.filter(service => {
    if (!searchTerm.trim()) return true;
    
    // Simplifica o termo de busca
    const search = searchTerm.trim();
    
    // Simplifica o número do serviço (remove '#' e espaços)
    const serviceNumber = String(service.controlNumber || '')
      .replace('#', '')
      .trim();
    
    // Busca simples que funciona para qualquer número
    return (
      // Compara os números de forma flexível
      serviceNumber === search || // Correspondência exata
      serviceNumber.includes(search) || // Correspondência parcial
      search.includes(serviceNumber) || // Correspondência inversa
      // Busca também no tipo e descrição
      service.type.toLowerCase().includes(search.toLowerCase()) ||
      service.description.toLowerCase().includes(search.toLowerCase())
    );
  });

  useEffect(() => {
    console.log('Termo de busca:', searchTerm);
    console.log('Total de serviços:', services.length);
    console.log('Serviços filtrados:', filteredServices.length);
    console.log('Primeiro serviço:', services[0]);
  }, [searchTerm, services, filteredServices]);

  useEffect(() => {
    if (clientId) {
      console.log('Carregando serviços para cliente:', clientId);
      refreshServices(clientId);
    }
  }, [clientId]);

  useEffect(() => {
    console.log('Serviços atuais:', services.map(s => ({
      controlNumber: s.controlNumber,
      type: s.type
    })));
  }, [services]);

=======
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
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
          Serviços
        </button>
      </div>

      {/* Layout Mobile (< 768px) */}
      <div className="grid gap-4 md:hidden">
        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <h2 className="text-base font-medium mb-3">Novo Serviço</h2>
          <ServiceForm 
            clientId={clientId} 
            onSubmit={handleSubmitService}
          />
        </div>

        <div className="bg-card p-4 rounded-lg border shadow-sm">
          <h2 className="text-base font-medium mb-3">Lista de Serviços</h2>
<<<<<<< HEAD
          
          <Input
            type="text"
            placeholder="Buscar por número, tipo ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          <div className="grid grid-cols-1 gap-2">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                data-service-id={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={`bg-white rounded-lg p-2 shadow-sm border cursor-pointer
=======
          <div className="grid grid-cols-1 gap-2">
            {services.map((service) => (
              <div
                key={service.id}
                data-service-id={service.id}
                className={`bg-white rounded-lg p-2 shadow-sm border 
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
                  ${service.id === serviceToScrollId ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-gray-100'}
                  hover:border-gray-200 transition-colors`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{service.type}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    #{service.controlNumber}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                <div className="text-xs text-muted-foreground mt-0.5">
<<<<<<< HEAD
                  Criado em: {formatDate(service.createdAt)}
=======
                  Criado em: {new Date(service.createdAt).toLocaleDateString()}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
                </div>
                <ServiceCard
                  service={service}
                  onUpdate={handleUpdateService}
                  onDelete={handleDeleteService}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Desktop (≥ 768px) */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">Novo Serviço</h2>
          <ServiceForm 
            clientId={clientId} 
            onSubmit={handleSubmitService}
          />
        </div>

        <div className="bg-card p-6 rounded-lg border shadow-sm">
          <h2 className="text-lg font-medium mb-4">Lista de Serviços</h2>
<<<<<<< HEAD
          
          <Input
            type="text"
            placeholder="Buscar por número, tipo ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                ref={service.id === serviceToScrollId ? serviceRef : null}
                onClick={() => handleServiceClick(service.id)}
                className={`bg-white rounded-lg p-2.5 shadow-sm border cursor-pointer
=======
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service) => (
              <div
                key={service.id}
                ref={service.id === serviceToScrollId ? serviceRef : null}
                className={`bg-white rounded-lg p-2.5 shadow-sm border 
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
                  ${service.id === serviceToScrollId ? 'border-primary ring-2 ring-primary/20' : 'border-gray-100'}
                  hover:border-gray-200 transition-colors`}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-sm">{service.type}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    #{service.controlNumber}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                <div className="text-xs text-muted-foreground mt-0.5">
<<<<<<< HEAD
                  Criado em: {formatDate(service.createdAt)}
=======
                  Criado em: {new Date(service.createdAt).toLocaleDateString()}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
                </div>
                <ServiceCard
                  service={service}
                  onUpdate={handleUpdateService}
                  onDelete={handleDeleteService}
                  onDownload={handleDownload}
                  onPrint={handlePrint}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}