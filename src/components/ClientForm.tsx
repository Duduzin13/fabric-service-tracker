
import { useState } from "react";
import { Client } from "@/types";
import { saveClient } from "@/lib/localStorage";
import { toast } from "sonner";

export default function ClientForm() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const client: Client = {
      id: crypto.randomUUID(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    saveClient(client);
    setFormData({ name: "", address: "", phone: "" });
    toast.success("Cliente cadastrado com sucesso!");
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
