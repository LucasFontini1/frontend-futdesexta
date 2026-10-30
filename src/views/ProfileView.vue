<script setup>
import { ref } from 'vue'
import { updateProfile } from '@/api/authApi'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const name = ref(auth.user?.name || '')
const username = ref(auth.user?.username || '')
const image = ref(null)
const error = ref('')
const success = ref('')
const busy = ref(false)
async function save() {
  const form = new FormData()
  form.append('name', name.value)
  form.append('username', username.value)
  if (image.value) form.append('photo', image.value)
  error.value = ''
  success.value = ''
  busy.value = true
  try {
    auth.user = await updateProfile(form)
    success.value = 'Perfil atualizado.'
  } catch (err) {
    error.value = err.message
  } finally {
    busy.value = false
  }
}
function chooseFile(event) {
  image.value = event.target.files?.[0] || null
}
</script>

<template>
  <div class="container page">
    <section class="card form-card">
      <h1>Meu perfil</h1>
      <img
        v-if="auth.user?.photo"
        :src="auth.user.photo"
        alt="Foto do perfil"
        width="96"
        height="96"
      />
      <p v-if="error" role="alert" class="error">{{ error }}</p>
      <p v-if="success" role="status" class="notice">{{ success }}</p>
      <form class="form" @submit.prevent="save">
        <label class="field">Nome <input v-model="name" required /></label>
        <label class="field">Username <input v-model="username" required /></label>
        <label class="field"
          >Foto (até 3 MB)
          <input type="file" accept="image/png,image/jpeg,image/webp" @change="chooseFile"
        /></label>
        <button type="submit" class="button" :disabled="busy">Salvar perfil</button>
      </form>
    </section>
  </div>
</template>
