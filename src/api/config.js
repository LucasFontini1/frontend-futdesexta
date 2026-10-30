const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(
  /\/$/,
  '',
)
let token = null

export function setToken(value) {
  token = value || null
}
export function hasToken() {
  return Boolean(token)
}

export async function api(path, { method = 'GET', data } = {}) {
  const headers = { Accept: 'application/json' }
  if (token) headers.Authorization = `Bearer ${token}`
  if (data && !(data instanceof FormData)) headers['Content-Type'] = 'application/json'
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: data == null ? undefined : data instanceof FormData ? data : JSON.stringify(data),
  })
  const raw = await response.text()
  let result = null
  if (raw) {
    try {
      result = JSON.parse(raw)
    } catch {
      throw new Error('Resposta inesperada da API.')
    }
  }
  if (!response.ok) {
    const detail = result?.detail || result?.non_field_errors?.[0]
    const field = result && Object.values(result).find((value) => Array.isArray(value))
    throw new Error(
      typeof detail === 'string' ? detail : field?.[0] || 'Não foi possível concluir a operação.',
    )
  }
  return result
}
