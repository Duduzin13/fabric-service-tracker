
import jsPDF from 'jspdf';
import { Client, Service } from '@/types';

export const generateServicePDF = (client: Client, service: Service) => {
  const doc = new jsPDF();
  
  // Configurar fonte e tamanho
  doc.setFont("helvetica");
  doc.setFontSize(20);
  
  // Título
  doc.text("Ordem de Serviço", 105, 20, { align: "center" });
  
  // Desenhar caixa para amostra de tecido (5x5 cm) no canto superior esquerdo
  doc.rect(10, 10, 50, 50); // 50 = 5cm em PDF points
  doc.setFontSize(8);
  doc.text("Área para amostra de tecido", 35, 35, { align: "center" });
  
  // Informações do cliente
  doc.setFontSize(16);
  doc.text("Dados do Cliente", 20, 80);
  doc.setFontSize(14);
  doc.text(`Nome: ${client.name}`, 20, 90);
  doc.text(`Endereço: ${client.address}`, 20, 100);
  doc.text(`Telefone: ${client.phone}`, 20, 110);
  
  // Informações do serviço
  doc.setFontSize(16);
  doc.text("Detalhes do Serviço", 20, 130);
  doc.setFontSize(14);
  doc.text(`Número de Controle: ${service.controlNumber}`, 20, 140);
  doc.text(`Tipo: ${getServiceTypeLabel(service.type)}`, 20, 150);
  doc.text(`Nome: ${service.name}`, 20, 160);
  
  // Descrição do serviço
  doc.text("Descrição:", 20, 180);
  const descriptionLines = doc.splitTextToSize(service.description, 170);
  doc.text(descriptionLines, 20, 190);
  
  // Data
  const date = new Date(service.createdAt).toLocaleDateString();
  doc.text(`Data: ${date}`, 20, 270);
  
  // Salvar o PDF
  doc.save(`ordem-servico-${service.controlNumber}.pdf`);
};

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
