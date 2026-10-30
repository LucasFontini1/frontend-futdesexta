<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/config'
const route = useRoute()
const password = ref('')
const confirm = ref('')
const error = ref('')
const success = ref(false)
async function submit() {
  error.value = ''
  try {
    await api('/conta/redefinir-senha/', {
      method: 'POST',
      data: {
        uid: route.query.uid,
        token: route.query.token,
        password: password.value,
        password_confirm: confirm.value,
      },
    })
    success.value = true
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="container page">
    <div class="card form-card">
      <h1>Nova senha</h1>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <div v-if="success" class="notice">
        Senha atualizada. <RouterLink to="/entrar">Entre na sua conta.</RouterLink>
      </div>
      <form v-else class="form" @submit.prevent="submit">
        <label class="field"
          >Nova senha
          <input
            v-model="password"
            type="password"
            minlength="8"
            autocomplete="new-password"
            required
        /></label>
        <label class="field"
          >Confirmação
          <input
            v-model="confirm"
            type="password"
            minlength="8"
            autocomplete="new-password"
            required
        /></label>
        <button class="button" type="submit">Salvar nova senha</button>
      </form>
    </div>
  </section>
</template>
