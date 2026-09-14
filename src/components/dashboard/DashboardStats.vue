<template>
  <div class="stats-grid">
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <div class="stat-icon" :style="{ background: stat.color }">
        <span>{{ stat.icon }}</span>
      </div>
      <div class="stat-content">
        <h3>{{ stat.label }}</h3>
        <p class="stat-number">{{ stat.value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface StatItem {
  label: string
  value: number | string
  icon: string
  color: string
}

defineProps<{
  stats: StatItem[]
}>()
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 20px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  flex-shrink: 0;
}

.stat-content h3 {
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 500;
  margin: 0 0 4px 0;
  transition: color 0.3s ease;
}

.stat-number {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  transition: color 0.3s ease;
}
</style>