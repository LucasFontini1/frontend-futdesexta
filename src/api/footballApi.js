import { api } from './config'

export const getSides = (id) => api(`/partidas/${id}/lados/`)
export const addSide = (id, data) => api(`/partidas/${id}/lados/`, { method: 'POST', data })
export const getLineup = (id) => api(`/partidas/${id}/escalacao/`)
export const saveLineup = (id, slots) =>
  api(`/partidas/${id}/escalacao/`, { method: 'PUT', data: { slots } })
export const getResult = (id) => api(`/partidas/${id}/resultado/`)
export const saveResult = (id, data) => api(`/partidas/${id}/resultado/`, { method: 'POST', data })
export const getRanking = (kind = 'geral', team = '') =>
  api(
    `/estatisticas/?kind=${encodeURIComponent(kind)}${team ? `&team=${encodeURIComponent(team)}` : ''}`,
  )
export const getOptionalMetrics = (id) => api(`/partidas/${id}/metricas/`)
export const saveOptionalMetric = (id, data) =>
  api(`/partidas/${id}/metricas/`, { method: 'POST', data })
