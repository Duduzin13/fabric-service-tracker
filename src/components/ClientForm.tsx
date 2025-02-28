import { useState } from "react";
import { Client } from "@/types";
import { useClients } from '@/contexts/ClientContext';
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ClientFormProps {
  initialData?: Client;
  onSubmit?: () => void;
}

export default function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const { saveClient } = useClients();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
  });

  const formatPhone = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Formata o número conforme a quantidade de dígitos
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})/, '($1) ')
        .replace(/(\d{4,5})/, '$1-')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
    return numbers.slice(0, 11);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Valida o telefone
    const phoneNumbers = formData.phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      toast.error("Número de telefone inválido");
      return;
    }

    try {
      const client: Client = {
        id: initialData?.id || crypto.randomUUID(),
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveClient(client);
      toast.success(initialData ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
      if (!initialData) {
        setFormData({ name: "", address: "", phone: "" });
      }
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error(error);
      toast.error(initialData ? "Erro ao atualizar cliente" : "Erro ao cadastrar cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome
        </label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">
          Endereço
        </label>
        <Input
          id="address"
          type="text"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Telefone
        </label>
        <Input
          id="phone"
          type="tel"
          required
          placeholder="(00) 00000-0000"
          value={formData.phone}
          onChange={handlePhoneChange}
          maxLength={15}
        />
      </div>
      <Button
        type="submit"
        className="w-full"
      >
        {initialData ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
      </Button>
    </form>
  );
}

