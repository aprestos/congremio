import { supabase } from '@/lib/supabase.ts'

export default class {
  static async get(): Promise<Array<unknown>> {
    try {
      const result = await supabase.from('locations').select()
      console.log(result.data)
      return result.data as unknown[]
    } catch (error) {
      console.error((error as Error).message)
      return []
    }
  }
}
