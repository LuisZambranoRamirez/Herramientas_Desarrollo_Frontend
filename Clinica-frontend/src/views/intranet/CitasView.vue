<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { citasService } from '@/services/citas.service'

import type {
  Cita,
  EstadoCita,
} from '@/types'

// Estado
const citas = ref<Cita[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Filtros
const filtroEstado = ref<EstadoCita | 'TODOS'>('TODOS')

// Computed para filtrar las citas localmente
const citasFiltradas = computed(() => {
  if (filtroEstado.value === 'TODOS') {
    return citas.value
  }

  return citas.value.filter(
    cita => cita.estado === filtroEstado.value,
  )
})

// Obtener clase según estado
const getEstadoClass = (estado: string) => {
  switch (estado) {
    case 'PROGRAMADA':
      return 'bg-blue-100 text-blue-800'
    case 'CONFIRMADA':
      return 'bg-green-100 text-green-800'
    case 'ATENDIDA':
      return 'bg-gray-100 text-gray-800'
    case 'CANCELADA':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Cargar citas
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

// Actualizar estado de una cita
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

// Cargar datos al montar el componente
onMounted(fetchCitas)
</script>


<template>
  <div class="citas-container">
    <div class="header">
      <h1 class="title">Gestión de Citas</h1>
      <p class="subtitle">Administra las citas programadas de los pacientes</p>
    </div>

    <!-- Filtros -->
    <div class="filters">
      <label for="estadoFilter">Filtrar por estado:</label>
      <select id="estadoFilter" v-model="filtroEstado" class="select-box">
        <option value="TODOS">Todos</option>
        <option value="PROGRAMADA">Programadas</option>
        <option value="CONFIRMADA">Confirmadas</option>
        <option value="ATENDIDA">Atendidas</option>
        <option value="CANCELADA">Canceladas</option>
      </select>
    </div>

    <!-- Estado de Carga -->
    <div v-if="isLoading" class="loading">
      Cargando citas...
    </div>

    <!-- Tabla de Citas -->
    <div v-else class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>DNI Paciente</th>
            <th>DNI Odontólogo</th>
            <th>Motivo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citasFiltradas" :key="cita.cita_id">
            <td>{{ cita.fecha }}</td>
            <td>{{ cita.hora }}</td>
            <td>{{ cita.dni_paciente }}</td>
            <td>{{ cita.dni_odontologo }}</td>
            <td>{{ cita.motivo_consulta }}</td>
            <td>
              <span class="chip" :class="getEstadoClass(cita.estado)">
                {{ cita.estado }}
              </span>
            </td>
            <td>
              <!-- Acciones de ejemplo, llamando a updateEstadoCita del store -->
              <button
                v-if="cita.estado === 'PROGRAMADA'"
                @click="updateEstadoCita(cita.cita_id, 'CONFIRMADA')"
                class="btn btn-sm btn-success"
              >
                Confirmar
              </button>

              <button
                v-if="
                  cita.estado === 'PROGRAMADA' ||
                  cita.estado === 'CONFIRMADA'
                "
                @click="updateEstadoCita(cita.cita_id, 'CANCELADA')"
                class="btn btn-sm btn-danger"
              >
                Cancelar
              </button>
            </td>
          </tr>
          <tr v-if="citasFiltradas.length === 0">
            <td colspan="7" class="text-center">No hay citas para mostrar.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

/*ESTILOS PARA LA VISTA DE CITAS */
.citas-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.header {
  margin-bottom: 2rem;
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
}

.filters {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.select-box {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
}

.table-wrapper {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
}

.data-table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
}

.chip {
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
}

.bg-blue-100 { background-color: #dbeafe; }
.text-blue-800 { color: #1e40af; }
.bg-green-100 { background-color: #dcfce3; }
.text-green-800 { color: #166534; }
.bg-gray-100 { background-color: #f3f4f6; }
.text-gray-800 { color: #1f2937; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-800 { color: #991b1b; }

.btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  margin-right: 0.5rem;
}

.btn-sm { font-size: 0.8rem; }
.btn-success { background-color: #10b981; color: white; }
.btn-danger { background-color: #ef4444; color: white; }
.text-center { text-align: center; }
</style>
