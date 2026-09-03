<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const emit = defineEmits<{
  (e: 'toggleMobile'): void
}>()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const titulosPorRuta: Record<string, string> = {
  '/dashboard': 'Dashboard Principal',
  '/usuarios': 'Gestión de Pacientes',
  '/agenda': 'Agenda y Citas Médicas',
  '/tratamientos': 'Catálogo de Tratamientos',
  '/pagos': 'Registro de Pagos',
  '/inventario': 'Inventario y Proveedores',
  '/configuracion': 'Configuración General',
}

const titulo = computed(() => titulosPorRuta[route.path] ?? 'Intranet SoliDent')

const usuarioNombre = computed(() => {
  const username = authStore.currentUser?.username ?? 'Usuario'
  return username.split('@')[0] || 'Usuario'
})

const inicial = computed(() => usuarioNombre.value.charAt(0).toUpperCase() || 'U')

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="dashboard-header">
    <div class="header-left">
      <button
        type="button"
        class="mobile-menu-btn"
        aria-label="Abrir menú lateral"
        @click="emit('toggleMobile')"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 class="header-title">{{ titulo }}</h1>
    </div>

    <div class="header-right">
      <div class="user-badge">
        <div class="user-avatar">
          <span>{{ inicial }}</span>
        </div>
        <div class="user-info">
          <span class="user-name">{{ usuarioNombre }}</span>
          <span class="user-role">Administrador</span>
        </div>
      </div>

      <button type="button" class="logout-btn" title="Cerrar sesión" @click="cerrarSesion">
        <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span class="logout-text">Salir</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  background: #ffffff;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 40;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px;
  color: #1e293b;
  cursor: pointer;
}

.mobile-menu-btn svg {
  width: 20px;
  height: 20px;
}

.header-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.user-badge {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5046e5 0%, #4338ca 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
  padding: 0.45rem 0.9rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.logout-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 0 16px;
  }

  .mobile-menu-btn {
    display: flex;
  }

  .header-title {
    font-size: 1.05rem;
  }

  .user-info {
    display: none;
  }

  .logout-text {
    display: none;
  }
}
</style>
