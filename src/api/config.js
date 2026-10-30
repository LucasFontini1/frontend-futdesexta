/** Cliente Axios centralizado, com persistência e renovação de JWT.
 * O contrato api(path, options) preserva os serviços já existentes.
 */
import axios from 'axios'

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const ACCESS = 'access_token'
const REFRESH = 'refresh_token'
let refreshPromise = null
const client = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: { Accept: 'application/json', 'Accept-Language': 'pt-br' },
})

export const getAccessToken = () => localStorage.getItem(ACCESS)
export const getRefreshToken = () => localStorage.getItem(REFRESH)
export const hasToken = () => Boolean(getAccessToken() && getRefreshToken())

export function setToken(access, refresh) {
  if (access) localStorage.setItem(ACCESS, access)
  else localStorage.removeItem(ACCESS)
  if (refresh) localStorage.setItem(REFRESH, refresh)
}
export function clearTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
  localStorage.removeItem('user_profile_cache')
}

function normalizeError(error) {
  const payload = error.response?.data
  const detail = payload?.detail || payload?.non_field_errors?.[0]
  const field = payload && Object.values(payload).find((value) => Array.isArray(value))
  const message = typeof detail === 'string'
    ? detail : field?.[0] || (error.code === 'ECONNABORTED' ? 'Tempo de conexão esgotado.' : 'Não foi possível concluir a operação.')
  const e = new Error(message)
  e.status = error.response?.status
  return e
}

client.interceptors.request.use((request) => {
  const access = getAccessToken()
  if (access) request.headers.Authorization = `Bearer ${access}`
  return request
})

async function refreshAccess() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('Sua sessão expirou.')
  const { data } = await axios.post(
    `${API_BASE}/token/refresh/`,
    { refresh },
    { timeout: 20000, headers: { 'Accept-Language': 'pt-br' } },
  )
  if (!data?.access) throw new Error('A API não retornou o token de acesso.')
  setToken(data.access, data.refresh)
  return data.access
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error.config
    const isToken = /(?:^|\/)token(?:\/|$)/.test(request?.url || '')
    if (error.response?.status !== 401 || !request || isToken || request._retry) {
      return Promise.reject(normalizeError(error))
    }
    request._retry = true
    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccess().finally(() => { refreshPromise = null })
      }
      request.headers.Authorization = `Bearer ${await refreshPromise}`
      return client(request)
    } catch (refreshError) {
      clearTokens()
      window.dispatchEvent(new Event('fut-session-expired'))
      return Promise.reject(normalizeError(refreshError))
    }
  },
)

export async function api(path, { method = 'GET', data } = {}) {
  const response = await client.request({ url: path, method, data })
  return response.data
}
