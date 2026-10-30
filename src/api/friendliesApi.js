import { api } from './config'
export const listFriendlies = () => api('/amistosos/')
export const createFriendly = (data) => api('/amistosos/', { method: 'POST', data })
export const respondFriendly = (id, accept) =>
  api(`/amistosos/${id}/responder/`, { method: 'POST', data: { accept } })
export const approveFriendlyResult = (id) =>
  api(`/amistosos/${id}/aprovar-resultado/`, { method: 'POST' })
