<template>
  <aside class="sidebar">
    <div class="sidebar-brand">
      <span class="brand-icon">☰</span>
      <span class="brand-text">SoitDent</span>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="nav-item active">
        <span class="nav-icon">📊</span>
        <span class="nav-text">Dashboard</span>
      </router-link>

      <router-link to="/usuarios" class="nav-item">
        <span class="nav-icon">👥</span>
        <span class="nav-text">Usuarios y Personal</span>
      </router-link>

      <router-link to="/agenda" class="nav-item">
        <span class="nav-icon">📅</span>
        <span class="nav-text">Agenda y Citas</span>
      </router-link>

      <router-link to="/tratamientos" class="nav-item">
        <span class="nav-icon">💊</span>
        <span class="nav-text">Tratamientos</span>
      </router-link>

      <router-link to="/pagos" class="nav-item">
        <span class="nav-icon">💰</span>
        <span class="nav-text">Pagos</span>
      </router-link>

      <router-link to="/inventario" class="nav-item">
        <span class="nav-icon">📦</span>
        <span class="nav-text">Inventario y Proveedores</span>
      </router-link>

      <router-link to="/configuracion" class="nav-item">
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">Configuración</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <p class="sidebar-copy">© 2026 SoitDent</p>
    </div>
  </aside>
</template>

<script setup lang="ts">
// No necesita lógica adicional
</script>

<style scoped>
.sidebar {
  width: 250px;
  height: 100vh;
  background: #1a2b3c;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-brand {
  padding: 24px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.brand-icon {
  font-size: 24px;
}

.brand-text {
  font-size: 20px;
  font-weight: 700;
  color: white;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 20px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: all 0.2s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.nav-item.active {
  background: rgba(52, 152, 219, 0.15);
  color: #3498db;
  border-left-color: #3498db;
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-size: 14px;
}

.sidebar-footer {
  padding: 16px 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.sidebar-copy {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
  margin: 0;
  text-align: center;
}
</style>