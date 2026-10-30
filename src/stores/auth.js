import { defineStore } from 'pinia'
import { ref } from 'vue'
import { hasToken } from '@/api/config'
import * as authApi from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const busy = ref(false)

  async function signIn(email, password) {
    busy.value = true
    try {
      user.value = await authApi.login(email, password)
    } catch (error) {
      authApi.logout()
      user.value = null
      throw error
    } finally {
      busy.value = false
    }
  }
  function signOut() {
    authApi.logout()
    user.value = null
  }
  const isAuthenticated = () => hasToken() && Boolean(user.value)
  return { user, busy, signIn, signOut, isAuthenticated }
})
