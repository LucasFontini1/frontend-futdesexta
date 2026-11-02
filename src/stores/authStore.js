import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getCurrentUser, signIn } from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('access_token'))
  const user = ref(null)
  const loading = ref(false)
  const error = ref('')
  const isAuthenticated = computed(() => Boolean(token.value && localStorage.getItem('refresh_token')))

  function clearSession() {
    token.value = null
    user.value = null
    for (const key of ['access_token', 'refresh_token', 'user_profile_cache']) localStorage.removeItem(key)
  }

  async function restoreSession() {
    if (!localStorage.getItem('refresh_token')) { clearSession(); return false }
    try {
      const response = await getCurrentUser()
      user.value = response.data
      token.value = localStorage.getItem('access_token')
      localStorage.setItem('user_profile_cache', JSON.stringify(user.value))
      return true
    } catch {
      clearSession()
      return false
    }
  }

  async function login(email, password) {
    loading.value = true
    error.value = ''
    try {
      const { data } = await signIn(email, password)
      if (!data.access || !data.refresh) throw new Error('O servidor não retornou uma sessão válida.')
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      token.value = data.access
      if (!await restoreSession()) throw new Error('Não foi possível consultar seu perfil.')
      return true
    } catch (e) {
      clearSession()
      error.value = e.response?.status === 401
        ? 'E-mail ou senha incorretos.'
        : e.response?.data?.detail || e.message || 'Falha na conexão com o servidor.'
      return false
    } finally { loading.value = false }
  }

  window.addEventListener('fut-session-expired', clearSession)
  return { token, user, loading, error, isAuthenticated, login, restoreSession, clearSession }
})
