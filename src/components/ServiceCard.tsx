import { Service, Client } from "@/types";
import { Button } from "./ui/button";
import { Edit, Trash2, Printer, Download, Send, MessageSquare } from "lucide-react";
import { generateClientOS } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatCurrency } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
  client: Client;
  onUpdate: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onDownload: (service: Service, client: Client) => void;
  onPrint: (service: Service, client: Client) => void;
}

export function ServiceCard({ service, client, onUpdate, onDelete, onDownload, onPrint }: ServiceCardProps) {
  const handleWhatsApp = () => {
    const phone = client.phone.replace(/\D/g, '');
    const message = `Olá ${client.name}, gostaria de falar sobre o serviço ${service.type} (OS: ${service.controlNumber}).`;
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleClientOS = async () => {
    try {
      await generateClientOS(service, client);
      toast.success('OS do cliente gerada com sucesso');
    } catch (error) {
      toast.error('Erro ao gerar OS do cliente');
    }
  };

  // Format currency helper function (can be moved to utils if used elsewhere)
  const formatValue = (value: string | undefined) => {
    if (!value) return 'A combinar';
    return formatCurrency(parseFloat(value));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {service.type}
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => onUpdate(service)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onDelete(service.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">OS:</span> {service.controlNumber}</p>
          <p><span className="font-medium">Valor:</span> {formatValue(service.value)}</p>
          {service.deadline && (
            <p><span className="font-medium">Prazo:</span> {new Date(service.deadline).toLocaleDateString('pt-BR')}</p>
          )}
          <p><span className="font-medium">Descrição:</span> {service.description || 'Sem descrição'}</p>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" size="sm" onClick={handleWhatsApp}>
            <MessageSquare className="h-4 w-4 mr-2" />
            WhatsApp
          </Button>
          <Button variant="outline" size="sm" onClick={handleClientOS}>
            <Send className="h-4 w-4 mr-2" />
            Gerar OS
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload(service, client)}>
            <Download className="h-4 w-4 mr-2" />
            Baixar
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPrint(service, client)}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
