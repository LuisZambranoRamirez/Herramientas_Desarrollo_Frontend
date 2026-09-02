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

const rutasInternas = ['/dashboard', '/inventario', '/usuarios', '/agenda', '/tratamientos', '/pagos', '/configuracion']

const isDashboardRoute = computed(() => {
return rutasInternas.some(ruta => route.path.startsWith(ruta))
})

const isLoginRoute = computed(() => {
  return route.path === '/login'
})
</script>

<style>
/* Tus estilos globales aquí */
</style>