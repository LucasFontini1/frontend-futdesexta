<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { register } from '@/api/authApi'

const router = useRouter()
const auth = useAuthStore()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmation = ref('')
const showPassword = ref(false)
const accepted = ref(false)
const busy = ref(false)
const error = ref('')
const passwordsMatch = computed(() => password.value === confirmation.value)

function messageFrom(errorObject) {
  const data = errorObject?.response?.data
  if (typeof data?.detail === 'string') return data.detail
  if (data && typeof data === 'object') {
    const field = Object.entries(data).find(([, value]) => Array.isArray(value) || typeof value === 'string')
    if (field) return Array.isArray(field[1]) ? field[1].join(' ') : field[1]
  }
  return errorObject?.message || 'Não foi possível criar a conta.'
}

async function submit() {
  error.value = ''
  if (!passwordsMatch.value) { error.value = 'As senhas não coincidem.'; return }
  if (!accepted.value) { error.value = 'Confirme que deseja criar sua conta.'; return }
  busy.value = true
  const address = email.value.trim().toLowerCase()
  try {
    await register({ name: name.value.trim(), email: address, password: password.value })
    const loggedIn = await auth.login(address, password.value)
    password.value = ''
    confirmation.value = ''
    if (loggedIn) {
      await router.replace('/inicio')
    } else {
      error.value = 'Conta criada, mas o login automático não foi concluído. Entre com seu e-mail e senha.'
    }
  } catch (err) {
    error.value = messageFrom(err)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-shell" aria-label="Criar conta no Fut de Sexta">
      <div class="login-form-panel">
        <RouterLink to="/entrar" class="brand brand-link"><div class="brand-ball" aria-hidden="true">⚽</div><span>FUT <strong>DE SEXTA</strong></span></RouterLink>
        <div class="form-area register-form">
          <div class="eyebrow"><span class="eyebrow-line"></span> ENTRE PARA O TIME</div>
          <h1>Seu jogo <span>começa aqui.</span></h1>
          <p class="subtitle">Crie sua conta e entre direto em campo.</p>
          <form @submit.prevent="submit">
            <label for="name">Nome completo</label>
            <input id="name" v-model="name" type="text" autocomplete="name" placeholder="Seu nome" maxlength="255" required />
            <label for="email">E-mail</label>
            <input id="email" v-model="email" type="email" autocomplete="email" placeholder="seu@email.com" required />
            <label for="password">Senha</label>
            <div class="password-wrap">
              <input id="password" v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" minlength="8" placeholder="Crie uma senha" required />
              <button type="button" class="reveal" :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'" @click="showPassword = !showPassword">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
            </div>
            <label for="confirmation">Confirmar senha</label>
            <input id="confirmation" v-model="confirmation" :type="showPassword ? 'text' : 'password'" autocomplete="new-password" placeholder="Repita sua senha" required />
            <label class="checkbox-label"><input v-model="accepted" type="checkbox" required /> Quero criar minha conta no Fut de Sexta.</label>
            <p v-if="error" class="error" role="alert">{{ error }}</p>
            <button type="submit" class="submit" :disabled="busy || auth.loading">{{ busy ? 'Criando sua conta...' : 'Criar conta e entrar' }} <span aria-hidden="true">→</span></button>
          </form>
          <p class="bottom-note">Já tem uma conta? <RouterLink to="/entrar" class="text-link">Entrar</RouterLink></p>
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
