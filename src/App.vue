<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
const auth = useAuthStore()
onMounted(() => { auth.restoreSession() })
</script>
<template><RouterView /></template>
