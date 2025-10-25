import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { authService } from '@/features/auth/service.ts'
import { RouteNames } from '@/router/routeNames'
import { log } from '@/lib/logger'

// Guard function type
export type RouteGuard = () => Promise<boolean>

// Authentication check guard
export const requiresAuth = async (): Promise<boolean> => {
  try {
    const user = await authService.getUser()
    return !!user
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

// Staff permission check guard
export const hasAnyOfRoles = async (roles: string[]): Promise<boolean> => {
  if (!roles || roles.length === 0) return false
  try {
    const user = await authService.getUser()
    if (!user?.access?.role) return false
    if (user.access.role === 'super-admin') return true
    return roles.includes(user.access.role)
  } catch (error) {
    console.error('Error checking staff permissions:', error)
    return false
  }
}

// Main navigation guard handler (Vue 2 style)
export const navigationGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): Promise<void> => {
  try {
    // Check custom guard function
    if (to.meta.guard) {
      log.debug('calling guard', to.meta)
      const hasPermission = await to.meta.guard()
      log.debug('hasPermission', { hasPermission })

      if (hasPermission) {
        next()
      } else {
        next({ name: RouteNames.error.notFound })
      }
      return
    }

    // Check authentication requirement
    if (to.meta.requiresAuth) {
      const isAuthenticated = await requiresAuth()

      if (isAuthenticated) {
        next()
      } else {
        next({ name: RouteNames.auth.signIn })
      }
      return
    }

    // No guards required, proceed
    next()
  } catch (error) {
    console.error('Navigation guard error:', error)
    next({ name: RouteNames.error.notFound })
  }
}
