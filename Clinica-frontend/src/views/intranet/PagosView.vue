<script setup lang="ts">
import { ref } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

interface PagoItem {
  id: string
  paciente: string
  tratamiento: string
  monto: number
  metodo: 'TARJETA' | 'EFECTIVO' | 'YAPE' | 'TRANSFERENCIA'
  fecha: string
  estado: 'COMPLETADO' | 'PENDIENTE'
}

const pagos = ref<PagoItem[]>([
  {
    id: 'PAG-1092',
    paciente: 'Carlos Mendoza Ramos',
    tratamiento: 'Limpieza Dental Profunda',
    monto: 70,
    metodo: 'YAPE',
    fecha: '02/09/2026',
    estado: 'COMPLETADO',
  },
  {
    id: 'PAG-1091',
    paciente: 'Lucía Fernández Torres',
    tratamiento: 'Ortodoncia Control Mensual',
    monto: 180,
    metodo: 'TARJETA',
    fecha: '02/09/2026',
    estado: 'COMPLETADO',
  },
  {
    id: 'PAG-1090',
    paciente: 'Jorge Morales Vega',
    tratamiento: 'Implante Dental Primera Cuota',
    monto: 300,
    metodo: 'TRANSFERENCIA',
    fecha: '01/09/2026',
    estado: 'COMPLETADO',
  },
  {
    id: 'PAG-1089',
    paciente: 'Ana Paula Gómez',
    tratamiento: 'Evaluación y Diagnóstico',
    monto: 50,
    metodo: 'EFECTIVO',
    fecha: '01/09/2026',
    estado: 'COMPLETADO',
  },
])
</script>

<template>
  <DashboardLayout>
    <div class="pagos-view">
      <div class="view-header">
        <div>
          <h2 class="view-title">Registro de Pagos</h2>
          <p class="view-desc">Historial de transacciones, cobros e ingresos de la clínica.</p>
        </div>
        <button class="btn-nuevo" type="button">+ Registrar Pago</button>
      </div>

      <!-- Resumen Cards -->
      <div class="stats-row">
        <div class="stat-mini-card">
          <span class="stat-label">Ingresos de Hoy</span>
          <span class="stat-val text-emerald">S/ 600.00</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Transacciones</span>
          <span class="stat-val">4 Realizadas</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Método Más Usado</span>
          <span class="stat-val">Yape / Plin</span>
        </div>
      </div>

      <div class="table-card">
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>N° Recibo</th>
                <th>Paciente</th>
                <th>Tratamiento</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagos" :key="pago.id">
                <td class="font-mono">{{ pago.id }}</td>
                <td class="font-semibold">{{ pago.paciente }}</td>
                <td>{{ pago.tratamiento }}</td>
                <td class="font-bold text-emerald">S/ {{ pago.monto }}.00</td>
                <td>
                  <span class="badge-method">{{ pago.metodo }}</span>
                </td>
                <td>{{ pago.fecha }}</td>
                <td>
                  <span class="badge-status completado">✓ {{ pago.estado }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.pagos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.view-desc {
  font-size: 0.92rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.btn-nuevo {
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.25);
}

.btn-nuevo:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-mini-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
}

.stat-val {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
}

.text-emerald {
  color: #059669;
}

.table-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  background: #f8fafc;
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.font-mono {
  font-family: monospace;
  font-size: 0.85rem;
  color: #64748b;
}

.font-semibold {
  font-weight: 600;
}

.font-bold {
  font-weight: 700;
}

.badge-method {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-status.completado {
  background: #dcfce7;
  color: #15803d;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}
</style>
