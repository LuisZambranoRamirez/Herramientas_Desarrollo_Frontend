<template>
  <DashboardLayout>
    <div class="welcome-section">
      <h2>Bienvenido, {{ usuarioNombre }}</h2>
      <p class="date">Hoy es {{ today }}, tienes <strong>12 citas</strong> agendadas para hoy.</p>
    </div>

    <DashboardStats :stats="statsData" />

    <div class="dashboard-grid">
      <DashboardAppointments :citas="citasData" />
      <DashboardActivity :actividades="actividadData" />
    </div>

    <!-- Stock Bajo -->
    <DashboardLowStock :insumos="stockData" />
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import DashboardStats from '@/components/dashboard/DashboardStats.vue'
import DashboardAppointments from '@/components/dashboard/DashboardAppointments.vue'
import DashboardActivity from '@/components/dashboard/DashboardActivity.vue'
import DashboardLowStock from '@/components/dashboard/DashboardLowStock.vue'

interface StatItem {
  label: string
  value: number | string
  icon: string
  color: string
}

interface Cita {
  id: number
  paciente: string
  hora: string
  tratamiento: string
  estado: 'Confirmada' | 'En curso' | 'Pendiente' | 'Completada'
}

interface Actividad {
  texto: string
  tiempo: string
  color: string
}

interface InsumoStock {
  nombre: string
  cantidad: number
  unidad: string
  minimo: number
  porcentaje: number
}


const authStore = useAuthStore()
const usuarioNombre = computed(() => {
  const username = authStore.currentUser?.username ?? 'Usuario'
  return username.split('@')[0]
})

const today = computed(() => {
  const date = new Date()
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }
  return date.toLocaleDateString('es-ES', options)
})


const statsData = ref<StatItem[]>([
  { label: 'Citas Hoy', value: 12, icon: '📅', color: '#3498db' },
  { label: 'Pacientes Activos', value: 348, icon: '👤', color: '#2ecc71' },
  { label: 'Tratamientos en Curso', value: 27, icon: '🏥', color: '#f39c12' },
  { label: 'Stock Bajo', value: '3 Insumos', icon: '⚠️', color: '#e74c3c' }
])

const citasData = ref<Cita[]>([
  { id: 1, paciente: 'Luis utp', hora: '09:00 AM', tratamiento: 'Limpieza Dental', estado: 'Confirmada' },
  { id: 2, paciente: 'Ana María Silva', hora: '10:00 AM', tratamiento: 'Ortodoncia (Ajuste)', estado: 'En curso' },
  { id: 3, paciente: 'Roberto Torres', hora: '11:30 AM', tratamiento: 'Implante Dental', estado: 'Confirmada' },
  { id: 4, paciente: 'Lucía Fernández', hora: '02:00 PM', tratamiento: 'Endodoncia', estado: 'Pendiente' },
  { id: 5, paciente: 'Miguel Ángel Rivas', hora: '03:00 PM', tratamiento: 'Evaluación Inicial', estado: 'Pendiente' }
])

const actividadData = ref<Actividad[]>([
  { texto: '<strong>Dra. Rodríguez</strong> creó una nueva reserva para Carlos Mendoza.', tiempo: 'Hace 10 mins', color: '#3498db' },
  { texto: '<strong>Dr. García</strong> completó la historia clínica de Ana Silva.', tiempo: 'Hace 35 mins', color: '#2ecc71' },
  { texto: 'Sistema detectó Stock Bajo para el insumo <strong>Guantes de Látex M</strong>.', tiempo: 'Hace 1 hora', color: '#e74c3c' },
  { texto: 'Admisión confirmó el pago de Roberto Torres por <strong>$150</strong>.', tiempo: 'Hace 2 horas', color: '#f39c12' }
])

const stockData = ref<InsumoStock[]>([
  { nombre: 'Guantes de Látex M', cantidad: 2, unidad: 'cajas', minimo: 5, porcentaje: 40 },
  { nombre: 'Resina Dental A2', cantidad: 3, unidad: 'tubos', minimo: 10, porcentaje: 30 },
  { nombre: 'Mascarillas Quirúrgicas', cantidad: 4, unidad: 'cajas', minimo: 8, porcentaje: 50 }
])
</script>

<style scoped>
.welcome-section {
  margin-bottom: 30px;
}

.welcome-section h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 6px 0;
  transition: color 0.3s ease;
}

.welcome-section .date {
  color: var(--text-muted);
  margin: 0;
  font-size: 15px;
  transition: color 0.3s ease;
}

.welcome-section .date strong {
  color: var(--text-main);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 30px;
}

@media (max-width: 900px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
