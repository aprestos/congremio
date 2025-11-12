export enum TicketStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SOLD_OUT = 'sold_out',
}

export enum TicketGroup {
  GENERAL = 'general',
  ADMIN = 'admin',
}

export interface Ticket {
  id: number
  edition_id: number
  tenant_id: string
  name: string
  group: TicketGroup
  price: number
  status: TicketStatus
  quantity: number
  valid_from?: string
  valid_until?: string
  sale_from?: string
  sale_until?: string
  created_at: string
}

export type CreateTicketInput = Omit<Ticket, 'id' | 'created_at'>

export type UpdateTicketInput = Omit<
  Ticket,
  'id' | 'edition_id' | 'tenant_id' | 'created_at'
>
