<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  getTeam,
  getMembers,
  getPlayers,
  createPlayer,
  findUsers,
  inviteUser,
} from '@/api/teamsApi'

const route = useRoute()
const auth = useAuthStore()
const team = ref(null)
const members = ref([])
const players = ref([])
const error = ref('')
const notice = ref('')
const playerName = ref('')
const shirtNumber = ref('')
const search = ref('')
const foundUsers = ref([])
const role = computed(() => members.value.find((m) => m.user === auth.user?.id)?.role)
const isAdmin = computed(() => role.value === 'owner' || role.value === 'admin')
async function load() {
  error.value = ''
  try {
    const id = route.params.id
    const [t, m, p] = await Promise.all([getTeam(id), getMembers(id), getPlayers(id)])
    team.value = t
    members.value = m
    players.value = p
  } catch (err) {
    error.value = err.message
  }
}
async function addPlayer() {
  error.value = ''
  notice.value = ''
  try {
    await createPlayer(route.params.id, {
      name: playerName.value,
      shirt_number: shirtNumber.value ? Number(shirtNumber.value) : null,
    })
    playerName.value = ''
    shirtNumber.value = ''
    notice.value = 'Jogador cadastrado.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
async function searchUsers() {
  error.value = ''
  if (search.value.trim().length < 2) return
  try {
    const result = await findUsers(search.value.trim())
    foundUsers.value = result.results ?? result
  } catch (err) {
    error.value = err.message
  }
}
async function invite(userId) {
  error.value = ''
  notice.value = ''
  try {
    await inviteUser(route.params.id, userId)
    notice.value = 'Convite enviado.'
    foundUsers.value = []
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <template v-if="team">
      <h1>{{ team.name }}</h1>
      <p>{{ team.description }}</p>
      <div class="grid">
        <section class="card">
          <h2>Elenco</h2>
          <div v-for="player in players" :key="player.id" class="list-row">
            <span>{{ player.shirt_number ?? '—' }} · {{ player.name }}</span>
            <span class="muted">{{ player.position }}</span>
          </div>
          <form v-if="isAdmin" class="form" @submit.prevent="addPlayer">
            <h3>Adicionar jogador</h3>
            <label class="field"
              >Nome <input v-model="playerName" maxlength="120" required
            /></label>
            <label class="field"
              >Número <input v-model="shirtNumber" type="number" min="0" max="65535"
            /></label>
            <button class="button" type="submit">Cadastrar jogador</button>
          </form>
        </section>
        <section class="card">
          <h2>Membros</h2>
          <div v-for="member in members" :key="member.id" class="list-row">
            <span>{{ member.name || member.username }}</span>
            <span>{{ member.role }}</span>
          </div>
          <div v-if="isAdmin" class="form">
            <h3>Convidar pessoa</h3>
            <label class="field">Nome ou username <input v-model="search" minlength="2" /></label>
            <button class="button button-secondary" type="button" @click="searchUsers">
              Pesquisar
            </button>
            <div v-for="user in foundUsers" :key="user.id" class="list-row">
              <span>{{ user.name }} (@{{ user.username }})</span>
              <button class="button" type="button" @click="invite(user.id)">Convidar</button>
            </div>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>
