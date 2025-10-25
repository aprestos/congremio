import type { TenantAccess } from '@/features/auth/access.model.ts'

export interface User {
  id: string
  name: string
  email: string
  access: TenantAccess | undefined
}
