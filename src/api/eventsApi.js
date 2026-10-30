import { api } from './config'
export const listEvents = () => api('/eventos/')
export const createEvent = (data) => api('/eventos/', { method: 'POST', data })
export const getEvent = (id) => api(`/eventos/${id}/`)
export const answerEvent = (id, response) =>
  api(`/eventos/${id}/presenca/`, { method: 'POST', data: { response } })
