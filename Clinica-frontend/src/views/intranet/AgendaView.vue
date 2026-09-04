<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { citasService } from '@/services/citas.service'

import type {
  Cita,
  EstadoCita,
} from '@/types'

const citas = ref<Cita[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

const filtroEstado = ref<EstadoCita | 'TODOS'>('TODOS')

const citasFiltradas = computed(() => {
  if (filtroEstado.value === 'TODOS') {
    return citas.value
  }

  return citas.value.filter(
    c => c.estado === filtroEstado.value,
  )
})

const totalPorEstado = computed(() => ({
  PROGRAMADA: citas.value.filter(
    c => c.estado === 'PROGRAMADA',
  ).length,
  CONFIRMADA: citas.value.filter(
    c => c.estado === 'CONFIRMADA',
  ).length,
  ATENDIDA: citas.value.filter(
    c => c.estado === 'ATENDIDA',
  ).length,
  CANCELADA: citas.value.filter(
    c => c.estado === 'CANCELADA',
  ).length,
}))

const estadoConfig: Record<
  string,
  { label: string; clase: string }
> = {
  PROGRAMADA: {
    label: 'Programada',
    clase: 'estado-programada',
  },
  CONFIRMADA: {
    label: 'Confirmada',
    clase: 'estado-confirmada',
  },
  ATENDIDA: {
    label: 'Atendida',
    clase: 'estado-atendida',
  },
  CANCELADA: {
    label: 'Cancelada',
    clase: 'estado-cancelada',
  },
  NO_ASISTIO: {
    label: 'No asistió',
    clase: 'estado-no-asistio',
  },
  REPROGRAMADA: {
    label: 'Reprogramada',
    clase: 'estado-reprogramada',
  },
  EN_PROCESO: {
    label: 'En proceso',
    clase: 'estado-en-proceso',
  },
}

const formatFecha = (fecha: string) => {
  const [y, m, d] = fecha.split('-')
  return `${d}/${m}/${y}`
}

const formatHora = (hora: string) => {
  return hora.slice(0, 5)
}

const fetchCitas = async () => {
  isLoading.value = true
  error.value = null

  try {
    citas.value = await citasService.getAll()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Error al cargar las citas'
  } finally {
    isLoading.value = false
  }
}

const updateEstadoCita = async (
  citaId: string,
  estado: EstadoCita,
) => {
  isLoading.value = true
  error.value = null

  try {
    const cita = await citasService.update(
      citaId,
      { estado },
    )

    const index = citas.value.findIndex(
      c => c.cita_id === citaId,
    )

    if (index !== -1) {
      citas.value[index] = cita
    }
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Error al actualizar el estado de la cita'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchCitas)
</script>

<template>
  <DashboardLayout>
    <!-- Cabecera -->
    <div class="page-header">
      <div>
        <p class="page-subtitle">Gestiona y actualiza el estado de las citas</p>
      </div>
      <div class="header-stats">
        <div class="stat-pill stat-programada" @click="filtroEstado = 'PROGRAMADA'">
          📋 {{ totalPorEstado.PROGRAMADA }} Programadas
        </div>
        <div class="stat-pill stat-confirmada" @click="filtroEstado = 'CONFIRMADA'">
          ✅ {{ totalPorEstado.CONFIRMADA }} Confirmadas
        </div>
        <div class="stat-pill stat-atendida" @click="filtroEstado = 'ATENDIDA'">
          🏁 {{ totalPorEstado.ATENDIDA }} Atendidas
        </div>
        <div class="stat-pill stat-cancelada" @click="filtroEstado = 'CANCELADA'">
          ❌ {{ totalPorEstado.CANCELADA }} Canceladas
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filtros-bar">
      <div class="filtro-group">
        <label>Filtrar por estado</label>
        <select v-model="filtroEstado" class="select-filtro">
          <option value="TODOS">Todos los estados</option>
          <option value="PROGRAMADA">Programadas</option>
          <option value="CONFIRMADA">Confirmadas</option>
          <option value="ATENDIDA">Atendidas</option>
          <option value="CANCELADA">Canceladas</option>
          <option value="NO_ASISTIO">No asistió</option>
          <option value="EN_PROCESO">En proceso</option>
        </select>
      </div>
      <button class="btn-reset" v-if="filtroEstado !== 'TODOS'" @click="filtroEstado = 'TODOS'">
        ✕ Limpiar filtro
      </button>
      <span class="resultado-count">{{ citasFiltradas.length }} resultado(s)</span>
    </div>

    <!-- Cargando -->
    <div v-if="isLoading" class="estado-carga">
      <div class="spinner"></div>
      <p>Cargando citas...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="estado-error">
      ⚠️ {{ error }}
    </div>

    <!-- Tabla -->
    <div v-else class="tabla-card">
      <table class="tabla">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Paciente (DNI)</th>
            <th>Odontólogo (DNI)</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citasFiltradas" :key="cita.cita_id" class="tabla-fila">
            <td class="td-fecha">{{ formatFecha(cita.fecha) }}</td>
            <td class="td-hora">{{ formatHora(cita.hora) }}</td>
            <td>{{ cita.dni_paciente }}</td>
            <td>{{ cita.dni_odontologo }}</td>
            <td class="td-motivo">{{ cita.motivo_consulta }}</td>
            <td>
              <span class="badge" :class="estadoConfig[cita.estado]?.clase">
                {{ estadoConfig[cita.estado]?.label ?? cita.estado }}
              </span>
            </td>
            <td class="td-acciones">
              <button
                v-if="cita.estado === 'PROGRAMADA'"
                class="btn-accion btn-confirmar"
                @click="updateEstadoCita(cita.cita_id, 'CONFIRMADA')"
              >
                ✓ Confirmar
              </button>
              <button
                v-if="cita.estado === 'CONFIRMADA'"
                class="btn-accion btn-atender"
                @click="updateEstadoCita(cita.cita_id, 'ATENDIDA')"
              >
                🏁 Atendida
              </button>
              <button
                v-if="cita.estado === 'PROGRAMADA' || cita.estado === 'CONFIRMADA'"
                class="btn-accion btn-cancelar"
                @click="updateEstadoCita(cita.cita_id, 'CANCELADA')"
              >
                ✕ Cancelar
              </button>
              <span v-if="cita.estado === 'ATENDIDA' || cita.estado === 'CANCELADA'" class="sin-accion">
                —
              </span>
            </td>
          </tr>
          <tr v-if="citasFiltradas.length === 0">
            <td colspan="7" class="td-vacio">No hay citas para mostrar.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.page-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 0.9rem;
}

.header-stats {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.stat-pill {
  padding: 0.4rem 0.9rem;
  border-radius: 999px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.stat-pill:hover { opacity: 0.8; }

.stat-programada { background: #dbeafe; color: #1e40af; }
.stat-confirmada { background: #dcfce7; color: #166534; }
.stat-atendida   { background: #f3f4f6; color: #374151; }
.stat-cancelada  { background: #fee2e2; color: #991b1b; }

/* Filtros */
.filtros-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-group label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
}

.select-filtro {
  padding: 0.45rem 0.75rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1e293b;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.select-filtro:focus { border-color: #6366f1; }

.btn-reset {
  padding: 0.4rem 0.8rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #64748b;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover { background: #f1f5f9; color: #1e293b; }

.resultado-count {
  margin-left: auto;
  font-size: 0.82rem;
  color: #94a3b8;
}

/* Carga y error */
.estado-carga {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  color: #64748b;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.estado-error {
  padding: 1rem 1.5rem;
  background: #fee2e2;
  border-radius: 10px;
  color: #991b1b;
  font-size: 0.9rem;
}

/* Tabla */
.tabla-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.08);
  overflow: hidden;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
}

.tabla thead tr {
  background: #f8fafc;
}

.tabla th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.8rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-fila td {
  padding: 0.9rem 1rem;
  font-size: 0.875rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.tabla-fila:last-child td { border-bottom: none; }
.tabla-fila:hover { background: #fafbff; }

.td-fecha { font-weight: 600; color: #1e293b; }
.td-hora  { font-family: monospace; font-size: 0.9rem; }
.td-motivo { max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Badges de estado */
.badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.estado-programada  { background: #dbeafe; color: #1e40af; }
.estado-confirmada  { background: #dcfce7; color: #166534; }
.estado-atendida    { background: #f3f4f6; color: #374151; }
.estado-cancelada   { background: #fee2e2; color: #991b1b; }
.estado-no-asistio  { background: #fef3c7; color: #92400e; }
.estado-reprogramada{ background: #ede9fe; color: #5b21b6; }
.estado-en-proceso  { background: #cffafe; color: #164e63; }

/* Botones de acción */
.td-acciones { display: flex; gap: 0.4rem; align-items: center; flex-wrap: wrap; }

.btn-accion {
  padding: 0.3rem 0.7rem;
  border: none;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
}

.btn-accion:hover { opacity: 0.85; transform: translateY(-1px); }
.btn-accion:active { transform: translateY(0); }

.btn-confirmar { background: #10b981; color: white; }
.btn-atender   { background: #6366f1; color: white; }
.btn-cancelar  { background: #f87171; color: white; }

.sin-accion { color: #cbd5e1; font-size: 1rem; }

.td-vacio {
  text-align: center;
  padding: 3rem;
  color: #94a3b8;
  font-size: 0.9rem;
}
</style>
