import jsPDF from 'jspdf';
import { Client, Service } from '@/types';

export async function generateServicePDF(client: Client, service: Service): Promise<Blob> {
  const doc = new jsPDF();
  
  // Configurar fonte e tamanho
  doc.setFont("helvetica");
  doc.setFontSize(20);
  
  // Título
  doc.text("Ordem de Serviço", 105, 20, { align: "center" });
  
  // Desenhar caixa para amostra de tecido (5x5 cm) no canto superior esquerdo
  doc.rect(10, 10, 50, 50);
  doc.setFontSize(8);
  doc.text("Área para amostra de tecido", 35, 35, { align: "center" });
  
  // Informações do cliente
  doc.setFontSize(16);
  doc.text("Dados do Cliente", 20, 80);
  doc.setFontSize(14);
  doc.text(`Endereço: ${client.address}`, 20, 100);
  doc.text(`Telefone: ${client.phone}`, 20, 110);
  
  // Informações do serviço
  doc.setFontSize(16);
  doc.text("Detalhes do Serviço", 20, 130);
  doc.setFontSize(14);
  doc.text(`Número de Controle: ${service.controlNumber}`, 20, 140);
  doc.text(`Tipo: ${service.type}`, 20, 150);
  
  // Descrição do serviço
  doc.text("Descrição:", 20, 170);
  const descriptionLines = doc.splitTextToSize(service.description, 170);
  doc.text(descriptionLines, 20, 180);
  
  // Data
  const date = new Date(service.createdAt).toLocaleDateString();
  doc.text(`Data: ${date}`, 20, 270);
  
  return new Promise<Blob>((resolve) => {
    const blob = doc.output('blob');
    resolve(blob);
  });
}



const getServiceTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    chair: "Cadeira",
    sofa: "Sofá",
    armchair: "Poltrona",
    pouf: "Pufe",
    curtain: "Cortina",
    cover: "Capa"
  };
  return types[type] || type;
};


