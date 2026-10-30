<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/api/authApi'
const router = useRouter()
const form = reactive({ name: '', username: '', email: '', password: '', password_confirm: '' })
const error = ref('')
const saving = ref(false)
async function submit() {
  saving.value = true
  error.value = ''
  try { await register(form); await router.push('/entrar') }
  catch (err) { error.value = err.message }
  finally { saving.value = false }
}
</script>

<template>
  <div class="container page">
    <section class="card form-card">
      <h1>Crie sua conta</h1>
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <form class="form" @submit.prevent="submit">
        <label class="field">Nome completo <input v-model="form.name" required maxlength="255" autocomplete="name" /></label>
        <label class="field">Username <input v-model="form.username" required maxlength="50" autocomplete="username" /></label>
        <label class="field">E-mail <input v-model="form.email" type="email" required autocomplete="email" /></label>
        <label class="field">Senha <input v-model="form.password" type="password" required autocomplete="new-password" minlength="8" /></label>
        <label class="field">Confirme a senha <input v-model="form.password_confirm" type="password" required autocomplete="new-password" /></label>
        <button class="button" type="submit" :disabled="saving">Criar conta</button>
      </form>
    </section>
  </div>
</template>
