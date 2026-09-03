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
            :style="{ width: insumo.porcentaje + '%', background: insumo.porcentaje < 20 ? '#e74c3c' : '#f39c12' }"
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
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-top: 30px;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stock-header h2 {
  color: #2c3e50;
  margin: 0;
}

.stock-warning {
  background: #fef9e7;
  color: #f39c12;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: #27ae60;
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
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stock-item:last-child {
  border-bottom: none;
}

.stock-info {
  flex: 1;
}

.stock-name {
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.stock-detail {
  margin: 2px 0 0 0;
  font-size: 14px;
  color: #7f8c8d;
}

.stock-detail strong {
  color: #2c3e50;
}

.stock-bar-container {
  flex: 2;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.stock-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.stock-min {
  font-size: 12px;
  color: #95a5a6;
  margin: 0;
  min-width: 80px;
  text-align: right;
}
</style>