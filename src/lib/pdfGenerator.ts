import jsPDF from 'jspdf';
import { Client, Service } from '@/types';

export async function generateServicePDF(client: Client, service: Service): Promise<Blob> {
  const doc = new jsPDF();
  
  // Configurar fonte e tamanho
  doc.setFont("helvetica");
  doc.setFontSize(25);
  
  // Título
  doc.text("Ordem de Serviço", 105, 20, { align: "center" });
  
  // Desenhar caixa para amostra de tecido
  doc.rect(10, 10, 50, 50);
  doc.setFontSize(8);
  doc.text("Área para amostra de tecido", 35, 35, { align: "center" });
  
  // Informações do cliente
  doc.setFontSize(12);
  doc.text("Dados do Cliente", 20, 70);
  doc.setFontSize(10);
  doc.text(`Endereço: ${client.address}`, 20, 80);
  doc.text(`Telefone: ${client.phone}`, 20, 90);
  
  // Informações do serviço
  doc.setFontSize(28);
  doc.text("Detalhes do Serviço", 20, 110);
  doc.setFontSize(25);
  doc.text(`Número de Controle: ${service.controlNumber}`, 20, 125);
  doc.text(`Tipo: ${service.type}`, 20, 140);
  
  // Descrição do serviço - Ajuste automático da fonte baseado no tamanho do texto
  doc.text("Descrição:", 20, 155);
  let fontSize = 25;
  let descriptionLines;
  do {
    doc.setFontSize(fontSize);
    descriptionLines = doc.splitTextToSize(service.description, 180); // Aumentado para usar mais da largura
    if (descriptionLines.length * (fontSize * 0.3527) > 25) { // Se altura do texto > 25mm
      fontSize -= 2;
    }
  } while (descriptionLines.length * (fontSize * 0.3527) > 25 && fontSize > 12);
  
  doc.text(descriptionLines, 20, 170);
  
  // Data
  doc.setFontSize(12);
  const date = new Date(service.createdAt).toLocaleDateString();
  doc.text(`Data: ${date}`, 20, 190);
  
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


