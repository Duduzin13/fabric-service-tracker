import { useNavigate } from "react-router-dom";
import ClientForm from "@/components/ClientForm";
import ClientList from "@/components/ClientList";
import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-4 sm:p-6">
      <div className="flex flex-col items-center gap-3 sm:gap-2 mb-4 sm:mb-6">
        <button className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-md bg-primary text-white text-sm sm:text-base">
          Clientes
        </button>

        <Button
          onClick={() => navigate('/services')}
          className="flex items-center gap-2"
        >
          <ListChecks className="h-4 w-4" />
          Todos os Serviços
        </Button>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        <div className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Novo Cliente</h2>
          <ClientForm />
        </div>

        <div className="bg-card p-4 sm:p-6 rounded-lg border shadow-sm">
          <h2 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Lista de Clientes</h2>
          <ClientList />
        </div>
      </div>
    </div>
  );
}

