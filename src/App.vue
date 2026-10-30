<script setup>
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
const route = useRoute()
const auth = useAuthStore()
const privateLayout = computed(() => Boolean(route.meta.auth && auth.isAuthenticated()))
onMounted(() => { if (auth.isAuthenticated()) auth.loadCurrentUser().catch(() => {}) })
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
  <AppSidebar v-if="privateLayout" />
  <AppHeader v-else :theme="theme" @change-theme="changeTheme" />
  <main :class="{ 'authenticated-main': privateLayout }"><RouterView /></main>
  <footer v-if="!privateLayout" class="site-footer">Fut de Sexta · Futebol é comunidade.</footer>
</template>
