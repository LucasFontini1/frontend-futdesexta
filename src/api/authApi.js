import { api, clearTokens, setToken } from './config'

export async function login(email, password) {
  const result = await api('/token/', { method: 'POST', data: { email, password } })
  if (!result?.access || !result?.refresh) throw new Error('O servidor não retornou os tokens de sessão.')
  setToken(result.access, result.refresh)
  try {
    const profile = await api('/usuarios/me/')
    localStorage.setItem('user_profile_cache', JSON.stringify(profile))
    return profile
  } catch (error) {
    clearTokens()
    throw error
  }
}
export const register = (data) => api('/registro/', { method: 'POST', data })
export const getProfile = () => api('/usuarios/me/')
export const updateProfile = async (data) => {
  const profile = await api('/usuarios/me/', { method: 'PATCH', data })
  localStorage.setItem('user_profile_cache', JSON.stringify(profile))
  return profile
}
export function logout() { clearTokens() }
