<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { api } from '@/api/config'

const emit = defineEmits(['selected'])
const search = ref('')
const candidates = ref([])
const error = ref('')
const element = ref(null)
const selected = ref(null)
let map = null
let marker = null

function place(latitude, longitude, label = '') {
  const lat = Number(latitude)
  const lon = Number(longitude)
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return
  if (marker) marker.remove()
  marker = L.marker([lat, lon], {
    icon: L.divIcon({ html: '📍', className: 'custom-map-pin', iconSize: [30, 32] }),
  }).addTo(map)
  map.setView([lat, lon], 15)
  selected.value = { latitude: Number(lat.toFixed(6)), longitude: Number(lon.toFixed(6)), location: label }
  emit('selected', selected.value)
}
async function lookup() {
  error.value = ''
  if (search.value.trim().length < 3) return
  try { candidates.value = await api(`/geocodificar/?q=${encodeURIComponent(search.value)}`) }
  catch (err) { error.value = err.message }
}
onMounted(() => {
  map = L.map(element.value).setView([-14.2, -51.9], 4)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)
  map.on('click', (event) => place(event.latlng.lat, event.latlng.lng))
})
onUnmounted(() => { if (map) map.remove() })
</script>

<template>
  <div class="card">
    <h3>Local no mapa (opcional)</h3>
    <label class="field">Pesquisar endereço
      <input v-model="search" placeholder="Cidade, rua ou campo" />
    </label>
    <button type="button" class="button button-secondary" @click="lookup">Pesquisar no mapa</button>
    <p v-if="error" role="alert" class="error">{{ error }}</p>
    <div v-for="candidate in candidates" :key="candidate.name" class="list-row">
      <span>{{ candidate.name }}</span>
      <button type="button" class="button button-secondary"
        @click="place(candidate.latitude, candidate.longitude, candidate.name)">Selecionar</button>
    </div>
    <div ref="element" class="location-map" aria-label="Mapa para selecionar o local"></div>
    <p v-if="selected">
      Coordenadas: {{ selected.latitude }}, {{ selected.longitude }}
      <a :href="`https://www.openstreetmap.org/?mlat=${selected.latitude}&mlon=${selected.longitude}#map=16/${selected.latitude}/${selected.longitude}`"
        target="_blank" rel="noopener noreferrer">Abrir mapa externo</a>
    </p>
  </div>
</template>

<style scoped>
.location-map { height: 330px; width: 100%; margin-top: 1rem; border-radius: .8rem; }
.custom-map-pin { font-size: 1.5rem; }
</style>
