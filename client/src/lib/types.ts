export interface Department {
  id: number;
  name: string;
  name_es: string;
}

export interface Desk {
  id: number;
  number: number;
  clientId: number | null;
  client: Client | null;
  updatedAt: Date;
}

export interface Client {
  id: number;
  called: boolean;
  departmentId: number;
  updatedAt: Date;
  department: {
    id: number;
    name: string;
  };
  lastDesk: Desk;
}
