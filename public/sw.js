/* Cache somente de recursos públicos. API, autenticação e páginas privadas não são armazenadas. */
const CACHE = 'futdesexta-public-v1'
const OFFLINE = '/offline.html'
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) =>
    cache.addAll([OFFLINE, '/icons/icon.svg', '/manifest.webmanifest'])
  ))
  self.skipWaiting()
})
self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))
  )))
  self.clients.claim()
})
self.addEventListener('fetch', (event) => {
  const request = event.request
  const url = new URL(request.url)
  if (request.method !== 'GET' || url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/api/') || request.headers.has('Authorization')) return
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE)))
  }
})
self.addEventListener('push', (event) => {
  let payload = { title: 'Fut de Sexta', body: 'Você tem uma notificação.', url: '/notificacoes' }
  if (event.data) {
    try { payload = { ...payload, ...event.data.json() } } catch { /* corpo inválido */ }
  }
  const url = typeof payload.url === 'string' && payload.url.startsWith('/') &&
    !payload.url.startsWith('//') ? payload.url : '/notificacoes'
  event.waitUntil(self.registration.showNotification(payload.title, {
    body: payload.body, icon: '/icons/icon.svg', data: { url },
  }))
})
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(self.clients.openWindow(event.notification.data?.url || '/notificacoes'))
})
