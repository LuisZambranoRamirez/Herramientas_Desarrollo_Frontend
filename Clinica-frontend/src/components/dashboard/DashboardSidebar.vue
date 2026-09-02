<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  collapsed?: boolean
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:collapsed', value: boolean): void
  (e: 'update:mobileOpen', value: boolean): void
}>()

function toggleCollapse() {
  emit('update:collapsed', !props.collapsed)
}

function closeMobile() {
  emit('update:mobileOpen', false)
}
</script>

<template>
  <div>
    <!-- Backdrop oscuro para versión móvil -->
    <div
      v-if="mobileOpen"
      class="sidebar-backdrop"
      @click="closeMobile"
    ></div>

    <aside
      class="sidebar"
      :class="{
        'is-collapsed': collapsed,
        'mobile-open': mobileOpen,
      }"
    >
      <!-- Cabecera del Sidebar con Logo y Botón Colapsar -->
      <div class="sidebar-header">
        <RouterLink to="/dashboard" class="sidebar-brand" @click="closeMobile">
          <div class="brand-logo-box">
            <span class="logo-letter">S</span>
          </div>
          <span v-if="!collapsed" class="brand-name">
            Soli<span class="brand-accent">Dent</span>
          </span>
        </RouterLink>

        <!-- Botón Toggle Collapse (Desktop) -->
        <button
          type="button"
          class="collapse-btn"
          :title="collapsed ? 'Expandir menú' : 'Colapsar menú'"
          @click="toggleCollapse"
        >
          <svg
            class="collapse-arrow"
            :class="{ rotated: collapsed }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <!-- Menú de Navegación -->
      <nav class="sidebar-nav">
        <!-- 1. Dashboard -->
        <RouterLink
          to="/dashboard"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Dashboard' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="9" rx="1.5" stroke-width="2" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" stroke-width="2" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" stroke-width="2" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" stroke-width="2" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Dashboard</span>
        </RouterLink>

        <!-- 2. Pacientes -->
        <RouterLink
          to="/usuarios"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Pacientes' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Pacientes</span>
        </RouterLink>

        <!-- 3. Agenda y Citas -->
        <RouterLink
          to="/agenda"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Agenda y Citas' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" />
              <line x1="16" y1="2" x2="16" y2="6" stroke-width="2" />
              <line x1="8" y1="2" x2="8" y2="6" stroke-width="2" />
              <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Agenda y Citas</span>
        </RouterLink>

        <!-- 4. Tratamientos -->
        <RouterLink
          to="/tratamientos"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Tratamientos' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Tratamientos</span>
        </RouterLink>

        <!-- 5. Pagos -->
        <RouterLink
          to="/pagos"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Pagos' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="1" y="4" width="22" height="16" rx="2" stroke-width="2" />
              <line x1="1" y1="10" x2="23" y2="10" stroke-width="2" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Pagos</span>
        </RouterLink>

        <!-- 6. Inventario y Proveedores -->
        <RouterLink
          to="/inventario"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Inventario y Proveedores' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Inventario y Stock</span>
        </RouterLink>

        <!-- 7. Configuración -->
        <RouterLink
          to="/configuracion"
          class="nav-item"
          active-class="active"
          :title="collapsed ? 'Configuración' : ''"
          @click="closeMobile"
        >
          <div class="nav-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" stroke-width="2" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="nav-text">Configuración</span>
        </RouterLink>
      </nav>

      <!-- Pie del Sidebar: Volver a la Web pública -->
      <div class="sidebar-footer">
        <RouterLink to="/" class="public-web-btn" :title="collapsed ? 'Ir al sitio web' : ''">
          <svg class="nav-icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span v-if="!collapsed" class="footer-text">Volver a la Web</span>
        </RouterLink>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.sidebar-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 90;
  animation: fadeIn 0.2s ease;
}

.sidebar {
  width: 260px;
  height: 100vh;
  background: #0f172a;
  color: #f8fafc;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-x: hidden;
}

/* Modo Colapsado */
.sidebar.is-collapsed {
  width: 78px;
}

/* Cabecera */
.sidebar-header {
  padding: 1.25rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  min-height: 70px;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  cursor: pointer;
}

.brand-logo-box {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  flex-shrink: 0;
}

.logo-letter {
  color: #ffffff;
  font-weight: 800;
  font-size: 1.25rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-name {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  white-space: nowrap;
}

.brand-accent {
  color: #818cf8;
}

/* Botón Colapsar */
.collapse-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #94a3b8;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
}

.collapse-arrow {
  width: 18px;
  height: 18px;
  transition: transform 0.3s ease;
}

.collapse-arrow.rotated {
  transform: rotate(180deg);
}

/* Navegación */
.sidebar-nav {
  flex: 1;
  padding: 1.25rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.75rem 0.9rem;
  border-radius: 10px;
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.92rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

.nav-item.active {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.16) 0%, rgba(99, 102, 241, 0.05) 100%);
  color: #ffffff;
  font-weight: 700;
  box-shadow: inset 3px 0 0 #6366f1;
}

.nav-item.active .nav-icon {
  color: #818cf8;
}

.nav-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: color 0.2s ease;
}

.nav-icon svg {
  width: 20px;
  height: 20px;
}

.nav-text {
  transition: opacity 0.2s ease;
}

/* Footer */
.sidebar-footer {
  padding: 1rem 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.public-web-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.public-web-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.nav-icon-sm {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: 260px !important;
  }

  .sidebar.mobile-open {
    transform: translateX(0);
  }

  .collapse-btn {
    display: none;
  }
}
</style>
