<script setup>
import { onMounted, ref, watch } from 'vue'
import { listMatchHistory } from '@/api/matchesApi'

const matches = ref([])
const kind = ref('')
const page = ref(1)
const count = ref(0)
const hasNext = ref(false)
const loading = ref(false)
const error = ref('')
const categories = [
  { value: '', label: 'Todas as modalidades' },
  { value: 'pelada', label: 'Peladas' },
  { value: 'friendly', label: 'Amistosos' },
  { value: 'competition', label: 'Competições' },
]
async function load() {
  error.value = ''
  loading.value = true
  try {
    const data = await listMatchHistory(page.value, kind.value)
    matches.value = data.results ?? data
    count.value = data.count ?? matches.value.length
    hasNext.value = Boolean(data.next)
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
watch(kind, () => {
  page.value = 1
  load()
})
onMounted(load)
function next() {
  if (!hasNext.value) return
  page.value++
  load()
}
function previous() {
  if (page.value === 1) return
  page.value--
  load()
}
</script>

<template>
  <section class="container page history-page">
    <header class="history-heading">
      <div>
        <h1>Histórico de partidas</h1>
        <p class="muted">Consulte os jogos realizados, separados pela modalidade.</p>
      </div>
      <RouterLink class="button button-secondary" to="/estatisticas">Ver rankings</RouterLink>
    </header>
    <label class="history-filter"
      >Modalidade
      <select v-model="kind">
        <option v-for="item in categories" :key="item.value" :value="item.value">
          {{ item.label }}
        </option>
      </select>
    </label>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="loading" role="status" class="muted">Carregando histórico...</p>
    <div v-else class="history-list">
      <RouterLink
        v-for="match in matches"
        :key="match.id"
        :to="`/partidas/${match.id}`"
        class="history-card card"
      >
        <div class="history-date">
          <strong>{{
            new Date(match.starts_at).toLocaleDateString('pt-BR', { day: '2-digit' })
          }}</strong>
          <small>{{
            new Date(match.starts_at).toLocaleDateString('pt-BR', {
              month: 'short',
              year: 'numeric',
            })
          }}</small>
        </div>
        <div class="history-details">
          <h2>{{ match.title }}</h2>
          <p class="muted">{{ match.location || 'Local não informado' }}</p>
        </div>
        <span class="history-kind">{{
          match.kind === 'pelada' ? 'Pelada' : match.kind === 'friendly' ? 'Amistoso' : 'Competição'
        }}</span>
        <span aria-hidden="true">›</span>
      </RouterLink>
      <p v-if="!matches.length" class="muted">Nenhuma partida concluída nesta modalidade.</p>
    </div>
    <nav class="history-pagination" aria-label="Paginação de histórico">
      <button type="button" :disabled="page <= 1 || loading" @click="previous">Anterior</button>
      <span>Página {{ page }} · {{ count }} partidas</span>
      <button type="button" :disabled="!hasNext || loading" @click="next">Próxima</button>
    </nav>
  </section>
</template>

<style scoped>
.history-page {
  max-width: 1150px;
}
.history-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}
.history-heading h1 {
  font-size: 30px;
  font-weight: 800;
}
.history-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
}
.history-filter select {
  padding: 10px;
  border-radius: 10px;
  background: transparent;
  border: 1px solid #bad8c2;
  color: inherit;
}
.history-list {
  display: grid;
  gap: 11px;
}
.history-card {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 14px 18px;
}
.history-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 65px;
  padding: 9px;
  background: #e2f8e8;
  border-radius: 10px;
  color: #17763d;
}
.history-date strong {
  font-size: 25px;
}
.history-date small {
  font-size: 10px;
}
.history-details {
  flex: 1;
}
.history-details h2 {
  font-size: 16px;
  font-weight: 750;
}
.history-details p {
  font-size: 12px;
}
.history-kind {
  border-radius: 30px;
  background: #e5f8eb;
  color: #1b7a40;
  padding: 7px 11px;
  font-size: 11px;
  font-weight: 700;
}
.history-pagination {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  font-size: 12px;
}
.history-pagination button {
  padding: 9px 13px;
  border-radius: 8px;
  background: #e3f6e9;
  color: #146b36;
  font-weight: 700;
}
.history-pagination button:disabled {
  opacity: 0.5;
}
:root[data-theme='dark'] .history-date,
:root[data-theme='dark'] .history-kind {
  background: #204a2a;
  color: #d1ffdf;
}
@media (max-width: 580px) {
  .history-kind {
    display: none;
  }
  .history-card {
    gap: 10px;
  }
  .history-heading h1 {
    font-size: 25px;
  }
}
</style>
