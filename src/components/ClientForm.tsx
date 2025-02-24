import { useState } from "react";
import { Client } from "@/types";
import { useClients } from '@/contexts/ClientContext';
import { toast } from "sonner";

export default function ClientForm() {
  const { saveClient } = useClients();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const client: Client = {
        id: crypto.randomUUID(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await saveClient(client);
      toast.success("Cliente cadastrado com sucesso!");
      setFormData({ name: "", address: "", phone: "" });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao cadastrar cliente");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nome
        </label>
        <input
          id="name"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="address">
          Endereço
        </label>
        <input
          id="address"
          type="text"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="phone">
          Telefone
        </label>
        <input
          id="phone"
          type="tel"
          required
          className="w-full px-3 py-2 border rounded-md"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        Cadastrar Cliente
      </button>
    </form>
  );
}
