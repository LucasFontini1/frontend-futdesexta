<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { listTeams } from '@/api/teamsApi'
import { listMatches } from '@/api/matchesApi'

const auth = useAuthStore()
const loading = ref(true)
const error = ref('')
const teams = ref([])
const matches = ref([])
const upcoming = computed(() =>
  matches.value
    .filter((match) => new Date(match.starts_at).getTime() >= Date.now() && match.status !== 'canceled')
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
    .slice(0, 4),
)
const nextMatch = computed(() => upcoming.value[0] || null)

onMounted(async () => {
  try {
    const [teamResponse, matchResponse] = await Promise.all([listTeams(), listMatches()])
    teams.value = teamResponse.results ?? teamResponse
    matches.value = matchResponse.results ?? matchResponse
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <section class="dashboard container page">
    <header class="dashboard-heading">
      <div>
        <p class="dashboard-kicker">SEU ESPAÇO NO FUTEBOL</p>
        <h1>Olá, {{ auth.user?.name || 'jogador' }}! <span aria-hidden="true">⚽</span></h1>
        <p class="muted">Acompanhe suas equipes, peladas e próximos encontros.</p>
      </div>
      <RouterLink class="button" to="/partidas">Ver peladas</RouterLink>
    </header>

    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <p v-if="loading" role="status">Carregando seu espaço...</p>
    <template v-else>
      <div class="dashboard-stats">
        <RouterLink to="/equipes" class="dashboard-stat">
          <span class="stat-icon" aria-hidden="true">♟</span>
          <span class="stat-value">{{ teams.length }}</span>
          <span class="stat-label">Minhas equipes nesta página</span>
        </RouterLink>
        <RouterLink to="/partidas" class="dashboard-stat">
          <span class="stat-icon" aria-hidden="true">⚽</span>
          <span class="stat-value">{{ matches.length }}</span>
          <span class="stat-label">Partidas carregadas</span>
        </RouterLink>
        <RouterLink to="/agenda" class="dashboard-stat">
          <span class="stat-icon" aria-hidden="true">▦</span>
          <span class="stat-value">{{ upcoming.length }}</span>
          <span class="stat-label">Próximos jogos nesta página</span>
        </RouterLink>
      </div>
      <div class="dashboard-columns">
        <section class="dashboard-panel">
          <div class="panel-heading">
            <h2>Próximas peladas</h2>
            <RouterLink to="/agenda">Ver agenda</RouterLink>
          </div>
          <div v-if="upcoming.length" class="fixture-list">
            <RouterLink v-for="match in upcoming" :key="match.id" class="fixture-item" :to="`/partidas/${match.id}`">
              <span class="fixture-date">
                <strong>{{ new Date(match.starts_at).toLocaleDateString('pt-BR', { day: '2-digit' }) }}</strong>
                <small>{{ new Date(match.starts_at).toLocaleDateString('pt-BR', { month: 'short' }) }}</small>
              </span>
              <span class="fixture-details"><strong>{{ match.title }}</strong>
                <small>{{ new Date(match.starts_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) }} · {{ match.location || 'Local a definir' }}</small>
              </span>
              <span class="fixture-arrow" aria-hidden="true">›</span>
            </RouterLink>
          </div>
          <div v-else class="empty-area">
            <span aria-hidden="true">⚽</span>
            <p>Nenhuma próxima pelada encontrada.</p>
            <RouterLink class="button" to="/partidas">Agendar pelada</RouterLink>
          </div>
        </section>
        <section class="dashboard-panel">
          <div class="panel-heading"><h2>Minhas equipes</h2><RouterLink to="/equipes">Gerenciar</RouterLink></div>
          <RouterLink v-for="team in teams.slice(0, 5)" :key="team.id" class="team-line" :to="`/equipes/${team.id}`">
            <img v-if="team.emblem" :src="team.emblem" alt="" class="team-avatar" />
            <span v-else class="team-avatar" aria-hidden="true">⚽</span>
            <span><strong>{{ team.name }}</strong><small>{{ team.member_count }} membros</small></span>
          </RouterLink>
          <div v-if="!teams.length" class="empty-area">
            <p>Você ainda não participa de equipes.</p>
            <RouterLink class="button" to="/equipes">Criar equipe</RouterLink>
          </div>
          <div class="panel-actions">
            <RouterLink to="/convites">Convites</RouterLink>
            <RouterLink to="/amistosos">Amistosos</RouterLink>
            <RouterLink to="/competicoes">Competições</RouterLink>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<style scoped>
.dashboard{max-width:1260px}.dashboard-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:30px;flex-wrap:wrap}.dashboard-heading h1{font-size:clamp(26px,3.4vw,38px);font-weight:800;letter-spacing:-1px}.dashboard-kicker{font-size:11px;letter-spacing:1.3px;font-weight:800;color:#168847}.dashboard-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:24px 0}.dashboard-stat{padding:23px;border:1px solid #cbe2d2;border-radius:16px;background:var(--card-bg,#fff);display:flex;flex-direction:column;gap:8px}.stat-icon{font-size:24px;color:#1db95e}.stat-value{font-size:36px;font-weight:800}.stat-label{font-size:12px;color:#667b6b}.dashboard-columns{display:grid;grid-template-columns:1.4fr 1fr;gap:18px}.dashboard-panel{border:1px solid #cbe2d2;border-radius:16px;padding:24px;background:var(--card-bg,#fff)}.panel-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.panel-heading h2{font-weight:800;font-size:19px}.panel-heading a{font-size:12px;color:#168847;font-weight:700}.fixture-item,.team-line{display:flex;align-items:center;gap:13px;padding:14px 3px;border-bottom:1px solid #e3eee6}.fixture-date{min-width:52px;display:flex;flex-direction:column;align-items:center;background:#e4f8e9;border-radius:10px;padding:9px;color:#126b35}.fixture-date strong{font-size:23px}.fixture-date small,.fixture-details small,.team-line small{display:block;font-size:11px;color:#657d6c}.fixture-details{flex:1}.fixture-details strong,.team-line strong{font-size:13px}.fixture-arrow{font-size:28px}.team-avatar{width:42px;height:42px;border-radius:12px;background:#e1f8e8;display:grid;place-items:center;object-fit:cover}.empty-area{padding:24px 8px;text-align:center;display:grid;justify-items:center;gap:12px}.empty-area span{font-size:32px}.panel-actions{display:flex;gap:12px;flex-wrap:wrap;padding-top:20px}.panel-actions a{font-size:12px;color:#168847;font-weight:700}
:root[data-theme="dark"] .dashboard-stat,:root[data-theme="dark"] .dashboard-panel{--card-bg:#11241a;border-color:#34533c}:root[data-theme="dark"] .fixture-item,:root[data-theme="dark"] .team-line{border-color:#294032}:root[data-theme="dark"] .fixture-date,:root[data-theme="dark"] .team-avatar{background:#1b482b;color:#a5f4bd}
@media(max-width:900px){.dashboard-columns{grid-template-columns:1fr}}@media(max-width:550px){.dashboard-stats{grid-template-columns:1fr}.dashboard-panel{padding:16px}}
</style>
