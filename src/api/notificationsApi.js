import { api } from './config'
export const listNotifications = () => api('/notificacoes/')
export const markRead = (id) => api(`/notificacoes/${id}/ler/`, { method: 'POST' })
export const registerPush = (subscription) =>
  api('/notificacoes/inscrever-push/', {
    method: 'POST',
    data: {
      endpoint: subscription.endpoint,
      p256dh: subscription.toJSON().keys.p256dh,
      auth: subscription.toJSON().keys.auth,
    },
  })
