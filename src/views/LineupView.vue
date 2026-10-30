<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMatch } from '@/api/matchesApi'
import { getPlayers } from '@/api/teamsApi'
import { getSides, addSide, getLineup, saveLineup } from '@/api/footballApi'
import '@/assets/css/football.css'

const id = useRoute().params.id
const match = ref(null)
const sides = ref([])
const players = ref([])
const slots = ref([])
const error = ref('')
const notice = ref('')
const sideName = ref('')
const form = reactive({
  side: '',
  player: '',
  x: 50,
  y: 50,
  position: '',
  goalkeeper: false,
  reserve: false,
})
async function load() {
  try {
    const [m, s, l] = await Promise.all([getMatch(id), getSides(id), getLineup(id)])
    match.value = m
    sides.value = s
    slots.value = l
    const roster = await getPlayers(m.team)
    players.value = roster
  } catch (err) {
    error.value = err.message
  }
}
async function createSide() {
  try {
    await addSide(id, { name: sideName.value, order: sides.value.length + 1, color: '#22c55e' })
    sideName.value = ''
    await load()
  } catch (err) {
    error.value = err.message
  }
}
function addPlayer() {
  if (!form.player || !form.side) return
  const player = Number(form.player)
  slots.value = [
    ...slots.value.filter((item) => item.player !== player),
    {
      side: Number(form.side),
      player,
      x: Number(form.x),
      y: Number(form.y),
      position: form.position,
      goalkeeper: form.goalkeeper,
      reserve: form.reserve,
    },
  ]
  form.player = ''
}
function label(id) {
  return players.value.find((person) => person.id === id)?.name || `#${id}`
}
async function save() {
  error.value = ''
  try {
    await saveLineup(id, slots.value)
    notice.value = 'Escalação salva.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Escalação manual</h1>
    <p>{{ match?.title }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <section class="card">
      <h2>Lados da partida</h2>
      <p v-for="side in sides" :key="side.id">{{ side.name }}</p>
      <form
        v-if="sides.length < 2 && match?.kind === 'pelada'"
        class="form"
        @submit.prevent="createSide"
      >
        <label class="field">Nome do lado <input v-model="sideName" required /></label>
        <button class="button" type="submit">Criar lado</button>
      </form>
    </section>
    <section class="card">
      <h2>Posicionar jogador</h2>
      <form class="form" @submit.prevent="addPlayer">
        <label class="field"
          >Lado
          <select v-model="form.side" required>
            <option value="" disabled>Selecione</option>
            <option v-for="side in sides" :key="side.id" :value="side.id">{{ side.name }}</option>
          </select>
        </label>
        <label class="field"
          >Jogador
          <select v-model="form.player" required>
            <option value="" disabled>Selecione</option>
            <option v-for="player in players" :key="player.id" :value="player.id">
              {{ player.name }}
            </option>
          </select>
        </label>
        <label class="field">Posição <input v-model="form.position" /></label>
        <label class="field"
          >Horizontal: {{ form.x }}% <input v-model.number="form.x" type="range" min="0" max="100"
        /></label>
        <label class="field"
          >Vertical: {{ form.y }}% <input v-model.number="form.y" type="range" min="0" max="100"
        /></label>
        <label><input v-model="form.goalkeeper" type="checkbox" /> Goleiro</label>
        <label><input v-model="form.reserve" type="checkbox" /> Reserva</label>
        <button class="button button-secondary" type="submit">Posicionar</button>
      </form>
      <div class="football-field" aria-label="Campo visual">
        <div
          v-for="slot in slots.filter((s) => !s.reserve)"
          :key="slot.player"
          class="field-player"
          :style="{ left: slot.x + '%', top: slot.y + '%' }"
        >
          <span>{{ label(slot.player) }}</span>
          <small>{{ slot.goalkeeper ? 'GOL' : slot.position }}</small>
        </div>
      </div>
      <div v-for="slot in slots" :key="slot.player" class="list-row">
        <span>{{ label(slot.player) }} · {{ slot.reserve ? 'Reserva' : 'Em campo' }}</span>
        <button
          class="button button-secondary"
          @click="slots = slots.filter((s) => s.player !== slot.player)"
        >
          Retirar
        </button>
      </div>
      <button class="button" type="button" @click="save">Salvar escalação</button>
    </section>
  </section>
</template>
