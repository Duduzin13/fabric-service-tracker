import { useState } from "react";
import { Service } from "@/types";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { uploadImage } from "@/lib/cloudinary";
import { X } from "lucide-react";

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
  onSubmit: (service: Service) => Promise<void>;
}

export default function ServiceForm({ clientId, initialData, onSubmit }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    description: initialData?.description || "",
    controlNumber: initialData?.controlNumber || "",
    value: initialData?.value || "",
    deadline: initialData?.deadline || "",
  });
  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 3) {
      toast.error("Máximo de 3 imagens permitido");
      return;
    }

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast.error(`Arquivo ${file.name} muito grande. Máximo 5MB`);
          continue;
        }
        
        toast.loading("Fazendo upload...");
        const imageUrl = await uploadImage(file);
        setImages(prev => [...prev, imageUrl]);
        toast.dismiss();
        toast.success("Upload concluído!");
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.dismiss();
      toast.error("Erro ao fazer upload da imagem");
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Formatar o valor para moeda real
  const formatCurrency = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9,-]+/g, '').replace(',', '.'));
    if (isNaN(numericValue)) return '';
    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleValueBlur = () => {
    const formattedValue = formatCurrency(formData.value);
    setFormData(prev => ({ ...prev, value: formattedValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const service: Service = {
      id: initialData?.id || crypto.randomUUID(),
      clientId,
      type: formData.type,
      description: formData.description,
      controlNumber: formData.controlNumber,
      value: formData.value,
      deadline: formData.deadline,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await onSubmit(service);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Tipo de Serviço</label>
        <Input
          required
          value={formData.type}
          onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Número de Controle</label>
        <Input
          required
          value={formData.controlNumber}
          onChange={(e) => setFormData(prev => ({ ...prev, controlNumber: e.target.value }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Valor (R$)</label>
          <Input
            type="text"
            value={formData.value}
            onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
            onBlur={handleValueBlur}
            placeholder="R$ 0,00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Data de Entrega</label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Imagens (máx. 3)
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {images.map((url, index) => (
            <div key={index} className="relative">
              <img 
                src={url} 
                alt={`Imagem ${index + 1}`} 
                className="w-20 h-20 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {images.length < 3 && (
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            multiple={3 - images.length > 1}
            className="w-full"
          />
        )}
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Atualizar Serviço' : 'Cadastrar Serviço'}
      </Button>
    </form>
  );
}
