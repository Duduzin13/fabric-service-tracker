import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Client, Service, ServiceItem } from '@/types'; // Import ServiceItem

// Helper function to load image data (remains the same)
async function loadImage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    img.onerror = (error) => reject(error);
    img.src = url;
  });
}

// --- Internal Production OS --- 
export async function generateServicePDF(client: Client, service: Service): Promise<Blob> {
  const doc = new jsPDF();
  let yPos = 15;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text("ORDEM DE SERVIÇO INTERNA - PRODUÇÃO", doc.internal.pageSize.width / 2, yPos, { align: 'center' });
  yPos += 10;

  // Basic Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data Geração: ${new Date().toLocaleDateString('pt-BR')}`, 15, yPos);
  doc.text(`Nº Controle: ${service.controlNumber}`, doc.internal.pageSize.width - 15, yPos, { align: 'right' });
  yPos += 8;

  // Client Info
  doc.setFont('helvetica', 'bold');
  doc.text("Cliente:", 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(`${client.name} (${client.phone})`, 35, yPos);
  yPos += 5;
  doc.text(`Endereço: ${client.street}, ${client.number} - ${client.neighborhood}, ${client.city}/${client.state}`, 15, yPos);
  yPos += 8;

  // Service Type and General Description
  doc.setFont('helvetica', 'bold');
  doc.text("Tipo Serviço:", 15, yPos);
  doc.setFont('helvetica', 'normal');
  doc.text(service.type, 45, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'bold');
  doc.text("Descrição Geral:", 15, yPos);
  yPos += 5;
  doc.setFont('helvetica', 'normal');
  const generalDescLines = doc.splitTextToSize(service.description || 'Sem descrição geral.', doc.internal.pageSize.width - 30);
  doc.text(generalDescLines, 15, yPos);
  yPos += generalDescLines.length * 4 + 5; // Adjust spacing based on lines

  // Service Items Table
  doc.setFont('helvetica', 'bold');
  doc.text("Itens do Serviço:", 15, yPos);
  yPos += 6;

  const tableColumnStyles = {
    0: { cellWidth: 40 }, // Ambiente
    1: { cellWidth: 60 }, // Item
    2: { cellWidth: 50 }, // Material
    3: { cellWidth: 20, halign: 'center' }, // Quantidade
  };

  autoTable(doc, {
    startY: yPos,
    head: [['Ambiente', 'Item', 'Material', 'Quantidade']],
    body: service.items.map(item => [
      item.environment,
      item.item,
      item.material,
      item.quantity
    ]),
    theme: 'grid',
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    columnStyles: tableColumnStyles,
    didDrawPage: (data) => {
        // Reset yPos for new page if table breaks
        yPos = data.cursor?.y ?? 15; 
    },
    margin: { left: 15, right: 15 }
  });

  // Get Y position after table
  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Images Section (Up to 4 images, smaller)
  if (service.images && service.images.length > 0) {
    const maxImages = 4;
    const imagesToDisplay = service.images.slice(0, maxImages);
    const pageEndX = doc.internal.pageSize.width - 15;
    const availableWidth = pageEndX - 15;
    const spacing = 4;
    // Calculate width to fit 4 images, ensure it's not too large
    let imgWidth = Math.min(45, (availableWidth - (spacing * (imagesToDisplay.length - 1))) / imagesToDisplay.length);
    let imgHeight = imgWidth; // Keep aspect ratio (assuming square-ish)
    let currentX = 15;
    const initialY = yPos + 8; // Add space before images

    // Check if images fit on the current page, otherwise add a new page
    if (initialY + imgHeight > doc.internal.pageSize.height - 20) {
        doc.addPage();
        yPos = 15; // Reset yPos for the new page
    } else {
        yPos = initialY;
    }

    doc.setFont('helvetica', 'bold');
    doc.text("Imagens:", 15, yPos - 4);

    for (let i = 0; i < imagesToDisplay.length; i++) {
      try {
        const imgData = await loadImage(imagesToDisplay[i]);
        // Check if the next image exceeds page width
        if (currentX + imgWidth > pageEndX) {
            // This case shouldn't happen with the calculated width, but as a fallback:
            // Move to next line or new page if needed (simplified here)
            console.warn("Image layout issue detected."); 
        }
        doc.addImage(imgData, 'JPEG', currentX, yPos, imgWidth, imgHeight);
        currentX += imgWidth + spacing;
      } catch (error) {
        console.error(`Erro ao adicionar imagem ${i}:`, error);
        // Optionally draw a placeholder for the failed image
        doc.rect(currentX, yPos, imgWidth, imgHeight);
        doc.text("Erro", currentX + imgWidth / 2, yPos + imgHeight / 2, { align: 'center' });
        currentX += imgWidth + spacing;
      }
    }
    yPos += imgHeight + 5; // Update yPos after images
  }

  // Finalize and return Blob
  return new Promise<Blob>((resolve) => {
    const blob = doc.output('blob');
    resolve(blob);
  });
}

// --- Client OS --- (Needs complete rewrite based on PDF model)
export const generateClientOS = (service: Service, client: Client): void => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  let yPos = 20;

  // Header (Based on PDF model)
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text("ORDEM DE SERVIÇO - STANZA DECORO", pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nº OS: ${service.controlNumber}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;
  const generationDate = service.createdAt ? new Date(service.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Data: ${generationDate}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Line Separator
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Client Info Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("INFORMAÇÕES DO CLIENTE", margin, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${client.name}`, margin, yPos);
  yPos += 5;
  doc.text(`Telefone: ${client.phone}`, margin, yPos);
  yPos += 5;
  const addressLine1 = `${client.street}, ${client.number}${client.neighborhood ? ` - ${client.neighborhood}` : ''}`;
  const addressLine2 = `${client.city} - ${client.state}`; 
  const addressLine3 = `CEP: ${client.cep}`;
  doc.text(`Endereço: ${addressLine1}`, margin, yPos);
  yPos += 5;
  doc.text(addressLine2, margin + 18, yPos);
  yPos += 5;
  doc.text(addressLine3, margin + 18, yPos);
  yPos += 10;

  // Line Separator
  doc.setLineWidth(0.3);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 8;

  // Service Details Section
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("DETALHES DO SERVIÇO", margin, yPos);
  yPos += 7;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Serviço Solicitado: ${service.type}`, margin, yPos);
  yPos += 7;

  doc.text("Descrição:", margin, yPos);
  yPos += 5;
  const generalDescLines = doc.splitTextToSize(service.description || 'N/A', contentWidth);
  doc.text(generalDescLines, margin, yPos);
  yPos += generalDescLines.length * 4 + 5;

  // Items Table (Client Version)
  const tableBody = service.items.map(item => {
    const unitValue = item.unitValue || 0;
    const subtotal = item.quantity * unitValue;
    return [
      item.environment,
      item.item,
      item.material,
      item.quantity,
      unitValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      subtotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    ];
  });

  const totalValue = service.items.reduce((sum, item) => sum + (item.quantity * (item.unitValue || 0)), 0);

  autoTable(doc, {
    startY: yPos,
    head: [['Ambiente', 'Item', 'Material', 'Quant.', 'Valor Unit.', 'Subtotal']],
    body: tableBody,
    theme: 'striped', // Matches PDF model style better
    headStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'center' },
    columnStyles: {
      0: { cellWidth: 30 }, // Ambiente
      1: { cellWidth: 45 }, // Item
      2: { cellWidth: 35 }, // Material
      3: { cellWidth: 15, halign: 'center' }, // Quant.
      4: { cellWidth: 25, halign: 'right' }, // Valor Unit.
      5: { cellWidth: 25, halign: 'right' }  // Subtotal
    },
    didDrawPage: (data) => {
        yPos = data.cursor?.y ?? 15; 
    },
    margin: { left: margin, right: margin }
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // Total Value
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text("Valor Total:", pageWidth - margin - 60, yPos, { align: 'left' });
  doc.setFont('helvetica', 'normal');
  doc.text(totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), pageWidth - margin, yPos, { align: 'right' });
  yPos += 10;

  // Delivery and Payment Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const deadlineText = service.deadline ? `Prazo de Entrega: ${new Date(service.deadline + 'T00:00:00').toLocaleDateString('pt-BR')} (ou conforme combinado)` : "Prazo de Entrega: A definir";
  doc.text(deadlineText, margin, yPos);
  yPos += 5;
  
  const paymentText = service.paymentMethod ? `Forma de Pagamento: ${service.paymentMethod}` : "Forma de Pagamento: A combinar";
  doc.text(paymentText, margin, yPos);
  yPos += 10;

  // Footer/Signature area (optional, based on model)
  // doc.text("Agradecemos a preferência!", pageWidth / 2, yPos, { align: 'center' });

  // Save the PDF
  doc.save(`OS_Cliente_${service.controlNumber}_${client.name.split(' ')[0]}.pdf`);
};

