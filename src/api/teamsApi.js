import { api } from './config'

export const listTeams = () => api('/equipes/')
export const createTeam = (data) => api('/equipes/', { method: 'POST', data })
export const getTeam = (id) => api(`/equipes/${id}/`)
export const getMembers = (id) => api(`/equipes/${id}/membros/`)
export const getPlayers = (id) => api(`/equipes/${id}/jogadores/`)
export const createPlayer = (id, data) => api(`/equipes/${id}/jogadores/`, { method: 'POST', data })
export const findUsers = (term) => api(`/usuarios/?search=${encodeURIComponent(term)}`)
export const inviteUser = (id, user_id) => api(`/equipes/${id}/convidar/`, { method: 'POST', data: { user_id } })
export const listInvitations = () => api('/convites-equipe/')
export const answerInvitation = (id, accept) =>
  api(`/convites-equipe/${id}/${accept ? 'aceitar' : 'recusar'}/`, { method: 'POST' })
