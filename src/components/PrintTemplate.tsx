import { useEffect } from 'react';
import { Client, Service } from "@/types";
import { generateServicePDF } from '@/lib/pdfGenerator';
import printJS from 'print-js';

interface PrintTemplateProps {
  client: Client;
  service: Service;
  onLoad: () => void;
}

export function PrintTemplate({ client, service, onLoad }: PrintTemplateProps) {
  useEffect(() => {
    const printPDF = async () => {
      try {
        const pdfBlob = await generateServicePDF(client, service);
        const pdfUrl = URL.createObjectURL(pdfBlob);
        
        printJS({
          printable: pdfUrl,
          type: 'pdf',
          showModal: false
        });

        setTimeout(() => {
          URL.revokeObjectURL(pdfUrl);
          onLoad();
        }, 1000);
      } catch (error) {
        console.error('Erro ao imprimir:', error);
        onLoad();
      }
    };

    printPDF();
  }, [client, service, onLoad]);

  return null;
} 
