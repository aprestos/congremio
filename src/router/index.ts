import { createRouter, createWebHistory } from 'vue-router'
import {
  navigationGuard,
  type RouteGuard,
  requiresStaff,
} from '@/router/guards'
import { RouteNames } from '@/router/routeNames.ts'
import HomeView from '../views/HomeView.vue'

// Extend Vue Router's RouteMeta interface
declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    guard?: RouteGuard
    permission?: string
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteNames.public.home,
      component: HomeView,
    },
    {
      path: '/auth',
      component: () => import('../views/auth/_templates/AuthTemplateView.vue'),
      children: [
        {
          path: 'sign-in',
          name: RouteNames.auth.signIn,
          component: () => import('../views/auth/SignInView-MagicLink.vue'),
        },
        {
          path: 'sign-up',
          name: RouteNames.auth.signUp,
          component: () => import('../views/auth/SignUpView.vue'),
        },
        {
          path: 'confirm',
          name: 'confirm',
          component: () => import('../views/auth/ConfirmView.vue'),
        },
      ],
    },
    {
      path: '/library',
      name: RouteNames.public.library,
      component: () => import('../views/library/HomeView.vue'),
    },
    {
      path: '/flee-market',
      name: RouteNames.public.fleeMarket,
      component: () => import('../views/flee-market/HomeView.vue'),
    },
    {
      path: '/tournaments',
      name: RouteNames.public.tournaments,
      component: () => import('../views/flee-market/HomeView.vue'),
    },
    {
      path: '/admin',
      component: () => import('../views/admin/HomeView.vue'),
      meta: {
        requiresAuth: true,
        permission: 'admin',
        guard: requiresStaff,
      },
      children: [
        {
          path: '',
          name: RouteNames.admin.dashboard,
          component: () => import('../views/admin/dashboard/HomeView.vue'),
        },
        {
          path: 'library',
          name: RouteNames.admin.library,
          component: () => import('../views/admin/library/LibraryView.vue'),
        },
        {
          path: 'events',
          name: RouteNames.admin.events,
          component: () => import('../views/admin/events/HomeView.vue'),
        },
        {
          path: 'tournaments',
          name: RouteNames.admin.tournaments,
          component: () => import('../views/admin/tournaments/HomeView.vue'),
        },
        {
          path: 'settings',
          name: RouteNames.admin.settings,
          component: () => import('../views/admin/settings/SettingsView.vue'),
        },
      ],
    },
    {
      path: '/not-found',
      name: RouteNames.error.notFound,
      component: () => import('../views/NotFoundView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/not-found',
    },
  ],
})

// Route guard using the Vue 2 style approach
router.beforeEach(navigationGuard)

export default router
