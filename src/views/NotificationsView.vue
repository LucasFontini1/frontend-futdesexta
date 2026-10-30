<script setup>
import PushPermission from '@/components/pwa/PushPermission.vue'
import { onMounted, ref } from 'vue'
import { listNotifications, markRead } from '@/api/notificationsApi'
const notifications = ref([])
const error = ref('')
async function load() {
  try {
    const result = await listNotifications()
    notifications.value = result.results ?? result
  } catch (err) {
    error.value = err.message
  }
}
async function read(id) {
  try {
    await markRead(id)
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Notificações</h1>
    <PushPermission />
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <article v-for="item in notifications" :key="item.id" class="card">
      <h2>{{ item.title }}</h2>
      <p class="muted">{{ new Date(item.created_at).toLocaleString('pt-BR') }}</p>
      <div class="actions">
        <RouterLink v-if="item.link" class="button button-secondary" :to="item.link"
          >Abrir</RouterLink
        >
        <button v-if="!item.read_at" class="button" @click="read(item.id)">Marcar como lida</button>
      </div>
    </article>
    <p v-if="!notifications.length && !error">Você não tem notificações.</p>
  </section>
</template>
