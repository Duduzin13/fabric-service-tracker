import { useState, useEffect } from "react";
import { Service, Client } from "@/types";
import { saveService, getClients, isControlNumberUnique } from "@/lib/localStorage";
import { generateServicePDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";
import { useServices } from '@/contexts/ServiceContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { generateId } from "@/lib/utils";

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
  onSubmit: (service: Service) => void;
}

export default function ServiceForm({ clientId, initialData, onSubmit }: ServiceFormProps) {
  const [type, setType] = useState(initialData?.type || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [controlNumber, setControlNumber] = useState(initialData?.controlNumber || '');
  const [client, setClient] = useState<Client | null>(null);
  const { refreshServices } = useServices();

  useEffect(() => {
    if (clientId) {
      const clients = getClients();
      const foundClient = clients.find(c => c.id === clientId);
      setClient(foundClient || null);
    }
  }, [clientId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !description || !controlNumber) {
      toast.error('Preencha todos os campos');
      return;
    }

    if (!initialData && !isControlNumberUnique(controlNumber)) {
      toast.error('Número de controle já existe');
      return;
    }

    const service: Service = {
      id: initialData?.id || crypto.randomUUID(),
      clientId,
      type,
      description,
      controlNumber,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSubmit(service);

    if (!initialData) {
      setType('');
      setDescription('');
      setControlNumber('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Tipo de Serviço
        </label>
        <Input
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          placeholder="Digite o tipo do serviço"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Digite a descrição do serviço"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="controlNumber" className="block text-sm font-medium mb-1">
          Número de Controle
        </label>
        <Input
          id="controlNumber"
          value={controlNumber}
          onChange={(e) => setControlNumber(e.target.value)}
          placeholder="Digite o número de controle"
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity">
        {initialData ? 'Salvar Alterações' : 'Cadastrar Serviço'}
      </Button>
    </form>
  );
}