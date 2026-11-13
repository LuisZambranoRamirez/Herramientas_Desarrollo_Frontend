<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { citasService } from '@/services/citas.service'
import { pacientesService } from '@/services/pacientes.service'
import type { CitaOdontologoResumen, CrearCitaDto, Paciente } from '@/types'
import BookingStepper from '../components/BookingStepper.vue'
import ServiceSelectionStep from '../components/ServiceSelectionStep.vue'
import SpecialistSelectionStep from '../components/SpecialistSelectionStep.vue'
import CalendarSelector from '../components/CalendarSelector.vue'
import PatientForm, { type PatientData } from '../components/PatientForm.vue'
import ConfirmationStep from '../components/ConfirmationStep.vue'

const authStore = useAuthStore()

// Paso actual del flujo (1: Servicio, 2: Especialista, 3: Fecha y Hora, 4: Confirmación)
const currentStep = ref<number>(1)
const patientFormRef = ref<InstanceType<typeof PatientForm> | null>(null)

// Estados de carga y comunicación con el backend
const isLoadingData = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const formErrorMessage = ref<string>('')
const odontologosApi = ref<CitaOdontologoResumen[]>([])
const pacientesApi = ref<Paciente[]>([])
const dniPacienteManual = ref<string>('')

// --- Paso 1: Selección de Servicio ---
const selectedServiceId = ref<string>('limpieza-dental')
const serviceNamesMap: Record<string, string> = {
  'limpieza-dental': 'Limpieza Dental',
  'ortodoncia': 'Ortodoncia',
  'implantes-dentales': 'Implantes Dentales',
}
const selectedServiceName = computed(
  () => serviceNamesMap[selectedServiceId.value] || 'Limpieza Dental',
)

// --- Paso 2: Selección de Especialista ---
const selectedSpecialistId = ref<string>('dra-marta-gonzalez')
const specialistNamesMap: Record<string, string> = {
  'dra-marta-gonzalez': 'Dra. Marta González',
  'dra-carmen-rodriguez': 'Dra. Carmen Rodríguez',
}

const odontologoSeleccionado = computed<CitaOdontologoResumen | undefined>(() => {
  if (odontologosApi.value.length === 0) return undefined
  if (selectedSpecialistId.value === 'dra-carmen-rodriguez') {
    return odontologosApi.value[1] || odontologosApi.value[0]
  }
  return odontologosApi.value[0]
})

const selectedSpecialistName = computed(() => {
  if (odontologoSeleccionado.value) {
    return `Dr(a). ${odontologoSeleccionado.value.nombres} ${odontologoSeleccionado.value.apellidos}`.trim()
  }
  return specialistNamesMap[selectedSpecialistId.value] || 'Dra. Marta González'
})

// --- Paso 3: Fecha, Horario y Datos ---
const selectedDayNumber = ref<number>(26)
const selectedTime = ref<string>('10:00 AM')
const selectedMonth = ref<string>('Agosto 2026')

const buildInitialPatientData = (): PatientData => ({
  fullName: authStore.user?.nombre_completo || '',
  email: authStore.user?.correo || (authStore.user?.username.includes('@') ? authStore.user?.username : '') || '',
  phone: authStore.user?.telefono || '',
})

const patientData = ref<PatientData>(buildInitialPatientData())

const selectedDateIso = computed(() => {
  const hoy = new Date()
  const diaNum = selectedDayNumber.value || hoy.getDate()
  // Usar año y mes actual o posterior para asegurar que no sea fecha pasada
  const anio = hoy.getFullYear()
  const mes = hoy.getMonth() + 1
  const dia = String(Math.max(hoy.getDate(), diaNum)).padStart(2, '0')
  return `${anio}-${String(mes).padStart(2, '0')}-${dia}`
})

// Texto de fecha formateada
const formattedDateText = computed(() => {
  const daysMap: Record<number, string> = {
    24: 'Lunes, 24 de Agosto',
    25: 'Martes, 25 de Agosto',
    26: 'Miércoles, 26 de Agosto',
    27: 'Jueves, 27 de Agosto',
    28: 'Viernes, 28 de Agosto',
  }
  return daysMap[selectedDayNumber.value] || `${selectedDayNumber.value} de Agosto`
})

const esStaffClinico = computed(
  () => authStore.isAuthenticated && authStore.userRole !== 'PACIENTE',
)

const cargarCatalogosReserva = async () => {
  if (!authStore.isAuthenticated) return
  isLoadingData.value = true
  try {
    odontologosApi.value = await citasService.getOdontologos()
    if (authStore.userRole !== 'PACIENTE') {
      pacientesApi.value = await pacientesService.getAll().catch(() => [])
      const primero = pacientesApi.value[0]
      if (primero && !dniPacienteManual.value) {
        dniPacienteManual.value = primero.dni
      }
    }
  } catch (err) {
    formErrorMessage.value =
      err instanceof Error ? err.message : 'No se pudo cargar la disponibilidad de especialistas.'
  } finally {
    isLoadingData.value = false
  }
}

onMounted(cargarCatalogosReserva)

function convertirHora24(time12h: string): string {
  const parts = (time12h || '10:00 AM').split(':')
  const rawH = parts[0] ? parseInt(parts[0], 10) : 10
  const rawM = parts[1] ? parts[1].slice(0, 2) : '00'
  let finalH = isNaN(rawH) ? 10 : rawH

  if (time12h.includes('PM') && finalH < 12) {
    finalH += 12
  } else if (time12h.includes('AM') && finalH === 12) {
    finalH = 0
  }

  return `${finalH.toString().padStart(2, '0')}:${rawM}:00`
}

// Navegación entre pasos
function goToStep(stepNumber: number) {
  if (stepNumber <= 3) {
    currentStep.value = stepNumber
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextStep() {
  if (currentStep.value < 3) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevStep() {
  if (currentStep.value > 1) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Confirmar cita desde el Paso 3 ➔ Envía POST /api/citas y pasa al Paso 4
async function handleConfirmAppointment() {
  const isValid = patientFormRef.value ? patientFormRef.value.validateAll() : false

  if (!isValid) {
    formErrorMessage.value = 'Por favor completa y corrige los campos obligatorios del paciente.'
    return
  }

  if (!authStore.isAuthenticated) {
    formErrorMessage.value = 'Debes iniciar sesión con tu cuenta para agendar una cita médica.'
    return
  }

  if (odontologosApi.value.length === 0) {
    await cargarCatalogosReserva()
  }

  const odontologoObjetivo = odontologoSeleccionado.value
  if (!odontologoObjetivo) {
    formErrorMessage.value = 'No hay especialistas activos disponibles en el sistema en este momento.'
    return
  }

  const payload: CrearCitaDto = {
    dni_odontologo: odontologoObjetivo.dni,
    fecha: selectedDateIso.value,
    hora: convertirHora24(selectedTime.value),
    motivo_consulta: selectedServiceName.value,
    diagnostico: null,
  }

  if (esStaffClinico.value) {
    const dniLimpio = dniPacienteManual.value.trim()
    if (!/^\d{8}$/.test(dniLimpio)) {
      formErrorMessage.value = 'Debes seleccionar o ingresar un DNI de paciente válido (8 dígitos).'
      return
    }
    payload.dni_paciente = dniLimpio
  }

  formErrorMessage.value = ''
  isSubmitting.value = true

  try {
    await citasService.create(payload)
    currentStep.value = 4
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    formErrorMessage.value =
      err instanceof Error ? err.message : 'Ocurrió un error al registrar tu cita en el servidor.'
  } finally {
    isSubmitting.value = false
  }
}

// Reiniciar flujo para agendar otra cita
function handleNewBooking() {
  patientData.value = buildInitialPatientData()
  selectedServiceId.value = 'limpieza-dental'
  selectedSpecialistId.value = 'dra-marta-gonzalez'
  selectedDayNumber.value = 26
  selectedTime.value = '10:00 AM'
  formErrorMessage.value = ''
  currentStep.value = 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="booking-page">
    <div class="booking-container">
      <!-- Indicador de Pasos Global (Stepper) -->
      <BookingStepper :current-step="currentStep" @change-step="goToStep" />

      <!-- Contenido del Paso con animación de transición suave -->
      <Transition name="fade-slide" mode="out-in">
        <!-- ================= PASO 1: ELIGE TU SERVICIO ================= -->
        <div v-if="currentStep === 1" key="step-1" class="step-wrapper">
          <ServiceSelectionStep
            v-model="selectedServiceId"
            @next="nextStep"
          />
        </div>

        <!-- ================= PASO 2: ELIGE TU ESPECIALISTA ================= -->
        <div v-else-if="currentStep === 2" key="step-2" class="step-wrapper">
          <SpecialistSelectionStep
            v-model="selectedSpecialistId"
            @next="nextStep"
            @prev="prevStep"
          />
        </div>

        <!-- ================= PASO 3: SELECCIONA FECHA Y HORA ================= -->
        <div v-else-if="currentStep === 3" key="step-3" class="step-wrapper">
          <!-- Encabezado -->
          <div class="header-section">
            <h1 class="main-title">Selecciona Fecha y Hora</h1>
            <p class="subtitle">Elige tu momento ideal y completa tus datos de contacto</p>
          </div>

          <!-- Aviso si no hay sesión iniciada -->
          <div v-if="!authStore.isAuthenticated" class="alert-auth" role="status">
            <span>
              Para confirmar una reserva en el sistema necesitas
              <RouterLink to="/login" class="auth-link">iniciar sesión</RouterLink>.
            </span>
          </div>

          <!-- Alerta de carga -->
          <div v-if="isLoadingData" class="alert-loading" role="status">
            Cargando disponibilidad de especialistas...
          </div>

          <!-- Alerta de validación o fallo HTTP -->
          <div v-if="formErrorMessage" class="alert-error" role="alert">
            <svg class="alert-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ formErrorMessage }}</span>
          </div>

          <!-- Tarjetas en paralelo (Calendario y Formulario) -->
          <div class="cards-grid">
            <!-- Tarjeta Izquierda: Calendario y Horas -->
            <section class="card-column" aria-label="Selección de fecha y hora">
              <CalendarSelector
                :month-name="selectedMonth"
                :model-value-date="selectedDayNumber"
                :model-value-time="selectedTime"
                @update:selected-date="selectedDayNumber = $event"
                @update:selected-time="selectedTime = $event"
              />
            </section>

            <!-- Tarjeta Derecha: Datos del Paciente -->
            <section class="card-column" aria-label="Información del paciente">
              <PatientForm ref="patientFormRef" v-model="patientData" />
              <div v-if="esStaffClinico" class="staff-dni-box">
                <label for="dniPacienteStaff" class="staff-dni-label">
                  DNI del Paciente a Agendar *
                </label>
                <select
                  v-if="pacientesApi.length > 0"
                  id="dniPacienteStaff"
                  v-model="dniPacienteManual"
                  class="staff-dni-input"
                >
                  <option value="" disabled>Seleccione un paciente registrado</option>
                  <option v-for="pac in pacientesApi" :key="pac.dni" :value="pac.dni">
                    {{ pac.dni }} - {{ pac.nombres }} {{ pac.apellidos }}
                  </option>
                </select>
                <input
                  v-else
                  id="dniPacienteStaff"
                  v-model="dniPacienteManual"
                  type="text"
                  maxlength="8"
                  placeholder="Ingresa DNI de 8 dígitos"
                  class="staff-dni-input"
                />
              </div>
            </section>
          </div>

          <!-- Botones de Acción Inferiores -->
          <div class="actions-row">
            <button
              type="button"
              class="btn-anterior"
              :disabled="isSubmitting"
              @click="prevStep"
              aria-label="Regresar al paso anterior"
            >
              <svg class="btn-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>Anterior</span>
            </button>

            <button
              type="button"
              class="btn-confirmar"
              :disabled="isSubmitting || isLoadingData"
              @click="handleConfirmAppointment"
              aria-label="Confirmar y agendar cita"
            >
              <svg class="btn-check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              <span>{{ isSubmitting ? 'Agendando cita...' : 'Confirmar Cita' }}</span>
            </button>
          </div>
        </div>

        <!-- ================= PASO 4: ¡CITA CONFIRMADA! ================= -->
        <div v-else-if="currentStep === 4" key="step-4" class="step-wrapper">
          <ConfirmationStep
            :service-name="selectedServiceName"
            :specialist-name="selectedSpecialistName"
            :date-text="formattedDateText"
            :time="selectedTime"
            :patient="patientData"
            @go-home="handleNewBooking"
            @new-booking="handleNewBooking"
          />
        </div>
      </Transition>
    </div>
  </main>
</template>

<style scoped>
.booking-page {
  width: 100%;
  flex: 1;
  background-color: #f8fafc;
  padding: 1.5rem 1.5rem 4rem;
  display: flex;
  justify-content: center;
}

.booking-container {
  max-width: 1080px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.step-wrapper {
  width: 100%;
}

/* Encabezado Paso 3 */
.header-section {
  text-align: center;
  margin-bottom: 2.25rem;
}

.main-title {
  font-size: 2.15rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

/* Alerta de Error */
.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.92rem;
  font-weight: 600;
  animation: shake 0.3s ease;
}

.alert-auth {
  background-color: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.92rem;
  font-weight: 500;
}

.auth-link {
  color: #0e7490;
  font-weight: 700;
  text-decoration: underline;
  white-space: nowrap;
}

.alert-loading {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  font-size: 0.92rem;
  font-weight: 600;
}

.staff-dni-box {
  background-color: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.staff-dni-label {
  font-size: 0.88rem;
  font-weight: 700;
  color: #1e293b;
}

.staff-dni-input {
  width: 100%;
  max-width: 320px;
  padding: 0.6rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  color: #0f172a;
  background-color: #ffffff;
}

.staff-dni-input:focus {
  outline: none;
  border-color: #0e7490;
  box-shadow: 0 0 0 3px rgba(14, 116, 144, 0.14);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Grilla de Tarjetas Paso 3 */
.cards-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.75rem;
  margin-bottom: 2.5rem;
}

.card-column {
  display: flex;
  flex-direction: column;
}

/* Botones de Acción */
.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.btn-anterior {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.btn-anterior:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateX(-2px);
}

.btn-arrow-icon {
  width: 18px;
  height: 18px;
}

.btn-confirmar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  border: none;
  border-radius: 9999px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 196, 159, 0.35);
  transition: all 0.25s ease;
}

.btn-confirmar:hover {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(0, 196, 159, 0.45);
  transform: translateY(-1px);
}

.btn-confirmar:active {
  transform: translateY(0);
}

.btn-anterior:disabled,
.btn-confirmar:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-check-icon {
  width: 20px;
  height: 20px;
}

/* Transiciones entre pasos */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}

@media (max-width: 860px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .main-title {
    font-size: 1.75rem;
  }

  .actions-row {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .btn-anterior,
  .btn-confirmar {
    width: 100%;
    justify-content: center;
  }
}
</style>
