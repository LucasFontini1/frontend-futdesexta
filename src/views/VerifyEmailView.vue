<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { api } from '@/api/config'
const route = useRoute()
const message = ref('Verificando sua conta…')
const success = ref(false)
onMounted(async () => {
  try {
    await api('/conta/verificar-email/', {
      method: 'POST',
      data: { uid: route.query.uid, token: route.query.token },
    })
    success.value = true
    message.value = 'E-mail confirmado! Sua conta está ativa.'
  } catch (err) {
    message.value = err.message
  }
})
</script>

<template>
  <section class="container page">
    <div class="card form-card">
      <h1>Confirmação de e-mail</h1>
      <p :class="success ? 'notice' : 'muted'" role="status">{{ message }}</p>
      <RouterLink class="button" to="/entrar">Ir para o login</RouterLink>
    </div>
  </section>
</template>
