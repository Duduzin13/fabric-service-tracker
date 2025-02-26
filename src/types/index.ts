export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: string;

  updatedAt: string;


}

export interface Service {
  id: string;
  clientId: string;
  type: string;
  description: string;
  controlNumber: string;
  createdAt: string;
  updatedAt: string;
  images?: string[]; // URLs das imagens
}

