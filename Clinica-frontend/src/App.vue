<template>
  <div id="app">
    <!-- Mostrar Navbar solo si NO estamos en el Dashboard -->
    <NavbarHeader v-if="!isDashboardRoute" />
    
    <!-- Contenido principal -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavbarHeader from '@/components/NavbarHeader.vue'

const route = useRoute()

// ✅ Detectar si estamos en la ruta del Dashboard
const isDashboardRoute = computed(() => {
  return route.path.startsWith('/dashboard')
})
</script>

<style>
/* Tus estilos globales aquí */
</style>