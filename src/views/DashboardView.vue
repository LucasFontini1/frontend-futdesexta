<script setup>
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
</script>

<template>
  <div class="container page">
    <h1>Meu painel</h1>
    <p>Olá, {{ auth.user?.name }}!</p>
    <div class="actions">
      <RouterLink class="button" to="/equipes">Minhas equipes</RouterLink>
      <RouterLink class="button button-secondary" to="/convites">Convites</RouterLink>
    </div>
  </div>
</template>
