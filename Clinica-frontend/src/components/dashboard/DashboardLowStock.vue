<template>
  <div class="stock-container">
    <div class="stock-header">
      <h2>Insumos con Stock Bajo</h2>
      <span class="stock-warning">⚠️ Atención</span>
    </div>
    <div v-if="insumos.length === 0" class="empty-state">
      <p>✅ Todos los insumos tienen stock suficiente</p>
    </div>
    <div v-else class="stock-list">
      <div v-for="insumo in insumos" :key="insumo.nombre" class="stock-item">
        <div class="stock-info">
          <p class="stock-name">{{ insumo.nombre }}</p>
          <p class="stock-detail">
            Quedan <strong>{{ insumo.cantidad }}</strong> {{ insumo.unidad }}
          </p>
        </div>
        <div class="stock-bar-container">
          <div 
            class="stock-bar" 
            :style="{ width: insumo.porcentaje + '%', background: insumo.porcentaje < 20 ? '#ef4444' : '#f59e0b' }"
          ></div>
        </div>
        <p class="stock-min">Mínimo: {{ insumo.minimo }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface InsumoStock {
  nombre: string
  cantidad: number
  unidad: string
  minimo: number
  porcentaje: number
}

defineProps<{
  insumos: InsumoStock[]
}>()
</script>

<style scoped>
.stock-container {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  margin-top: 30px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stock-header h2 {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  transition: color 0.3s ease;
}

.stock-warning {
  background: rgba(245, 158, 11, 0.14);
  color: #d97706;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

html.dark .stock-warning {
  color: #fbbf24;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #10b981;
  font-weight: 500;
}

.stock-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.stock-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-light);
  transition: border-color 0.3s ease;
}

.stock-item:last-child {
  border-bottom: none;
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-weight: 600;
  color: var(--text-main);
  margin: 0;
  font-size: 14px;
  transition: color 0.3s ease;
}

.stock-detail {
  margin: 3px 0 0 0;
  font-size: 13px;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.stock-detail strong {
  color: var(--text-main);
}

.stock-bar-container {
  flex: 2;
  height: 8px;
  background: var(--bg-disabled);
  border-radius: 4px;
  overflow: hidden;
  transition: background-color 0.3s ease;
}

.stock-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.stock-min {
  font-size: 12px;
  color: var(--text-muted);
  margin: 0;
  min-width: 80px;
  text-align: right;
  transition: color 0.3s ease;
}
</style>