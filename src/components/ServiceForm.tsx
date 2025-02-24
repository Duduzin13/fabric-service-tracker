import { useState } from "react";
import { Service } from "@/types";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useServices } from '@/contexts/ServiceContext';

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
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
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          placeholder="Digite o tipo do serviço"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          value={formData.controlNumber}
          onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
          placeholder="Digite o número de controle"
        />
      </div>

      <Button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity">
        {initialData ? 'Salvar Alterações' : 'Cadastrar Serviço'}
      </Button>
    </form>
  );
}