import { useState } from "react";
import { Service } from "@/types";
import { useServices } from '@/contexts/ServiceContext';
import { toast } from "sonner";

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
  onSubmit: (service: Service) => void;
}

export default function ServiceForm({ clientId, initialData, onSubmit }: ServiceFormProps) {
  const [type, setType] = useState(initialData?.type || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [controlNumber, setControlNumber] = useState(initialData?.controlNumber || '');
  const { refreshServices } = useServices();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !description || !controlNumber) {
      toast.error('Preencha todos os campos');
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

    try {
      await onSubmit(service);
      if (!initialData) {
        setType('');
        setDescription('');
        setControlNumber('');
      }
      refreshServices(clientId);
      toast.success(initialData ? 'Serviço atualizado!' : 'Serviço cadastrado!');
    } catch (error) {
      console.error(error);
      toast.error(initialData ? 'Erro ao atualizar serviço' : 'Erro ao cadastrar serviço');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block mb-1">
          Tipo de Serviço
        </label>
        <input
          id="type"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={type}
          onChange={(e) => setType(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="controlNumber" className="block mb-1">
          Número de Controle
        </label>
        <input
          id="controlNumber"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={controlNumber}
          onChange={(e) => setControlNumber(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="description" className="block mb-1">
          Descrição
        </label>
        <textarea
          id="description"
          required
          className="w-full px-3 py-2 border rounded-md min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        {initialData ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
      </button>
    </form>
  );
}
