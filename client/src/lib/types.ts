export interface Department {
  id: number
  name: string
}

export interface Desk {
  id: number
  number: number
  clientId: number | null
  client: Client | null
}

export interface Client {
  id: number
  called: boolean
  departmentId: number
  updatedAt: Date
}

