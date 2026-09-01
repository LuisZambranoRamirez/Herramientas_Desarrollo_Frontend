<template>
  <div id="app">
    <!-- Mostrar Navbar solo si NO estamos en el Dashboard -->
     <NavbarHeader v-if="!isDashboardRoute && !isLoginRoute" />
    
    <!-- Contenido principal -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import NavbarHeader from '@/components/NavbarHeader.vue'

const route = useRoute()

const isDashboardRoute = computed(() => {
  return route.path.startsWith('/dashboard')
})

const isLoginRoute = computed(() => {
  return route.path === '/login'
})
</script>

<style>
/* Tus estilos globales aquí */
</style>