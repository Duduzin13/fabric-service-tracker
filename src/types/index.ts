
export type Client = {
  id: string;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
};

export type ServiceType = 'chair' | 'sofa' | 'armchair' | 'pouf' | 'curtain' | 'cover';

export type Service = {
  id: string;
  clientId: string;
  controlNumber: string;
  type: ServiceType;
  name: string;
  description: string;
  createdAt: string;
};
