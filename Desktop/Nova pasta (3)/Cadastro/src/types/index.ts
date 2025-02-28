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

export interface Service {
  id: string;
  clientId: string;
  type: string;
  description: string;
  controlNumber: string;
  value?: string;
  deadline?: string;
  createdAt: string;
  updatedAt: string;
  images?: string[]; // URLs das imagens
}

