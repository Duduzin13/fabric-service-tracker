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
  controlNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
