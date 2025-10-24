import type { Access } from '@/features/auth/access.model.ts'
import { supabase } from '@/lib/supabase.ts'
import { tenantStore } from '@/stores/tenant.ts'
import type { User } from '@/features/auth/user.model.ts'

export const authService = {
  // Authentication methods
  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<unknown> {
    const { data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          tenant_id: tenantStore.value?.id,
        },
      },
    })

    if (data.user) {
      await supabase.functions.invoke(`user-tenant`, {
        body: {
          user_id: data.user.id,
        },
        method: 'POST',
      })
    }

    return data
  },

  async signIn(email: string, password: string): Promise<void> {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  async signInWithOTP(email: string): Promise<void> {
    await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut()
  },

  // User data methods (using getClaims)
  async getUser(): Promise<User | null> {
    const { data } = await supabase.auth.getClaims()

    if (!data?.claims?.sub) {
      return null
    }

    const tenantId: string | undefined = tenantStore.value?.id

    return {
      email: data.claims.email,
      name: data.claims.user_metadata?.display_name, //eslint-disable-line
      id: data.claims.sub,
      access: tenantId
        ? (data.claims?.access as Access)[tenantId] || undefined
        : undefined,
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const { data } = await supabase.auth.getClaims()
    return !!data?.claims?.sub
  },

  // Utility methods
  async setTenant(userId: string): Promise<void> {
    await supabase.functions.invoke('user-tenant', {
      body: {
        user_id: userId,
        tenant_id: tenantStore.value?.id,
      },
      method: 'POST',
    })
  },

  async updateUserMetadata(metadata: Record<string, unknown>): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      data: metadata,
    })
    if (error) {
      throw error
    }
  },

  hasAnyOfTheRoles(user: User, roles: string[]): boolean {
    if (!roles || !user?.access?.role) return false

    return roles.includes(user.access.role)
  },
}
