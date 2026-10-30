<script setup>
import { computed, ref, watch } from 'vue'
import { api } from '@/api/config'
const today = new Date()
const month = ref(today.toISOString().slice(0, 7))
const view = ref('list')
const events = ref([])
const loading = ref(false)
const error = ref('')
function localDate(value) { return new Date(value).toLocaleString('pt-BR') }
const days = computed(() => {
  const [year, m] = month.value.split('-').map(Number)
  const count = new Date(year, m, 0).getDate()
  return Array.from({ length: count }, (_, i) => i + 1)
})
function inDay(day) {
  const [year, m] = month.value.split('-').map(Number)
  return events.value.filter((item) => {
    const d = new Date(item.start)
    return d.getFullYear() === year && d.getMonth() + 1 === m && d.getDate() === day
  })
}
const byWeek = computed(() => {
  const weeks = []
  for (let i = 0; i < days.value.length; i += 7) {
    weeks.push(days.value.slice(i, i + 7))
  }
  return weeks
})
async function load() {
  loading.value = true; error.value = ''
  const [year, m] = month.value.split('-').map(Number)
  const last = String(new Date(year, m, 0).getDate()).padStart(2, '0')
  try { events.value = await api(`/calendario/?start=${month.value}-01&end=${month.value}-${last}`) }
  catch (err) { error.value = err.message }
  finally { loading.value = false }
}
watch(month, load, { immediate: true })
</script>

<template>
  <section class="container page">
    <h1>Calendário</h1>
    <div class="actions">
      <label class="field">Mês <input v-model="month" type="month" /></label>
      <label class="field">Visualização
        <select v-model="view">
          <option value="list">Lista</option>
          <option value="month">Mensal</option>
          <option value="week">Semanas do mês</option>
        </select>
      </label>
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="loading">Carregando agenda…</p>
    <div v-if="view === 'list'">
      <article v-for="event in events" :key="`${event.type}:${event.id}`" class="card">
        <h2>{{ event.title }}</h2>
        <p>{{ localDate(event.start) }} · {{ event.location }}</p>
        <p class="muted">{{ event.type }} · {{ event.status }}</p>
        <RouterLink class="button button-secondary" :to="event.link">Ver detalhes</RouterLink>
      </article>
    </div>
    <div v-else class="grid">
      <div v-for="(week, index) in (view === 'week' ? byWeek : [days])" :key="index" class="card">
        <div class="grid">
          <section v-for="day in week" :key="day">
            <h3>{{ day }}</h3>
            <RouterLink v-for="event in inDay(day)" :key="`${event.type}:${event.id}`" :to="event.link">
              {{ event.title }}
            </RouterLink>
          </section>
        </div>
      </div>
    </div>
    <p v-if="!loading && !events.length && !error">Nada programado para o período.</p>
  </section>
</template>
