<template>
  <div class="activity-container">
    <h2>Actividad Reciente</h2>
    <div class="activity-list">
      <div v-for="(actividad, index) in actividades" :key="index" class="activity-item">
        <div class="activity-dot" :style="{ background: actividad.color }"></div>
        <div class="activity-content">
          <p class="activity-text" v-html="actividad.texto"></p>
          <span class="activity-time">{{ actividad.tiempo }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Actividad {
  texto: string
  tiempo: string
  color: string
}

defineProps<{
  actividades: Actividad[]
}>()
</script>

<style scoped>
.activity-container {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  height: fit-content;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.activity-container h2 {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0 0 20px 0;
  transition: color 0.3s ease;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.activity-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 6px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-text {
  margin: 0;
  color: var(--text-main);
  font-size: 14px;
  line-height: 1.45;
  transition: color 0.3s ease;
}

.activity-text :deep(strong) {
  color: var(--text-main);
  font-weight: 600;
}

.activity-time {
  font-size: 12px;
  color: var(--text-muted);
  display: block;
  margin-top: 2px;
  transition: color 0.3s ease;
}
</style>