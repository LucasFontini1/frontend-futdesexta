<script setup>
import { onMounted, reactive, ref } from 'vue'
import { listTeams } from '@/api/teamsApi'
import { answerEvent, createEvent, listEvents } from '@/api/eventsApi'
const teams = ref([])
const events = ref([])
const error = ref('')
const notice = ref('')
const form = reactive({ team: '', title: '', category: 'other', starts_at: '', ends_at: '', location: '', description: '' })
async function load() {
  try {
    const [e, t] = await Promise.all([listEvents(), listTeams()])
    events.value = e.results ?? e
    teams.value = t.results ?? t
  } catch (err) { error.value = err.message }
}
async function create() {
  error.value = ''; notice.value = ''
  try {
    await createEvent({
      ...form, team: Number(form.team),
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
    })
    notice.value = 'Evento criado.'
    await load()
  } catch (err) { error.value = err.message }
}
async function respond(id, response) {
  try { await answerEvent(id, response); notice.value = 'Presença confirmada.' }
  catch (err) { error.value = err.message }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Eventos da equipe</h1>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <div class="card">
      <h2>Novo evento</h2>
      <form class="form" @submit.prevent="create">
        <label class="field">Equipe
          <select v-model="form.team" required>
            <option value="" disabled>Selecione</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </label>
        <label class="field">Nome <input v-model="form.title" required /></label>
        <label class="field">Tipo
          <select v-model="form.category">
            <option value="other">Outro</option>
            <option value="barbecue">Churrasco</option>
            <option value="celebration">Confraternização</option>
            <option value="meeting">Reunião</option>
          </select>
        </label>
        <label class="field">Início <input v-model="form.starts_at" type="datetime-local" required /></label>
        <label class="field">Fim <input v-model="form.ends_at" type="datetime-local" required /></label>
        <label class="field">Local <input v-model="form.location" /></label>
        <label class="field">Descrição <input v-model="form.description" /></label>
        <button class="button" type="submit">Criar evento</button>
      </form>
    </div>
    <h2>Próximos eventos</h2>
    <article v-for="event in events" :key="event.id" class="card">
      <h3>{{ event.title }}</h3>
      <p>{{ new Date(event.starts_at).toLocaleString('pt-BR') }} · {{ event.location }}</p>
      <div class="actions">
        <button class="button" @click="respond(event.id, 'going')">Vou</button>
        <button class="button button-secondary" @click="respond(event.id, 'not_going')">Não vou</button>
      </div>
    </article>
  </section>
</template>
