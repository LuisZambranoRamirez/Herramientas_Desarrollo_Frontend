<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)

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
        <RouterLink
          to="/login"
          class="nav-link nav-link-highlight"
          :class="{ active: isRouteActive('/login') }"
          @click="isMobileMenuOpen = false"
        >
          Intranet
        </RouterLink>
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