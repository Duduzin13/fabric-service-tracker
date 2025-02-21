import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jlxblemdpwdxublzpyjh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpseGJsZW1kcHdkeHVibHpweWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwODQ4NjAsImV4cCI6MjA1NTY2MDg2MH0.jYg75_tNTz1Y2arpWaT_qxyLkTwzFr6pylBGxDzgZ30';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Função para sincronizar dados
export const syncData = async () => {
  try {
    // Buscar dados locais
    const localClients = JSON.parse(localStorage.getItem('clients') || '[]');
    const localServices = JSON.parse(localStorage.getItem('services') || '[]');

    // Enviar para o Supabase
    for (const client of localClients) {
      await supabase
        .from('clients')
        .upsert({
          id: client.id,
          name: client.name,
          address: client.address,
          phone: client.phone
        });
    }

    for (const service of localServices) {
      await supabase
        .from('services')
        .upsert({
          id: service.id,
          client_id: service.clientId,
          control_number: service.controlNumber,
          type: service.type,
          description: service.description
        });
    }

    // Buscar dados atualizados
    const { data: cloudClients } = await supabase
      .from('clients')
      .select('*');

    const { data: cloudServices } = await supabase
      .from('services')
      .select('*');

    // Atualizar localStorage
    if (cloudClients) localStorage.setItem('clients', JSON.stringify(cloudClients));
    if (cloudServices) localStorage.setItem('services', JSON.stringify(cloudServices));

    return true;
  } catch (error) {
    console.error('Erro na sincronização:', error);
    throw error;
  }
}; 