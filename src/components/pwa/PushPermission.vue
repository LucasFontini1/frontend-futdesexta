<script setup>
import { ref } from 'vue'
import { registerPush } from '@/api/notificationsApi'
const error = ref('')
const success = ref('')
const key = import.meta.env.VITE_VAPID_PUBLIC_KEY
function decode(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const encoded = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(encoded), (character) => character.charCodeAt(0))
}
async function enable() {
  error.value = ''
  success.value = ''
  try {
    if (!key || !('serviceWorker' in navigator) || !('PushManager' in window)) {
      throw new Error('Notificações push não estão configuradas neste navegador.')
    }
    const permission = await Notification.requestPermission()
    if (permission !== 'granted') throw new Error('Permissão não concedida.')
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: decode(key),
    })
    await registerPush(subscription)
    success.value = 'Notificações ativadas para este navegador.'
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <div>
    <button type="button" class="button button-secondary" @click="enable">
      Ativar notificações push
    </button>
    <p v-if="success" class="notice" role="status">{{ success }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
  </div>
</template>
