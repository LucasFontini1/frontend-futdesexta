<script setup>
import { useRouter } from 'vue-router'
import BrandMark from '@/components/BrandMark.vue'
import { useAuthStore } from '@/stores/authStore'
const router = useRouter()
const auth = useAuthStore()
function logout() { auth.clearSession(); router.replace('/entrar') }
</script>
<template>
  <main class="welcome-page">
    <section class="welcome-card">
      <BrandMark />
      <p class="eyebrow">SESSÃO AUTENTICADA</p>
      <h1>Você está no jogo<span class="accent">.</span></h1>
      <p>Login realizado com sucesso{{ auth.user?.name ? ', ' + auth.user.name : '' }}.</p>
      <p class="muted">Os outros módulos serão desenvolvidos depois.</p>
      <button class="submit" @click="logout">Sair da conta <i class="mdi mdi-logout" aria-hidden="true"></i></button>
    </section>
  </main>
</template>
