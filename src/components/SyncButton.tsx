import { useState } from 'react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { syncClients, syncServices } from '@/lib/supabase';
import { saveClient, saveService } from '@/lib/localStorage';

export function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      // Sincronizar clientes
      const remoteClients = await syncClients();
      remoteClients?.forEach(client => saveClient(client));

      // Sincronizar serviços
      const remoteServices = await syncServices();
      remoteServices?.forEach(service => saveService(service));

      toast.success('Dados sincronizados com sucesso!');
    } catch (error) {
      console.error('Erro na sincronização:', error);
      toast.error('Erro ao sincronizar dados');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isSyncing}
      variant="outline"
      size="icon"
    >
      <Loader2 className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
    </Button>
  );
}