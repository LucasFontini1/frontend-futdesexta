<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
defineProps({ theme: { type: String, required: true } })
const emit = defineEmits(['change-theme'])
const auth = useAuthStore()
const router = useRouter()
function signOut() { auth.signOut(); router.push('/') }
</script>

<template>
  <header class="header">
    <div class="header-inner container">
      <RouterLink class="brand" to="/"><span aria-hidden="true">⚽</span> FUT <strong>DE SEXTA</strong></RouterLink>
      <nav class="main-nav" aria-label="Navegação principal">
        <template v-if="auth.isAuthenticated()">
          <RouterLink to="/painel">Painel</RouterLink>
          <RouterLink to="/equipes">Equipes</RouterLink>
          <RouterLink to="/partidas">Peladas</RouterLink>
          <RouterLink to="/agenda">Agenda</RouterLink>
          <RouterLink to="/estatisticas">Ranking</RouterLink>
          <RouterLink to="/amistosos">Amistosos</RouterLink>
          <RouterLink to="/competicoes">Competições</RouterLink>
          <RouterLink to="/eventos">Eventos</RouterLink>
          <RouterLink to="/notificacoes">Avisos</RouterLink>
          <RouterLink to="/convites">Convites</RouterLink>
          <RouterLink to="/perfil">Perfil</RouterLink>
          <button type="button" @click="signOut">Sair</button>
        </template>
        <template v-else>
          <RouterLink to="/entrar">Entrar</RouterLink>
          <RouterLink class="button" to="/cadastro">Criar conta</RouterLink>
        </template>
      </nav>
      <select :value="theme" aria-label="Tema" @change="emit('change-theme', $event.target.value)">
        <option value="system">Sistema</option>
        <option value="light">Claro</option>
        <option value="dark">Escuro</option>
      </select>
    </div>
  </header>
</template>
