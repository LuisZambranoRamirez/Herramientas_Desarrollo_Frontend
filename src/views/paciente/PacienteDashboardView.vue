<template>
  <div class="paciente-portal-layout">
    <main class="paciente-main-container">
      <!-- Banner de Bienvenida y Perfil del Paciente -->
      <section class="patient-hero-banner">
        <div class="hero-left">
          <div class="patient-avatar-badge">
            <span>{{ avatarLetter }}</span>
          </div>
          <div class="hero-text">
            <h2>¡Hola, {{ pacienteNombre }}!</h2>
            <p class="hero-desc">
              Bienvenido a tu portal de salud dental en <strong>SoliDent</strong>. Aquí puedes consultar tus próximas citas, agendar una nueva consulta y revisar tu historial clínico.
            </p>
          </div>
        </div>

        <div class="hero-right">
          <button class="btn-book-primary" @click="abrirModalAgendar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Agendar Nueva Cita
          </button>
        </div>
      </section>

      <!-- Ficha de Datos Personales del Paciente -->
      <section class="patient-profile-card">
        <div class="profile-header">
          <h3>Ficha del Paciente</h3>
          <span class="user-role-badge">PACIENTE</span>
        </div>
        <div class="profile-grid">
          <div class="profile-item">
            <span class="item-label">DNI:</span>
            <span class="item-value">{{ pacientePerfil?.dni || '---' }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">Teléfono:</span>
            <span class="item-value">{{ pacientePerfil?.telefono || 'No registrado' }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">Correo Electrónico:</span>
            <span class="item-value">{{ pacientePerfil?.correo || 'No registrado' }}</span>
          </div>
          <div class="profile-item">
            <span class="item-label">Dirección:</span>
            <span class="item-value">{{ pacientePerfil?.direccion || 'No registrada' }}</span>
          </div>
        </div>

        <div v-if="pacientePerfil?.observaciones" class="medical-alert-box">
          ⚠️ <strong>Alergias / Antecedentes Médicos:</strong> {{ pacientePerfil.observaciones }}
        </div>
      </section>

      <!-- Resumen de Métricas -->
      <section class="portal-metrics-grid">
        <div class="portal-metric-card">
          <div class="metric-icon blue">📅</div>
          <div class="metric-content">
            <span class="metric-title">Próxima Cita</span>
            <span class="metric-data-main">{{ proximaCitaTexto }}</span>
          </div>
        </div>

        <div class="portal-metric-card">
          <div class="metric-icon green">✅</div>
          <div class="metric-content">
            <span class="metric-title">Citas Activas</span>
            <span class="metric-data-main">{{ citasActivasCount }} agendadas</span>
          </div>
        </div>

        <div class="portal-metric-card">
          <div class="metric-icon purple">🦷</div>
          <div class="metric-content">
            <span class="metric-title">Tratamientos</span>
            <span class="metric-data-main">{{ misTratamientos.length }} registrados</span>
          </div>
        </div>
      </section>

      <!-- Pestañas del Portal -->
      <div class="portal-tabs">
        <button
          class="portal-tab-btn"
          :class="{ active: tabActiva === 'citas' }"
          @click="tabActiva = 'citas'"
        >
          📅 Mis Citas Odontológicas ({{ misCitas.length }})
        </button>
        <button
          class="portal-tab-btn"
          :class="{ active: tabActiva === 'tratamientos' }"
          @click="tabActiva = 'tratamientos'"
        >
          🏥 Mi Historial de Tratamientos ({{ misTratamientos.length }})
        </button>
      </div>

      <!-- SECCIÓN 1: MIS CITAS -->
      <section v-if="tabActiva === 'citas'" class="portal-tab-content">
        <div class="table-card">
          <div class="card-toolbar">
            <h3 class="toolbar-title">Historial de Citas Médicas</h3>
            <button class="btn-sm btn-primary" @click="abrirModalAgendar">
              + Reservar Cita
            </button>
          </div>

          <div v-if="cargandoCitas" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando tus citas médicas...</p>
          </div>

          <div v-else-if="misCitas.length === 0" class="empty-state">
            <div class="empty-icon">📅</div>
            <h4>Aún no tienes citas agendadas</h4>
            <p>Agenda tu primera consulta odontológica con nuestros especialistas certificados.</p>
            <button class="btn-primary btn-sm" @click="abrirModalAgendar">Agendar Cita Ahora</button>
          </div>

          <div v-else class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha & Hora</th>
                  <th>Especialista</th>
                  <th>Motivo</th>
                  <th>Diagnóstico</th>
                  <th>Estado</th>
                  <th class="text-right">Acción</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in misCitas" :key="c.cita_id">
                  <td class="nowrap">
                    <strong>{{ formatFecha(c.fecha) }}</strong>
                    <div class="text-muted small">{{ c.hora }}</div>
                  </td>
                  <td>
                    <strong>{{ getNombreOdontologo(c) }}</strong>
                    <div class="text-muted small">{{ c.odontologo?.especialidad || 'Odontología' }}</div>
                  </td>
                  <td>{{ c.motivo_consulta }}</td>
                  <td>
                    <span v-if="c.diagnostico" class="diagnosis-highlight">{{ c.diagnostico }}</span>
                    <span v-else class="text-muted italic">Pendiente de atención</span>
                  </td>
                  <td>
                    <span :class="['badge-status', getBadgeClass(c.estado)]">
                      {{ c.estado }}
                    </span>
                  </td>
                  <td class="text-right nowrap">
                    <button
                      v-if="c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA'"
                      class="btn-sm btn-cancel"
                      title="Cancelar cita"
                      @click="confirmarCancelacion(c)"
                    >
                      Cancelar Cita
                    </button>
                    <span v-else class="text-muted small">---</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- SECCIÓN 2: MIS TRATAMIENTOS -->
      <section v-if="tabActiva === 'tratamientos'" class="portal-tab-content">
        <div class="table-card">
          <div class="card-toolbar">
            <h3 class="toolbar-title">Mis Tratamientos Odontológicos</h3>
          </div>

          <div v-if="cargandoTratamientos" class="loading-state">
            <div class="spinner"></div>
            <p>Cargando información de tratamientos...</p>
          </div>

          <div v-else-if="misTratamientos.length === 0" class="empty-state">
            <div class="empty-icon">🦷</div>
            <h4>Sin tratamientos registrados</h4>
            <p>Tus tratamientos clínicos prescritos por el odontólogo aparecerán aquí.</p>
          </div>

          <div v-else class="treatments-grid">
            <div
              v-for="t in misTratamientos"
              :key="t.tratamiento_paciente_id"
              class="patient-treatment-card"
            >
              <div class="card-top">
                <span class="treatment-icon">✨</span>
                <span :class="['badge-status', getTratamientoBadgeClass(t.estado)]">
                  {{ t.estado }}
                </span>
              </div>
              <h4 class="treatment-title">{{ formatTratamientoNombre(t.tratamiento) }}</h4>
              <p class="treatment-date">Iniciado el {{ formatFecha(t.fecha_registro) }}</p>
              <div class="treatment-price-row">
                <span class="price-label">Monto del tratamiento:</span>
                <span class="price-val">S/ {{ t.precio.toFixed(2) }}</span>
              </div>
              <div v-if="t.observaciones" class="treatment-notes-box">
                <strong>Notas del doctor:</strong> {{ t.observaciones }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- MODAL: AGENDAR NUEVA CITA -->
      <div v-if="mostrarModalAgendar" class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Reservar Nueva Cita Médica</h3>
            <button class="modal-close" @click="mostrarModalAgendar = false">&times;</button>
          </div>
          <div class="modal-body">
            <div v-if="errorCitaModal.general" class="alert-box error-alert mb-3">
              ⚠️ {{ errorCitaModal.general }}
            </div>

            <div class="form-group">
              <label>Selecciona un Especialista:</label>
              <select
                v-model="nuevaCitaForm.dni_odontologo"
                class="form-control"
                :class="{ 'input-error': errorCitaModal.dni_odontologo }"
                @change="errorCitaModal.dni_odontologo = ''"
                @blur="validarCampoCita('dni_odontologo')"
              >
                <option disabled value="">Elige a tu odontólogo</option>
                <option v-for="doc in odontologos" :key="doc.dni" :value="doc.dni">
                  Dr(a). {{ doc.nombres }} {{ doc.apellidos }} — {{ doc.especialidad }}
                </option>
              </select>
              <span v-if="errorCitaModal.dni_odontologo" class="field-error">
                ⚠ {{ errorCitaModal.dni_odontologo }}
              </span>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Fecha de la Cita:</label>
                <input
                  v-model="nuevaCitaForm.fecha"
                  type="date"
                  :min="fechaMinima"
                  class="form-control"
                  :class="{ 'input-error': errorCitaModal.fecha }"
                  @change="errorCitaModal.fecha = ''"
                  @blur="validarCampoCita('fecha')"
                />
                <span v-if="errorCitaModal.fecha" class="field-error">
                  ⚠ {{ errorCitaModal.fecha }}
                </span>
              </div>

              <div class="form-group">
                <label>Hora:</label>
                <select v-model="nuevaCitaForm.hora" class="form-control">
                  <option v-for="hora in franjasHorarias" :key="hora" :value="hora">
                    {{ hora }}
                  </option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Motivo de la Consulta:</label>
              <select
                v-model="motivoSeleccionadoRapido"
                class="form-control mb-2"
                @change="seleccionarMotivoRapido"
              >
                <option value="">Selecciona un motivo común o escribe abajo...</option>
                <option value="Consulta y evaluación odontológica general">Consulta y evaluación odontológica general</option>
                <option value="Limpieza dental profunda y profilaxis">Limpieza dental profunda y profilaxis</option>
                <option value="Dolor o molestia en pieza dental">Dolor o molestia en pieza dental</option>
                <option value="Control y ajuste de ortodoncia (brackets)">Control y ajuste de ortodoncia (brackets)</option>
                <option value="Sensibilidad o sangrado de encías">Sensibilidad o sangrado de encías</option>
                <option value="Evaluación para implantes dentales">Evaluación para implantes dentales</option>
              </select>

              <textarea
                v-model="nuevaCitaForm.motivo_consulta"
                rows="3"
                class="form-control"
                :class="{ 'input-error': errorCitaModal.motivo_consulta }"
                placeholder="Describe brevemente tus síntomas o el servicio que necesitas..."
                @input="errorCitaModal.motivo_consulta = ''"
                @blur="validarCampoCita('motivo_consulta')"
              ></textarea>
              <span v-if="errorCitaModal.motivo_consulta" class="field-error">
                ⚠ {{ errorCitaModal.motivo_consulta }}
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secondary" @click="mostrarModalAgendar = false">Cancelar</button>
            <button
              class="btn-primary"
              :disabled="guardandoCita || !nuevaCitaForm.dni_odontologo || !nuevaCitaForm.motivo_consulta"
              @click="guardarNuevaCita"
            >
              {{ guardandoCita ? 'Agendando...' : 'Confirmar Reserva' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer SoliDent -->
    <FooterSection />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { pacientesService } from '@/services/pacientes.service'
import { citasService } from '@/services/citas.service'
import { tratamientosService } from '@/services/tratamientos.service'
import FooterSection from '@/components/FooterSection.vue'
import { validarFechaNoPasada, validarRequerido } from '@/utils/validators'
import type {
  Paciente,
  Cita,
  CitaOdontologoResumen,
  TratamientoPaciente,
  EstadoCita,
  EstadoTratamiento,
} from '@/types'

const authStore = useAuthStore()

// Perfil del Paciente
const pacientePerfil = ref<Paciente | null>(null)
const cargandoPerfil = ref(false)

const pacienteNombre = computed(() => {
  if (pacientePerfil.value?.nombres) {
    return pacientePerfil.value.nombres.split(' ')[0]
  }
  return authStore.currentUser?.nombre_completo?.split(' ')[0] || authStore.currentUser?.username || 'Paciente'
})

const avatarLetter = computed(() => {
  const name = pacienteNombre.value || 'P'
  return name.charAt(0).toUpperCase() || 'P'
})

// Pestaña Activa
const tabActiva = ref<'citas' | 'tratamientos'>('citas')

// Citas
const misCitas = ref<Cita[]>([])
const cargandoCitas = ref(false)

// Tratamientos
const misTratamientos = ref<TratamientoPaciente[]>([])
const cargandoTratamientos = ref(false)

// Odontólogos para reserva
const odontologos = ref<CitaOdontologoResumen[]>([])

// Modal Agendar
const mostrarModalAgendar = ref(false)
const guardandoCita = ref(false)
const motivoSeleccionadoRapido = ref('')

const franjasHorarias = [
  '08:30:00',
  '09:00:00',
  '09:30:00',
  '10:00:00',
  '10:30:00',
  '11:00:00',
  '11:30:00',
  '14:00:00',
  '14:30:00',
  '15:00:00',
  '15:30:00',
  '16:00:00',
  '16:30:00',
  '17:00:00',
  '17:30:00',
]

const fechaMinima = computed(() => {
  return new Date().toISOString().slice(0, 10)
})

const nuevaCitaForm = ref<{
  dni_odontologo: string
  fecha: string
  hora: string
  motivo_consulta: string
}>({
  dni_odontologo: '',
  fecha: new Date().toISOString().slice(0, 10),
  hora: '09:00:00',
  motivo_consulta: '',
})

// Métricas Computadas
const citasActivasCount = computed(() => {
  return misCitas.value.filter((c) => c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA').length
})

const proximaCitaTexto = computed(() => {
  const hoyStr = new Date().toISOString().slice(0, 10)
  const futuras = misCitas.value
    .filter((c) => (c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA') && c.fecha >= hoyStr)
    .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))

  const prox = futuras[0]
  if (!prox) return 'Sin citas próximas'
  return `${formatFecha(prox.fecha)} (${prox.hora.slice(0, 5)})`
})

// Helpers
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

function getNombreOdontologo(c: Cita): string {
  if (c.odontologo) {
    const full = `${c.odontologo.nombres} ${c.odontologo.apellidos}`.trim()
    if (full) return `Dr(a). ${full}`
  }
  const enc = odontologos.value.find((d) => d.dni === c.dni_odontologo)
  if (enc) return `Dr(a). ${enc.nombres} ${enc.apellidos}`
  return `Dr. (${c.dni_odontologo})`
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

// Carga de Datos
async function cargarDatos() {
  cargandoPerfil.value = true
  cargandoCitas.value = true
  cargandoTratamientos.value = true

  try {
    const [perfil, citas, tratamientos, docs] = await Promise.all([
      pacientesService.getMe().catch(() => null),
      citasService.getMisCitas().catch(() => [] as Cita[]),
      tratamientosService.getAll().catch(() => [] as TratamientoPaciente[]),
      citasService.getOdontologos().catch(() => [] as CitaOdontologoResumen[]),
    ])

    pacientePerfil.value = perfil
    misCitas.value = citas
    misTratamientos.value = tratamientos
    odontologos.value = docs

    if (docs.length > 0 && docs[0]) {
      nuevaCitaForm.value.dni_odontologo = docs[0].dni
    }
  } catch (err) {
    console.error('Error al cargar datos del paciente:', err)
  } finally {
    cargandoPerfil.value = false
    cargandoCitas.value = false
    cargandoTratamientos.value = false
  }
}

// Agendar Cita
const errorCitaModal = ref<Record<string, string>>({
  dni_odontologo: '',
  fecha: '',
  motivo_consulta: '',
  general: '',
})

function validarCampoCita(campo: string) {
  switch (campo) {
    case 'dni_odontologo':
      errorCitaModal.value.dni_odontologo = validarRequerido(
        nuevaCitaForm.value.dni_odontologo,
        'El odontólogo',
      )
      break
    case 'fecha':
      errorCitaModal.value.fecha = validarFechaNoPasada(nuevaCitaForm.value.fecha)
      break
    case 'motivo_consulta':
      errorCitaModal.value.motivo_consulta = validarRequerido(
        nuevaCitaForm.value.motivo_consulta,
        'El motivo de consulta',
      )
      break
  }
}

function validarCitaForm(): boolean {
  validarCampoCita('dni_odontologo')
  validarCampoCita('fecha')
  validarCampoCita('motivo_consulta')

  return (
    !errorCitaModal.value.dni_odontologo &&
    !errorCitaModal.value.fecha &&
    !errorCitaModal.value.motivo_consulta
  )
}

function abrirModalAgendar() {
  if (odontologos.value.length > 0 && odontologos.value[0] && !nuevaCitaForm.value.dni_odontologo) {
    nuevaCitaForm.value.dni_odontologo = odontologos.value[0].dni
  }
  nuevaCitaForm.value.motivo_consulta = ''
  motivoSeleccionadoRapido.value = ''
  errorCitaModal.value = {
    dni_odontologo: '',
    fecha: '',
    motivo_consulta: '',
    general: '',
  }
  mostrarModalAgendar.value = true
}

function seleccionarMotivoRapido() {
  if (motivoSeleccionadoRapido.value) {
    nuevaCitaForm.value.motivo_consulta = motivoSeleccionadoRapido.value
    errorCitaModal.value.motivo_consulta = ''
  }
}

async function guardarNuevaCita() {
  errorCitaModal.value.general = ''
  if (!validarCitaForm()) {
    return
  }

  guardandoCita.value = true
  try {
    await citasService.create({
      dni_odontologo: nuevaCitaForm.value.dni_odontologo,
      fecha: nuevaCitaForm.value.fecha,
      hora: nuevaCitaForm.value.hora,
      motivo_consulta: nuevaCitaForm.value.motivo_consulta.trim(),
    })

    mostrarModalAgendar.value = false
    // Recargar citas
    misCitas.value = await citasService.getMisCitas()
    tabActiva.value = 'citas'
  } catch (error: any) {
    errorCitaModal.value.general =
      error.message || 'Error al agendar la cita. Verifica que el horario esté disponible.'
  } finally {
    guardandoCita.value = false
  }
}

// Cancelar Cita
async function confirmarCancelacion(cita: Cita) {
  const confirmacion = window.confirm(
    `¿Estás seguro de que deseas cancelar tu cita del ${formatFecha(cita.fecha)} a las ${cita.hora}?`
  )
  if (!confirmacion) return

  try {
    await citasService.cancelar(cita.cita_id)
    cita.estado = 'CANCELADA'
    alert('Tu cita ha sido cancelada correctamente.')
  } catch (error: any) {
    alert(error.message || 'Error al cancelar la cita.')
  }
}

onMounted(cargarDatos)
</script>

<style scoped>
.paciente-portal-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-page);
}

.paciente-main-container {
  max-width: 1200px;
  width: 100%;
  margin: 30px auto;
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Banner de Bienvenida */
.patient-hero-banner {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 18px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-sm);
  flex-wrap: wrap;
}

.hero-left {
  display: flex;
  align-items: center;
  gap: 20px;
  max-width: 700px;
}

.patient-avatar-badge {
  width: 68px;
  height: 68px;
  border-radius: 18px;
  background: var(--accent-teal-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 28px;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(0, 196, 159, 0.25);
  flex-shrink: 0;
}

.hero-text h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0 0 6px 0;
}

.hero-desc {
  color: var(--text-muted);
  font-size: 15px;
  line-height: 1.5;
  margin: 0;
}

.btn-book-primary {
  background: var(--accent-teal-gradient);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 14px rgba(0, 196, 159, 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-book-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 196, 159, 0.45);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Ficha del Paciente */
.patient-profile-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 14px;
  padding: 22px 26px;
  box-shadow: var(--shadow-sm);
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: 12px;
}

.profile-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.user-role-badge {
  background: #ede9fe;
  color: var(--primary-purple);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.profile-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.item-label {
  font-size: 12px;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
}

.item-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-main);
}

.medical-alert-box {
  background: #fffbeb;
  color: #92400e;
  border-left: 4px solid #f59e0b;
  padding: 10px 16px;
  border-radius: 6px;
  margin-top: 16px;
  font-size: 13px;
}

/* Métricas */
.portal-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.portal-metric-card {
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
.metric-icon.green { background: #dcfce7; }
.metric-icon.purple { background: #ede9fe; }

.metric-content {
  display: flex;
  flex-direction: column;
}

.metric-title {
  font-size: 13px;
  color: var(--text-muted);
}

.metric-data-main {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

/* Pestañas */
.portal-tabs {
  display: flex;
  gap: 12px;
  border-bottom: 2px solid var(--border-light);
  padding-bottom: 4px;
}

.portal-tab-btn {
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

.portal-tab-btn:hover {
  color: var(--primary-purple);
  background: var(--primary-purple-light);
}

.portal-tab-btn.active {
  color: var(--primary-purple);
  background: var(--primary-purple-light);
  border-bottom: 3px solid var(--primary-purple);
}

/* Card y Tabla */
.table-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.card-toolbar {
  padding: 18px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
}

.toolbar-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
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
.small { font-size: 12px; }
.diagnosis-highlight { font-size: 13px; color: var(--primary-purple); font-weight: 500; }

/* Grid de Tratamientos */
.treatments-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 18px;
  padding: 24px;
}

.patient-treatment-card {
  border: 1px solid var(--border-light);
  background: var(--bg-page);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.treatment-icon { font-size: 20px; }

.treatment-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.treatment-date {
  font-size: 13px;
  color: var(--text-muted);
  margin: 0;
}

.treatment-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  padding-top: 8px;
  border-top: 1px dashed var(--border-light);
}

.price-label { font-size: 13px; color: var(--text-muted); }
.price-val { font-size: 16px; font-weight: 700; color: var(--primary-purple); }

.treatment-notes-box {
  background: var(--bg-card);
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: var(--text-main);
  border-left: 3px solid var(--primary-purple);
}

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
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--primary-purple-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-secondary {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-cancel:hover {
  background: #dc2626;
  color: #ffffff;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
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

.mb-2 { margin-bottom: 8px; }

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Spinners y Vacíos */
.loading-state, .empty-state {
  padding: 40px 20px;
  text-align: center;
  color: var(--text-muted);
}

.empty-icon {
  font-size: 42px;
  margin-bottom: 10px;
}

.empty-state h4 {
  font-size: 18px;
  color: var(--text-main);
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  margin: 0 0 16px 0;
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

@media (max-width: 768px) {
  .patient-hero-banner {
    flex-direction: column;
    align-items: flex-start;
  }
  .hero-right {
    width: 100%;
  }
  .btn-book-primary {
    width: 100%;
    justify-content: center;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.15) !important;
}

.field-error {
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 500;
  display: block;
  margin-top: 4px;
}
</style>
