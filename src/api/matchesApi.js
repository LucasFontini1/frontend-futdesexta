import { api } from './config'

export const listMatches = () => api('/partidas/')
export const getMatch = (id) => api(`/partidas/${id}/`)
export const createMatch = (data) => api('/partidas/', { method: 'POST', data })
export const listAttendance = (id) => api(`/partidas/${id}/presenca/`)
export const replyAttendance = (id, response) =>
  api(`/partidas/${id}/presenca/`, { method: 'POST', data: { response } })

export const listMatchHistory = (page = 1, kind = '') =>
  api(`/partidas/?status=finished&page=${Number(page)}${kind ? `&kind=${encodeURIComponent(kind)}` : ''}`)
