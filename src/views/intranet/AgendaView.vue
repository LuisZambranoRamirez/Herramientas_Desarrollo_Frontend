<script setup lang="ts">
// CAMBIO: Importaciones reactivas de Vue y Vue Router
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import type { Cita, EstadoCita } from '@/types'

// CAMBIO: Interfaz extendida de Cita para incluir observaciones opcionales
export interface CitaDental extends Cita {
  observaciones?: string
}

// Contrato formal para el formulario del modal de cita
export interface FormCita {
  dni_paciente: string
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
  observaciones: string
  estado: EstadoCita
}

// CAMBIO: Vue Router para redirección rápida a pagos
const router = useRouter()

// CAMBIO: Clave de almacenamiento en localStorage
const STORAGE_KEY = 'citas'

// CAMBIO: Opciones de odontólogos tratantes de la clínica
const ODONTOLOGOS_OPCIONES = [
  { dni: '45678912', nombre: 'Dr. Roberto Sánchez - COP 45678' },
  { dni: '47891234', nombre: 'Dra. Patricia Vega - COP 47891' },
  { dni: '41234567', nombre: 'Dr. Carlos Mendoza - COP 38920' },
  { dni: '48901234', nombre: 'Dra. Lucía Alva - COP 51203' },
]

// CAMBIO: Franjas horarias clínicas de 30 minutos
const FRANJAS_HORARIAS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
]

// CAMBIO: Interfaces auxiliares para selectores dinámicos
interface PacienteOption {
  dni: string
  nombreCompleto: string
}

interface TratamientoOption {
  id: string | number
  nombre: string
}

// CAMBIO: Seed Data inicial para agendamiento clínico
const SEED_CITAS: CitaDental[] = [
  {
    cita_id: 'CIT-1001',
    dni_paciente: '72845631',
    dni_odontologo: '45678912',
    fecha: '2026-09-12',
    hora: '09:00',
    motivo_consulta: 'Limpieza Dental Profunda',
    diagnostico: null,
    estado: 'PROGRAMADA',
    fecha_registro: '2026-09-10T10:00:00',
  },
  {
    cita_id: 'CIT-1002',
    dni_paciente: '45678912',
    dni_odontologo: '47891234',
    fecha: '2026-09-12',
    hora: '10:30',
    motivo_consulta: 'Ortodoncia Control Mensual',
    diagnostico: null,
    estado: 'CONFIRMADA',
    fecha_registro: '2026-09-09T14:30:00',
  },
  {
    cita_id: 'CIT-1003',
    dni_paciente: '12345678',
    dni_odontologo: '45678912',
    fecha: '2026-09-11',
    hora: '15:00',
    motivo_consulta: 'Implante Dental Primera Cuota',
    diagnostico: 'Implante integrado exitosamente',
    estado: 'ATENDIDA',
    fecha_registro: '2026-09-08T11:20:00',
  },
  {
    cita_id: 'CIT-1004',
    dni_paciente: '87654321',
    dni_odontologo: '41234567',
    fecha: '2026-09-10',
    hora: '11:00',
    motivo_consulta: 'Evaluación y Diagnóstico',
    diagnostico: null,
    estado: 'CANCELADA',
    fecha_registro: '2026-09-07T09:15:00',
  },
]

// CAMBIO: Carga inicial desde localStorage con fallback a Seed Data
const cargarCitasIniciales = (): CitaDental[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error al leer citas de localStorage:', e)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CITAS))
  return [...SEED_CITAS]
}

// CAMBIO: Lector dinámico de pacientes desde localStorage
const cargarPacientesOpciones = (): PacienteOption[] => {
  try {
    const raw = localStorage.getItem('pacientes')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p: Record<string, unknown>, i: number) => {
          const dni = String(p.dni || `DNI-${i + 1}`)
          const nombres = (p.nombres as string) || ''
          const apellidos = (p.apellidos as string) || ''
          const nombreCompleto =
            (p.nombreCompleto as string) ||
            `${nombres} ${apellidos}`.trim() ||
            (p.nombre as string) ||
            'Paciente'
          return { dni, nombreCompleto }
        })
      }
    }
  } catch (e) {
    console.error('Error al leer pacientes:', e)
  }
  return [
    { dni: '72845631', nombreCompleto: 'Carlos Mendoza Ramos' },
    { dni: '45678912', nombreCompleto: 'Lucía Fernández Torres' },
    { dni: '12345678', nombreCompleto: 'Jorge Morales Vega' },
    { dni: '87654321', nombreCompleto: 'Ana Paula Gómez' },
    { dni: '23456789', nombreCompleto: 'María Elena Suárez' },
  ]
}

// CAMBIO: Lector dinámico de tratamientos desde localStorage
const cargarTratamientosOpciones = (): TratamientoOption[] => {
  try {
    const raw = localStorage.getItem('tratamientos')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t: Record<string, unknown>, i: number) => ({
          id: (t.id || i + 1) as string | number,
          nombre: (t.nombre || t.tratamiento || 'Consulta Odontológica') as string,
        }))
      }
    }
  } catch (e) {
    console.error('Error al leer tratamientos:', e)
  }
  return [
    { id: 1, nombre: 'Consulta y examen clínico general' },
    { id: 2, nombre: 'Profilaxis dental (limpieza simple)' },
    { id: 3, nombre: 'Restauración con resina simple' },
    { id: 4, nombre: 'Ortodoncia Control Mensual' },
    { id: 5, nombre: 'Implante Dental Primera Cuota' },
    { id: 6, nombre: 'Evaluación y Diagnóstico' },
  ]
}

// Estado reactivo principal
const citas = ref<CitaDental[]>(cargarCitasIniciales())
const busqueda = ref('')
const filtroEstado = ref<EstadoCita | 'TODOS'>('TODOS')

const opcionesPacientes = ref<PacienteOption[]>(cargarPacientesOpciones())
const opcionesTratamientos = ref<TratamientoOption[]>(cargarTratamientosOpciones())

// CAMBIO: Auto-guardado en localStorage ante cualquier modificación
watch(
  citas,
  (nuevasCitas) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasCitas))
  },
  { deep: true }
)

// CAMBIO: Recargar selectores dinámicos al montar el componente
onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_CITAS))
  }
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()
})

// CAMBIO: Métricas computadas reactivamente por estado
const totalPorEstado = computed(() => ({
  PROGRAMADA: citas.value.filter((c) => c.estado === 'PROGRAMADA').length,
  CONFIRMADA: citas.value.filter((c) => c.estado === 'CONFIRMADA').length,
  ATENDIDA: citas.value.filter((c) => c.estado === 'ATENDIDA').length,
  CANCELADA: citas.value.filter((c) => c.estado === 'CANCELADA').length,
}))

// CAMBIO: Búsqueda reactiva por nombre, DNI, odontólogo o motivo
const citasFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase().trim()

  return citas.value.filter((cita) => {
    // Filtro por estado
    if (filtroEstado.value !== 'TODOS' && cita.estado !== filtroEstado.value) {
      return false
    }

    // Si no hay búsqueda de texto, incluir
    if (!q) return true

    // Datos auxiliares del paciente y odontólogo
    const nombrePac = obtenerNombrePaciente(cita.dni_paciente).toLowerCase()
    const nombreDoc = obtenerNombreOdontologo(cita.dni_odontologo).toLowerCase()

    return (
      cita.dni_paciente.toLowerCase().includes(q) ||
      nombrePac.includes(q) ||
      cita.dni_odontologo.toLowerCase().includes(q) ||
      nombreDoc.includes(q) ||
      cita.motivo_consulta.toLowerCase().includes(q) ||
      cita.cita_id.toLowerCase().includes(q)
    )
  })
})

// CAMBIO: Configuración de estilos y etiquetas por estado de cita
const estadoConfig: Record<EstadoCita, { label: string; clase: string }> = {
  PROGRAMADA:   { label: 'Programada',   clase: 'estado-programada' },
  CONFIRMADA:   { label: 'Confirmada',   clase: 'estado-confirmada' },
  ATENDIDA:     { label: 'Atendida',     clase: 'estado-atendida' },
  CANCELADA:    { label: 'Cancelada',    clase: 'estado-cancelada' },
  NO_ASISTIO:   { label: 'No Asistió',   clase: 'estado-cancelada' },
  REPROGRAMADA: { label: 'Reprogramada', clase: 'estado-programada' },
  EN_PROCESO:   { label: 'En Proceso',   clase: 'estado-confirmada' },
}

// CAMBIO: Auxiliares para obtener nombres legibles
const obtenerNombrePaciente = (dni: string): string => {
  const enc = opcionesPacientes.value.find((p) => p.dni === dni)
  return enc ? enc.nombreCompleto : `Paciente (${dni})`
}

const obtenerNombreOdontologo = (dni: string): string => {
  const enc = ODONTOLOGOS_OPCIONES.find((doc) => doc.dni === dni)
  if (!enc || !enc.nombre) return `Dr. (${dni})`
  const partes = enc.nombre.split('-')
  const primerNombre = partes[0]
  return primerNombre ? primerNombre.trim() : enc.nombre.trim()
}

// CAMBIO: Control de modo del modal (crear | editar | null)
type ModoModal = 'crear' | 'editar' | null
const modoModal = ref<ModoModal>(null)
const idSeleccionado = ref<string | null>(null)

const formVacio = (): FormCita => {
  const hoy = new Date().toISOString().slice(0, 10)
  return {
    dni_paciente: '',
    dni_odontologo: ODONTOLOGOS_OPCIONES[0]?.dni || '45678912',
    fecha: hoy,
    hora: '09:00',
    motivo_consulta: '',
    observaciones: '',
    estado: 'PROGRAMADA',
  }
}

const form = ref<FormCita>(formVacio())

// CAMBIO: Handler para abrir modal en modo creación re-consultando localStorage
const abrirCrear = () => {
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()

  modoModal.value = 'crear'
  idSeleccionado.value = null
  form.value = formVacio()

  const primerPaciente = opcionesPacientes.value[0]
  if (primerPaciente) {
    form.value.dni_paciente = primerPaciente.dni
  }

  const primerTratamiento = opcionesTratamientos.value[0]
  if (primerTratamiento) {
    form.value.motivo_consulta = primerTratamiento.nombre
  }
}

// CAMBIO: Handler para abrir modal en modo edición
const abrirEditar = (cita: CitaDental) => {
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()

  modoModal.value = 'editar'
  idSeleccionado.value = cita.cita_id
  form.value = {
    dni_paciente: cita.dni_paciente,
    dni_odontologo: cita.dni_odontologo,
    fecha: cita.fecha,
    hora: cita.hora,
    motivo_consulta: cita.motivo_consulta,
    observaciones: cita.observaciones || '',
    estado: cita.estado,
  }
}

const cerrarModal = () => {
  modoModal.value = null
  idSeleccionado.value = null
}

// CAMBIO: Guardar creación o actualización de cita
const guardar = () => {
  if (!form.value.dni_paciente || !form.value.motivo_consulta.trim()) {
    return
  }

  if (modoModal.value === 'crear') {
    const nuevoId = `CIT-${Math.floor(1000 + Math.random() * 9000)}`
    const nuevaCita: CitaDental = {
      cita_id: nuevoId,
      dni_paciente: form.value.dni_paciente,
      dni_odontologo: form.value.dni_odontologo,
      fecha: form.value.fecha,
      hora: form.value.hora,
      motivo_consulta: form.value.motivo_consulta.trim(),
      diagnostico: null,
      estado: 'PROGRAMADA',
      fecha_registro: new Date().toISOString(),
      observaciones: form.value.observaciones?.trim() || undefined,
    }
    citas.value.unshift(nuevaCita)
  } else if (modoModal.value === 'editar' && idSeleccionado.value) {
    const citaExistente = citas.value.find((c) => c.cita_id === idSeleccionado.value)
    if (citaExistente) {
      citaExistente.dni_paciente = form.value.dni_paciente
      citaExistente.dni_odontologo = form.value.dni_odontologo
      citaExistente.fecha = form.value.fecha
      citaExistente.hora = form.value.hora
      citaExistente.motivo_consulta = form.value.motivo_consulta.trim()
      citaExistente.observaciones = form.value.observaciones?.trim() || undefined
      citaExistente.estado = form.value.estado
    }
  }

  cerrarModal()
}


// CAMBIO: Eliminar cita con confirmación
const eliminarCita = (citaId: string) => {
  if (confirm('¿Estás seguro de eliminar esta cita de la agenda?')) {
    citas.value = citas.value.filter((c) => c.cita_id !== citaId)
  }
}

// CAMBIO: Acción rápida para cobro interconectada con el módulo de Pagos
const irACobrar = (cita: CitaDental) => {
  const nombrePac = obtenerNombrePaciente(cita.dni_paciente)
  router.push({
    path: '/pagos',
    query: {
      dni: cita.dni_paciente,
      nombre: nombrePac,
    },
  })
}

// CAMBIO: Formateadores auxiliares
const formatFecha = (fecha: string) => {
  if (!fecha) return '—'
  const partes = fecha.slice(0, 10).split('-')
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }
  return fecha
}

const formatHora = (hora: string) => hora.slice(0, 5)
</script>

<template>
  <DashboardLayout>
    <div class="agenda-view">

      <!-- ── Cabecera y Botón Principal ────────────────────────── -->
      <div class="page-header">
        <div>
          <h2 class="view-title">Agenda y Citas Médicas</h2>
          <p class="page-subtitle">Gestiona las citas agendadas, doctores tratantes y estados clínicos.</p>
        </div>
        <!-- CAMBIO: Botón destacado + Nueva Cita -->
        <button class="btn-nuevo" type="button" @click="abrirCrear">
          + Nueva Cita
        </button>
      </div>

      <!-- ── Tarjetas de Estadísticas Reactivas ───────────────── -->
      <div class="header-stats">
        <div
          class="stat-pill stat-programada"
          :class="{ activa: filtroEstado === 'PROGRAMADA' }"
          @click="filtroEstado = filtroEstado === 'PROGRAMADA' ? 'TODOS' : 'PROGRAMADA'"
        >
          📋 {{ totalPorEstado.PROGRAMADA }} Programadas
        </div>
        <div
          class="stat-pill stat-confirmada"
          :class="{ activa: filtroEstado === 'CONFIRMADA' }"
          @click="filtroEstado = filtroEstado === 'CONFIRMADA' ? 'TODOS' : 'CONFIRMADA'"
        >
          ✅ {{ totalPorEstado.CONFIRMADA }} Confirmadas
        </div>
        <div
          class="stat-pill stat-atendida"
          :class="{ activa: filtroEstado === 'ATENDIDA' }"
          @click="filtroEstado = filtroEstado === 'ATENDIDA' ? 'TODOS' : 'ATENDIDA'"
        >
          🏁 {{ totalPorEstado.ATENDIDA }} Atendidas
        </div>
        <div
          class="stat-pill stat-cancelada"
          :class="{ activa: filtroEstado === 'CANCELADA' }"
          @click="filtroEstado = filtroEstado === 'CANCELADA' ? 'TODOS' : 'CANCELADA'"
        >
          ❌ {{ totalPorEstado.CANCELADA }} Canceladas
        </div>
      </div>

      <!-- ── Barra de Filtros y Búsqueda ──────────────────────── -->
      <div class="tabla-card filter-card">
        <div class="filtros-bar">
          <div class="filtro-group">
            <label>Estado:</label>
            <select v-model="filtroEstado" class="select-filtro">
              <option value="TODOS">Todos los estados</option>
              <option value="PROGRAMADA">Programadas</option>
              <option value="CONFIRMADA">Confirmadas</option>
              <option value="ATENDIDA">Atendidas</option>
              <option value="CANCELADA">Canceladas</option>
            </select>
          </div>

          <!-- CAMBIO: Búsqueda reactiva rápida -->
          <div class="search-group">
            <input
              v-model="busqueda"
              type="text"
              placeholder="Buscar por paciente, DNI, doctor o motivo..."
              class="search-input"
            />
          </div>

          <button
            v-if="filtroEstado !== 'TODOS' || busqueda"
            class="btn-reset"
            @click="() => { filtroEstado = 'TODOS'; busqueda = ''; }"
          >
            ✕ Limpiar filtros
          </button>
          <span class="resultado-count">{{ citasFiltradas.length }} cita(s)</span>
        </div>

        <!-- ── Estado Vacío ────────────────────────────────────── -->
        <div v-if="citasFiltradas.length === 0" class="estado-vacio">
          <span class="vacio-icono">📅</span>
          <p class="vacio-titulo">Sin citas registradas</p>
          <p class="vacio-desc">
            {{ busqueda || filtroEstado !== 'TODOS' ? 'No se encontraron citas con los criterios seleccionados.' : 'Agenda la primera cita con el botón "+ Nueva Cita".' }}
          </p>
        </div>

        <!-- ── Tabla de Citas ──────────────────────────────────── -->
        <div v-else class="tabla-responsive">
          <table class="tabla data-table">
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Paciente</th>
                <th>Odontólogo Tratante</th>
                <th>Motivo / Servicio</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="cita in citasFiltradas" :key="cita.cita_id" class="tabla-fila">

                <!-- Fecha y Hora -->
                <td class="td-fechahora">
                  <div class="font-semibold">{{ formatFecha(cita.fecha) }}</div>
                  <div class="font-mono text-muted">⏰ {{ formatHora(cita.hora) }}</div>
                </td>

                <!-- CAMBIO: Columna Paciente con Nombre completo y DNI secundario -->
                <td>
                  <div class="font-semibold text-main">{{ obtenerNombrePaciente(cita.dni_paciente) }}</div>
                  <div class="font-mono text-purple">DNI: {{ cita.dni_paciente }}</div>
                </td>

                <!-- CAMBIO: Columna Odontólogo con Nombre completo del doctor -->
                <td class="font-semibold text-main">
                  {{ obtenerNombreOdontologo(cita.dni_odontologo) }}
                </td>

                <!-- CAMBIO: Columna Motivo -->
                <td>
                  <span class="badge-motivo">{{ cita.motivo_consulta }}</span>
                </td>

                <!-- CAMBIO: Badges de Estado -->
                <td>
                  <span class="badge" :class="estadoConfig[cita.estado]?.clase">
                    {{ estadoConfig[cita.estado]?.label ?? cita.estado }}
                  </span>
                </td>

                <!-- Acciones: Cobrar (solo ATENDIDA) + Editar + Eliminar siempre -->
                <td class="td-acciones">
                  <button
                    v-if="cita.estado === 'ATENDIDA'"
                    class="btn-accion btn-cobrar"
                    title="Ir a registrar pago"
                    @click="irACobrar(cita)"
                  >
                    💳 Cobrar
                  </button>
                  <button
                    class="btn-accion btn-icon edit"
                    title="Editar cita"
                    @click="abrirEditar(cita)"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn-accion btn-icon delete"
                    title="Eliminar cita"
                    @click="eliminarCita(cita.cita_id)"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── Modal de Registro / Edición de Cita ──────────────── -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modoModal === 'crear' ? 'Agendar Nueva Cita' : 'Editar Cita' }}</h3>
          <button class="modal-close" @click="cerrarModal">✕</button>
        </div>

        <form @submit.prevent="guardar" class="form-grid">

          <!-- CAMBIO: Selector dinámico de Paciente mostrando [DNI] - Nombre Completo -->
          <div class="form-group form-full">
            <label>Paciente *</label>
            <select v-model="form.dni_paciente" required class="form-select">
              <option value="" disabled>Seleccione un paciente</option>
              <option
                v-for="pac in opcionesPacientes"
                :key="pac.dni"
                :value="pac.dni"
              >
                {{ pac.dni }} - {{ pac.nombreCompleto }}
              </option>
            </select>
          </div>

          <!-- CAMBIO: Selector de Odontólogo tratante -->
          <div class="form-group form-full">
            <label>Odontólogo Tratante *</label>
            <select v-model="form.dni_odontologo" required class="form-select">
              <option
                v-for="doc in ODONTOLOGOS_OPCIONES"
                :key="doc.dni"
                :value="doc.dni"
              >
                {{ doc.nombre }}
              </option>
            </select>
          </div>

          <!-- CAMBIO: Selector dinámico de Servicio / Motivo -->
          <div class="form-group form-full">
            <label>Servicio / Motivo de Consulta *</label>
            <select v-model="form.motivo_consulta" required class="form-select">
              <option value="" disabled>Seleccione el servicio o motivo</option>
              <option
                v-for="trat in opcionesTratamientos"
                :key="trat.id"
                :value="trat.nombre"
              >
                {{ trat.nombre }}
              </option>
            </select>
          </div>

          <!-- CAMBIO: Campo de Fecha -->
          <div class="form-group">
            <label>Fecha de la Cita *</label>
            <input v-model="form.fecha" type="date" required />
          </div>

          <!-- CAMBIO: Selector de Franja Horaria -->
          <div class="form-group">
            <label>Hora de la Cita *</label>
            <select v-model="form.hora" required class="form-select">
              <option v-for="hora in FRANJAS_HORARIAS" :key="hora" :value="hora">
                ⏰ {{ hora }}
              </option>
            </select>
          </div>

          <!-- Estado de la cita: solo visible en modo edición -->
          <div v-if="modoModal === 'editar'" class="form-group form-full">
            <label>Estado de la Cita *</label>
            <select v-model="form.estado" required class="form-select">
              <option value="PROGRAMADA">Programada</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="ATENDIDA">Atendida</option>
              <option value="CANCELADA">Cancelada</option>
            </select>
          </div>

          <!-- CAMBIO: Observaciones / Notas clínicas -->
          <div class="form-group form-full">
            <label>Notas / Observaciones Clínicas</label>
            <textarea
              v-model="form.observaciones"
              rows="2"
              placeholder="Notas sobre alergias, indicaciones previas o motivo específico..."
            ></textarea>
          </div>

          <div class="modal-footer form-full">
            <button type="button" class="btn-secundario" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="btn-primario">
              {{ modoModal === 'crear' ? 'Agendar Cita' : 'Actualizar Cita' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.agenda-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #1e293b);
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin: 0.25rem 0 0;
  font-size: 0.9rem;
}

.btn-nuevo {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.btn-nuevo:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.header-stats {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.stat-pill {
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  border: 1px solid transparent;
}

.stat-pill:hover { transform: translateY(-1px); opacity: 0.9; }

.stat-programada { background: #dbeafe; color: #1e40af; }
.stat-confirmada { background: #dcfce7; color: #166534; }
.stat-atendida   { background: #ede9fe; color: #5b21b6; }
.stat-cancelada  { background: #fee2e2; color: #991b1b; }

.stat-pill.activa {
  box-shadow: 0 0 0 2px #4f46e5;
}

.filter-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.filtros-bar {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.filtro-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-group label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #475569;
}

.select-filtro {
  padding: 0.55rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-main, #1e293b);
  outline: none;
  background: transparent;
  cursor: pointer;
}

.search-group {
  flex: 1;
  min-width: 240px;
}

.search-input {
  width: 100%;
  padding: 0.55rem 1rem;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 0.875rem;
  outline: none;
  color: var(--text-main, #1e293b);
  background: transparent;
}

.search-input:focus,
.select-filtro:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.btn-reset {
  padding: 0.45rem 0.85rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: transparent;
  color: #64748b;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}

.resultado-count {
  margin-left: auto;
  font-size: 0.82rem;
  color: #94a3b8;
  white-space: nowrap;
}

.tabla-responsive {
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
  background: var(--bg-disabled, #f8fafc);
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  color: var(--text-main, #334155);
  vertical-align: middle;
}

.tabla-fila:hover {
  background: var(--bg-disabled, #fafbff);
}

.font-mono { font-family: monospace; font-size: 0.85rem; }
.font-semibold { font-weight: 600; }
.text-main { color: var(--text-main, #1e293b); }
.text-muted { color: #64748b; }
.text-purple { color: #6366f1; font-weight: 600; }
.text-right { text-align: right; }

.badge-motivo {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.estado-programada { background: #dbeafe; color: #1e40af; }
.estado-confirmada { background: #dcfce7; color: #166534; }
.estado-atendida   { background: #ede9fe; color: #5b21b6; }
.estado-cancelada  { background: #fee2e2; color: #991b1b; }

.td-acciones {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  justify-content: flex-end;
}

.btn-accion {
  padding: 0.35rem 0.65rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
}

.btn-accion:hover { opacity: 0.85; transform: translateY(-1px); }

.btn-confirmar { background: #dcfce7; color: #15803d; }
.btn-atender   { background: #ede9fe; color: #5b21b6; }
.btn-cancelar  { background: #fee2e2; color: #b91c1c; }
.btn-cobrar    { background: #dcfce7; color: #15803d; }

.btn-icon {
  background: #f1f5f9;
  font-size: 0.85rem;
  padding: 0.35rem 0.55rem;
}

.btn-icon.edit   { background: #fef9c3; }
.btn-icon.delete { background: #fee2e2; }

.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 0.5rem;
  text-align: center;
}

.vacio-icono  { font-size: 2.5rem; }
.vacio-titulo { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.vacio-desc   { font-size: 0.875rem; color: #94a3b8; margin: 0; max-width: 340px; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
}

.modal {
  background: var(--bg-card, #ffffff);
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s ease;
  border: 1px solid var(--border-light, transparent);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-full  { grid-column: 1 / -1; }

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
}

.form-group input,
.form-group textarea,
.form-select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-main, #1e293b);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light, #e2e8f0);
}

.form-full.modal-footer { padding: 0; border-top: none; padding-top: 0.5rem; }

.btn-primario {
  padding: 0.55rem 1.2rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primario:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-secundario {
  padding: 0.55rem 1.2rem;
  background: var(--bg-card, white);
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secundario:hover { background: #f1f5f9; }

/* Dark mode */
:global(html.dark) .view-title        { color: #f8fafc; }
:global(html.dark) .page-subtitle     { color: #94a3b8; }
:global(html.dark) .filter-card       { background: var(--bg-card, #131b2e); border-color: #1e293b; }
:global(html.dark) .filtros-bar       { border-bottom-color: #1e293b; }
:global(html.dark) .filtro-group label{ color: #cbd5e1; }
:global(html.dark) .select-filtro     { color: #f8fafc; border-color: #334155; }
:global(html.dark) .search-input      { color: #f8fafc; border-color: #334155; }
:global(html.dark) .search-input:focus{ border-color: #818cf8; }
:global(html.dark) .data-table th     { background: #0f172a; color: #94a3b8; border-bottom-color: #1e293b; }
:global(html.dark) .data-table td     { color: #cbd5e1; border-bottom-color: #1e293b; }
:global(html.dark) .tabla-fila:hover  { background: rgba(255,255,255,0.02); }
:global(html.dark) .badge-motivo      { background: #1e293b; color: #cbd5e1; }
:global(html.dark) .btn-icon          { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .btn-icon.edit     { background: rgba(234,179,8,0.2); }
:global(html.dark) .btn-icon.delete   { background: rgba(239,68,68,0.2); }
:global(html.dark) .vacio-titulo      { color: #f8fafc; }
:global(html.dark) .modal-overlay     { background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
:global(html.dark) .modal             { background: #131b2e; border-color: #1e293b; }
:global(html.dark) .modal-header      { border-bottom-color: #1e293b; }
:global(html.dark) .modal-header h3   { color: #f8fafc; }
:global(html.dark) .form-group label  { color: #cbd5e1; }
:global(html.dark) .form-group input,
:global(html.dark) .form-group textarea,
:global(html.dark) .form-select       { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .form-select option{ background: #131b2e; color: #f8fafc; }
:global(html.dark) .btn-secundario    { background: #1e293b; color: #cbd5e1; border-color: #334155; }
:global(html.dark) .btn-secundario:hover { background: #334155; color: #f8fafc; }

@media (max-width: 600px) {
  .form-grid   { grid-template-columns: 1fr; }
  .form-full   { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
