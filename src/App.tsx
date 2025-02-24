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

export default App;
