export enum TicketStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SOLD_OUT = 'sold_out',
}

export enum TicketType {
  GENERAL = 'general',
  VIP = 'vip',
  EARLY_BIRD = 'early_bird',
  STUDENT = 'student',
  GROUP = 'group',
}

export interface Ticket {
  id: number
  edition_id: number
  name: string
  description?: string
  type: TicketType
  price: number
  currency: string
  quantity_total: number
  quantity_available: number
  quantity_sold: number
  status: TicketStatus
  sale_start_date?: string
  sale_end_date?: string
  valid_from?: string
  valid_until?: string
  features?: string[]
  created_at: string
  updated_at: string
}

export interface TicketPurchase {
  id: number
  ticket_id: number
  user_id: string
  quantity: number
  total_price: number
  purchase_date: string
  status: 'pending' | 'completed' | 'cancelled' | 'refunded'
  payment_method?: string
  transaction_id?: string
}

export interface CreateTicketInput {
  edition_id: number
  name: string
  description?: string
  type: TicketType
  price: number
  currency?: string
  quantity_total: number
  status?: TicketStatus
  sale_start_date?: string
  sale_end_date?: string
  valid_from?: string
  valid_until?: string
  features?: string[]
}

export interface UpdateTicketInput {
  name?: string
  description?: string
  type?: TicketType
  price?: number
  quantity_total?: number
  status?: TicketStatus
  sale_start_date?: string
  sale_end_date?: string
  valid_from?: string
  valid_until?: string
  features?: string[]
}

export function getTicketStatusLabel(status: TicketStatus): string {
  const labels: Record<TicketStatus, string> = {
    [TicketStatus.ACTIVE]: 'Active',
    [TicketStatus.INACTIVE]: 'Inactive',
    [TicketStatus.SOLD_OUT]: 'Sold Out',
  }
  return labels[status]
}

export function getTicketTypeLabel(type: TicketType): string {
  const labels: Record<TicketType, string> = {
    [TicketType.GENERAL]: 'General',
    [TicketType.VIP]: 'VIP',
    [TicketType.EARLY_BIRD]: 'Early Bird',
    [TicketType.STUDENT]: 'Student',
    [TicketType.GROUP]: 'Group',
  }
  return labels[type]
}

export function calculateAvailability(ticket: Ticket): number {
  return Math.round((ticket.quantity_available / ticket.quantity_total) * 100)
}

export function isTicketAvailable(ticket: Ticket): boolean {
  if (ticket.status !== TicketStatus.ACTIVE) return false
  if (ticket.quantity_available <= 0) return false

  const now = new Date()

  if (ticket.sale_start_date) {
    const startDate = new Date(ticket.sale_start_date)
    if (now < startDate) return false
  }

  if (ticket.sale_end_date) {
    const endDate = new Date(ticket.sale_end_date)
    if (now > endDate) return false
  }

  return true
}
