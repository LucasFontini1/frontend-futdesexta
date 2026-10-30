<script setup>
import { onMounted, reactive, ref } from 'vue'
import { api } from '@/api/config'
import { listTeams } from '@/api/teamsApi'
import {
  createFriendly,
  listFriendlies,
  respondFriendly,
  approveFriendlyResult,
} from '@/api/friendliesApi'
const teams = ref([])
const opponents = ref([])
const friendlies = ref([])
const search = ref('')
const error = ref('')
const notice = ref('')
const form = reactive({
  from_team: '',
  to_team: '',
  starts_at: '',
  ends_at: '',
  location: '',
  message: '',
})
async function load() {
  try {
    const [a, b] = await Promise.all([listFriendlies(), listTeams()])
    friendlies.value = a.results ?? a
    teams.value = b.results ?? b
  } catch (err) {
    error.value = err.message
  }
}
async function discover() {
  error.value = ''
  try {
    const result = await api(`/equipes/descobrir/?search=${encodeURIComponent(search.value)}`)
    opponents.value = result.results ?? result
  } catch (err) {
    error.value = err.message
  }
}
async function create() {
  error.value = ''
  notice.value = ''
  try {
    await createFriendly({
      ...form,
      from_team: Number(form.from_team),
      to_team: Number(form.to_team),
      starts_at: new Date(form.starts_at).toISOString(),
      ends_at: new Date(form.ends_at).toISOString(),
    })
    notice.value = 'Convite enviado.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
async function respond(id, accept) {
  error.value = ''
  try {
    await respondFriendly(id, accept)
    await load()
  } catch (err) {
    error.value = err.message
  }
}
async function approve(id) {
  error.value = ''
  try {
    await approveFriendlyResult(id)
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Amistosos entre equipes</h1>
    <p>Convide outra equipe cadastrada, sem expor seu elenco privado.</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <section class="card">
      <h2>Convidar equipe</h2>
      <form class="form" @submit.prevent="create">
        <label class="field"
          >Minha equipe
          <select v-model="form.from_team" required>
            <option value="" disabled>Selecione</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">{{ team.name }}</option>
          </select>
        </label>
        <label class="field"
          >Pesquisar adversário
          <input v-model="search" placeholder="Nome da equipe" minlength="2" />
        </label>
        <button type="button" class="button button-secondary" @click="discover">
          Buscar equipes
        </button>
        <label class="field"
          >Equipe adversária
          <select v-model="form.to_team" required>
            <option value="" disabled>Selecione</option>
            <option v-for="team in opponents" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </label>
        <label class="field"
          >Início <input v-model="form.starts_at" type="datetime-local" required
        /></label>
        <label class="field"
          >Fim <input v-model="form.ends_at" type="datetime-local" required
        /></label>
        <label class="field">Local <input v-model="form.location" /></label>
        <label class="field">Mensagem <input v-model="form.message" /></label>
        <button type="submit" class="button">Enviar convite</button>
      </form>
    </section>
    <h2>Convites e partidas</h2>
    <article v-for="item in friendlies" :key="item.id" class="card">
      <h3>{{ item.from_name }} × {{ item.to_name }}</h3>
      <p>{{ new Date(item.starts_at).toLocaleString('pt-BR') }} · {{ item.status }}</p>
      <div class="actions">
        <button v-if="item.status === 'pending'" class="button" @click="respond(item.id, true)">
          Aceitar (administradores)
        </button>
        <button
          v-if="item.status === 'pending'"
          class="button button-secondary"
          @click="respond(item.id, false)"
        >
          Recusar
        </button>
        <RouterLink
          v-if="item.match"
          class="button button-secondary"
          :to="`/partidas/${item.match}`"
          >Ver partida</RouterLink
        >
        <button v-if="item.match" class="button" @click="approve(item.id)">
          Aprovar resultado
        </button>
      </div>
    </article>
  </section>
</template>
