import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Header } from "@/components/Header";
import { ServiceProvider } from '@/contexts/ServiceContext';
import { ClientProvider } from '@/contexts/ClientContext';
import ServiceList from "@/components/ServiceList";

const queryClient = new QueryClient();

function ServiceListWrapper() {
  const { clientId } = useParams();
  return <ServiceList clientId={clientId || ''} />;
}

const App = () => (
  <ClientProvider>
    <ServiceProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/client/:clientId" element={<ServiceListWrapper />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ServiceProvider>
  </ClientProvider>
);

export default App;
