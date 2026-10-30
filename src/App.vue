<script setup>
import { ref, watch } from 'vue'
import { RouterView } from 'vue-router'
import AppHeader from '@/components/layout/AppHeader.vue'
const theme = ref(localStorage.getItem('fut-theme') || 'system')
const media = matchMedia('(prefers-color-scheme: dark)')
function applyTheme() {
  document.documentElement.dataset.theme =
    theme.value === 'system' ? (media.matches ? 'dark' : 'light') : theme.value
}
media.addEventListener('change', applyTheme)
watch(theme, applyTheme, { immediate: true })
function changeTheme(value) {
  theme.value = value
  localStorage.setItem('fut-theme', value)
}
</script>

<template>
  <AppHeader :theme="theme" @change-theme="changeTheme" />
  <main><RouterView /></main>
  <footer class="site-footer">Fut de Sexta · Futebol é comunidade.</footer>
</template>
