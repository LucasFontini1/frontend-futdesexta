<script setup>
import { ref } from 'vue'
import BrandMark from '@/components/BrandMark.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const auth = useAuthStore()
const email = ref('')
const password = ref('')
const showPassword = ref(false)

async function submit() {
  if (await auth.login(email.value.trim(), password.value)) await router.replace('/inicio')
}
</script>

<template>
  <main class="login-page">
    <section class="login-shell" aria-label="Entrar no Fut de Sexta">
      <div class="login-form-panel">
        <BrandMark />
        <div class="form-area">
          <div class="eyebrow"><span class="eyebrow-line"></span> SUA PELADA COMEÇA AQUI</div>
          <h1>Bem-vindo <span>de volta.</span></h1>
          <p class="subtitle">Entre na sua conta e volte para o jogo.</p>
          <form @submit.prevent="submit">
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" autocomplete="email" placeholder="seu@email.com" required />
            <label for="password">Senha</label>
            <div class="password-wrap">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Sua senha" required />
              <button type="button" class="reveal" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword"><i class="mdi" :class="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'" aria-hidden="true"></i></button>
            </div>
            <p v-if="auth.error" class="error" role="alert">{{ auth.error }}</p>
            <button class="submit" type="submit" :disabled="auth.loading">{{ auth.loading ? 'Entrando...' : 'Entrar na minha conta' }} <i class="mdi mdi-arrow-right" aria-hidden="true"></i></button>
          </form>
          <p class="bottom-note">Não tem conta? <RouterLink to="/cadastro" class="text-link">Cadastre-se</RouterLink></p>
        </div>
        <div class="legal">© {{ new Date().getFullYear() }} Fut de Sexta. Feito para quem ama futebol.</div>
      </div>
      <aside class="login-visual">
        <div class="field-lines" aria-hidden="true"><div class="center-circle"></div></div>
        <div class="visual-content">
          <div class="live-tag"><span></span> FUTEBOL DE VERDADE</div>
          <div class="hero-mark">FUT <span>DE</span><br />SEXTA<span class="dot">.</span></div>
          <p class="visual-description">Toda sexta tem uma história.<br />A próxima começa com você.</p>
          <div class="visual-footer">A BOLA ROLA POR AQUI <span aria-hidden="true">↗</span></div>
        </div>
      </aside>
    </section>
  </main>
</template>
