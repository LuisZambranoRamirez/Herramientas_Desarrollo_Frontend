<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarHeader from './components/NavbarHeader.vue'
</script>

<template>
  <div class="app-wrapper">
    <NavbarHeader />
    <RouterView />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-page, #f8fafc);
}
</style>
