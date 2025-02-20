
import { useState, useEffect } from "react";
import { Service, ServiceType, Client } from "@/types";
import { saveService, getClients } from "@/lib/localStorage";
import { generateServicePDF } from "@/lib/pdfGenerator";
import { toast } from "sonner";

const serviceTypes: { value: ServiceType; label: string }[] = [
  { value: "chair", label: "Cadeira" },
  { value: "sofa", label: "Sofá" },
  { value: "armchair", label: "Poltrona" },
  { value: "pouf", label: "Pufe" },
  { value: "curtain", label: "Cortina" },
  { value: "cover", label: "Capa" },
];

interface ServiceFormProps {
  clientId: string;
}

export default function ServiceForm({ clientId }: ServiceFormProps) {
  const [formData, setFormData] = useState({
    type: "chair" as ServiceType,
    name: "",
    description: "",
  });
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const clients = getClients();
    const foundClient = clients.find(c => c.id === clientId);
    if (foundClient) {
      setClient(foundClient);
    }
  }, [clientId]);

  const generateControlNumber = () => {
    // Gera um número de controle único baseado na data e um número aleatório
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp.toString().slice(-6)}${random}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const service: Service = {
      id: crypto.randomUUID(),
      clientId,
      controlNumber: generateControlNumber(),
      ...formData,
      createdAt: new Date().toISOString(),
    };
    
    saveService(service);
    
    // Gerar PDF se o cliente foi encontrado
    if (client) {
      try {
        generateServicePDF(client, service);
        toast.success("Serviço cadastrado e PDF gerado com sucesso!");
      } catch (error) {
        toast.error("Erro ao gerar o PDF");
        console.error("Erro ao gerar PDF:", error);
      }
    }

    setFormData({ type: "chair", name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="type">
          Tipo de Serviço
        </label>
        <select
          id="type"
          className="w-full px-3 py-2 border rounded-md"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as ServiceType })
          }
        >
          {serviceTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="name">
          Nome do Serviço
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
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          required
          className="w-full px-3 py-2 border rounded-md h-24"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>
      <button
        type="submit"
        className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:opacity-90 transition-opacity"
      >
        Cadastrar Serviço
      </button>
    </form>
  );
}
