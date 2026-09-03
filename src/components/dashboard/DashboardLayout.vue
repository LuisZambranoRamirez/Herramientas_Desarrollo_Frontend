<script setup lang="ts">
import { ref } from 'vue'
import DashboardSidebar from './DashboardSidebar.vue'
import DashboardHeader from './DashboardHeader.vue'

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
</script>

<template>
  <div class="dashboard-layout" :class="{ 'is-collapsed': isCollapsed }">
    <DashboardSidebar
      v-model:collapsed="isCollapsed"
      v-model:mobile-open="isMobileOpen"
    />
    <div class="main-content">
      <DashboardHeader @toggle-mobile="isMobileOpen = !isMobileOpen" />
      <div class="page-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.main-content {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% - 260px);
}

.dashboard-layout.is-collapsed .main-content {
  margin-left: 78px;
  width: calc(100% - 78px);
}

.page-content {
  padding: 24px 30px;
  flex: 1;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0 !important;
    width: 100% !important;
  }

  .page-content {
    padding: 16px 14px;
  }
}
</style>