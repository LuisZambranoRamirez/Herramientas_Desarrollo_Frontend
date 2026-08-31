<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const isMobileMenuOpen = ref(false)

function scrollToSection(sectionId: string) {
  isMobileMenuOpen.value = false
  if (route.path !== '/') {
    router.push(`/#${sectionId}`).then(() => {
      const el = document.getElementById(sectionId)
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
  } else {
    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <!-- Brand Logo -->
      <RouterLink to="/" class="brand" @click="isMobileMenuOpen = false">
        <div class="brand-logo">
          <span class="logo-letter">S</span>
        </div>
        <span class="brand-name">Soli<span class="brand-highlight">Dent</span></span>
      </RouterLink>

      <!-- Desktop Navigation Menu -->
      <nav class="nav-menu">
        <RouterLink to="/" class="nav-link" :class="{ active: route.path === '/' }">
          Inicio
        </RouterLink>
        <a href="#nosotros" class="nav-link" @click.prevent="scrollToSection('nosotros')">
          Nosotros
        </a>
        <a href="#servicios" class="nav-link" @click.prevent="scrollToSection('servicios')">
          Servicios
        </a>
        <a href="#especialistas" class="nav-link" @click.prevent="scrollToSection('especialistas')">
          Especialistas
        </a>
        <RouterLink
          to="/reservar"
          class="nav-link nav-link-highlight"
          :class="{ active: route.path === '/reservar' }"
        >
          Reservar Cita
        </RouterLink>
        <a href="#intranet" class="nav-link" @click.prevent="scrollToSection('contacto')">
          Intranet
        </a>
      </nav>

      <!-- Mobile Hamburger Button -->
      <button
        type="button"
        class="mobile-toggle"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="Abrir menú de navegación"
      >
        <svg v-if="!isMobileMenuOpen" class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <div v-if="isMobileMenuOpen" class="mobile-menu">
      <RouterLink to="/" class="mobile-nav-link" @click="isMobileMenuOpen = false">
        Inicio
      </RouterLink>
      <a href="#nosotros" class="mobile-nav-link" @click.prevent="scrollToSection('nosotros')">
        Nosotros
      </a>
      <a href="#servicios" class="mobile-nav-link" @click.prevent="scrollToSection('servicios')">
        Servicios
      </a>
      <a href="#especialistas" class="mobile-nav-link" @click.prevent="scrollToSection('especialistas')">
        Especialistas
      </a>
      <RouterLink to="/reservar" class="mobile-nav-link highlight" @click="isMobileMenuOpen = false">
        Reservar Cita
      </RouterLink>
      <a href="#intranet" class="mobile-nav-link" @click.prevent="scrollToSection('contacto')">
        Intranet
      </a>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  padding: 1.1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 50;
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
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.brand-name {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.brand-highlight {
  color: #1e293b;
}

/* Nav Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 1.75rem;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover,
.nav-link.active {
  color: #1e293b;
  font-weight: 700;
}

.nav-link-highlight {
  color: #5046e5;
  font-weight: 700;
}

.nav-link-highlight:hover {
  color: #4338ca;
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: #1e293b;
  padding: 0.25rem;
}

.menu-icon {
  width: 26px;
  height: 26px;
}

.mobile-menu {
  display: none;
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
    border-top: 1px solid #f1f5f9;
    margin-top: 0.75rem;
  }

  .mobile-nav-link {
    font-size: 1rem;
    font-weight: 600;
    color: #475569;
    text-decoration: none;
    padding: 0.5rem 0;
  }

  .mobile-nav-link.highlight {
    color: #5046e5;
    font-weight: 700;
  }
}
</style>
