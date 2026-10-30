<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getMatch, listAttendance, replyAttendance } from '@/api/matchesApi'
import WeatherBadge from '@/components/maps/WeatherBadge.vue'
const route = useRoute()
const auth = useAuthStore()
const match = ref(null)
const attendances = ref([])
const error = ref('')
const notice = ref('')
const myAnswer = ref(null)
async function load() {
  try {
    const id = route.params.id
    const [m, a] = await Promise.all([getMatch(id), listAttendance(id)])
    match.value = m
    attendances.value = a
    myAnswer.value = a.find((entry) => entry.user === auth.user?.id)?.response
  } catch (err) { error.value = err.message }
}
async function reply(response) {
  error.value = ''; notice.value = ''
  try {
    await replyAttendance(route.params.id, response)
    notice.value = 'Presença atualizada.'
    await load()
  } catch (err) { error.value = err.message }
}
onMounted(load)
</script>

<template>
  <section class="container page">
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p v-if="notice" class="notice" role="status">{{ notice }}</p>
    <template v-if="match">
      <h1>{{ match.title }}</h1>
      <p>{{ new Date(match.starts_at).toLocaleString('pt-BR') }}</p>
      <p>{{ match.location }}</p>
      <p>Status: {{ match.status }}</p>
      <section class="card">
        <h2>Você vai jogar?</h2>
        <p>Minha resposta: {{ myAnswer === 'going' ? 'Vou' : myAnswer === 'not_going' ? 'Não vou' : 'Ainda não respondi' }}</p>
        <div class="actions">
          <button class="button" type="button" @click="reply('going')">Vou</button>
          <button class="button button-secondary" type="button" @click="reply('not_going')">Não vou</button>
        </div>
      </section>
      <div class="actions">
        <RouterLink class="button button-secondary" :to="`/partidas/${match.id}/escalacao`">Escalação</RouterLink>
        <RouterLink class="button button-secondary" :to="`/partidas/${match.id}/resultado`">Registrar resultado</RouterLink>
      </div>
      <WeatherBadge :match-id="match.id" />
      <section class="card">
        <h2>Confirmações</h2>
        <p>{{ attendances.filter((a) => a.response === 'going').length }} confirmados</p>
        <p>{{ attendances.filter((a) => a.response === 'not_going').length }} não vão</p>
      </section>
    </template>
  </section>
</template>
