<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const userName = computed(() => auth.user?.name || 'Meu perfil')
const initial = computed(() => userName.value[0]?.toUpperCase() || '⚽')
const items = [
  { to: '/painel', label: 'Início', symbol: '⌂' },
  { to: '/equipes', label: 'Equipes', symbol: '♟' },
  { to: '/partidas', label: 'Peladas', symbol: '⚽' },
  { to: '/agenda', label: 'Agenda', symbol: '▦' },
  { to: '/estatisticas', label: 'Ranking', symbol: '★' },
  { to: '/amistosos', label: 'Amistosos', symbol: '↔' },
  { to: '/competicoes', label: 'Competições', symbol: '🏆' },
  { to: '/eventos', label: 'Eventos', symbol: '◈' },
  { to: '/notificacoes', label: 'Avisos', symbol: '♧' },
  { to: '/convites', label: 'Convites', symbol: '✉' },
  { to: '/perfil', label: 'Perfil', symbol: '◉' },
  { to: '/configuracoes', label: 'Configurações', symbol: '⚙' },
  { to: '/historico', label: 'Histórico', symbol: '◷' },
]
function active(item) {
  return route.path === item.to || route.path.startsWith(item.to + '/')
}
function logout() {
  auth.signOut()
  router.push('/entrar')
}
</script>

<template>
  <aside class="fut-sidebar" aria-label="Menu lateral">
    <RouterLink to="/painel" class="sidebar-brand">
      <img src="/icons/fut-dark-192.png" alt="" width="52" height="52" />
      <span>Fut <strong>de Sexta</strong></span>
    </RouterLink>
    <div class="sidebar-section-label">MENU PRINCIPAL</div>
    <nav class="sidebar-links" aria-label="Navegação principal">
      <RouterLink
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="sidebar-link"
        :class="{ selected: active(item) }"
        :aria-current="active(item) ? 'page' : undefined"
      >
        <span class="sidebar-icon" aria-hidden="true">{{ item.symbol }}</span>
        <span class="sidebar-link-label">{{ item.label }}</span>
      </RouterLink>
    </nav>
    <div class="sidebar-footer">
      <RouterLink class="sidebar-profile" to="/perfil">
        <img v-if="auth.user?.photo" :src="auth.user.photo" alt="" class="profile-photo" />
        <span v-else class="profile-initial">{{ initial }}</span>
        <span class="profile-name"
          >{{ userName }}<small>@{{ auth.user?.username || 'jogador' }}</small></span
        >
      </RouterLink>
      <button class="sidebar-logout" type="button" @click="logout">Sair da conta</button>
    </div>
  </aside>
</template>

<style scoped>
.fut-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  width: 252px;
  z-index: 1200;
  background: #0c1810;
  color: #eef8f0;
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px;
  overflow-y: auto;
  border-right: 1px solid #254331;
}
.sidebar-brand {
  display: flex;
  gap: 12px;
  align-items: center;
  min-height: 80px;
  margin-bottom: 24px;
  font-size: 19px;
  font-weight: 800;
}
.sidebar-brand img {
  object-fit: contain;
  border-radius: 12px;
}
.sidebar-brand strong {
  color: #32d86c;
}
.sidebar-section-label {
  font-size: 10px;
  font-weight: 800;
  color: #759685;
  letter-spacing: 1px;
  margin: 0 12px 13px;
}
.sidebar-links {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 43px;
  padding: 0 12px;
  border-radius: 10px;
  color: #abc4b0;
  font-size: 13px;
  font-weight: 600;
  transition: background 0.2s;
}
.sidebar-link:hover {
  background: #192e20;
  color: #fff;
}
.sidebar-link.selected {
  background: #19432a;
  border: 1px solid #34794a;
  color: #fff;
}
.sidebar-icon {
  width: 23px;
  text-align: center;
  font-size: 21px;
}
.sidebar-footer {
  margin-top: auto;
  padding-top: 24px;
}
.sidebar-profile {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border: 1px solid #315b3d;
  background: #152c1d;
  border-radius: 11px;
}
.profile-photo,
.profile-initial {
  height: 38px;
  width: 38px;
  object-fit: cover;
  border-radius: 50%;
  background: #237b40;
  display: grid;
  place-items: center;
  font-weight: 800;
}
.profile-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  font-weight: 700;
}
.profile-name small {
  display: block;
  color: #96b5a0;
  margin-top: 3px;
}
.sidebar-logout {
  width: 100%;
  margin-top: 10px;
  padding: 10px;
  background: transparent;
  border: 1px solid #2b4e35;
  border-radius: 9px;
  color: #dceadf;
}
@media (max-width: 700px) {
  .fut-sidebar {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: auto;
    max-height: none;
    overflow: visible;
    padding: 5px 4px calc(5px + env(safe-area-inset-bottom));
    border-right: 0;
    border-top: 1px solid #326c43;
  }
  .sidebar-brand,
  .sidebar-section-label,
  .sidebar-footer {
    display: none;
  }
  .sidebar-links {
    flex-direction: row;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 1px;
  }
  .sidebar-link {
    flex: 0 0 65px;
    min-height: 50px;
    flex-direction: column;
    gap: 2px;
    justify-content: center;
    padding: 4px 1px;
  }
  .sidebar-icon {
    font-size: 19px;
  }
  .sidebar-link-label {
    font-size: 9px;
    white-space: nowrap;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sidebar-link {
    transition: none;
  }
}
</style>
