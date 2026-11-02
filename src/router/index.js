import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/entrar' },
    { path: '/entrar', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/inicio', name: 'home', component: () => import('@/views/HomeView.vue'), meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/entrar' },
  ],
})
router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAuthenticated) return { name: 'login' }
  if (to.meta.requiresAuth) {
    const ok = await auth.restoreSession()
    if (!ok) return { name: 'login' }
  }
  if (to.name === 'login' && auth.isAuthenticated) return { name: 'home' }
})
export default router
