import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getAccessToken, hasToken, clearTokens } from '@/api/config'
import * as authApi from '@/api/authApi'

export const useAuthStore = defineStore('auth', () => {
  function cachedUser() {
    try {
      return JSON.parse(localStorage.getItem('user_profile_cache') || 'null')
    } catch {
      localStorage.removeItem('user_profile_cache')
      return null
    }
  }
  const user = ref(cachedUser())
  const busy = ref(false)
  const accessToken = ref(getAccessToken())
  const isLoggedIn = computed(() => Boolean(accessToken.value))
  async function signIn(email, password) {
    busy.value = true
    try {
      user.value = await authApi.login(email, password)
      accessToken.value = getAccessToken()
    } catch (error) {
      authApi.logout()
      user.value = null
      accessToken.value = null
      throw error
    } finally {
      busy.value = false
    }
  }
  async function loadCurrentUser() {
    if (!hasToken()) return null
    try {
      user.value = await authApi.getProfile()
      accessToken.value = getAccessToken()
      localStorage.setItem('user_profile_cache', JSON.stringify(user.value))
      return user.value
    } catch (error) {
      signOut()
      throw error
    }
  }
  function signOut() {
    clearTokens()
    user.value = null
    accessToken.value = null
  }
  function isAuthenticated() {
    return hasToken()
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('fut-session-expired', () => {
      signOut()
      if (window.location.pathname !== '/entrar') {
        window.location.assign('/entrar?expired=1')
      }
    })
  }
  return { user, busy, accessToken, isLoggedIn, signIn, signOut, loadCurrentUser, isAuthenticated }
})
