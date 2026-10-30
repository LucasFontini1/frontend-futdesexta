<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('')
const password = ref('')
const error = ref('')
async function submit() {
  error.value = ''
  try {
    await auth.signIn(email.value, password.value)
    const next = route.query.next
    await router.push(typeof next === 'string' && next.startsWith('/') && !next.startsWith('//') ? next : '/painel')
  } catch (err) { error.value = err.message }
}
</script>

<template>
  <div class="container page">
    <section class="card form-card">
      <h1>Entre em campo</h1>
      <p class="muted">Acesse sua equipe do Fut de Sexta.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <form class="form" @submit.prevent="submit">
        <label class="field">E-mail <input v-model="email" type="email" autocomplete="email" required /></label>
        <label class="field">Senha <input v-model="password" type="password" autocomplete="current-password" required /></label>
        <button class="button" type="submit" :disabled="auth.busy">Entrar</button>
      </form>
      <p><RouterLink to="/esqueci-senha">Esqueci minha senha</RouterLink></p>
      <p>Não tem conta? <RouterLink to="/cadastro">Cadastre-se</RouterLink></p>
    </section>
  </div>
</template>
