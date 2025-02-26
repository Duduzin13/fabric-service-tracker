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
    type: initialData?.type || '',
    description: initialData?.description || '',
    controlNumber: initialData?.controlNumber || '',
  });
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        updatedAt: new Date().toISOString(),
        images: images
      };

      await onSubmit(service);
      
      if (!initialData) {
        setFormData({ type: '', description: '', controlNumber: '' });
        setImages([]);
      }
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
      toast.error('Erro ao salvar serviço');
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
