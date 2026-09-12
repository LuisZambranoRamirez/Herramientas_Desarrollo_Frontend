<script setup lang="ts">
import { ref, computed } from 'vue'
import BookingStepper from '../components/BookingStepper.vue'
import ServiceSelectionStep from '../components/ServiceSelectionStep.vue'
import SpecialistSelectionStep from '../components/SpecialistSelectionStep.vue'
import CalendarSelector from '../components/CalendarSelector.vue'
import PatientForm, { type PatientData } from '../components/PatientForm.vue'
import ConfirmationStep from '../components/ConfirmationStep.vue'

// Paso actual del flujo (1: Servicio, 2: Especialista, 3: Fecha y Hora, 4: Confirmación)
const currentStep = ref<number>(1)
const patientFormRef = ref<InstanceType<typeof PatientForm> | null>(null)

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
const selectedSpecialistName = computed(
  () => specialistNamesMap[selectedSpecialistId.value] || 'Dra. Marta González',
)

// --- Paso 3: Fecha, Horario y Datos ---
const selectedDayNumber = ref<number>(26)
const selectedTime = ref<string>('10:00 AM')
const selectedMonth = ref<string>('Agosto 2026')

const patientData = ref<PatientData>({
  fullName: '',
  email: '',
  phone: '',
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

const formErrorMessage = ref<string>('')

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

// Confirmar cita desde el Paso 3 ➔ Valida estrictamente y pasa al Paso 4
function handleConfirmAppointment() {
  // Ejecuta la validación interna del componente PatientForm
  const isValid = patientFormRef.value ? patientFormRef.value.validateAll() : false

  if (!isValid) {
    formErrorMessage.value = 'Por favor completa y corrige los campos obligatorios del paciente.'
    return
  }

  formErrorMessage.value = ''

  // Guardar en localStorage para persistencia
  try {
    const bookingRecord = {
      id: `SLD-${Math.floor(1000 + Math.random() * 9000)}`,
      service: selectedServiceName.value,
      specialist: selectedSpecialistName.value,
      date: formattedDateText.value,
      time: selectedTime.value,
      patient: { ...patientData.value },
      createdAt: new Date().toISOString(),
    }
    const existingBookings = JSON.parse(localStorage.getItem('solident_bookings') || '[]')
    existingBookings.push(bookingRecord)
    localStorage.setItem('solident_bookings', JSON.stringify(existingBookings))

    // CAMBIO: Sincronización con la clave 'citas' de la intranet
    const timeParts = (selectedTime.value || '10:00').split(':')
    const rawH = timeParts[0] ? parseInt(timeParts[0], 10) : 10
    const rawM = timeParts[1] ? timeParts[1].slice(0, 2) : '00'
    let finalH = isNaN(rawH) ? 10 : rawH

    if (selectedTime.value.includes('PM') && finalH < 12) {
      finalH += 12
    } else if (selectedTime.value.includes('AM') && finalH === 12) {
      finalH = 0
    }

    const horaStr = `${finalH.toString().padStart(2, '0')}:${rawM}`

    const dniPaciente = patientData.value.phone ? patientData.value.phone.replace(/\D/g, '') : `CLI-${Date.now().toString().slice(-6)}`
    const dniOdontologo = selectedSpecialistId.value === 'dra-carmen-rodriguez' ? '47891234' : '45678912'

    const nuevaCita = {
      cita_id: `CIT-${Math.floor(1000 + Math.random() * 9000)}`,
      dni_paciente: dniPaciente,
      dni_odontologo: dniOdontologo,
      fecha: '2026-08-26',
      hora: horaStr,
      motivo_consulta: selectedServiceName.value,
      diagnostico: null,
      estado: 'PROGRAMADA',
      fecha_registro: new Date().toISOString(),
      observaciones: `Reserva web. Email: ${patientData.value.email}, Tel: ${patientData.value.phone}`,
    }

    const citasExistentes = JSON.parse(localStorage.getItem('citas') || '[]')
    citasExistentes.unshift(nuevaCita)
    localStorage.setItem('citas', JSON.stringify(citasExistentes))

    // CAMBIO: Alta automática del paciente en 'pacientes' si no existe
    const pacientesExistentes = JSON.parse(localStorage.getItem('pacientes') || '[]')
    const existePaciente = pacientesExistentes.some(
      (p: Record<string, unknown>) =>
        String(p.dni) === dniPaciente ||
        String(p.nombreCompleto || `${p.nombres || ''} ${p.apellidos || ''}`).toLowerCase() === patientData.value.fullName.trim().toLowerCase()
    )

    if (!existePaciente) {
      const partes = patientData.value.fullName.trim().split(' ')
      const nombres = partes[0] || 'Paciente'
      const apellidos = partes.slice(1).join(' ') || 'Web'

      pacientesExistentes.push({
        dni: dniPaciente,
        username: patientData.value.email.split('@')[0] || `paciente.${dniPaciente}`,
        nombres,
        apellidos,
        nombreCompleto: patientData.value.fullName.trim(),
        telefono: patientData.value.phone,
        correo: patientData.value.email,
        direccion: 'Registrado vía Web Pública',
        observaciones: 'Registrado automáticamente por reserva de cita web',
        fecha_nacimiento: '1995-01-01',
        fecha_registro: new Date().toISOString(),
      })
      localStorage.setItem('pacientes', JSON.stringify(pacientesExistentes))
    }
  } catch (e) {
    console.warn('No se pudo guardar la cita en localStorage', e)
  }

  currentStep.value = 4
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Reiniciar flujo para agendar otra cita
function handleNewBooking() {
  patientData.value.fullName = ''
  patientData.value.email = ''
  patientData.value.phone = ''
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

          <!-- Alerta de validación si faltan campos -->
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
            </section>
          </div>

          <!-- Botones de Acción Inferiores -->
          <div class="actions-row">
            <button
              type="button"
              class="btn-anterior"
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
              <span>Confirmar Cita</span>
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
