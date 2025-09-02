import type { UserResponse } from '@supabase/supabase-js'
import type { Access, TenantAccess } from '@/features/auth/access.model.ts'
import { supabase } from '@/lib/supabase.ts'
import { tenantStore } from '@/stores/tenant.ts'

export const authService = {
  async signUp(
    name: string,
    email: string,
    password: string,
  ): Promise<UserResponse> {
    const { data, error } = await supabase.auth.signUp({
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

    return { data, error }
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
        // set this to false if you do not want the user to be automatically signed up
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })
  },
  async getUser(): Promise<UserResponse> {
    return supabase.auth.getUser()
  },

  async getAccess(): Promise<TenantAccess> {
    const { data } = await supabase.auth.getClaims()

    const tenant_id = tenantStore.value?.id
    const access: Access = data?.claims?.access

    console.log('access', access)
    if (!tenant_id || !access || !access[tenant_id]) {
      return { role: '', permissions: [] }
    } else return access[tenant_id]
  },

  async getRole(): Promise<string | undefined> {
    const access = await this.getAccess()

    if (!access) return undefined
    else return access.role
  },

  async getPermissions(): Promise<string[]> {
    const access: TenantAccess = await this.getAccess()

    if (!access) return []
    else return access.permissions || []
  },

  async hasAdminAccess(): Promise<boolean> {
    const role = await this.getRole()
    console.log('role', role)

    return role === 'staff' || role === 'admin' || role === 'super-admin'
  },
  async setTenant(userId: string): Promise<void> {
    // Call the user-tenant function to set up user-tenant relationship
    await supabase.functions.invoke('user-tenant', {
      body: {
        user_id: userId,
      },
      method: 'POST',
    })
  },
}
