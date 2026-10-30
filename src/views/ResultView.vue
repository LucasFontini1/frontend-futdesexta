<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getMatch } from '@/api/matchesApi'
import { getSides, getLineup, getResult, saveResult, getOptionalMetrics, saveOptionalMetric } from '@/api/footballApi'
const id = useRoute().params.id
const match = ref(null)
const sides = ref([])
const slots = ref([])
const error = ref('')
const notice = ref('')
const form = reactive({ home_side: '', away_side: '', home_score: 0, away_score: 0, goals: [] })
const metrics = ref([])
const metricForm = reactive({ player: '', yellow_cards: '', red_cards: '', fouls: '', saves: '' })
async function loadMetrics() {
  metrics.value = await getOptionalMetrics(id)
}
async function submitMetric() {
  error.value = ''
  notice.value = ''
  const values = { player: Number(metricForm.player) }
  for (const field of ['yellow_cards', 'red_cards', 'fouls', 'saves']) {
    if (metricForm[field] !== '') values[field] = Number(metricForm[field])
  }
  if (Object.keys(values).length === 1) {
    error.value = 'Informe pelo menos uma estatística opcional.'
    return
  }
  try {
    await saveOptionalMetric(id, values)
    notice.value = 'Estatística opcional registrada.'
    await loadMetrics()
  } catch (err) {
    error.value = err.message
  }
}
async function load() {
  try {
    const [m, ss, ls] = await Promise.all([getMatch(id), getSides(id), getLineup(id)])
    match.value = m
    sides.value = ss
    slots.value = ls
    await loadMetrics()
    if (ss.length === 2) {
      form.home_side = ss[0].id
      form.away_side = ss[1].id
    }
    try {
      Object.assign(form, await getResult(id))
    } catch {
      /* resultado não informado */
    }
  } catch (err) {
    error.value = err.message
  }
}
function addGoal() {
  form.goals.push({
    scoring_side: Number(form.home_side),
    scorer: null,
    conceded_by: null,
    own_goal: false,
  })
}
async function submit() {
  error.value = ''
  notice.value = ''
  try {
    await saveResult(id, {
      home_side: Number(form.home_side),
      away_side: Number(form.away_side),
      home_score: Number(form.home_score),
      away_score: Number(form.away_score),
      goals: form.goals.map((goal) => ({
        scoring_side: Number(goal.scoring_side),
        scorer: goal.scorer || null,
        conceded_by: goal.conceded_by || null,
        own_goal: Boolean(goal.own_goal),
      })),
    })
    notice.value =
      match.value.kind === 'friendly'
        ? 'Placar salvo. É necessária aprovação das duas equipes.'
        : 'Resultado registrado.'
    await load()
  } catch (err) {
    error.value = err.message
  }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <h1>Resultado da partida</h1>
    <p>{{ match?.title }}</p>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <form class="form card" @submit.prevent="submit">
      <label class="field"
        >Mandante
        <select v-model="form.home_side" required>
          <option v-for="side in sides" :key="side.id" :value="side.id">{{ side.name }}</option>
        </select>
      </label>
      <label class="field"
        >Gols <input v-model.number="form.home_score" type="number" min="0" required
      /></label>
      <label class="field"
        >Visitante
        <select v-model="form.away_side" required>
          <option v-for="side in sides" :key="side.id" :value="side.id">{{ side.name }}</option>
        </select>
      </label>
      <label class="field"
        >Gols <input v-model.number="form.away_score" type="number" min="0" required
      /></label>
      <h2>Gols identificados</h2>
      <p>Opcional: se não houver autor identificado, o placar ainda é registrado.</p>
      <div v-for="(goal, i) in form.goals" :key="i" class="card">
        <label class="field"
          >Lado que marcou
          <select v-model="goal.scoring_side">
            <option v-for="side in sides" :key="side.id" :value="side.id">{{ side.name }}</option>
          </select>
        </label>
        <label class="field"
          >Autor
          <select v-model="goal.scorer">
            <option :value="null">Não identificado</option>
            <option v-for="slot in slots" :key="slot.player" :value="slot.player">
              Jogador #{{ slot.player }}
            </option>
          </select>
        </label>
        <label class="field"
          >Goleiro que sofreu
          <select v-model="goal.conceded_by">
            <option :value="null">Não identificado</option>
            <option
              v-for="slot in slots.filter((s) => s.goalkeeper)"
              :key="slot.player"
              :value="slot.player"
            >
              Goleiro #{{ slot.player }}
            </option>
          </select>
        </label>
        <label><input v-model="goal.own_goal" type="checkbox" /> Gol contra</label>
        <button type="button" class="button button-secondary" @click="form.goals.splice(i, 1)">
          Retirar gol
        </button>
      </div>
      <button type="button" class="button button-secondary" @click="addGoal">Adicionar gol</button>
      <button class="button" type="submit" :disabled="sides.length !== 2">
        Salvar resultado oficial
      </button>
    </form>
    <section class="card">
      <h2>Estatísticas opcionais</h2>
      <p class="muted">Registre somente o que foi observado. Campo vazio significa não informado, não zero.</p>
      <div v-for="row in metrics" :key="row.player" class="list-row">
        <span>Jogador #{{ row.player }}</span>
        <span>
          Amarelos: {{ row.yellow_cards ?? '—' }} · Vermelhos: {{ row.red_cards ?? '—' }} ·
          Faltas: {{ row.fouls ?? '—' }} · Defesas: {{ row.saves ?? '—' }}
        </span>
      </div>
      <form class="form" @submit.prevent="submitMetric">
        <label class="field">Jogador escalado
          <select v-model="metricForm.player" required>
            <option value="" disabled>Selecione um jogador</option>
            <option v-for="slot in slots.filter((s) => !s.reserve)" :key="slot.player" :value="slot.player">
              Jogador #{{ slot.player }}
            </option>
          </select>
        </label>
        <label class="field">Cartões amarelos <input v-model="metricForm.yellow_cards" type="number" min="0" /></label>
        <label class="field">Cartões vermelhos <input v-model="metricForm.red_cards" type="number" min="0" /></label>
        <label class="field">Faltas <input v-model="metricForm.fouls" type="number" min="0" /></label>
        <label class="field">Defesas <input v-model="metricForm.saves" type="number" min="0" /></label>
        <button type="submit" class="button">Salvar estatísticas opcionais</button>
      </form>
    </section>
  </section>
</template>
