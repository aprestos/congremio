export interface Event {
  id: number
  tenant_id: string
  name: string
  description?: string
  start_date: string
  end_date: string
  location?: string
  timezone?: string
  created_at: string
  updated_at: string
}
