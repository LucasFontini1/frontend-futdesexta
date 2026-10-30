import { api, setToken } from './config'

export async function login(email, password) {
  const result = await api('/token/', { method: 'POST', data: { email, password } })
  setToken(result.access)
  return api('/usuarios/me/')
}
export const register = (data) => api('/registro/', { method: 'POST', data })
export const updateProfile = (data) => api('/usuarios/me/', { method: 'PATCH', data })
export function logout() { setToken(null) }
