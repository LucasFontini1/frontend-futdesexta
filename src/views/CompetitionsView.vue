<script setup>
import { onMounted, reactive, ref } from 'vue'
import {
  listCompetitions,
  createCompetition,
  getCompetitionInvitations,
  respondCompetitionInvitation,
} from '@/api/competitionsApi'
const competitions = ref([])
const invitations = ref([])
const error = ref('')
const notice = ref('')
const form = reactive({ name: '', description: '', format: 'league', rules: '' })
async function load() {
  try {
    const [c, i] = await Promise.all([listCompetitions(), getCompetitionInvitations()])
    competitions.value = c.results ?? c
    invitations.value = i.results ?? i
  } catch (err) {
    error.value = err.message
  }
}
async function create() {
  error.value = ''
  try {
    await createCompetition(form)
    notice.value = 'Competição criada.'
    form.name = ''
    await load()
  } catch (err) {
    error.value = err.message
  }
}
async function reply(id, accept) {
  error.value = ''
  try {
    await respondCompetitionInvitation(id, accept)
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Competições</h1>
    <p>Organize campeonatos somente com equipes cadastradas e convidadas.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <div class="card">
      <h2>Criar competição</h2>
      <form class="form" @submit.prevent="create">
        <label class="field">Nome <input v-model="form.name" required maxlength="120" /></label>
        <label class="field"
          >Formato
          <select v-model="form.format">
            <option value="league">Pontos corridos</option>
            <option value="knockout">Mata-mata</option>
          </select>
        </label>
        <label class="field">Descrição <input v-model="form.description" /></label>
        <label class="field">Regulamento <input v-model="form.rules" /></label>
        <button class="button" type="submit">Criar campeonato</button>
      </form>
    </div>
    <h2>Convites recebidos</h2>
    <article
      v-for="invite in invitations.filter((i) => i.status === 'pending')"
      :key="invite.id"
      class="card"
    >
      <p>Competição #{{ invite.competition }} · {{ invite.team_name }}</p>
      <div class="actions">
        <button class="button" @click="reply(invite.id, true)">Aceitar</button>
        <button class="button button-secondary" @click="reply(invite.id, false)">Recusar</button>
      </div>
    </article>
    <h2>Minhas competições</h2>
    <div class="grid">
      <RouterLink
        v-for="competition in competitions"
        :key="competition.id"
        :to="`/competicoes/${competition.id}`"
        class="card"
      >
        <h3>{{ competition.name }}</h3>
        <p>{{ competition.format === 'league' ? 'Pontos corridos' : 'Mata-mata' }}</p>
        <p>{{ competition.description }}</p>
      </RouterLink>
    </div>
  </section>
</template>
