<script setup lang="ts">
// NavbarHeader component for SoliDent
</script>

<template>
  <header class="navbar">
    <div class="navbar-container">
      <div class="brand">
        <div class="brand-logo">
          <span class="logo-letter">S</span>
        </div>
        <span class="brand-name">Soli<span class="brand-highlight">Dent</span></span>
      </div>

      <div class="support-info">
        <span class="support-label">¿Necesitas ayuda?</span>
        <a href="tel:+51912045471" class="support-phone">+51 912 045 471</a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  width: 100%;
  background-color: #ffffff;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  padding: 1.25rem 2rem;
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
  background: #5046e5;
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

.support-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
}

.support-label {
  color: #64748b;
  font-weight: 500;
}

.support-phone {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
  transition: color 0.2s ease;
}

.support-phone:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .navbar {
    padding: 1rem;
  }

  .support-info {
    font-size: 0.82rem;
  }
}
</style>
