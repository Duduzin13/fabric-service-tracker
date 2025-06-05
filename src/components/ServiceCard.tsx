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
  const [isEditing, setIsEditing] = useState(false); // Corrected syntax

  const handleWhatsApp = () => {
    const phone = client.phone.replace(/\D/g, '');
    const message = `ORDEM DE SERVIÇO - STANZA DECORO
Nº OS: ${service.controlNumber}

INFORMAÇÕES DO CLIENTE
Nome: ${client.name}
Telefone: +55${client.phone}
Endereço: ${client.street}, ${client.number}${client.neighborhood ? ` - ${client.neighborhood}` : ''}
${client.city} - ${client.state} - CEP: ${client.cep}

DETALHES DO SERVIÇO
Serviço Solicitado: ${service.type}
Descrição: ${service.description || 'Sem descrição'}
Valor: ${service.value ? `R$ ${service.value}` : "A combinar"}
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

  // Função para lidar com a atualização do serviço e fechar o modal
  const handleServiceUpdate = async (updatedService: Service) => {
    try {
      await onUpdate(updatedService);
      setIsEditing(false); // Fecha o modal após salvar com sucesso
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      // Não fecha o modal em caso de erro
    }
  };

  console.log(client);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Serviço</DialogTitle>
          </DialogHeader>
          <ServiceForm
            clientId={service.clientId}
            initialData={service}
            onSubmit={handleServiceUpdate}
          />
        </DialogContent>
      </Dialog>

      {/* Restored Horizontal Button Layout */}
      <div className="flex flex-wrap gap-1.5 mt-4 justify-start"> 
        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="flex items-center gap-1 h-8 px-2">
          <Edit className="h-3.5 w-3.5" /> Editar
        </Button>

        <Button variant="outline" size="sm" onClick={() => onDelete(service.id)} className="text-destructive flex items-center gap-1 h-8 px-2">
          <Trash2 className="h-3.5 w-3.5" /> Excluir
        </Button>

        <Button variant="outline" size="sm" onClick={() => onDownload(service)} className="flex items-center gap-1 h-8 px-2">
          <Download className="h-3.5 w-3.5" /> Baixar OS
        </Button>

        <Button variant="outline" size="sm" onClick={handleClientOS} className="flex items-center gap-1 h-8 px-2">
          <Send className="h-3.5 w-3.5" /> OS Cliente
        </Button>

        <Button variant="outline" size="sm" onClick={() => onPrint(service)} className="flex items-center gap-1 h-8 px-2">
          <Printer className="h-3.5 w-3.5" /> Imprimir
        </Button>

        <Button 
          onClick={handleWhatsApp}
          className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-1 h-8 px-2"
          size="sm"
        >
          <WhatsappLogo weight="fill" className="h-3.5 w-3.5" /> WhatsApp
        </Button>
      </div>

      
    </div>
  );
} 
