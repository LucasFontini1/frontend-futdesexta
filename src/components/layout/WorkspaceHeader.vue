<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { listNotifications } from '@/api/notificationsApi'

defineProps({ theme: { type: String, required: true } })
const emit = defineEmits(['change-theme'])
const route = useRoute()
const titles = {
  dashboard: 'Início', teams: 'Equipes', team: 'Minha equipe',
  matches: 'Peladas', match: 'Detalhes da partida', calendar: 'Agenda',
  stats: 'Estatísticas', friendlies: 'Amistosos', competitions: 'Competições',
  competition: 'Competição', events: 'Eventos', notifications: 'Notificações',
  invites: 'Convites', profile: 'Meu perfil', lineup: 'Escalação',
  result: 'Resultado', recurrences: 'Recorrências',
}
const title = computed(() => titles[route.name] || 'Fut de Sexta')
const unread = ref(0)
let timer
async function loadUnread() {
  try {
    const result = await listNotifications()
    const items = result.results ?? result
    unread.value = items.filter((item) => !item.read_at).length
  } catch { unread.value = 0 }
}
onMounted(() => {
  loadUnread()
  timer = setInterval(loadUnread, 60000)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <header class="workspace-header">
    <div class="workspace-header-inner">
      <div class="workspace-identity">
        <img src="/icons/fut-dark-192.png" alt="" width="40" height="40" class="mobile-logo" />
        <div>
          <small>FUT DE SEXTA</small>
          <h2>{{ title }}</h2>
        </div>
      </div>
      <div class="workspace-tools">
        <label class="workspace-theme">
          <span class="sr-only">Tema do aplicativo</span>
          <select :value="theme" aria-label="Tema do aplicativo" @change="emit('change-theme', $event.target.value)">
            <option value="system">Sistema</option>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </label>
        <RouterLink to="/notificacoes" class="workspace-bell" aria-label="Abrir notificações">
          <span aria-hidden="true">♧</span>
          <span v-if="unread" class="workspace-count">{{ unread > 99 ? '99+' : unread }}</span>
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<style scoped>
.workspace-header{position:fixed;top:0;left:252px;right:0;z-index:900;height:75px;background:#fff;border-bottom:1px solid #dae8de;color:#1b3322}
.workspace-header-inner{height:100%;display:flex;align-items:center;justify-content:space-between;padding:0 34px;gap:14px}
.workspace-identity{display:flex;align-items:center;gap:9px}.workspace-identity small{display:none}.workspace-identity h2{font-weight:750;font-size:20px}
.mobile-logo{display:none}.workspace-tools{display:flex;align-items:center;gap:10px}
.workspace-theme select{border:1px solid #d3e5d7;background:#f7fbf8;color:inherit;padding:8px 10px;border-radius:10px;font-size:12px}
.workspace-bell{display:grid;place-items:center;position:relative;height:42px;width:42px;border-radius:11px;font-size:26px;color:#3e6549}
.workspace-bell:hover{background:#e9f8ed}.workspace-count{position:absolute;top:-3px;right:-4px;min-width:19px;height:19px;display:grid;place-items:center;border-radius:50px;background:#17ad4e;color:#fff;font-size:10px;font-weight:800;padding:0 4px}
.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
:root[data-theme="dark"] .workspace-header{background:#132418;border-color:#315039;color:#edfaef}
:root[data-theme="dark"] .workspace-theme select{background:#1a3221;border-color:#315039}
@media(max-width:700px){.workspace-header{left:0;height:63px;background:#0c1810;color:#fff;border-color:#2c5037}.workspace-header-inner{padding:0 12px}.workspace-identity small{display:block;color:#65dc8c;font-size:9px;letter-spacing:.9px;font-weight:800}.workspace-identity h2{font-size:15px}.mobile-logo{display:block}.workspace-theme select{max-width:87px;padding:6px;font-size:11px;background:#182e20;color:#fff;border-color:#385b42}.workspace-bell{color:#fff}}
</style>
