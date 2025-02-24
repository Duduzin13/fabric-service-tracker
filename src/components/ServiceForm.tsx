<<<<<<< HEAD
import { useState } from "react";
import { Service } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useServices } from '@/contexts/ServiceContext';
=======
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
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
<<<<<<< HEAD
}

export default function ServiceForm({ clientId, initialData }: ServiceFormProps) {
  const { saveService, updateService } = useServices();
  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    description: initialData?.description || '',
    controlNumber: initialData?.controlNumber || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const service: Service = {
        id: initialData?.id || crypto.randomUUID(),
        clientId,
        ...formData,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (initialData) {
        await updateService(service);
        toast.success("Serviço atualizado com sucesso!");
      } else {
        await saveService(service);
        toast.success("Serviço cadastrado com sucesso!");
        setFormData({ type: '', description: '', controlNumber: '' });
      }
    } catch (error) {
      console.error(error);
      toast.error(initialData ? "Erro ao atualizar serviço" : "Erro ao cadastrar serviço");
=======
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
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
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
<<<<<<< HEAD
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
=======
          value={type}
          onChange={(e) => setType(e.target.value)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
          placeholder="Digite o tipo do serviço"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição
        </label>
        <Textarea
          id="description"
<<<<<<< HEAD
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
=======
          value={description}
          onChange={(e) => setDescription(e.target.value)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
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
<<<<<<< HEAD
          value={formData.controlNumber}
          onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
=======
          value={controlNumber}
          onChange={(e) => setControlNumber(e.target.value)}
>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
          placeholder="Digite o número de controle"
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity">
        {initialData ? 'Salvar Alterações' : 'Cadastrar Serviço'}
      </Button>
    </form>
  );
}