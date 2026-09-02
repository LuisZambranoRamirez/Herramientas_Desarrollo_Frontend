<template>
  <DashboardLayout>
    <div class="inventario-header">
      <h2>Inventario</h2>
      <p class="subtitle">Insumos registrados y su nivel de stock</p>
    </div>

    <div v-if="cargando" class="estado-info">
      Cargando insumos...
    </div>

    <div v-else-if="error" class="estado-error">
      {{ error }}
    </div>

    <div v-else class="tabla-container">
      <table class="tabla-insumos">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Stock mínimo</th>
            <th>Estado</th>
            <th>Vencimiento</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="insumo in insumos"
            :key="insumo.insumo_id"
            :class="{ 'fila-alerta': insumo.stock < insumo.stock_minimo }"
          >
            <td>{{ insumo.nombre }}</td>
            <td>{{ insumo.stock }}</td>
            <td>{{ insumo.stock_minimo }}</td>
            <td>
              <span
                class="badge"
                :class="insumo.stock < insumo.stock_minimo ? 'badge-bajo' : 'badge-ok'"
              >
                {{ insumo.stock < insumo.stock_minimo ? 'Stock bajo' : 'OK' }}
              </span>
            </td>
            <td>{{ insumo.fecha_vencimiento ?? '—' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Insumo } from '@/types'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { insumoApi } from '@/services/mock-api'

const insumos = ref<Insumo[]>([])
const cargando = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    insumos.value = await insumoApi.getAll()
  } catch (e) {
    error.value = 'No se pudo cargar el inventario.'
  } finally {
    cargando.value = false
  }
})
</script>

<style scoped>
.inventario-header {
  margin-bottom: 24px;
}

.inventario-header h2 {
  font-size: 24px;
  color: #1a2b3c;
  margin: 0 0 6px 0;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 15px;
}

.estado-info,
.estado-error {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.estado-error {
  color: #e74c3c;
}

.tabla-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tabla-insumos {
  width: 100%;
  border-collapse: collapse;
}

.tabla-insumos th {
  text-align: left;
  padding: 14px 20px;
  background: #f5f7fa;
  color: #2c3e50;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-insumos td {
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  color: #2c3e50;
  font-size: 14px;
}

.fila-alerta {
  background: #fdf2f2;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-ok {
  background: #eafaf1;
  color: #27ae60;
}

.badge-bajo {
  background: #fdecea;
  color: #e74c3c;
}
</style>