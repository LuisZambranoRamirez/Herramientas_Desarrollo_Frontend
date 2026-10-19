<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const isMobileMenuOpen = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isPaciente = computed(() => authStore.userRole === 'PACIENTE')

const displayNombre = computed(() => {
  if (!authStore.user) return ''
  if (authStore.user.nombre_completo) {
    const parts = authStore.user.nombre_completo.trim().split(' ')
    return parts[0] || authStore.user.nombre_completo
  }
  const cleanUsername = authStore.user.username.split('@')[0] || authStore.user.username
  return cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1)
})

const userInitial = computed(() => {
  if (!displayNombre.value) return 'P'
  return displayNombre.value.charAt(0).toUpperCase()
})

function cerrarSesion() {
  authStore.logout()
  isMobileMenuOpen.value = false
  if (route.meta.requiresAuth) {
    router.push('/')
  }
}

const sectionIds = ['inicio', 'nosotros', 'servicios', 'especialistas']
const activeSection = ref<string>('inicio')

let isManualScrolling = false
let scrollTimeout: ReturnType<typeof setTimeout> | null = null
let ticking = false

function updateActiveSectionOnScroll() {
  if (route.path !== '/') return
  if (isManualScrolling) return

  const scrollY = window.scrollY
  if (scrollY < 120) {
    activeSection.value = 'inicio'
    return
  }

  const windowHeight = window.innerHeight
  const docHeight = document.documentElement.scrollHeight
  if (windowHeight + scrollY >= docHeight - 60) {
    activeSection.value = 'especialistas'
    return
  }

  const navOffset = 130
  let current = 'inicio'
  for (const id of sectionIds) {
    const el = document.getElementById(id)
    if (el) {
      const rect = el.getBoundingClientRect()
      if (rect.top <= navOffset) {
        current = id
      }
    }
  }
  activeSection.value = current
}

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveSectionOnScroll()
      ticking = false
    })
    ticking = true
  }
}

function scrollToSection(sectionId: string) {
  isMobileMenuOpen.value = false

  if (route.path !== '/') {
    router.push({ path: '/', hash: sectionId === 'inicio' ? undefined : `#${sectionId}` }).then(() => {
      nextTick(() => {
        scrollToElement(sectionId)
      })
    })
    return
  }

  scrollToElement(sectionId)
}

function scrollToElement(sectionId: string) {
  isManualScrolling = true
  activeSection.value = sectionId

  if (scrollTimeout) clearTimeout(scrollTimeout)
  scrollTimeout = setTimeout(() => {
    isManualScrolling = false
  }, 800)

  if (sectionId === 'inicio') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname)
    }
    return
  }

  const el = document.getElementById(sectionId)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
    history.pushState(null, '', `#${sectionId}`)
  }
}

const isSectionActive = (id: string) => {
  return route.path === '/' && activeSection.value === id
}

const isRouteActive = (path: string) => {
  return route.path === path
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })

  if (route.path === '/') {
    if (route.hash) {
      const targetId = route.hash.replace('#', '')
      if (sectionIds.includes(targetId)) {
        activeSection.value = targetId
        setTimeout(() => {
          scrollToElement(targetId)
        }, 150)
        return
      }
    }
    updateActiveSectionOnScroll()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) clearTimeout(scrollTimeout)
})

watch(
  () => route.hash,
  (newHash) => {
    if (route.path === '/') {
      const targetId = newHash.replace('#', '')
      if (sectionIds.includes(targetId)) {
        activeSection.value = targetId
      } else if (!newHash) {
        activeSection.value = 'inicio'
      }
    }
  }
)

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/') {
      nextTick(() => {
        updateActiveSectionOnScroll()
      })
    }
  }
)
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <RouterLink to="/" class="brand" @click.prevent="scrollToSection('inicio')">
        <div class="brand-logo">
          <span class="logo-letter">S</span>
        </div>
        <span class="brand-name">Soli<span class="brand-highlight">Dent</span></span>
      </RouterLink>

      <nav class="nav-menu">
        <a
          href="#inicio"
          class="nav-link"
          :class="{ active: isSectionActive('inicio') }"
          @click.prevent="scrollToSection('inicio')"
        >
          Inicio
        </a>
        <a
          href="#nosotros"
          class="nav-link"
          :class="{ active: isSectionActive('nosotros') }"
          @click.prevent="scrollToSection('nosotros')"
        >
          Nosotros
        </a>
        <a
          href="#servicios"
          class="nav-link"
          :class="{ active: isSectionActive('servicios') }"
          @click.prevent="scrollToSection('servicios')"
        >
          Servicios
        </a>
        <a
          href="#especialistas"
          class="nav-link"
          :class="{ active: isSectionActive('especialistas') }"
          @click.prevent="scrollToSection('especialistas')"
        >
          Especialistas
        </a>
        <RouterLink
          to="/reservar"
          class="nav-link nav-link-highlight"
          :class="{ active: isRouteActive('/reservar') }"
          @click="isMobileMenuOpen = false"
        >
          Reservar Cita
        </RouterLink>

        <!-- No autenticado -->
        <RouterLink
          v-if="!isAuthenticated"
          to="/login"
          class="nav-link nav-link-highlight"
          :class="{ active: isRouteActive('/login') }"
          @click="isMobileMenuOpen = false"
        >
          Intranet
        </RouterLink>

        <!-- Autenticado: Evidencia en la esquina derecha -->
        <div v-else class="user-corner-badge">
          <div class="user-avatar" :title="authStore.user?.username">
            {{ userInitial }}
          </div>
          <div class="user-info">
            <span class="user-greeting">Hola, <strong>{{ displayNombre }}</strong></span>
            <span class="user-role-pill" :class="{ 'role-paciente': isPaciente, 'role-admin': !isPaciente }">
              {{ isPaciente ? 'Paciente' : (authStore.userRole === 'ODONTOLOGO' ? 'Odontólogo' : 'Admin') }}
            </span>
          </div>

          <RouterLink
            v-if="!isPaciente"
            to="/dashboard"
            class="nav-intranet-chip"
            title="Ir a la Intranet"
          >
            Intranet
          </RouterLink>

          <button
            type="button"
            class="logout-button"
            @click="cerrarSesion"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg class="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </nav>

      <button
        type="button"
        class="mobile-toggle"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="Abrir menú"
      >
        <svg v-if="!isMobileMenuOpen" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <a
        href="#inicio"
        class="mobile-nav-link"
        :class="{ active: isSectionActive('inicio') }"
        @click.prevent="scrollToSection('inicio')"
      >
        Inicio
      </a>
      <a
        href="#nosotros"
        class="mobile-nav-link"
        :class="{ active: isSectionActive('nosotros') }"
        @click.prevent="scrollToSection('nosotros')"
      >
        Nosotros
      </a>
      <a
        href="#servicios"
        class="mobile-nav-link"
        :class="{ active: isSectionActive('servicios') }"
        @click.prevent="scrollToSection('servicios')"
      >
        Servicios
      </a>
      <a
        href="#especialistas"
        class="mobile-nav-link"
        :class="{ active: isSectionActive('especialistas') }"
        @click.prevent="scrollToSection('especialistas')"
      >
        Especialistas
      </a>

      <!-- Si no está autenticado -->
      <template v-if="!isAuthenticated">
        <RouterLink
          to="/reservar"
          class="mobile-nav-link highlight"
          :class="{ active: isRouteActive('/reservar') }"
          @click="isMobileMenuOpen = false"
        >
          Reservar Cita
        </RouterLink>
        <RouterLink
          to="/login"
          class="mobile-nav-link highlight"
          :class="{ active: isRouteActive('/login') }"
          @click="isMobileMenuOpen = false"
        >
          Intranet
        </RouterLink>
      </template>

      <!-- Si está autenticado -->
      <template v-else>
        <div class="mobile-user-profile">
          <div class="user-avatar">{{ userInitial }}</div>
          <div class="user-info">
            <span class="user-greeting">Hola, <strong>{{ displayNombre }}</strong></span>
            <span class="user-role-pill" :class="{ 'role-paciente': isPaciente, 'role-admin': !isPaciente }">
              {{ isPaciente ? 'Paciente' : (authStore.userRole === 'ODONTOLOGO' ? 'Odontólogo' : 'Admin') }}
            </span>
          </div>
        </div>

        <RouterLink
          to="/reservar"
          class="mobile-nav-link highlight"
          :class="{ active: isRouteActive('/reservar') }"
          @click="isMobileMenuOpen = false"
        >
          📅 Reservar mi Cita
        </RouterLink>

        <RouterLink
          v-if="!isPaciente"
          to="/dashboard"
          class="mobile-nav-link"
          @click="isMobileMenuOpen = false"
        >
          📊 Panel Intranet
        </RouterLink>

        <button
          type="button"
          class="mobile-logout-btn"
          @click="cerrarSesion"
        >
          Cerrar Sesión
        </button>
      </template>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  background-color: var(--bg-card);
  border-bottom: 1px solid var(--border-light);
  padding: 1.1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  cursor: pointer;
}

.brand-logo {
  width: 38px;
  height: 38px;
  background: linear-gradient(135deg, #5b4ae4 0%, #4338ca 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(91, 74, 228, 0.25);
}

.logo-letter {
  color: #ffffff;
  font-weight: 800;
  font-size: 1.25rem;
  line-height: 1;
}

.brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main);
  letter-spacing: -0.02em;
  transition: color 0.3s ease;
}

.brand-highlight {
  color: var(--text-main);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  color: var(--text-main);
  font-weight: 600;
}

.nav-link.active {
  color: #7c3aed !important;
  font-weight: 700 !important;
}

.nav-link.active::after {
  content: '' !important;
  position: absolute !important;
  bottom: -4px !important;
  left: 0 !important;
  right: 0 !important;
  height: 2px !important;
  background: #7c3aed !important;
  border-radius: 2px !important;
}

.nav-link-highlight {
  color: #5046e5;
  font-weight: 700;
}

.nav-link-highlight.active {
  color: #7c3aed !important;
  font-weight: 800 !important;
}

.nav-link-highlight.active::after {
  background: #7c3aed !important;
}

.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-main);
  padding: 0.25rem;
}

.menu-icon {
  width: 26px;
  height: 26px;
}

.mobile-menu {
  display: none;
}

.mobile-nav-link {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  padding: 0.5rem 0;
  cursor: pointer;
}

.mobile-nav-link.active {
  color: #7c3aed !important;
  font-weight: 700 !important;
}

.mobile-nav-link.highlight {
  color: #5046e5;
  font-weight: 700;
}

.mobile-nav-link.highlight.active {
  color: #7c3aed !important;
  font-weight: 800 !important;
}

/* User corner badge */
.user-corner-badge {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.2);
  padding: 0.35rem 0.75rem 0.35rem 0.5rem;
  border-radius: 9999px;
  backdrop-filter: blur(8px);
  transition: all 0.2s ease;
}

.user-corner-badge:hover {
  background: rgba(99, 102, 241, 0.12);
  border-color: rgba(99, 102, 241, 0.35);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 2px 6px rgba(79, 70, 229, 0.3);
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.15;
}

.user-greeting {
  font-size: 0.85rem;
  color: var(--text-main);
  white-space: nowrap;
}

.user-greeting strong {
  color: #4f46e5;
  font-weight: 700;
}

.user-role-pill {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  width: fit-content;
}

.role-paciente {
  background: rgba(14, 165, 233, 0.15);
  color: #0284c7;
}

.role-admin {
  background: rgba(124, 58, 237, 0.15);
  color: #7c3aed;
}

.nav-intranet-chip {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: 6px;
  background: rgba(124, 58, 237, 0.1);
  color: #7c3aed;
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav-intranet-chip:hover {
  background: #7c3aed;
  color: #ffffff;
}

.logout-button {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.logout-button:hover {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
  transform: scale(1.1);
}

.logout-icon {
  width: 18px;
  height: 18px;
}

/* Mobile user profile */
.mobile-user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(99, 102, 241, 0.08);
  border-radius: 12px;
  margin-bottom: 0.5rem;
}

.mobile-logout-btn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  text-align: center;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
}

.mobile-logout-btn:hover {
  background: #ef4444;
  color: #ffffff;
}

@media (max-width: 840px) {
  .navbar {
    padding: 1rem 1.25rem;
  }

  .nav-menu {
    display: none;
  }

  .mobile-toggle {
    display: block;
  }

  .mobile-menu {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0 0.5rem;
    border-top: 1px solid var(--border-light);
    margin-top: 0.75rem;
  }
}
</style>