<script setup>
import { onMounted, ref } from 'vue'
import { listTeams } from '@/api/teamsApi'
import LocationPicker from '@/components/maps/LocationPicker.vue'
import { createMatch, listMatches } from '@/api/matchesApi'
const matches = ref([])
const teams = ref([])
const error = ref('')
const notice = ref('')
const form = ref({
  team: '',
  title: '',
  starts_at: '',
  ends_at: '',
  location: '',
  latitude: null,
  longitude: null,
})
async function load() {
  try {
    const [m, t] = await Promise.all([listMatches(), listTeams()])
    matches.value = m.results ?? m
    teams.value = t.results ?? t
  } catch (err) {
    error.value = err.message
  }
}
async function submit() {
  error.value = ''
  notice.value = ''
  try {
    await createMatch({
      ...form.value,
      team: Number(form.value.team),
      starts_at: new Date(form.value.starts_at).toISOString(),
      ends_at: new Date(form.value.ends_at).toISOString(),
    })
    notice.value = 'Partida agendada.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Peladas</h1>
    <p class="muted">Organize os encontros e acompanhe quem vai jogar.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <section class="card">
      <h2>Agendar pelada</h2>
      <p>É necessário ser dono ou administrador da equipe.</p>
      <form class="form" @submit.prevent="submit">
        <label class="field"
          >Equipe
          <select v-model="form.team" required>
            <option value="" disabled>Selecione</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </label>
        <label class="field">Nome <input v-model="form.title" required /></label>
        <label class="field"
          >Início <input v-model="form.starts_at" type="datetime-local" required
        /></label>
        <label class="field"
          >Fim <input v-model="form.ends_at" type="datetime-local" required
        /></label>
        <label class="field">Local <input v-model="form.location" /></label>
        <LocationPicker
          @selected="
            (value) => {
              form.latitude = value.latitude
              form.longitude = value.longitude
              if (value.location) form.location = value.location
            }
          "
        />
        <button class="button" type="submit">Agendar</button>
      </form>
    </section>
    <h2>Próximas partidas</h2>
    <div class="grid">
      <RouterLink
        v-for="match in matches"
        :key="match.id"
        :to="`/partidas/${match.id}`"
        class="card"
      >
        <h3>{{ match.title }}</h3>
        <p>{{ new Date(match.starts_at).toLocaleString('pt-BR') }}</p>
        <p class="muted">{{ match.location || 'Local não informado' }}</p>
      </RouterLink>
    </div>
  </section>
</template>
