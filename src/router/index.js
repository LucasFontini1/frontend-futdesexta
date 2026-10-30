import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/LandingView.vue') },
    { path: '/entrar', name: 'login', component: () => import('@/views/LoginView.vue') },
    { path: '/cadastro', name: 'register', component: () => import('@/views/RegisterView.vue') },
    { path: '/verificar-email', name: 'verify-email', component: () => import('@/views/VerifyEmailView.vue') },
    { path: '/esqueci-senha', name: 'forgot-password', component: () => import('@/views/ForgotPasswordView.vue') },
    { path: '/redefinir-senha', name: 'reset-password', component: () => import('@/views/ResetPasswordView.vue') },
    { path: '/termos', name: 'terms', component: () => import('@/views/LegalView.vue') },
    { path: '/privacidade', name: 'privacy', component: () => import('@/views/LegalView.vue') },
    { path: '/painel', name: 'dashboard', component: () => import('@/views/DashboardView.vue'), meta: { auth: true } },
    { path: '/equipes', name: 'teams', component: () => import('@/views/TeamsView.vue'), meta: { auth: true } },
    { path: '/equipes/:id', name: 'team', component: () => import('@/views/TeamView.vue'), meta: { auth: true } },
    { path: '/agenda', name: 'calendar', component: () => import('@/views/CalendarView.vue'), meta: { auth: true } },
    { path: '/recorrencias', name: 'recurrences', component: () => import('@/views/RecurrencesView.vue'), meta: { auth: true } },
    { path: '/estatisticas', name: 'stats', component: () => import('@/views/StatisticsView.vue'), meta: { auth: true } },
    { path: '/amistosos', name: 'friendlies', component: () => import('@/views/FriendliesView.vue'), meta: { auth: true } },
    { path: '/competicoes', name: 'competitions', component: () => import('@/views/CompetitionsView.vue'), meta: { auth: true } },
    { path: '/competicoes/:id', name: 'competition', component: () => import('@/views/CompetitionDetailView.vue'), meta: { auth: true } },
    { path: '/eventos', name: 'events', component: () => import('@/views/EventsView.vue'), meta: { auth: true } },
    { path: '/notificacoes', name: 'notifications', component: () => import('@/views/NotificationsView.vue'), meta: { auth: true } },
    { path: '/partidas/:id/escalacao', name: 'lineup', component: () => import('@/views/LineupView.vue'), meta: { auth: true } },
    { path: '/partidas/:id/resultado', name: 'result', component: () => import('@/views/ResultView.vue'), meta: { auth: true } },
    { path: '/partidas', name: 'matches', component: () => import('@/views/MatchesView.vue'), meta: { auth: true } },
    { path: '/partidas/:id', name: 'match', component: () => import('@/views/MatchView.vue'), meta: { auth: true } },
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
