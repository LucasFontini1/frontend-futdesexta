import { api } from './config'

export const listMatches = () => api('/partidas/')
export const getMatch = (id) => api(`/partidas/${id}/`)
export const createMatch = (data) => api('/partidas/', { method: 'POST', data })
export const listAttendance = (id) => api(`/partidas/${id}/presenca/`)
export const replyAttendance = (id, response) =>
  api(`/partidas/${id}/presenca/`, { method: 'POST', data: { response } })
