<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/config'
import {
  getCompetition, getCompetitionTeams, getCompetitionFixtures, getStandings,
  inviteTeamCompetition, generateBracket, advanceBracket, addCompetitionFixture,
} from '@/api/competitionsApi'

const route = useRoute()
const id = route.params.id
const competition = ref(null)
const teams = ref([])
const fixtures = ref([])
const ranking = ref([])
const found = ref([])
const search = ref('')
const notice = ref('')
const error = ref('')
const form = reactive({ home_team: '', away_team: '', starts_at: '', ends_at: '', round: 1 })
const dates = reactive({ starts_at: '', ends_at: '' })
const iso = (v) => new Date(v).toISOString()
async function load() {
  try {
    const [c, t, f, r] = await Promise.all([
      getCompetition(id), getCompetitionTeams(id), getCompetitionFixtures(id), getStandings(id),
    ])
    competition.value = c
    teams.value = t
    fixtures.value = f
    ranking.value = r
  } catch (err) { error.value = err.message }
}
async function discover() {
  error.value = ''
  try {
    const response = await api(`/equipes/descobrir/?search=${encodeURIComponent(search.value)}`)
    found.value = response.results ?? response
  } catch (err) { error.value = err.message }
}
async function invite(team) {
  error.value = ''
  try { await inviteTeamCompetition(id, team); notice.value = 'Convite enviado.' }
  catch (err) { error.value = err.message }
}
async function addFixture() {
  error.value = ''
  try {
    await addCompetitionFixture(id, {
      ...form, home_team: Number(form.home_team), away_team: Number(form.away_team),
      starts_at: iso(form.starts_at), ends_at: iso(form.ends_at),
    })
    await load()
  } catch (err) { error.value = err.message }
}
async function bracket(advance) {
  error.value = ''
  try {
    const payload = { starts_at: iso(dates.starts_at), ends_at: iso(dates.ends_at) }
    const result = await (advance ? advanceBracket(id, payload) : generateBracket(id, payload))
    notice.value = result.completed ? `Campeão: equipe #${result.champion}` : 'Rodada criada.'
    await load()
  } catch (err) { error.value = err.message }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>{{ competition?.name || 'Competição' }}</h1>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <template v-if="competition">
      <p>{{ competition.description }}</p>
      <section class="card">
        <h2>Equipes confirmadas</h2>
        <p v-for="team in teams" :key="team.team_id">{{ team.team__name }}</p>
        <h3>Convidar outra equipe</h3>
        <label class="field">Pesquisar equipe <input v-model="search" minlength="2" /></label>
        <button class="button button-secondary" @click="discover">Pesquisar</button>
        <div v-for="team in found" :key="team.id" class="list-row">
          {{ team.name }} <button class="button" @click="invite(team.id)">Convidar</button>
        </div>
      </section>
      <section class="card">
        <h2>Classificação</h2>
        <div v-for="(team, index) in ranking" :key="team.team" class="list-row">
          <span>{{ index + 1 }}º {{ team.name }}</span>
          <span>{{ team.points }} pontos · {{ team.played }} jogos · SG {{ team.goal_difference }}</span>
        </div>
      </section>
      <section v-if="competition.format === 'knockout'" class="card">
        <h2>Mata-mata</h2>
        <label class="field">Início da rodada <input v-model="dates.starts_at" type="datetime-local" /></label>
        <label class="field">Término <input v-model="dates.ends_at" type="datetime-local" /></label>
        <div class="actions">
          <button class="button" @click="bracket(false)">Gerar chave</button>
          <button class="button button-secondary" @click="bracket(true)">Avançar vencedores</button>
        </div>
      </section>
      <section v-else class="card">
        <h2>Novo confronto</h2>
        <form class="form" @submit.prevent="addFixture">
          <label class="field">Casa
            <select v-model="form.home_team" required>
              <option value="" disabled>Selecione</option>
              <option v-for="team in teams" :key="team.team_id" :value="team.team_id">{{ team.team__name }}</option>
            </select>
          </label>
          <label class="field">Visitante
            <select v-model="form.away_team" required>
              <option value="" disabled>Selecione</option>
              <option v-for="team in teams" :key="team.team_id" :value="team.team_id">{{ team.team__name }}</option>
            </select>
          </label>
          <label class="field">Início <input v-model="form.starts_at" type="datetime-local" required /></label>
          <label class="field">Fim <input v-model="form.ends_at" type="datetime-local" required /></label>
          <button class="button" type="submit">Criar confronto</button>
        </form>
      </section>
      <h2>Confrontos</h2>
      <div v-for="fixture in fixtures" :key="fixture.id" class="card">
        <h3>Rodada {{ fixture.round }} · {{ fixture.home_team }} × {{ fixture.away_team }}</h3>
        <RouterLink class="button button-secondary" :to="`/partidas/${fixture.match}`">Abrir partida e resultado</RouterLink>
      </div>
    </template>
  </section>
</template>
