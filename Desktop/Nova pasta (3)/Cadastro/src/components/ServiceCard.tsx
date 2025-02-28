import { useState } from "react";
import { Service, Client } from "@/types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import ServiceForm from "./ServiceForm";
import { Edit, Trash2, Printer, Download, Send } from "lucide-react";
import { WhatsappLogo } from '@phosphor-icons/react';
import { generateClientOS } from "@/lib/pdfGenerator";
import { toast } from "sonner";

interface ServiceCardProps {
  service: Service;
  client: Client;
  onUpdate: (service: Service) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onDownload: (service: Service) => Promise<void>;
  onPrint: (service: Service) => Promise<void>;
}

export function ServiceCard({ service, client, onUpdate, onDelete, onDownload, onPrint }: ServiceCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleWhatsApp = () => {
    const phone = client.phone.replace(/\D/g, '');
    const message = `ORDEM DE SERVIÇO - STANZA DECORO
Nº OS: ${service.controlNumber}

INFORMAÇÕES DO CLIENTE
Nome: ${client.name}
Telefone: +55${client.phone}
Endereço: ${client.street}, ${client.number} - ${client.neighborhood}
${client.city} - ${client.state} - CEP: ${client.cep}

DETALHES DO SERVIÇO
Serviço Solicitado: ${service.type}
Descrição: ${service.description}
Valor: R$ ${service.value || "A combinar"}
Prazo de Entrega: ${service.deadline || "A definir"}

Agradecemos a preferência!
Stanza Decoro - Tapeçaria de Alto Padrão
R. Armando Erse Figueiredo, 143 - Jardim Campo Limpo, São Paulo - SP`;

    window.open(`https://wa.me/55${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleClientOS = async () => {
    try {
      await generateClientOS(service, client);
      toast.success('OS do cliente gerada com sucesso');
    } catch (error) {
      toast.error('Erro ao gerar OS do cliente');
    }
  };

  console.log(client);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <ServiceForm
            clientId={service.clientId}
            initialData={service}
            onSubmit={onUpdate}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-2">
      
          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
            <Edit className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => onDelete(service.id)} className="text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => onDownload(service)}>
            <Download className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="icon" onClick={handleClientOS}>
            <Send className="h-3 w-3" />
          </Button>

          <Button variant="outline" size="icon" onClick={() => onPrint(service)}>
            <Printer className="h-3 w-3" />
          </Button>

          <Button 
            onClick={handleWhatsApp}
            className="bg-green-500 hover:bg-green-600 text-white"
            size="icon"
          >
            <WhatsappLogo className="h-3 w-3" />
          </Button>
        
      </div>

      
    </div>
  );
} 
