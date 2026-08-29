<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import BookingStepper from '../components/BookingStepper.vue'
import CalendarSelector from '../components/CalendarSelector.vue'
import PatientForm, { type PatientData } from '../components/PatientForm.vue'
import BookingConfirmationModal from '../components/BookingConfirmationModal.vue'

// Paso actual del Stepper (por defecto 3: Fecha y Hora)
const currentStep = ref<number>(3)

// Estados de la reserva
const selectedDayNumber = ref<number>(26)
const selectedTime = ref<string>('10:00 AM')
const selectedMonth = ref<string>('Agosto 2026')

// Datos simulados de pasos anteriores
const selectedService = ref<string>('Consulta Odontológica General')
const selectedSpecialist = ref<string>('Dra. Camila Morales (Odontología Integral)')

// Datos del formulario del paciente
const patientData = reactive<PatientData>({
  fullName: '',
  email: '',
  phone: '',
})

// Estado del modal de confirmación
const isConfirmationModalOpen = ref<boolean>(false)
const generatedBookingCode = ref<string>('#SLD-2684')

// Texto de fecha formateada
const formattedDateText = computed(() => {
  const daysMap: Record<number, string> = {
    24: 'Lunes 24',
    25: 'Martes 25',
    26: 'Miércoles 26',
    27: 'Jueves 27',
    28: 'Viernes 28',
  }
  const dayName = daysMap[selectedDayNumber.value] || `Día ${selectedDayNumber.value}`
  return `${dayName} de Agosto, 2026`
})

// Mensaje de validación
const formErrorMessage = ref<string>('')

// Confirmar cita
function handleConfirmAppointment() {
  if (!patientData.fullName.trim()) {
    formErrorMessage.value = 'Por favor ingresa el nombre del paciente.'
    return
  }
  if (!patientData.email.trim() || !patientData.email.includes('@')) {
    formErrorMessage.value = 'Por favor ingresa un correo electrónico válido.'
    return
  }
  if (!patientData.phone.trim()) {
    formErrorMessage.value = 'Por favor ingresa un número de teléfono celular.'
    return
  }

  formErrorMessage.value = ''
  generatedBookingCode.value = `#SLD-${Math.floor(1000 + Math.random() * 9000)}`
  isConfirmationModalOpen.value = true
}

// Botón Anterior
function handlePrevious() {
  if (currentStep.value > 1) {
    currentStep.value--
  } else {
    currentStep.value = 1
  }
}

// Cambiar paso desde el stepper
function handleChangeStep(stepId: number) {
  currentStep.value = stepId
}

// Reiniciar reserva para agendar otra cita
function handleNewBooking() {
  isConfirmationModalOpen.value = false
  patientData.fullName = ''
  patientData.email = ''
  patientData.phone = ''
  selectedDayNumber.value = 26
  selectedTime.value = '10:00 AM'
  currentStep.value = 3
}
</script>

<template>
  <main class="booking-page">
    <div class="booking-container">
      <!-- 1. Barra de Progreso (Stepper) -->
      <BookingStepper :current-step="currentStep" @change-step="handleChangeStep" />

      <!-- 2. Encabezado y Subtítulo -->
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

      <!-- 3. Tarjetas en paralelo (Calendario y Formulario) -->
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
          <PatientForm v-model="patientData" />
        </section>
      </div>

      <!-- 4. Botones de Acción Inferiores -->
      <div class="actions-row">
        <!-- Botón Anterior -->
        <button
          type="button"
          class="btn-anterior"
          @click="handlePrevious"
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

        <!-- Botón Confirmar Cita -->
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

    <!-- 5. Modal de Confirmación -->
    <BookingConfirmationModal
      :is-open="isConfirmationModalOpen"
      :appointment-data="{
        serviceName: selectedService,
        specialistName: selectedSpecialist,
        dateText: formattedDateText,
        time: selectedTime,
        patient: patientData,
        bookingCode: generatedBookingCode,
      }"
      @close="isConfirmationModalOpen = false"
      @new-booking="handleNewBooking"
    />
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

/* Encabezado */
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

/* Grilla de Tarjetas */
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

/* Botón Anterior */
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

/* Botón Confirmar Cita */
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
