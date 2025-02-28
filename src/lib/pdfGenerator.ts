import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Client, Service } from '@/types';

export async function generateServicePDF(client: Client, service: Service): Promise<Blob> {
  const doc = new jsPDF();
  
  // Configurar fonte e tamanho
  doc.setFont("helvetica");
  doc.setFontSize(25);
  
  // Título
  doc.text("Ordem de Serviço", 105, 18, { align: "center" });
  
  // Desenhar caixa para amostra de tecido
  doc.rect(10, 10, 40, 40);
  doc.setFontSize(8);
  doc.text("Área para amostra de tecido", 29, 28, { align: "center" });
  
  // Informações do cliente
  doc.setFontSize(12);
  doc.text("Dados do Cliente", 68, 38);
  doc.setFontSize(10);
  doc.text(`Nome: ${client.name}`, 68, 45);
  doc.text(`Telefone: ${client.phone}`, 68, 52);
  doc.text(`Endereço: ${client.street}, ${client.number} - ${client.neighborhood}`, 68, 59);
  doc.text(`${client.city} - ${client.state} - CEP: ${client.cep}`, 68, 66);
  
  // Informações do serviço
  doc.setFontSize(25);
  doc.text("Detalhes do Serviço", 20, 80);
  doc.setFontSize(23);
  doc.text(`Número de Controle: ${service.controlNumber}`, 20, 95);
  doc.text(`Tipo: ${service.type}`, 20, 110);
  
  // Descrição do serviço - Ajuste automático da fonte baseado no tamanho do texto
  doc.text("Descrição:", 20, 130);
  let fontSize = 25;
  let descriptionLines;
  do {
    doc.setFontSize(fontSize);
    descriptionLines = doc.splitTextToSize(service.description, 180); // Aumentado para usar mais da largura
    if (descriptionLines.length * (fontSize * 0.3527) > 20) { // Se altura do texto > 25mm
      fontSize -= 1;
    }
  } while (descriptionLines.length * (fontSize * 0.3527) > 20 && fontSize > 12);
  
  doc.text(descriptionLines, 20, 140);
  
  // Data
  doc.setFontSize(12);
  const date = new Date(service.createdAt).toLocaleDateString();
  doc.text(`Data: ${date}`, 20, 190);

  // Orçamento
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAMENTO', 120, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(`Valor total: R$ ${service.value || "A combinar"}`, 120, 87);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Prazo de entrega:', 120, 94);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  // Formatar a data de entrega para o formato brasileiro
  const formattedDeadline = service.deadline ? new Date(service.deadline).toLocaleDateString('pt-BR') : "A definir";
  doc.text(formattedDeadline, 157, 94);
  
  
  // Adiciona as imagens do serviço na mesma página
  if (service.images && service.images.length > 0) {
    doc.setFontSize(16);
    doc.text("Imagens do Serviço:", 10, 200); // Movido mais para esquerda

    let xPosition = 10; // Começa mais à esquerda
    const yPosition = 210;
    const pageWidth = doc.internal.pageSize.width;
    const totalImages = service.images.length;
    const spacing = 5; // Reduzido o espaçamento
    const availableWidth = pageWidth - 20; // Largura disponível
    const imgWidth = Math.min(60, (availableWidth - (spacing * (totalImages - 1))) / totalImages);
    const imgHeight = imgWidth; // Mantém proporção quadrada

    for (let i = 0; i < service.images.length; i++) {
      try {
        const imgData = await loadImage(service.images[i]);
        doc.addImage(imgData, 'JPEG', xPosition, yPosition, imgWidth, imgHeight);
        xPosition += imgWidth + spacing;
      } catch (error) {
        console.error('Erro ao adicionar imagem:', error);
      }
    }
  }
  
  // Orçamento
  
  
  return new Promise<Blob>((resolve) => {
    const blob = doc.output('blob');
    resolve(blob);
  });
}

// Função auxiliar para carregar imagem
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export const generateClientOS = (service: Service, client: Client): void => {
  const doc = new jsPDF();
  
  // Configurações iniciais
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Em vez de tentar carregar a imagem, vamos apenas adicionar o texto do nome da empresa
  // Título da empresa
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 160, 99);
  doc.text("STANZA DECORO", margin, 20);
  
  // Informações da empresa (cabeçalho)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Tapeçaria de Alto Padrão', margin, 30);
  doc.text('R. Armando Erse Figueiredo, 143', margin, 35);
  doc.text('São Paulo - SP, 05785-020', margin, 40);

  // Título principal
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("REGISTRO DE ORDEM DE SERVIÇO", pageWidth / 2, 50, { align: 'center' });
  
  // Número da OS e data
  doc.setDrawColor(201, 160, 99);
  doc.setFillColor(250, 245, 235);
  doc.roundedRect(pageWidth - 90, 10, 65, 30, 3, 3, 'FD');
  
  // Linha O.S.
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 160, 99);
  doc.setFontSize(12);
  doc.text('O.S.', pageWidth - 85, 22);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text(service.controlNumber, pageWidth - 75, 22);
  
  // Linha Data
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(201, 160, 99);
  doc.text('Data:', pageWidth - 85, 32);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const currentDate = new Date().toLocaleDateString('pt-BR');
  doc.text(currentDate, pageWidth - 73, 32);
  
  // Linha separadora
  doc.setDrawColor(201, 160, 99);
  doc.setLineWidth(0.5);
  doc.line(margin, 60, pageWidth - margin, 60);
  
  // DADOS DO CLIENTE
  doc.setFillColor(250, 245, 235);
  doc.setDrawColor(201, 160, 99);
  doc.roundedRect(margin, 65, contentWidth, 50, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(201, 160, 99);
  doc.text('DADOS DO CLIENTE', margin + 5, 75);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Nome:', margin + 5, 85);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(client.name, margin + 17, 85);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Telefone:', margin + 5, 95);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(client.phone, margin + 22, 95);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Endereço:', margin + 5, 105);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  const fullAddress = `${client.street}, ${client.number}${client.neighborhood ? ` - ${client.neighborhood}` : ''}`;
  const cityState = `${client.city}${client.city && client.state ? ' - ' : ''}${client.state}${client.cep ? ` - CEP: ${client.cep}` : ''}`;
  
  console.log(fullAddress);
  console.log(cityState);
  
  doc.text(fullAddress, margin + 23, 105);
  doc.text(cityState, margin + 23, 110);
  
  // DETALHES DO SERVIÇO
  doc.setFillColor(250, 245, 235);
  doc.setDrawColor(201, 160, 99);
  doc.roundedRect(margin, 120, contentWidth, 50, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(201, 160, 99);
  doc.text('DETALHES DO SERVIÇO', margin + 5, 130);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Serviço Solicitado:', margin + 5, 140);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(service.type, margin + 37.5, 140);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Descrição:', margin + 5, 150);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Quebra de texto para descrição
  const descriptionLines = doc.splitTextToSize(service.description || 'Sem descrição adicional.', contentWidth - 40);
  doc.text(descriptionLines, margin + 24, 150);
  
  // ORÇAMENTO
  doc.setFillColor(250, 245, 235);
  doc.setDrawColor(201, 160, 99);
  doc.roundedRect(margin, 175, contentWidth, 40, 3, 3, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(201, 160, 99);
  doc.text('ORÇAMENTO', margin + 5, 185);
  
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('Valor total:', margin + 5, 195);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  doc.text(`R$ ${service.value}`, margin + 24.3, 195);
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Prazo de entrega:', margin + 5, 205);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  
  // Formatar a data para o formato brasileiro
  const formattedDeadline = service.deadline ? new Date(service.deadline).toLocaleDateString('pt-BR') : "A definir";
  doc.text(formattedDeadline, margin + 35.3, 205);
  
  // Rodapé
  doc.setDrawColor(201, 160, 99);
  doc.setFillColor(250, 245, 235);
  doc.roundedRect(margin, pageHeight - 30, contentWidth, 20, 3, 3, 'FD');
  doc.setFontSize(10);
  doc.setTextColor(201, 160, 99);
  doc.setFont('helvetica', 'bold');
  doc.text('Stanza Decoro - Tapeçaria de Alto Padrão', pageWidth / 2, pageHeight - 20, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('stanzadecoro.com.br', pageWidth / 2, pageHeight - 15, { align: 'center' });
  
  // Save the PDF
  doc.save(`OS_Cliente_${service.controlNumber}.pdf`);
};


