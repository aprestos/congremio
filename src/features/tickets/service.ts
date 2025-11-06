import { supabase } from '@/lib/supabase'
import type {
  Ticket,
  TicketPurchase,
  CreateTicketInput,
  UpdateTicketInput,
} from './ticket.model'
import { TicketStatus } from './ticket.model'

export const ticketService = {
  /**
   * Get all tickets for an edition
   */
  async getByEdition(editionId: number): Promise<Ticket[]> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('edition_id', editionId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return (data as Ticket[]) || []
  },

  /**
   * Get a single ticket by ID
   */
  async getById(ticketId: number): Promise<Ticket | null> {
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .eq('id', ticketId)
      .single<Ticket>()

    if (error) throw error
    return data
  },

  /**
   * Create a new ticket
   */
  async create(input: CreateTicketInput): Promise<Ticket> {
    const ticketData = {
      ...input,
      currency: input.currency || 'EUR',
      status: input.status || TicketStatus.INACTIVE,
      quantity_available: input.quantity_total,
      quantity_sold: 0,
    }

    const { data, error } = await supabase
      .from('tickets')
      .insert(ticketData)
      .select()
      .single<Ticket>()

    if (error) throw error
    return data
  },

  /**
   * Update an existing ticket
   */
  async update(ticketId: number, input: UpdateTicketInput): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update(input)
      .eq('id', ticketId)
      .select()
      .single<Ticket>()

    if (error) throw error
    return data
  },

  /**
   * Delete a ticket
   */
  async delete(ticketId: number): Promise<void> {
    const { error } = await supabase.from('tickets').delete().eq('id', ticketId)

    if (error) throw error
  },

  /**
   * Update ticket quantity
   */
  async updateQuantity(
    ticketId: number,
    quantityTotal: number,
  ): Promise<Ticket> {
    // Get current ticket to calculate new available quantity
    const ticket = await this.getById(ticketId)
    if (!ticket) throw new Error('Ticket not found')

    const quantityAvailable =
      quantityTotal - (ticket.quantity_total - ticket.quantity_available)

    const { data, error } = await supabase
      .from('tickets')
      .update({
        quantity_total: quantityTotal,
        quantity_available: quantityAvailable,
      })
      .eq('id', ticketId)
      .select()
      .single<Ticket>()

    if (error) throw error
    return data
  },

  /**
   * Update ticket status
   */
  async updateStatus(ticketId: number, status: TicketStatus): Promise<Ticket> {
    const { data, error } = await supabase
      .from('tickets')
      .update({ status })
      .eq('id', ticketId)
      .select()
      .single<Ticket>()

    if (error) throw error
    return data
  },

  /**
   * Get purchases for a ticket
   */
  async getPurchases(ticketId: number): Promise<TicketPurchase[]> {
    const { data, error } = await supabase
      .from('ticket_purchases')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('purchase_date', { ascending: false })

    if (error) throw error
    return (data as TicketPurchase[]) || []
  },

  /**
   * Get ticket statistics for an edition
   */
  async getStatistics(editionId: number): Promise<{
    totalTickets: number
    totalSold: number
    totalRevenue: number
    activeTickets: number
  }> {
    const tickets = await this.getByEdition(editionId)

    return {
      totalTickets: tickets.reduce(
        (sum, ticket) => sum + ticket.quantity_total,
        0,
      ),
      totalSold: tickets.reduce((sum, ticket) => sum + ticket.quantity_sold, 0),
      totalRevenue: tickets.reduce(
        (sum, ticket) => sum + ticket.quantity_sold * ticket.price,
        0,
      ),
      activeTickets: tickets.filter(
        (ticket) => ticket.status === TicketStatus.ACTIVE,
      ).length,
    }
  },

  /**
   * Subscribe to ticket changes for real-time updates
   */
  subscribe(editionId: number, callback: () => void): () => void {
    const channel = supabase
      .channel(`tickets:${editionId}`)
      .on(
        'postgres_changes' as never,
        {
          event: '*',
          schema: 'public',
          table: 'tickets',
          filter: `edition_id=eq.${editionId}`,
        } as never,
        callback as never,
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  },
}

export default ticketService
