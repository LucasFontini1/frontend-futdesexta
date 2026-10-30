<script setup>
import { onMounted, ref } from 'vue'
import { api } from '@/api/config'
const props = defineProps({ matchId: { type: [Number, String], required: true } })
const weather = ref(null)
onMounted(async () => {
  try {
    weather.value = await api(`/partidas/${props.matchId}/clima/`)
  } catch {
    weather.value = { state: 'unavailable' }
  }
})
</script>

<template>
  <div class="card">
    <h3>Previsão no horário da partida</h3>
    <p v-if="!weather">Consultando clima…</p>
    <p v-else-if="weather.state !== 'available'">
      ☁️❔ {{ weather.reason || 'Previsão indisponível.' }}
    </p>
    <template v-else>
      <p>🌡️ {{ weather.temperature_c }} °C</p>
      <p>☔ Probabilidade de chuva: {{ weather.precipitation_probability_percent }}%</p>
      <p class="muted">
        Código meteorológico: {{ weather.weather_code }} · Fonte: {{ weather.source }}
      </p>
      <p class="muted">
        Consultado em {{ new Date(weather.consulted_at).toLocaleString('pt-BR') }}
      </p>
    </template>
  </div>
</template>
