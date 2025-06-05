export interface Client {
  id: string;
  name: string;
  phone: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para os itens detalhados do serviço
export interface ServiceItem {
  id: string; // Pode ser útil para gerenciamento no formulário
  environment: string; // Ambiente
  item: string; // Item (O que é)
  material: string; // Material
  quantity: number; // Quantidade
  unitValue?: number; // Valor Unitário (opcional na OS interna, necessário na do cliente)
}

export interface Service {
  id: string;
  clientId: string;
  type: string; // Tipo geral do serviço
  description: string; // Descrição geral do serviço
  controlNumber: string;
  value?: string; // Valor total (calculado a partir dos itens para OS do cliente)
  deadline?: string;
  paymentMethod?: string; // Adicionado para OS do cliente, conforme modelo
  createdAt: string;
  updatedAt: string;
  images?: string[]; // URLs das imagens (até 4)
  items: ServiceItem[]; // Array de itens detalhados do serviço
}


