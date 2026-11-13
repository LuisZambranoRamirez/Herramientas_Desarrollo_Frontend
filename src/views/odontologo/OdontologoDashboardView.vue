<template>
  <DashboardLayout>
    <div class="odontologo-dashboard">
      <!-- Banner de Bienvenida y Perfil del Odontólogo -->
      <section class="profile-hero-card">
        <div class="hero-main">
          <div class="avatar-badge">
            <span>{{ inicialesDoc }}</span>
          </div>
          <div class="hero-info">
            <div class="doctor-title-row">
              <h2>Dr(a). {{ doctorNombreCompleto }}</h2>
              <span class="specialty-pill">{{ doctorEspecialidad }}</span>
            </div>
            <p class="hero-subtitle">
              Colegiatura: <strong>{{ doctorColegiatura }}</strong> | 
              Usuario: <strong>{{ authStore.currentUser?.username }}</strong>
            </p>
          </div>
        </div>
        <div class="hero-actions">
          <button class="btn-primary" @click="abrirModalTratamiento()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Tratamiento
          </button>
        </div>
      </section>

      <!-- Tarjetas de Métricas del Odontólogo -->
      <section class="stats-grid">
        <div class="metric-card">
          <div class="metric-icon blue">📅</div>
          <div class="metric-data">
            <span class="metric-value">{{ metrics.citasHoy }}</span>
            <span class="metric-label">Citas para Hoy</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon amber">⏳</div>
          <div class="metric-data">
            <span class="metric-value">{{ metrics.pendientes }}</span>
            <span class="metric-label">Citas Pendientes</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon green">✅</div>
          <div class="metric-data">
            <span class="metric-value">{{ metrics.atendidas }}</span>
            <span class="metric-label">Citas Atendidas</span>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon purple">👥</div>
          <div class="metric-data">
            <span class="metric-value">{{ pacientes.length }}</span>
            <span class="metric-label">Pacientes en Sistema</span>
          </div>
        </div>
      </section>

      <!-- Pestañas de Navegación del Módulo -->
      <div class="section-tabs">
        <button
          class="tab-btn"
          :class="{ active: tabActiva === 'citas' }"
          @click="tabActiva = 'citas'"
        >
          📅 Mis Citas Asignadas ({{ misCitas.length }})
        </button>
        <button
          class="tab-btn"
          :class="{ active: tabActiva === 'pacientes' }"
          @click="tabActiva = 'pacientes'"
        >
          📋 Ficha y Tratamientos de Pacientes
        </button>
      </div>

      <!-- SECCIÓN 1: MIS CITAS ASIGNADAS -->
      <section v-if="tabActiva === 'citas'" class="content-section">
        <div class="table-card">
          <div class="card-toolbar">
            <div class="search-box">
              <input
                v-model="busquedaCita"
                type="text"
                placeholder="Buscar por paciente, DNI o motivo..."
                class="search-input"
              />
            </div>
            <div class="filter-group">
              <label>Estado:</label>
              <select v-model="filtroEstadoCita" class="filter-select">
                <option value="TODOS">Todos los estados</option>
                <option value="PROGRAMADA">Programadas</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="ATENDIDA">Atendidas</option>
                <option value="CANCELADA">Canceladas</option>
                <option value="NO_ASISTIO">No Asistió</option>
              </select>
            </div>
          </div>

          <div v-if="cargandoCitas" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando citas asignadas...</p>
          </div>

          <div v-else-if="citasFiltradas.length === 0" class="empty-state">
            <p>No se encontraron citas con los filtros seleccionados.</p>
          </div>

          <div v-else class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha & Hora</th>
                  <th>Paciente</th>
                  <th>Motivo de Consulta</th>
                  <th>Diagnóstico</th>
                  <th>Estado</th>
                  <th class="text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in citasFiltradas" :key="c.cita_id">
                  <td class="nowrap">
                    <strong>{{ formatFecha(c.fecha) }}</strong>
                    <div class="text-muted small">{{ c.hora }}</div>
                  </td>
                  <td>
                    <div class="patient-name">{{ getNombrePaciente(c) }}</div>
                    <div class="text-muted small">DNI: {{ c.dni_paciente }}</div>
                  </td>
                  <td>{{ c.motivo_consulta }}</td>
                  <td>
                    <span v-if="c.diagnostico" class="diagnosis-text">{{ c.diagnostico }}</span>
                    <span v-else class="text-muted italic">Sin diagnóstico</span>
                  </td>
                  <td>
                    <span :class="['badge-status', getBadgeClass(c.estado)]">
                      {{ c.estado }}
                    </span>
                  </td>
                  <td class="text-right nowrap">
                    <button
                      class="btn-sm btn-outline"
                      title="Actualizar estado y diagnóstico"
                      @click="abrirModalEstado(c)"
                    >
                      ✏️ Atender
                    </button>
                    <button
                      class="btn-sm btn-ghost"
                      title="Ver tratamientos del paciente"
                      @click="seleccionarPacientePorDni(c.dni_paciente)"
                    >
                      📁 Ficha
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 2: HISTORIAL Y TRATAMIENTOS DE PACIENTES -->
      <section v-if="tabActiva === 'pacientes'" class="content-section">
        <div class="patient-history-grid">
          <!-- Columna Izquierda: Directorio de Pacientes -->
          <div class="patient-list-card">
            <div class="list-header">
              <h3>Directorio Clínico</h3>
              <input
                v-model="busquedaPaciente"
                type="text"
                placeholder="Buscar por DNI o nombre..."
                class="search-input"
              />
            </div>
            <div v-if="cargandoPacientes" class="loading-state">
              <div class="spinner"></div>
              <p>Cargando pacientes...</p>
            </div>
            <div v-else class="patient-items">
              <div
                v-for="p in pacientesFiltrados"
                :key="p.dni"
                class="patient-item"
                :class="{ active: pacienteSeleccionado?.dni === p.dni }"
                @click="seleccionarPaciente(p)"
              >
                <div class="patient-item-avatar">{{ p.nombres.charAt(0) }}</div>
                <div class="patient-item-info">
                  <strong>{{ p.nombres }} {{ p.apellidos }}</strong>
                  <span class="text-muted small">DNI: {{ p.dni }} | Tel: {{ p.telefono || 'S/N' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Columna Derecha: Detalle de Ficha y Tratamientos -->
          <div class="patient-detail-card">
            <div v-if="!pacienteSeleccionado" class="empty-selection">
              <div class="empty-icon">📂</div>
              <h4>Selecciona un paciente del directorio</h4>
              <p class="text-muted">Podrás consultar su información médica e historial de tratamientos odontológicos.</p>
            </div>

            <div v-else class="patient-dossier">
              <!-- Cabecera de la Ficha -->
              <div class="dossier-header">
                <div>
                  <h3>{{ pacienteSeleccionado.nombres }} {{ pacienteSeleccionado.apellidos }}</h3>
                  <p class="text-muted">
                    DNI: <strong>{{ pacienteSeleccionado.dni }}</strong> | 
                    Correo: <strong>{{ pacienteSeleccionado.correo || 'No registrado' }}</strong> | 
                    Tel: <strong>{{ pacienteSeleccionado.telefono || 'No registrado' }}</strong>
                  </p>
                  <p v-if="pacienteSeleccionado.observaciones" class="allergy-notice">
                    ⚠️ <strong>Observaciones Clínicas / Alergias:</strong> {{ pacienteSeleccionado.observaciones }}
                  </p>
                </div>
                <button class="btn-primary btn-sm" @click="abrirModalTratamiento(pacienteSeleccionado)">
                  + Nuevo Tratamiento
                </button>
              </div>

              <!-- Historial de Tratamientos -->
              <div class="dossier-treatments">
                <h4>Historial de Tratamientos Odontológicos</h4>

                <div v-if="cargandoTratamientos" class="loading-state">
                  <div class="spinner"></div>
                  <p>Consultando tratamientos...</p>
                </div>

                <div v-else-if="tratamientosPaciente.length === 0" class="empty-state">
                  <p>Este paciente aún no tiene tratamientos registrados.</p>
                </div>

                <div v-else class="treatment-cards">
                  <div
                    v-for="t in tratamientosPaciente"
                    :key="t.tratamiento_paciente_id"
                    class="treatment-card"
                  >
                    <div class="treatment-card-header">
                      <div>
                        <strong class="treatment-name">{{ formatTratamientoNombre(t.tratamiento) }}</strong>
                        <div class="text-muted small">Registrado el {{ formatFecha(t.fecha_registro) }}</div>
                      </div>
                      <div class="treatment-badge-group">
                        <span class="price-tag">S/ {{ t.precio.toFixed(2) }}</span>
                        <span :class="['badge-status', getTratamientoBadgeClass(t.estado)]">
                          {{ t.estado }}
                        </span>
                      </div>
                    </div>
                    <div v-if="t.observaciones" class="treatment-notes">
                      <strong>Evolución / Notas:</strong> {{ t.observaciones }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MODAL 1: ATENDER CITA / ACTUALIZAR ESTADO & DIAGNÓSTICO -->
      <div v-if="mostrarModalEstado" class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Atención de Cita Médica</h3>
            <button class="modal-close" @click="mostrarModalEstado = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="modal-info-box">
              <p><strong>Paciente:</strong> {{ citaSeleccionada ? getNombrePaciente(citaSeleccionada) : '' }}</p>
              <p><strong>Fecha/Hora:</strong> {{ citaSeleccionada?.fecha }} a las {{ citaSeleccionada?.hora }}</p>
              <p><strong>Motivo:</strong> {{ citaSeleccionada?.motivo_consulta }}</p>
            </div>

            <div class="form-group">
              <label>Estado de la Cita:</label>
              <select v-model="estadoForm.estado" class="form-control">
                <option value="PROGRAMADA">PROGRAMADA</option>
                <option value="CONFIRMADA">CONFIRMADA</option>
                <option value="EN_PROCESO">EN_PROCESO</option>
                <option value="ATENDIDA">ATENDIDA (Completada)</option>
                <option value="CANCELADA">CANCELADA</option>
                <option value="NO_ASISTIO">NO ASISTIÓ</option>
              </select>
            </div>

            <div class="form-group">
              <label>Diagnóstico y Observaciones Médicas:</label>
              <textarea
                v-model="estadoForm.diagnostico"
                rows="4"
                class="form-control"
                placeholder="Describa el diagnóstico, hallazgos clínicos y recomendaciones para el paciente..."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="mostrarModalEstado = false">Cancelar</button>
            <button
              class="btn-primary"
              :disabled="guardandoEstado"
              @click="guardarEstadoCita"
            >
              {{ guardandoEstado ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
          </div>
        </div>
      </div>

      <!-- MODAL 2: REGISTRAR NUEVO TRATAMIENTO -->
      <div v-if="mostrarModalTratamiento" class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Registrar Plan de Tratamiento</h3>
            <button class="modal-close" @click="mostrarModalTratamiento = false">&times;</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Paciente:</label>
              <select v-model="tratamientoForm.dni_paciente" class="form-control">
                <option disabled value="">Seleccione un paciente</option>
                <option v-for="p in pacientes" :key="p.dni" :value="p.dni">
                  {{ p.nombres }} {{ p.apellidos }} (DNI: {{ p.dni }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Procedimiento / Tratamiento Odontológico:</label>
              <select v-model="tratamientoForm.tratamiento" class="form-control">
                <option value="Limpieza_dental_profunda">Limpieza Dental Profunda</option>
                <option value="Aplicacion_de_fluor">Aplicación de Flúor</option>
                <option value="Selladores_de_fosas_y_fisuras">Selladores de Fosas y Fisuras</option>
                <option value="Restauracion_con_resina">Restauración con Resina</option>
                <option value="Ortopedia_maxilar">Ortopedia Maxilar</option>
                <option value="Implante_dental">Implante Dental</option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio (S/):</label>
                <input
                  v-model.number="tratamientoForm.precio"
                  type="number"
                  min="0"
                  step="10"
                  class="form-control"
                  placeholder="0.00"
                />
              </div>

              <div class="form-group">
                <label>Estado Inicial:</label>
                <select v-model="tratamientoForm.estado" class="form-control">
                  <option value="INICIADO">INICIADO</option>
                  <option value="EN_PROCESO">EN_PROCESO</option>
                  <option value="PENDIENTE">PENDIENTE</option>
                  <option value="FINALIZADO">FINALIZADO</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Plan de Trabajo / Notas Clínicas:</label>
              <textarea
                v-model="tratamientoForm.observaciones"
                rows="3"
                class="form-control"
                placeholder="Detalles del procedimiento, piezas dentales involucradas, etc."
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="mostrarModalTratamiento = false">Cancelar</button>
            <button
              class="btn-primary"
              :disabled="guardandoTratamiento || !tratamientoForm.dni_paciente"
              @click="guardarNuevoTratamiento"
            >
              {{ guardandoTratamiento ? 'Registrando...' : 'Registrar Tratamiento' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { odontologosService } from '@/services/odontologos.service'
import { citasService } from '@/services/citas.service'
import { pacientesService } from '@/services/pacientes.service'
import { tratamientosService } from '@/services/tratamientos.service'
import type {
  Odontologo,
  Cita,
  Paciente,
  TratamientoPaciente,
  EstadoCita,
  EstadoTratamiento,
  TratamientoOdontologico,
} from '@/types'

const authStore = useAuthStore()

// Datos del Perfil del Odontólogo
const doctorPerfil = ref<Odontologo | null>(null)
const doctorNombreCompleto = computed(() => {
  if (doctorPerfil.value?.nombres) {
    return `${doctorPerfil.value.nombres} ${doctorPerfil.value.apellidos}`.trim()
  }
  return authStore.currentUser?.nombre_completo || authStore.currentUser?.username || 'Especialista'
})

const inicialesDoc = computed(() => {
  return doctorNombreCompleto.value.charAt(0).toUpperCase() || 'D'
})

const doctorEspecialidad = computed(() => {
  return doctorPerfil.value?.especialidad || 'ODONTOLOGÍA GENERAL'
})

const doctorColegiatura = computed(() => {
  return doctorPerfil.value?.colegiatura || 'REGISTRADO'
})

// Pestaña Activa ('citas' | 'pacientes')
const tabActiva = ref<'citas' | 'pacientes'>('citas')

// Citas
const misCitas = ref<Cita[]>([])
const cargandoCitas = ref(false)
const busquedaCita = ref('')
const filtroEstadoCita = ref<string>('TODOS')

// Pacientes
const pacientes = ref<Paciente[]>([])
const cargandoPacientes = ref(false)
const busquedaPaciente = ref('')
const pacienteSeleccionado = ref<Paciente | null>(null)

// Tratamientos del paciente seleccionado
const tratamientosPaciente = ref<TratamientoPaciente[]>([])
const cargandoTratamientos = ref(false)

// Modales
const mostrarModalEstado = ref(false)
const guardandoEstado = ref(false)
const citaSeleccionada = ref<Cita | null>(null)
const estadoForm = ref<{ estado: string; diagnostico: string }>({
  estado: 'ATENDIDA',
  diagnostico: '',
})

const mostrarModalTratamiento = ref(false)
const guardandoTratamiento = ref(false)
const tratamientoForm = ref<{
  dni_paciente: string
  tratamiento: TratamientoOdontologico
  precio: number
  estado: EstadoTratamiento
  observaciones: string
}>({
  dni_paciente: '',
  tratamiento: 'Limpieza_dental_profunda',
  precio: 100,
  estado: 'INICIADO',
  observaciones: '',
})

// Métricas Computadas
const metrics = computed(() => {
  const hoyStr = new Date().toISOString().slice(0, 10)
  const citasHoy = misCitas.value.filter((c) => c.fecha === hoyStr).length
  const pendientes = misCitas.value.filter((c) => c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA').length
  const atendidas = misCitas.value.filter((c) => c.estado === 'ATENDIDA').length

  return {
    citasHoy,
    pendientes,
    atendidas,
  }
})

// Filtro de Citas
const citasFiltradas = computed(() => {
  const q = busquedaCita.value.toLowerCase().trim()
  return misCitas.value.filter((c) => {
    if (filtroEstadoCita.value !== 'TODOS' && c.estado !== filtroEstadoCita.value) {
      return false
    }
    if (!q) return true
    const nombre = getNombrePaciente(c).toLowerCase()
    return (
      c.dni_paciente.toLowerCase().includes(q) ||
      nombre.includes(q) ||
      c.motivo_consulta.toLowerCase().includes(q)
    )
  })
})

// Filtro de Pacientes
const pacientesFiltrados = computed(() => {
  const q = busquedaPaciente.value.toLowerCase().trim()
  if (!q) return pacientes.value
  return pacientes.value.filter((p) => {
    const full = `${p.nombres} ${p.apellidos}`.toLowerCase()
    return p.dni.includes(q) || full.includes(q) || (p.correo && p.correo.toLowerCase().includes(q))
  })
})

// Helpers
function getNombrePaciente(c: Cita): string {
  if (c.paciente) {
    const full = `${c.paciente.nombres} ${c.paciente.apellidos}`.trim()
    if (full) return full
  }
  const found = pacientes.value.find((p) => p.dni === c.dni_paciente)
  if (found) return `${found.nombres} ${found.apellidos}`
  return `Paciente (${c.dni_paciente})`
}

function formatFecha(fechaStr: string): string {
  if (!fechaStr) return ''
  try {
    const datePart = fechaStr.split('T')[0]
    if (!datePart) return fechaStr
    const parts = datePart.split('-')
    if (parts.length < 3 || !parts[0] || !parts[1] || !parts[2]) return fechaStr
    return `${parts[2]}/${parts[1]}/${parts[0]}`
  } catch {
    return fechaStr
  }
}

function formatTratamientoNombre(nombre: string): string {
  if (!nombre) return ''
  return nombre.replace(/_/g, ' ')
}

function getBadgeClass(estado: EstadoCita): string {
  switch (estado) {
    case 'PROGRAMADA':
    case 'REPROGRAMADA':
      return 'badge-blue'
    case 'CONFIRMADA':
    case 'EN_PROCESO':
      return 'badge-purple'
    case 'ATENDIDA':
      return 'badge-green'
    case 'CANCELADA':
    case 'NO_ASISTIO':
      return 'badge-red'
    default:
      return 'badge-gray'
  }
}

function getTratamientoBadgeClass(estado: EstadoTratamiento): string {
  switch (estado) {
    case 'INICIADO':
      return 'badge-blue'
    case 'EN_PROCESO':
      return 'badge-amber'
    case 'FINALIZADO':
      return 'badge-green'
    default:
      return 'badge-gray'
  }
}

// Carga Inicial de Datos
async function cargarDatos() {
  cargandoCitas.value = true
  cargandoPacientes.value = true

  try {
    const [perfil, citasList, pacientesList] = await Promise.all([
      odontologosService.getMe().catch(() => null),
      citasService.getMisCitas().catch(() => [] as Cita[]),
      pacientesService.getAll().catch(() => [] as Paciente[]),
    ])

    doctorPerfil.value = perfil
    misCitas.value = citasList
    pacientes.value = pacientesList

    if (pacientesList.length > 0 && pacientesList[0]) {
      seleccionarPaciente(pacientesList[0])
    }
  } catch (err) {
    console.error('Error al inicializar panel de odontólogo:', err)
  } finally {
    cargandoCitas.value = false
    cargandoPacientes.value = false
  }
}

// Selección de Paciente y Carga de Tratamientos
async function seleccionarPaciente(paciente: Paciente) {
  pacienteSeleccionado.value = paciente
  cargandoTratamientos.value = true
  try {
    tratamientosPaciente.value = await tratamientosService.getByPaciente(paciente.dni)
  } catch {
    tratamientosPaciente.value = []
  } finally {
    cargandoTratamientos.value = false
  }
}

function seleccionarPacientePorDni(dni: string) {
  tabActiva.value = 'pacientes'
  const p = pacientes.value.find((pac) => pac.dni === dni)
  if (p) {
    seleccionarPaciente(p)
  }
}

// Gestión de Estado de Cita
function abrirModalEstado(cita: Cita) {
  citaSeleccionada.value = cita
  estadoForm.value = {
    estado: cita.estado === 'PROGRAMADA' ? 'ATENDIDA' : cita.estado,
    diagnostico: cita.diagnostico || '',
  }
  mostrarModalEstado.value = true
}

async function guardarEstadoCita() {
  if (!citaSeleccionada.value) return
  guardandoEstado.value = true
  try {
    await citasService.actualizarEstado(citaSeleccionada.value.cita_id, {
      estado: estadoForm.value.estado,
      diagnostico: estadoForm.value.diagnostico,
    })
    citaSeleccionada.value.estado = estadoForm.value.estado as EstadoCita
    citaSeleccionada.value.diagnostico = estadoForm.value.diagnostico
    mostrarModalEstado.value = false
  } catch (error: any) {
    alert(error.message || 'Error al actualizar estado de la cita')
  } finally {
    guardandoEstado.value = false
  }
}

// Registro de Nuevo Tratamiento
function abrirModalTratamiento(paciente?: Paciente) {
  if (paciente) {
    tratamientoForm.value.dni_paciente = paciente.dni
  } else if (pacienteSeleccionado.value) {
    tratamientoForm.value.dni_paciente = pacienteSeleccionado.value.dni
  } else if (pacientes.value.length > 0 && pacientes.value[0]) {
    tratamientoForm.value.dni_paciente = pacientes.value[0].dni
  }
  tratamientoForm.value.observaciones = ''
  tratamientoForm.value.precio = 120
  tratamientoForm.value.estado = 'INICIADO'
  mostrarModalTratamiento.value = true
}

async function guardarNuevoTratamiento() {
  if (!doctorPerfil.value?.dni && !authStore.currentUser) {
    alert('No se pudo identificar el DNI del odontólogo en sesión.')
    return
  }

  const dniOdontologo = doctorPerfil.value?.dni || ''
  guardandoTratamiento.value = true

  try {
    await tratamientosService.create({
      dni_paciente: tratamientoForm.value.dni_paciente,
      dni_odontologo: dniOdontologo,
      tratamiento: tratamientoForm.value.tratamiento,
      precio: tratamientoForm.value.precio,
      estado: tratamientoForm.value.estado,
      observaciones: tratamientoForm.value.observaciones,
    })

    mostrarModalTratamiento.value = false

    // Refrescar historial si el paciente tratado es el seleccionado
    if (pacienteSeleccionado.value?.dni === tratamientoForm.value.dni_paciente) {
      seleccionarPaciente(pacienteSeleccionado.value)
    }
  } catch (error: any) {
    alert(error.message || 'Error al registrar el tratamiento.')
  } finally {
    guardandoTratamiento.value = false
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.odontologo-dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Banner de Perfil */
.profile-hero-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  padding: 24px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
  gap: 16px;
}

.hero-main {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-badge {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: var(--accent-teal-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 26px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.3);
}

.doctor-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.doctor-title-row h2 {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.specialty-pill {
  background: var(--primary-purple-light);
  color: var(--primary-purple);
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin: 4px 0 0 0;
}

/* Métricas */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.metric-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: var(--shadow-sm);
}

.metric-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
}
.metric-icon.blue { background: #e0f2fe; }
.metric-icon.amber { background: #fef3c7; }
.metric-icon.green { background: #dcfce7; }
.metric-icon.purple { background: #ede9fe; }

.metric-data {
  display: flex;
  flex-direction: column;
}

.metric-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  line-height: 1.2;
}

.metric-label {
  font-size: 13px;
  color: var(--text-muted);
}

/* Pestañas */
.section-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid var(--border-light);
  padding-bottom: 4px;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  padding: 10px 18px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  color: var(--primary-purple);
  background: var(--primary-purple-light);
}

.tab-btn.active {
  color: var(--primary-purple);
  background: var(--primary-purple-light);
  border-bottom: 3px solid var(--primary-purple);
}

/* Tablas y Controles */
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-toolbar {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  border-bottom: 1px solid var(--border-light);
}

.search-input {
  padding: 8px 14px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-main);
  font-size: 14px;
  min-width: 260px;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-purple);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--text-muted);
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-main);
  font-size: 14px;
}

.table-responsive {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 14px;
}

.data-table th {
  background: var(--bg-page);
  color: var(--text-muted);
  font-weight: 600;
  padding: 12px 18px;
  border-bottom: 1px solid var(--border-light);
}

.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
}

.nowrap { white-space: nowrap; }
.text-right { text-align: right; }
.patient-name { font-weight: 600; }
.diagnosis-text { font-size: 13px; color: var(--text-main); }
.small { font-size: 12px; }

/* Badges */
.badge-status {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
}
.badge-blue { background: #dbeafe; color: #1e40af; }
.badge-purple { background: #ede9fe; color: #5b21b6; }
.badge-green { background: #dcfce7; color: #166534; }
.badge-red { background: #fee2e2; color: #991b1b; }
.badge-amber { background: #fef3c7; color: #92400e; }
.badge-gray { background: #f1f5f9; color: #475569; }

/* Botones */
.btn-primary {
  background: var(--primary-purple);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--primary-purple-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--primary-purple);
  color: var(--primary-purple);
  font-weight: 600;
}
.btn-outline:hover {
  background: var(--primary-purple-light);
}

.btn-ghost {
  background: transparent;
  border: 1px solid var(--border-light);
  color: var(--text-main);
  margin-left: 6px;
}
.btn-ghost:hover {
  background: var(--bg-page);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Layout de Ficha de Pacientes */
.patient-history-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 20px;
}

.patient-list-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
  max-height: 650px;
  display: flex;
  flex-direction: column;
}

.list-header h3 {
  font-size: 16px;
  margin: 0 0 12px 0;
  color: var(--text-main);
}
.list-header .search-input {
  width: 100%;
  margin-bottom: 12px;
  box-sizing: border-box;
}

.patient-items {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.patient-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.patient-item:hover {
  background: var(--bg-page);
}

.patient-item.active {
  background: var(--primary-purple-light);
  border-color: var(--primary-purple);
}

.patient-item-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-purple);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.patient-item-info {
  display: flex;
  flex-direction: column;
}

.patient-detail-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.dossier-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--border-light);
  gap: 16px;
  flex-wrap: wrap;
}

.dossier-header h3 {
  font-size: 20px;
  margin: 0 0 6px 0;
  color: var(--text-main);
}

.allergy-notice {
  background: #fef2f2;
  color: #991b1b;
  border-left: 3px solid #ef4444;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 10px 0 0 0;
  font-size: 13px;
}

.dossier-treatments {
  margin-top: 20px;
}

.dossier-treatments h4 {
  font-size: 16px;
  margin: 0 0 16px 0;
  color: var(--text-main);
}

.treatment-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.treatment-card {
  border: 1px solid var(--border-light);
  border-radius: 10px;
  padding: 16px;
  background: var(--bg-page);
}

.treatment-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.treatment-name {
  font-size: 15px;
  color: var(--text-main);
}

.treatment-badge-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.price-tag {
  font-weight: 700;
  color: var(--primary-purple);
  font-size: 14px;
}

.treatment-notes {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-main);
  background: var(--bg-card);
  padding: 8px 12px;
  border-radius: 6px;
}

/* Modales */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
}

.modal-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: var(--shadow-lg);
  overflow: hidden;
}

.modal-header {
  padding: 18px 24px;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  color: var(--text-main);
}

.modal-close {
  background: transparent;
  border: none;
  font-size: 24px;
  color: var(--text-muted);
  cursor: pointer;
}

.modal-body {
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-info-box {
  background: var(--bg-page);
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-main);
}

.modal-info-box p {
  margin: 4px 0;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.form-control {
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  background: var(--bg-input);
  color: var(--text-main);
  font-size: 14px;
}
.form-control:focus {
  outline: none;
  border-color: var(--primary-purple);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Estados Vacíos & Spinners */
.loading-state, .empty-state, .empty-selection {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 40px;
  margin-bottom: 10px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-light);
  border-top-color: var(--primary-purple);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 12px auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .patient-history-grid {
    grid-template-columns: 1fr;
  }
}
</style>
