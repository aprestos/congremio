import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/sign-in',
      name: 'Sign In',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/auth/SignInView.vue'),
    },
    {
      path: '/sign-up',
      name: 'Sign up',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/auth/SignUpView.vue'),
    },
    {
      path: '/library',
      name: 'LibraryHome',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/library/HomeView.vue'),
    },
    {
      path: '/library/new',
      name: 'LibraryNew',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/library/NewView.vue'),
    },
    {
      path: '/flee-market',
      name: 'Flee Market',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/flee-market/HomeView.vue'),
    },
    {
      path: '/tournaments',
      name: 'Tournaments',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/flee-market/HomeView.vue'),
    },
    {
      path: '/admin/',
      component: () => import('../views/admin/HomeView.vue'),
      children: [
        {
          path: 'library',
          component: import('../views/admin/LibraryView.vue'),
        },
      ],
    },
  ],
})

export default router
