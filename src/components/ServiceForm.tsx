import { useState } from "react";
import { Service } from "@/types";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
  onSubmit: (service: Service) => Promise<void>;
}

export default function ServiceForm({ clientId, initialData, onSubmit }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || '',
    description: initialData?.description || '',
    controlNumber: initialData?.controlNumber || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.type || !formData.description || !formData.controlNumber) {
      toast.error('Preencha todos os campos');
      return;
    }

    try {
      setIsSubmitting(true);
      const service: Service = {
        id: initialData?.id || crypto.randomUUID(),
        clientId,
        type: formData.type,
        description: formData.description,
        controlNumber: formData.controlNumber,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await onSubmit(service);
      
      if (!initialData) {
        setFormData({
          type: '',
          description: '',
          controlNumber: ''
        });
      }
      toast.success(initialData ? 'Serviço atualizado!' : 'Serviço cadastrado!');
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error(initialData ? 'Erro ao atualizar serviço' : 'Erro ao cadastrar serviço');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Tipo de Serviço
        </label>
        <Input
          id="type"
          type="text"
          required
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="controlNumber" className="block text-sm font-medium mb-1">
          Número de Controle
        </label>
        <Input
          id="controlNumber"
          type="text"
          required
          value={formData.controlNumber}
          onChange={(e) => setFormData({ ...formData, controlNumber: e.target.value })}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Descrição
        </label>
        <Textarea
          id="description"
          required
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Salvando...' : (initialData ? 'Atualizar Serviço' : 'Cadastrar Serviço')}
      </Button>
    </form>
  );
}
