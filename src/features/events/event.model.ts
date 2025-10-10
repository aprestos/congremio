export interface Edition {
  id: number
  name: string
  start_date?: string
  end_date?: string
  description?: string
  location?: {
    title?: string
    url?: string
  }
}
