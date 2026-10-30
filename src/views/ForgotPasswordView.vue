<script setup>
import { ref } from 'vue'
import { api } from '@/api/config'
const email = ref('')
const error = ref('')
const message = ref('')
async function submit() {
  error.value = ''
  try {
    const data = await api('/conta/recuperar-senha/', {
      method: 'POST',
      data: { email: email.value },
    })
    message.value = data.detail
  } catch (err) {
    error.value = err.message
  }
}
</script>

<template>
  <section class="container page">
    <div class="card form-card">
      <h1>Recuperar senha</h1>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-if="message" class="notice" role="status">{{ message }}</p>
      <form class="form" @submit.prevent="submit">
        <label class="field"
          >E-mail cadastrado <input v-model="email" type="email" required
        /></label>
        <button class="button" type="submit">Enviar recuperação</button>
      </form>
    </div>
  </section>
</template>
