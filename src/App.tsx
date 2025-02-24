<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Toaster } from 'sonner';
import Index from './pages/Index';
import Services from './pages/Services';
import { ClientProvider } from './contexts/ClientContext';
import { ServiceProvider } from './contexts/ServiceContext';

function App() {
  return (
    <ClientProvider>
      <ServiceProvider>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/client/:clientId" element={<Services />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </ServiceProvider>
    </ClientProvider>
  );
}

=======
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

>>>>>>> cbabc0a5850ca5786bf5c5fd461dc15c87062100
export default App;
