<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { citasService } from '@/services/citas.service'
import { pacientesService } from '@/services/pacientes.service'
import type { Cita, CitaOdontologoResumen, EstadoCita, Paciente } from '@/types'

export interface FormCita {
  dni_paciente: string
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
  diagnostico: string
  estado: EstadoCita
}

interface PacienteOption {
  dni: string
  nombreCompleto: string
}

const router = useRouter()

const FRANJAS_HORARIAS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00',
]

const MOTIVOS_SUGERIDOS = [
  'Consulta y examen clínico general',
  'Limpieza Dental Profunda',
  'Profilaxis dental (limpieza simple)',
  'Restauración con resina simple',
  'Ortodoncia Control Mensual',
  'Implante Dental',
  'Evaluación y Diagnóstico',
]

// Estado reactivo conectado a la API
const citas = ref<Cita[]>([])
const opcionesPacientes = ref<PacienteOption[]>([])
const opcionesOdontologos = ref<CitaOdontologoResumen[]>([])

const cargando = ref(false)
const guardando = ref(false)
const procesandoId = ref<string | null>(null)
const errorCarga = ref<string | null>(null)
const errorAccion = ref<string | null>(null)
const errorModal = ref<string | null>(null)

const busqueda = ref('')
const filtroEstado = ref<EstadoCita | 'TODOS'>('TODOS')

const cargarDatos = async () => {
  cargando.value = true
  errorCarga.value = null
  try {
    const [citasData, odontologosData, pacientesData] = await Promise.all([
      citasService.getAll(),
      citasService.getOdontologos(),
      pacientesService.getAll().catch(() => [] as Paciente[]),
    ])
    citas.value = citasData
    opcionesOdontologos.value = odontologosData
    opcionesPacientes.value = pacientesData.map((p) => ({
      dni: p.dni,
      nombreCompleto: `${p.nombres} ${p.apellidos}`.trim(),
    }))
  } catch (err) {
    errorCarga.value =
      err instanceof Error ? err.message : 'No se pudieron cargar las citas desde el servidor.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

// Métricas computadas reactivamente por estado
const totalPorEstado = computed(() => ({
  PROGRAMADA: citas.value.filter((c) => c.estado === 'PROGRAMADA').length,
  CONFIRMADA: citas.value.filter((c) => c.estado === 'CONFIRMADA').length,
  ATENDIDA: citas.value.filter((c) => c.estado === 'ATENDIDA').length,
  CANCELADA: citas.value.filter((c) => c.estado === 'CANCELADA').length,
}))

const obtenerNombrePaciente = (cita: Cita): string => {
  if (cita.paciente) {
    const full = `${cita.paciente.nombres} ${cita.paciente.apellidos}`.trim()
    if (full) return full
  }
  const enc = opcionesPacientes.value.find((p) => p.dni === cita.dni_paciente)
  return enc ? enc.nombreCompleto : `Paciente (${cita.dni_paciente})`
}

const obtenerNombreOdontologo = (cita: Cita): string => {
  if (cita.odontologo) {
    const full = `${cita.odontologo.nombres} ${cita.odontologo.apellidos}`.trim()
    if (full) return `Dr(a). ${full}`
  }
  const enc = opcionesOdontologos.value.find((doc) => doc.dni === cita.dni_odontologo)
  return enc ? `Dr(a). ${enc.nombres} ${enc.apellidos}`.trim() : `Dr. (${cita.dni_odontologo})`
}

// Búsqueda reactiva por nombre, DNI, odontólogo o motivo
const citasFiltradas = computed(() => {
  const q = busqueda.value.toLowerCase().trim()

  return citas.value.filter((cita) => {
    if (filtroEstado.value !== 'TODOS' && cita.estado !== filtroEstado.value) {
      return false
    }

    if (!q) return true

    const nombrePac = obtenerNombrePaciente(cita).toLowerCase()
    const nombreDoc = obtenerNombreOdontologo(cita).toLowerCase()

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

const estadoConfig: Record<EstadoCita, { label: string; clase: string }> = {
  PROGRAMADA:   { label: 'Programada',   clase: 'estado-programada' },
  CONFIRMADA:   { label: 'Confirmada',   clase: 'estado-confirmada' },
  ATENDIDA:     { label: 'Atendida',     clase: 'estado-atendida' },
  CANCELADA:    { label: 'Cancelada',    clase: 'estado-cancelada' },
  NO_ASISTIO:   { label: 'No Asistió',   clase: 'estado-cancelada' },
  REPROGRAMADA: { label: 'Reprogramada', clase: 'estado-programada' },
  EN_PROCESO:   { label: 'En Proceso',   clase: 'estado-confirmada' },
}

// Control de modal (crear | editar | null)
type ModoModal = 'crear' | 'editar' | null
const modoModal = ref<ModoModal>(null)
const idSeleccionado = ref<string | null>(null)
const citaEnEdicion = ref<Cita | null>(null)

const formVacio = (): FormCita => {
  const hoy = new Date().toISOString().slice(0, 10)
  return {
    dni_paciente: opcionesPacientes.value[0]?.dni || '',
    dni_odontologo: opcionesOdontologos.value[0]?.dni || '',
    fecha: hoy,
    hora: '09:00',
    motivo_consulta: '',
    diagnostico: '',
    estado: 'PROGRAMADA',
  }
}

const form = ref<FormCita>(formVacio())

const pacientesSelect = computed<PacienteOption[]>(() => {
  const lista = [...opcionesPacientes.value]
  const cita = citaEnEdicion.value
  if (cita && !lista.some((p) => p.dni === cita.dni_paciente)) {
    lista.unshift({
      dni: cita.dni_paciente,
      nombreCompleto: obtenerNombrePaciente(cita),
    })
  }
  return lista
})

const odontologosSelect = computed<CitaOdontologoResumen[]>(() => {
  const lista = [...opcionesOdontologos.value]
  const cita = citaEnEdicion.value
  if (cita && !lista.some((o) => o.dni === cita.dni_odontologo)) {
    lista.unshift({
      dni: cita.dni_odontologo,
      nombres: cita.odontologo?.nombres || 'Odontólogo',
      apellidos: cita.odontologo?.apellidos || `(${cita.dni_odontologo})`,
      especialidad: cita.odontologo?.especialidad || '',
      colegiatura: cita.odontologo?.colegiatura || '',
    })
  }
  return lista
})

const franjasSelect = computed<string[]>(() => {
  if (form.value.hora && !FRANJAS_HORARIAS.includes(form.value.hora)) {
    return [form.value.hora, ...FRANJAS_HORARIAS]
  }
  return FRANJAS_HORARIAS
})

const abrirCrear = () => {
  errorModal.value = null
  citaEnEdicion.value = null
  modoModal.value = 'crear'
  idSeleccionado.value = null
  form.value = formVacio()
}

const abrirEditar = (cita: Cita) => {
  errorModal.value = null
  citaEnEdicion.value = cita
  modoModal.value = 'editar'
  idSeleccionado.value = cita.cita_id
  form.value = {
    dni_paciente: cita.dni_paciente,
    dni_odontologo: cita.dni_odontologo,
    fecha: cita.fecha.slice(0, 10),
    hora: cita.hora.slice(0, 5),
    motivo_consulta: cita.motivo_consulta,
    diagnostico: cita.diagnostico || '',
    estado: cita.estado,
  }
}

const cerrarModal = () => {
  if (guardando.value) return
  modoModal.value = null
  idSeleccionado.value = null
  citaEnEdicion.value = null
  errorModal.value = null
}

const guardar = async () => {
  if (!form.value.dni_paciente || !form.value.dni_odontologo || !form.value.motivo_consulta.trim()) {
    errorModal.value = 'Completa paciente, odontólogo y motivo de consulta.'
    return
  }

  const hoyStr = new Date().toISOString().slice(0, 10)
  if (modoModal.value === 'crear' && form.value.fecha < hoyStr) {
    errorModal.value = 'No se pueden agendar citas en fechas pasadas.'
    return
  }

  guardando.value = true
  errorModal.value = null

  try {
    if (modoModal.value === 'crear') {
      const creada = await citasService.create({
        dni_paciente: form.value.dni_paciente,
        dni_odontologo: form.value.dni_odontologo,
        fecha: form.value.fecha,
        hora: form.value.hora,
        motivo_consulta: form.value.motivo_consulta.trim(),
        diagnostico: form.value.diagnostico.trim() || null,
      })
      citas.value.unshift(creada)
    } else if (modoModal.value === 'editar' && idSeleccionado.value) {
      const actualizada = await citasService.update(idSeleccionado.value, {
        dni_paciente: form.value.dni_paciente,
        dni_odontologo: form.value.dni_odontologo,
        fecha: form.value.fecha,
        hora: form.value.hora,
        motivo_consulta: form.value.motivo_consulta.trim(),
        diagnostico: form.value.diagnostico.trim() || null,
        estado: form.value.estado,
      })
      const idx = citas.value.findIndex((c) => c.cita_id === idSeleccionado.value)
      if (idx !== -1) {
        citas.value[idx] = actualizada
      }
    }

    guardando.value = false
    cerrarModal()
  } catch (err) {
    errorModal.value =
      err instanceof Error ? err.message : 'Ocurrió un error al guardar la cita en el servidor.'
  } finally {
    guardando.value = false
  }
}

const cancelarCita = async (cita: Cita) => {
  if (cita.estado === 'CANCELADA') return
  if (!confirm('¿Estás seguro de cancelar esta cita en la agenda?')) return

  procesandoId.value = cita.cita_id
  errorAccion.value = null
  try {
    const actualizada = await citasService.delete(cita.cita_id)
    const idx = citas.value.findIndex((c) => c.cita_id === cita.cita_id)
    if (idx !== -1) {
      citas.value[idx] = actualizada
    }
  } catch (err) {
    errorAccion.value =
      err instanceof Error ? err.message : 'No se pudo cancelar la cita seleccionada.'
  } finally {
    procesandoId.value = null
  }
}

const irACobrar = (cita: Cita) => {
  router.push({
    path: '/pagos',
    query: {
      dni: cita.dni_paciente,
      nombre: obtenerNombrePaciente(cita),
    },
  })
}

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
        <button class="btn-nuevo" type="button" @click="abrirCrear">
          + Nueva Cita
        </button>
      </div>

      <!-- ── Alerta de error en acciones rápidas ────────────────── -->
      <div v-if="errorAccion" class="alert-banner" role="alert">
        <span>⚠️ {{ errorAccion }}</span>
        <button type="button" class="alert-close" @click="errorAccion = null">✕</button>
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
              <option value="EN_PROCESO">En Proceso</option>
              <option value="REPROGRAMADA">Reprogramadas</option>
              <option value="ATENDIDA">Atendidas</option>
              <option value="CANCELADA">Canceladas</option>
              <option value="NO_ASISTIO">No Asistió</option>
            </select>
          </div>

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

        <!-- ── Estado de Carga ──────────────────────────────────── -->
        <div v-if="cargando" class="estado-carga">
          <div class="spinner"></div>
          <p>Cargando citas médicas...</p>
        </div>

        <!-- ── Error de Carga ───────────────────────────────────── -->
        <div v-else-if="errorCarga" class="estado-error">
          <p>⚠️ {{ errorCarga }}</p>
          <button type="button" class="btn-primario" @click="cargarDatos">Reintentar</button>
        </div>

        <!-- ── Estado Vacío ────────────────────────────────────── -->
        <div v-else-if="citasFiltradas.length === 0" class="estado-vacio">
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

                <!-- Paciente -->
                <td>
                  <div class="font-semibold text-main">{{ obtenerNombrePaciente(cita) }}</div>
                  <div class="font-mono text-purple">DNI: {{ cita.dni_paciente }}</div>
                </td>

                <!-- Odontólogo -->
                <td class="font-semibold text-main">
                  {{ obtenerNombreOdontologo(cita) }}
                </td>

                <!-- Motivo -->
                <td>
                  <span class="badge-motivo">{{ cita.motivo_consulta }}</span>
                </td>

                <!-- Estado -->
                <td>
                  <span class="badge" :class="estadoConfig[cita.estado]?.clase">
                    {{ estadoConfig[cita.estado]?.label ?? cita.estado }}
                  </span>
                </td>

                <!-- Acciones -->
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
                    :disabled="procesandoId === cita.cita_id"
                    @click="abrirEditar(cita)"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn-accion btn-icon delete"
                    title="Cancelar cita"
                    :disabled="procesandoId === cita.cita_id || cita.estado === 'CANCELADA'"
                    @click="cancelarCita(cita)"
                  >
                    {{ procesandoId === cita.cita_id ? '⏳' : '🚫' }}
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
          <button class="modal-close" :disabled="guardando" @click="cerrarModal">✕</button>
        </div>

        <form @submit.prevent="guardar" class="form-grid">
          <div v-if="errorModal" class="modal-alerta-error form-full" role="alert">
            ⚠️ {{ errorModal }}
          </div>

          <div class="form-group form-full">
            <label>Paciente *</label>
            <select v-model="form.dni_paciente" required class="form-select">
              <option value="" disabled>Seleccione un paciente</option>
              <option
                v-for="pac in pacientesSelect"
                :key="pac.dni"
                :value="pac.dni"
              >
                {{ pac.dni }} - {{ pac.nombreCompleto }}
              </option>
            </select>
          </div>

          <div class="form-group form-full">
            <label>Odontólogo Tratante *</label>
            <select v-model="form.dni_odontologo" required class="form-select">
              <option value="" disabled>Seleccione un odontólogo</option>
              <option
                v-for="doc in odontologosSelect"
                :key="doc.dni"
                :value="doc.dni"
              >
                Dr(a). {{ doc.nombres }} {{ doc.apellidos }}{{ doc.colegiatura ? ` - COP ${doc.colegiatura}` : '' }}
              </option>
            </select>
          </div>

          <div class="form-group form-full">
            <label>Servicio / Motivo de Consulta *</label>
            <input
              v-model="form.motivo_consulta"
              type="text"
              list="motivos-consulta-opciones"
              required
              placeholder="Selecciona o escribe el motivo de la consulta..."
            />
            <datalist id="motivos-consulta-opciones">
              <option v-for="motivo in MOTIVOS_SUGERIDOS" :key="motivo" :value="motivo" />
            </datalist>
          </div>

          <div class="form-group">
            <label>Fecha de la Cita *</label>
            <input v-model="form.fecha" type="date" required />
          </div>

          <div class="form-group">
            <label>Hora de la Cita *</label>
            <select v-model="form.hora" required class="form-select">
              <option v-for="hora in franjasSelect" :key="hora" :value="hora">
                ⏰ {{ hora }}
              </option>
            </select>
          </div>

          <div v-if="modoModal === 'editar'" class="form-group form-full">
            <label>Estado de la Cita *</label>
            <select v-model="form.estado" required class="form-select">
              <option value="PROGRAMADA">Programada</option>
              <option value="CONFIRMADA">Confirmada</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="REPROGRAMADA">Reprogramada</option>
              <option value="ATENDIDA">Atendida</option>
              <option value="CANCELADA">Cancelada</option>
              <option value="NO_ASISTIO">No Asistió</option>
            </select>
          </div>

          <div class="form-group form-full">
            <label>Diagnóstico / Notas Clínicas</label>
            <textarea
              v-model="form.diagnostico"
              rows="2"
              placeholder="Diagnóstico preliminar o indicaciones clínicas de la cita..."
            ></textarea>
          </div>

          <div class="modal-footer form-full">
            <button type="button" class="btn-secundario" :disabled="guardando" @click="cerrarModal">
              Cancelar
            </button>
            <button type="submit" class="btn-primario" :disabled="guardando">
              {{ guardando ? 'Guardando...' : (modoModal === 'crear' ? 'Agendar Cita' : 'Actualizar Cita') }}
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
.btn-accion:disabled,
.btn-icon:disabled { opacity: 0.55; cursor: not-allowed; }

.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
}
.alert-close:hover { background: rgba(185, 28, 28, 0.12); }

.estado-carga,
.estado-error {
  text-align: center;
  padding: 3.5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.estado-error {
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #2b758f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.9rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-alerta-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

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
.btn-primario:disabled,
.btn-secundario:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

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
:global(html.dark) .estado-carga,
:global(html.dark) .estado-error     { background: #0f172a; border-color: #334155; color: #f8fafc; }
:global(html.dark) .estado-error     { border-color: #7f1d1d; color: #fca5a5; }
:global(html.dark) .spinner          { border-color: #334155; border-top-color: #38bdf8; }
:global(html.dark) .alert-banner,
:global(html.dark) .modal-alerta-error { background: rgba(127, 29, 29, 0.35); border-color: #7f1d1d; color: #fca5a5; }

@media (max-width: 600px) {
  .form-grid   { grid-template-columns: 1fr; }
  .form-full   { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
