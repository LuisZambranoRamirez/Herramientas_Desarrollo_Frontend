<template>
  <div class="activity-container">
    <h2>Actividad Reciente</h2>
    <div class="activity-list">
      <div v-for="(actividad, index) in actividades" :key="index" class="activity-item">
        <div class="activity-dot" :style="{ background: actividad.color }"></div>
        <div class="activity-content">
          <p class="activity-text">{{ actividad.texto }}</p>
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
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  height: fit-content;
}

.activity-container h2 {
  color: #2c3e50;
  margin: 0 0 20px 0;
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
  color: #2c3e50;
  font-size: 14px;
}

.activity-text strong {
  color: #1a2b3c;
}

.activity-time {
  font-size: 12px;
  color: #95a5a6;
}
</style>