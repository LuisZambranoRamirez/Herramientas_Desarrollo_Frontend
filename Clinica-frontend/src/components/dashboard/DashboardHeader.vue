<template>
  <header class="dashboard-header">
    <div class="header-left">
      <h1>Dashboard</h1>
    </div>
    <div class="header-right">
      <span class="header-user">👨‍⚕️ Dr. Fabrizio</span>
      <button class="logout-btn">Cerrar Sesión</button>
    </div>
  </header>
</template>

<script setup lang="ts">
// No necesita lógica adicional
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