<script setup>
import { onMounted, reactive, ref } from 'vue'
import { listTeams } from '@/api/teamsApi'
import {
  listRecurrences,
  createRecurrence,
  generateRecurrence,
  disableRecurrence,
} from '@/api/recurrenceApi'
const teams = ref([])
const rules = ref([])
const error = ref('')
const notice = ref('')
const form = reactive({
  team: '',
  title: 'Pelada da semana',
  weekday: 4,
  start_time: '19:00',
  end_time: '21:00',
  starts_on: '',
  until: '',
  location: '',
  expected_players: 10,
  interval_weeks: 1,
})
async function load() {
  try {
    const [a, b] = await Promise.all([listRecurrences(), listTeams()])
    rules.value = a.results ?? a
    teams.value = b.results ?? b
  } catch (err) {
    error.value = err.message
  }
}
async function create() {
  error.value = ''
  notice.value = ''
  try {
    await createRecurrence({
      ...form,
      team: Number(form.team),
      weekday: Number(form.weekday),
      starts_on: form.starts_on,
      until: form.until || null,
      expected_players: Number(form.expected_players),
      interval_weeks: Number(form.interval_weeks),
    })
    notice.value = 'Série criada e próximas partidas geradas.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
async function generate(id) {
  try {
    const data = await generateRecurrence(id)
    notice.value = `${data.created} novas partidas geradas.`
  } catch (err) {
    error.value = err.message
  }
}
async function stop(id) {
  try {
    await disableRecurrence(id)
    notice.value = 'Série encerrada.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Peladas recorrentes</h1>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <section class="card">
      <h2>Nova série semanal</h2>
      <form class="form" @submit.prevent="create">
        <label class="field"
          >Equipe
          <select v-model="form.team" required>
            <option value="" disabled>Selecione</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </label>
        <label class="field">Nome <input v-model="form.title" required maxlength="120" /></label>
        <label class="field"
          >Dia da semana
          <select v-model.number="form.weekday">
            <option :value="0">Segunda</option>
            <option :value="1">Terça</option>
            <option :value="2">Quarta</option>
            <option :value="3">Quinta</option>
            <option :value="4">Sexta</option>
            <option :value="5">Sábado</option>
            <option :value="6">Domingo</option>
          </select>
        </label>
        <label class="field">Início <input v-model="form.start_time" type="time" required /></label>
        <label class="field">Fim <input v-model="form.end_time" type="time" required /></label>
        <label class="field"
          >Data inicial <input v-model="form.starts_on" type="date" required
        /></label>
        <label class="field"
          >Encerrar em (opcional) <input v-model="form.until" type="date"
        /></label>
        <label class="field">Local <input v-model="form.location" /></label>
        <button type="submit" class="button">Agendar série</button>
      </form>
    </section>
    <h2>Séries da equipe</h2>
    <article v-for="rule in rules" :key="rule.id" class="card">
      <h3>{{ rule.title }}</h3>
      <p>Dia {{ rule.weekday }} · {{ rule.start_time }}–{{ rule.end_time }}</p>
      <div class="actions">
        <button v-if="rule.active" class="button" @click="generate(rule.id)">Gerar próximas</button>
        <button v-if="rule.active" class="button button-secondary" @click="stop(rule.id)">
          Encerrar série
        </button>
      </div>
    </article>
  </section>
</template>
