import axios from 'axios'

const baseURL = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api').replace(/\/$/, '')
const api = axios.create({ baseURL, timeout: 20000 })
let pendingRefresh = null

api.interceptors.request.use((request) => {
  const token = localStorage.getItem('access_token')
  if (token) request.headers.Authorization = `Bearer ${token}`
  return request
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (!original || error.response?.status !== 401 || original._retry || /\/token\//.test(original.url || '')) {
      return Promise.reject(error)
    }
    original._retry = true
    try {
      if (!pendingRefresh) {
        pendingRefresh = axios.post(`${baseURL}/token/refresh/`, {
          refresh: localStorage.getItem('refresh_token'),
        }).finally(() => { pendingRefresh = null })
      }
      const { data } = await pendingRefresh
      localStorage.setItem('access_token', data.access)
      original.headers.Authorization = `Bearer ${data.access}`
      return api(original)
    } catch (refreshError) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_profile_cache')
      window.dispatchEvent(new Event('fut-session-expired'))
      return Promise.reject(refreshError)
    }
  },
)
export default api
