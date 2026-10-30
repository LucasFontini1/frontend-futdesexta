import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/LandingView.vue') },
    { path: '/entrar', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/cadastro', name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/painel', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { auth: true } },
    { path: '/equipes', name: 'teams', component: () => import('@/views/TeamsView.vue'), meta: { auth: true } },
    { path: '/equipes/:id', name: 'team', component: () => import('@/views/TeamView.vue'), meta: { auth: true } },
    { path: '/convites', name: 'invites', component: () => import('@/views/InvitationsView.vue'), meta: { auth: true } },
    { path: '/perfil', name: 'profile', component: () => import('@/views/ProfileView.vue'), meta: { auth: true } },
    { path: '/:pathMatch(.*)*', name: '404', component: () => import('@/views/NotFoundView.vue') },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.isAuthenticated()) return { name: 'login', query: { next: to.fullPath } }
  if ((to.name === 'login' || to.name === 'register') && auth.isAuthenticated()) return { name: 'dashboard' }
})
export default router
