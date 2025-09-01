import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_API_URL as string,
  import.meta.env.VITE_API_ANON_PUBLIC_JWT as string,
)
