<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
const installEvent = ref(null)
const installed = ref(false)
function ready(event) { event.preventDefault(); installEvent.value = event }
function confirmInstalled() { installed.value = true; installEvent.value = null }
async function install() {
  if (!installEvent.value) return
  const event = installEvent.value
  installEvent.value = null
  await event.prompt()
}
onMounted(() => {
  window.addEventListener('beforeinstallprompt', ready)
  window.addEventListener('appinstalled', confirmInstalled)
})
onUnmounted(() => {
  window.removeEventListener('beforeinstallprompt', ready)
  window.removeEventListener('appinstalled', confirmInstalled)
})
</script>

<template>
  <button v-if="installEvent && !installed" type="button" class="button" @click="install">
    Instalar Fut de Sexta
  </button>
</template>
