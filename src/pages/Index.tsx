
import { useState } from "react";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import ServiceForm from "@/components/ServiceForm";
import ServiceList from "@/components/ServiceList";

const Index = () => {
  const [selectedTab, setSelectedTab] = useState<"clients" | "services">("clients");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={() => setSelectedTab("clients")}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedTab === "clients"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setSelectedTab("services")}
            className={`px-4 py-2 rounded-md transition-colors ${
              selectedTab === "services"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground"
            }`}
          >
            Serviços
          </button>
        </div>

        {selectedTab === "clients" ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-medium mb-4">Novo Cliente</h2>
                <ClientForm />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-medium mb-4">Lista de Clientes</h2>
                <ClientList />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-medium mb-4">Novo Serviço</h2>
                {selectedClientId ? (
                  <ServiceForm clientId={selectedClientId} />
                ) : (
                  <p className="text-muted-foreground">
                    Selecione um cliente para adicionar um serviço
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border shadow-sm">
                <h2 className="text-lg font-medium mb-4">Lista de Serviços</h2>
                {selectedClientId ? (
                  <ServiceList clientId={selectedClientId} />
                ) : (
                  <p className="text-muted-foreground">
                    Selecione um cliente para ver seus serviços
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
