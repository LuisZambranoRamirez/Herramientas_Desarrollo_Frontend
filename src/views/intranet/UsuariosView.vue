<template>
  <DashboardLayout>
    <div class="usuarios-page">
      <div class="header-section">
        <div>
          <h2>Gestión de Usuarios</h2>
          <p class="subtitle">Administra las cuentas de acceso, roles y estados de los usuarios del sistema.</p>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
</script>

<style scoped>
.usuarios-page {
  padding: 8px 0 24px;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 6px 0;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin: 0;
}
</style>
