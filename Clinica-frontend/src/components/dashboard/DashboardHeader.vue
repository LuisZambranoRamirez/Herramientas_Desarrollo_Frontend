<template>
  <header class="dashboard-header">
    <div class="header-left">
      <h1>{{ titulo }}</h1>
    </div>
    <div class="header-right">
      <span class="header-user">👤 {{ usuarioNombre }}</span>
      <button @click="cerrarSesion" class="logout-btn">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const titulosPorRuta: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/usuarios': 'Usuarios y Personal',
  '/agenda': 'Agenda y Citas',
  '/tratamientos': 'Tratamientos',
  '/pagos': 'Pagos',
  '/inventario': 'Inventario y Proveedores',
  '/configuracion': 'Configuración',
}

const titulo = computed(() => titulosPorRuta[route.path] ?? 'Dashboard')

// Muestra el username del store, sin texto hardcodeado
const usuarioNombre = computed(() => {
  const username = authStore.currentUser?.username ?? 'Usuario'
  return username.split('@')[0]
})

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}
</script>
<style scoped>
.dashboard-header {
  background: white;
  padding: 16px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e8edf3;
  height: 70px;
}

.header-left h1 {
  font-size: 24px;
  color: #1a2b3c;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-user {
  font-size: 14px;
  color: #2c3e50;
  font-weight: 500;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>
