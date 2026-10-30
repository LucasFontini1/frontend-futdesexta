/** API central baseada no fluxo JWT/refresh do Momentum.
 * A persistência no localStorage é intencional, conforme a referência solicitada.
 * Em produção, a opção de cookies HttpOnly reduziria exposição a XSS.
 */
const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const ACCESS = 'access_token'
const REFRESH = 'refresh_token'
let refreshPromise = null

export const getAccessToken = () => localStorage.getItem(ACCESS)
export const getRefreshToken = () => localStorage.getItem(REFRESH)
export const hasToken = () => Boolean(getAccessToken() && getRefreshToken())
export function setToken(value, refresh) {
  if (value) localStorage.setItem(ACCESS, value)
  else localStorage.removeItem(ACCESS)
  if (refresh) localStorage.setItem(REFRESH, refresh)
}
export function clearTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
  localStorage.removeItem('user_profile_cache')
}
async function readResponse(response) {
  const raw = await response.text()
  if (!raw) return null
  try { return JSON.parse(raw) } catch { throw new Error('Resposta inesperada da API.') }
}
function apiError(response, payload) {
  const detail = payload?.detail || payload?.non_field_errors?.[0]
  const field = payload && Object.values(payload).find((value) => Array.isArray(value))
  const message = typeof detail === 'string' ? detail : field?.[0] || 'Não foi possível concluir a operação.'
  const error = new Error(message)
  error.status = response.status
  return error
}
async function refreshAccess() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('Sessão expirada. Entre novamente.')
  const response = await fetch(`${API_BASE}/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ refresh }),
  })
  const payload = await readResponse(response)
  if (!response.ok || !payload?.access) throw apiError(response, payload)
  setToken(payload.access, payload.refresh)
  return payload.access
}
export async function api(path, { method = 'GET', data, _retry = false } = {}) {
  const headers = { Accept: 'application/json' }
  const token = getAccessToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (data != null && !(data instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${API_BASE}${path}`, {
    method, headers,
    body: data == null ? undefined : data instanceof FormData ? data : JSON.stringify(data),
  })
  const payload = await readResponse(response)
  if (response.status === 401 && !_retry && !path.startsWith('/token/')) {
    try {
      if (!refreshPromise) refreshPromise = refreshAccess().finally(() => { refreshPromise = null })
      await refreshPromise
      return api(path, { method, data, _retry: true })
    } catch (error) {
      clearTokens()
      window.dispatchEvent(new Event('fut-session-expired'))
      throw error
    }
  }
  if (!response.ok) throw apiError(response, payload)
  return payload
}
