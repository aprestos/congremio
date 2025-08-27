export interface Event {
  id: number;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  location?: string;
  tenant_id: string;
  created_at: string;
  updated_at: string;
}
