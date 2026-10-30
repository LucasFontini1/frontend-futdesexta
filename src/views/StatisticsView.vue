<script setup>
import { ref, watch } from 'vue'
import { getRanking } from '@/api/footballApi'
const kind = ref('geral')
const ranking = ref([])
const error = ref('')
const loading = ref(false)
async function load() {
  loading.value = true
  error.value = ''
  try {
    const data = await getRanking(kind.value)
    ranking.value = data.ranking
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
watch(kind, load, { immediate: true })
</script>

<template>
  <section class="container page">
    <h1>Estatísticas e rankings</h1>
    <p>Resultados oficiais são contabilizados uma única vez por modalidade.</p>
    <label class="field"
      >Modalidade
      <select v-model="kind">
        <option value="geral">Total geral</option>
        <option value="pelada">Peladas</option>
        <option value="friendly">Amistosos</option>
        <option value="competition">Competições</option>
      </select>
    </label>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading">Carregando estatísticas…</p>
    <div v-for="row in ranking" :key="`${row.team}:${row.player}`" class="card">
      <h2>{{ row.name }}</h2>
      <p>{{ row.games }} jogos · {{ row.goals }} gols · {{ row.wins }} vitórias</p>
      <p class="muted">
        {{ row.draws }} empates · {{ row.losses }} derrotas ·
        {{ row.goals_conceded_identified }} gols sofridos identificados
      </p>
      <p class="muted">
        Amarelos: {{ row.yellow_cards ?? 'não informado' }} · Vermelhos:
        {{ row.red_cards ?? 'não informado' }} · Faltas: {{ row.fouls ?? 'não informado' }} ·
        Defesas: {{ row.saves ?? 'não informado' }}
      </p>
    </div>
    <p v-if="!ranking.length && !loading && !error" class="muted">
      Não há estatísticas oficiais para este filtro.
    </p>
  </section>
</template>
