import { api } from './config'
export const listRecurrences = () => api('/recorrencias/')
export const createRecurrence = (data) => api('/recorrencias/', { method: 'POST', data })
export const generateRecurrence = (id) => api(`/recorrencias/${id}/gerar/`, { method: 'POST' })
export const disableRecurrence = (id) => api(`/recorrencias/${id}/`, { method: 'DELETE' })
