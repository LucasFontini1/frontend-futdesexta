<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getTeam, getPlayers } from '@/api/teamsApi'
import { getRanking } from '@/api/footballApi'

const route = useRoute()
const team = ref(null)
const player = ref(null)
const statistics = ref({})
const loading = ref(true)
const error = ref('')
const categories = [
  { id: 'geral', label: 'Total geral' },
  { id: 'pelada', label: 'Peladas' },
  { id: 'friendly', label: 'Amistosos' },
  { id: 'competition', label: 'Competições' },
]
const current = ref('geral')
const row = computed(() => statistics.value[current.value] || null)

onMounted(async () => {
  try {
    const teamId = route.params.teamId
    const [t, players, ...rankings] = await Promise.all([
      getTeam(teamId),
      getPlayers(teamId),
      ...categories.map((category) => getRanking(category.id, teamId)),
    ])
    team.value = t
    player.value = players.find((item) => Number(item.id) === Number(route.params.playerId)) || null
    if (!player.value) throw new Error('Jogador não encontrado nesta equipe.')
    for (const [index, category] of categories.entries()) {
      statistics.value[category.id] = rankings[index].ranking.find((entry) => entry.player === player.value.id) || null
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="container page player-page">
    <RouterLink :to="`/equipes/${route.params.teamId}`" class="muted">Voltar para a equipe</RouterLink>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="loading" role="status">Carregando jogador...</p>
    <template v-else-if="player">
      <header class="player-header card">
        <img v-if="player.photo" :src="player.photo" :alt="`Foto de ${player.name}`" class="player-picture" />
        <div v-else class="player-picture placeholder" aria-hidden="true">⚽</div>
        <div>
          <span class="eyebrow">{{ team?.name }}</span>
          <h1>{{ player.name }}</h1>
          <p class="muted">{{ player.position || 'Posição não definida' }} · Camisa {{ player.shirt_number ?? '—' }}</p>
        </div>
      </header>
      <section class="card">
        <h2>Estatísticas</h2>
        <div class="category-nav" aria-label="Modalidade da estatística">
          <button v-for="category in categories" :key="category.id" type="button" :aria-pressed="current === category.id" :class="{ active: current === category.id }" @click="current = category.id">{{ category.label }}</button>
        </div>
        <div v-if="row" class="player-stats">
          <div><strong>{{ row.games }}</strong><small>Jogos</small></div>
          <div><strong>{{ row.goals }}</strong><small>Gols</small></div>
          <div><strong>{{ row.wins }}</strong><small>Vitórias</small></div>
          <div><strong>{{ row.draws }}</strong><small>Empates</small></div>
          <div><strong>{{ row.losses }}</strong><small>Derrotas</small></div>
          <div><strong>{{ row.saves ?? '—' }}</strong><small>Defesas</small></div>
          <div><strong>{{ row.yellow_cards ?? '—' }}</strong><small>Amarelos</small></div>
          <div><strong>{{ row.red_cards ?? '—' }}</strong><small>Vermelhos</small></div>
        </div>
        <p v-else class="muted">Sem resultados registrados nesta modalidade.</p>
      </section>
    </template>
  </section>
</template>

<style scoped>
.player-page{max-width:1000px}.player-header{display:flex;align-items:center;gap:24px;margin:22px 0}
.player-picture{width:104px;height:104px;border-radius:20px;object-fit:cover;flex-shrink:0}
.placeholder{display:grid;place-items:center;background:#dff8e7;font-size:45px}
.player-header h1{font-size:32px;letter-spacing:-1px;font-weight:800}
.eyebrow{font-size:11px;font-weight:800;letter-spacing:1px;color:#16a052;text-transform:uppercase}
.category-nav{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0}
.category-nav button{padding:9px 12px;border:1px solid #b8d8c1;background:transparent;color:inherit;border-radius:10px}
.category-nav button.active{border-color:#239c4d;background:#dcf6e4;color:#136a32}
.player-stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.player-stats div{padding:16px;border-radius:12px;border:1px solid #d2e6d8;display:flex;flex-direction:column;gap:7px}
.player-stats strong{font-size:29px;font-weight:800}.player-stats small{font-size:11px;color:#69806f}
:root[data-theme="dark"] .category-nav button.active{background:#204e2d;color:#d3ffdf}
@media(max-width:650px){.player-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.player-header{gap:12px}.player-picture{width:72px;height:72px}.player-header h1{font-size:24px}}
</style>
