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

interface Address {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function ClientForm({ initialData, onSubmit }: ClientFormProps) {
  const { saveClient } = useClients();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    cep: initialData?.cep || "",
    street: initialData?.street || "",
    number: initialData?.number || "",
    neighborhood: initialData?.neighborhood || "",
    city: initialData?.city || "",
    state: initialData?.state || ""
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

  const searchCep = async (cep: string) => {
    if (cep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: Address = await response.json();

      if (data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        street: data.logradouro,
        neighborhood: data.bairro,
        city: data.localidade,
        state: data.uf
      }));
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
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
        phone: formData.phone,
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveClient(client);
      toast.success(initialData ? "Cliente atualizado com sucesso!" : "Cliente cadastrado com sucesso!");
      if (!initialData) {
        setFormData({ name: "", phone: "", cep: "", street: "", number: "", neighborhood: "", city: "", state: "" });
      }
      if (onSubmit) onSubmit();
    } catch (error) {
      console.error(error);
      toast.error(initialData ? "Erro ao atualizar cliente" : "Erro ao cadastrar cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        {/* Nome */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <Input
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm font-medium mb-1">Telefone</label>
          <Input
            required
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(00) 00000-0000"
            maxLength={15}
          />
        </div>

        {/* CEP e Número */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CEP</label>
            <Input
              required
              value={formData.cep}
              onChange={(e) => {
                const cep = e.target.value.replace(/\D/g, '');
                setFormData(prev => ({ ...prev, cep }));
                if (cep.length === 8) searchCep(cep);
              }}
              placeholder="12345678"
              maxLength={8}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Número</label>
            <Input
              required
              value={formData.number}
              onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
            />
          </div>
        </div>

        {/* Endereço preenchido automaticamente */}
        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <Input value={formData.street} onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))} className="bg-gray-50" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bairro</label>
            <Input value={formData.neighborhood} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cidade</label>
            <Input value={formData.city} readOnly className="bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Estado</label>
            <Input value={formData.state} readOnly className="bg-gray-50" />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Atualizar Cliente' : 'Cadastrar Cliente'}
      </Button>
    </form>
  );
}

