import { useState, useEffect } from "react";
import { Service, ServiceItem } from "@/types";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { uploadImage } from "@/lib/cloudinary"; // Assuming this handles upload logic
import { X, Plus, Trash2 } from "lucide-react";

interface ServiceFormProps {
  clientId: string;
  initialData?: Service;
  onSubmit: (service: Service) => Promise<void>;
  onCancel?: () => void; // Optional cancel handler
}

export default function ServiceForm({ clientId, initialData, onSubmit, onCancel }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    type: initialData?.type || "",
    description: initialData?.description || "",
    controlNumber: initialData?.controlNumber || "",
    deadline: initialData?.deadline || "",
    paymentMethod: initialData?.paymentMethod || "", // Added payment method
  });
  const [items, setItems] = useState<ServiceItem[]>(initialData?.items || [
    { id: crypto.randomUUID(), environment: '', item: '', material: '', quantity: 1, unitValue: 0 }
  ]);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [isUploading, setIsUploading] = useState(false);

  // Calculate total value based on items
  const totalValue = items.reduce((sum, item) => sum + (item.quantity * (item.unitValue || 0)), 0);

  const handleItemChange = (index: number, field: keyof ServiceItem, value: string | number) => {
    const newItems = [...items];
    // Ensure quantity and unitValue are numbers
    if (field === 'quantity' || field === 'unitValue') {
      const numValue = Number(value);
      newItems[index] = { ...newItems[index], [field]: isNaN(numValue) ? 0 : numValue };
    } else {
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), environment: '', item: '', material: '', quantity: 1, unitValue: 0 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) { // Prevent removing the last item
      setItems(items.filter((_, i) => i !== index));
    } else {
      toast.info("Pelo menos um item é necessário.");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 4) { // Increased limit to 4
      toast.error("Máximo de 4 imagens permitido");
      return;
    }

    setIsUploading(true);
    try {
      const uploadPromises = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast.error(`Arquivo ${file.name} muito grande. Máximo 5MB`);
          continue;
        }
        uploadPromises.push(uploadImage(file)); // Assuming uploadImage returns a promise with the URL
      }
      
      toast.loading("Fazendo upload das imagens...");
      const imageUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...imageUrls]);
      toast.dismiss();
      toast.success("Upload(s) concluído(s)!");

    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast.dismiss();
      toast.error("Erro ao fazer upload de uma ou mais imagens");
    } finally {
      setIsUploading(false);
      // Clear the file input
      if (e.target) {
        e.target.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Format currency helper
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined || isNaN(value)) return 'R$ 0,00';
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const parseCurrency = (value: string): number => {
    const cleaned = value.replace(/[^0-9,.-]+/g, '').replace('.', '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.type || !formData.controlNumber || items.some(item => !item.item || !item.material || item.quantity <= 0)) {
        toast.error("Preencha todos os campos obrigatórios do serviço e dos itens.");
        return;
    }

    const service: Service = {
      id: initialData?.id || crypto.randomUUID(),
      clientId,
      type: formData.type,
      description: formData.description,
      controlNumber: formData.controlNumber,
      value: totalValue.toFixed(2), // Store total value calculated from items
      deadline: formData.deadline,
      paymentMethod: formData.paymentMethod,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      images: images,
      items: items, // Include the detailed items
    };

    await onSubmit(service);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Service Details */}
      <div className="space-y-4 p-4 border rounded-md bg-background/50">
        <h3 className="text-lg font-medium mb-3">Detalhes Gerais do Serviço</h3>
        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Serviço*</label>
          <Input
            required
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Número de Controle*</label>
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
            placeholder="Descreva o serviço..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prazo de Entrega</label>
          <Input
            type="date"
            value={formData.deadline}
            onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
          <Input
            value={formData.paymentMethod}
            onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
            placeholder="Ex: Dinheiro, PIX, Cartão..."
          />
        </div>
      </div>

      {/* Items Section */}
      <div className="space-y-4 p-4 border rounded-md bg-background/50">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Itens do Serviço</h3>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-1" /> Adicionar Item
          </Button>
        </div>

        {items.map((item, index) => (
          <div key={item.id} className="p-4 border rounded-md space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Item {index + 1}</h4>
              {items.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeItem(index)}
                  variant="ghost"
                  size="sm"
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Ambiente*</label>
                <Input
                  required
                  value={item.environment}
                  onChange={(e) => handleItemChange(index, 'environment', e.target.value)}
                  placeholder="Ex: Sala, Quarto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Item*</label>
                <Input
                  required
                  value={item.item}
                  onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                  placeholder="Ex: Cortina, Sofá..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Material*</label>
                <Input
                  required
                  value={item.material}
                  onChange={(e) => handleItemChange(index, 'material', e.target.value)}
                  placeholder="Ex: Linho, Veludo..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Quantidade*</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valor Unitário</label>
                <Input
                  type="number"
                  step="0.01"
                  value={item.unitValue}
                  onChange={(e) => handleItemChange(index, 'unitValue', parseFloat(e.target.value))}
                  placeholder="R$ 0,00"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="text-right font-medium">
          Valor Total: {formatCurrency(totalValue)}
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-4 p-4 border rounded-md bg-background/50">
        <h3 className="text-lg font-medium">Imagens</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="flex items-center justify-center h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-1" />
                <span className="text-sm">Adicionar Imagem</span>
              </div>
            </label>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isUploading}>
          {initialData ? 'Atualizar' : 'Criar'} Serviço
        </Button>
      </div>
    </form>
  );
}
