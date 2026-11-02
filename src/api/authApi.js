import api from './config'

export const signIn = (email, password) => api.post('/token/', { email, password })
export const getCurrentUser = () => api.get('/usuarios/me/')
export const verifyToken = (token) => api.post('/token/verify/', { token })

export const register = (data) => api.post('/registro/', data)
