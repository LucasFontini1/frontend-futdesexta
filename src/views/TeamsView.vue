<script setup>
import { onMounted, ref } from 'vue'
import { createTeam, listTeams } from '@/api/teamsApi'
const teams = ref([])
const name = ref('')
const busy = ref(false)
const error = ref('')
async function load() {
  try {
    const result = await listTeams()
    teams.value = result.results ?? result
  } catch (err) {
    error.value = err.message
  }
}
async function create() {
  busy.value = true
  error.value = ''
  try {
    await createTeam({ name: name.value })
    name.value = ''
    await load()
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Minhas equipes</h1>
    <p class="muted">Equipes privadas: os novos membros entram somente por convite.</p>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div class="card">
      <h2>Criar equipe</h2>
      <form class="form" @submit.prevent="create">
        <label class="field"
          >Nome da equipe <input v-model="name" required maxlength="120"
        /></label>
        <div><button type="submit" class="button" :disabled="busy">Criar equipe</button></div>
      </form>
    </div>
    <h2>Equipes que participo</h2>
    <div class="grid">
      <RouterLink v-for="team in teams" :key="team.id" class="card" :to="`/equipes/${team.id}`">
        <h3>{{ team.name }}</h3>
        <p>{{ team.description || 'Equipe privada' }}</p>
        <p class="muted">{{ team.member_count }} membro(s)</p>
      </RouterLink>
    </div>
    <p v-if="!teams.length && !error" class="muted">Você ainda não participa de nenhuma equipe.</p>
  </section>
</template>
