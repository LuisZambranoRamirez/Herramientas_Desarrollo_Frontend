<template>
  <div class="stats-grid">
    <div v-for="stat in stats" :key="stat.label" class="stat-card">
      <div class="stat-icon" :style="{ background: stat.color }">
        <i :class="stat.icon"></i>
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
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
}

.stat-content h3 {
  color: #7f8c8d;
  font-size: 14px;
  margin: 0 0 5px 0;
}

.stat-number {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}
</style>