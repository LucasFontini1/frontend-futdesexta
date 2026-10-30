<script setup>
import { onMounted, ref } from 'vue'
import { listInvitations, answerInvitation } from '@/api/teamsApi'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const invitations = ref([])
const error = ref('')
const message = ref('')
async function load() {
  try {
    const result = await listInvitations()
    invitations.value = result.results ?? result
  } catch (err) {
    error.value = err.message
  }
}
async function reply(id, accepted) {
  error.value = ''
  try {
    await answerInvitation(id, accepted)
    message.value = accepted ? 'Convite aceito!' : 'Convite recusado.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Convites de equipes</h1>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="message" class="notice" role="status">{{ message }}</p>
    <div v-for="invite in invitations" :key="invite.id" class="card">
      <h2>{{ invite.team_name }}</h2>
      <p>Status: {{ invite.status }}</p>
      <div v-if="invite.invitee === auth.user?.id && invite.status === 'pending'" class="actions">
        <button class="button" @click="reply(invite.id, true)">Aceitar</button>
        <button class="button button-secondary" @click="reply(invite.id, false)">Recusar</button>
      </div>
    </div>
    <p v-if="!invitations.length && !error">Você ainda não tem convites.</p>
  </section>
</template>
