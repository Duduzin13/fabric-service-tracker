import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Header } from "@/components/Header";
import { ServiceProvider } from '@/contexts/ServiceContext';
import { ClientProvider } from '@/contexts/ClientContext';
import ServiceList from "@/components/ServiceList";
import AllServicesPage from "./pages/AllServices";

const queryClient = new QueryClient();

function ServiceListWrapper() {
  const { clientId } = useParams();
  return <ServiceList clientId={clientId || ''} />;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClientProvider>
        <ServiceProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/client/:clientId" element={<ServiceListWrapper />} />
                <Route path="/services" element={<AllServicesPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </TooltipProvider>
        </ServiceProvider>
      </ClientProvider>
    </QueryClientProvider>
  );
}

