import { supabase } from '@/lib/supabase'
import { FunctionsHttpError } from '@supabase/supabase-js'

export interface User {
  id: string
  name: string
  email: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export const userService = {
  async search(query: string): Promise<User[]> {
    const url = new URL(
      `${import.meta.env.VITE_API_URL as string}/functions/v1/users`,
    )
    url.searchParams.set('query', query)

    const {
      data: { session },
    } = await supabase.auth.getSession()

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
        apikey: import.meta.env.VITE_API_ANON_PUBLIC_JWT as string,
      },
    })

    if (!response.ok) throw new Error('Failed to search users')
    const result = (await response.json()) as {
      results: User[]
    }
    console.log('RESULT', result)
    return result?.results
  },

  async getById(id: string): Promise<User | null> {
    const { data, error } = await supabase.functions.invoke(`users/${id}`, {
      method: 'GET',
    })
    if (error) throw error
    return data as User
  },

  async create(email: string): Promise<User> {
    const { data, error } = await supabase.functions.invoke('users', {
      body: {
        email: email,
      },
      method: 'POST',
    })

    if (data) return data as User
    else {
      if (error instanceof FunctionsHttpError) {
        type ErrorMessage = { message?: string }
        const errorMessage = await error.context.json() as ErrorMessage
        if (typeof errorMessage.message === 'string') {
          throw new Error(errorMessage.message)
        } else {
          throw new Error('Unknown error occurred while creating user')
        }
      } else {
        console.log('Unknown error:', JSON.stringify(error))
        throw new Error('Unable to create user')
      }
    }
  },
}
