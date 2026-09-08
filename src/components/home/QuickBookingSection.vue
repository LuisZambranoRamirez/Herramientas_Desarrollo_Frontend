<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Obtener fecha mínima (hoy) en formato local YYYY-MM-DD
function getTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const minDate = ref(getTodayDateString())

const timeOptions = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
]

const quickForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
})

interface FormErrors {
  fullName: string
  email: string
  phone: string
  service: string
  date: string
  time: string
}

const errors = reactive<FormErrors>({
  fullName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
})

const touched = reactive({
  fullName: false,
  email: false,
  phone: false,
  service: false,
  date: false,
  time: false,
})

const isSubmitting = ref(false)
const quickFormSuccess = ref(false)

// Verifica si un horario ya pasó en el día de hoy
function isTimeSlotPastToday(slotStr: string, selectedDate: string): boolean {
  if (!selectedDate || selectedDate !== minDate.value) return false
  const match = slotStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match || !match[1] || !match[2] || !match[3]) return false
  let hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0

  const now = new Date()
  const slotDate = new Date()
  slotDate.setHours(hour, minute, 0, 0)
  return slotDate.getTime() <= now.getTime()
}

// Validaciones individuales
function validateFullName(val: string): string {
  const trimmed = val.trim()
  if (!trimmed) {
    return 'El nombre completo es obligatorio.'
  }
  if (trimmed.length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.'
  }
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/
  if (!nameRegex.test(trimmed)) {
    return 'El nombre solo puede contener letras y espacios.'
  }
  return ''
}

function validateEmail(val: string): string {
  const trimmed = val.trim()
  if (!trimmed) {
    return 'El correo electrónico es obligatorio.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(trimmed)) {
    return 'Ingresa un correo electrónico válido (ejemplo: maria@email.com).'
  }
  return ''
}

function validatePhone(val: string): string {
  const trimmed = val.trim()
  if (!trimmed) {
    return 'El número de teléfono es obligatorio.'
  }
  const digitsOnly = trimmed.replace(/\D/g, '')
  if (digitsOnly.length === 9) {
    if (!digitsOnly.startsWith('9')) {
      return 'El número de celular debe iniciar con 9.'
    }
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('519')) {
    // Válido con código Perú +51
  } else {
    return `Debe contener 9 dígitos numéricos (ingresaste ${digitsOnly.length}).`
  }
  return ''
}

function validateService(val: string): string {
  if (!val) {
    return 'Por favor selecciona un servicio.'
  }
  return ''
}

function validateDate(val: string): string {
  if (!val) {
    return 'Por favor selecciona la fecha de tu cita.'
  }
  if (val < minDate.value) {
    return 'La fecha de la cita no puede ser anterior al día de hoy.'
  }
  return ''
}

function validateTime(val: string, selectedDate: string): string {
  if (!val) {
    return 'Por favor selecciona una hora de atención.'
  }
  if (isTimeSlotPastToday(val, selectedDate)) {
    return 'Este horario ya no está disponible para hoy. Elige otra hora o fecha posterior.'
  }
  return ''
}

// Handlers de inputs para validación en tiempo real cuando ya fue interactuado
function onFieldInput(field: 'fullName' | 'email' | 'phone') {
  if (touched[field]) {
    if (field === 'fullName') errors.fullName = validateFullName(quickForm.fullName)
    if (field === 'email') errors.email = validateEmail(quickForm.email)
    if (field === 'phone') errors.phone = validatePhone(quickForm.phone)
  }
}

function onBlur(field: keyof FormErrors) {
  touched[field] = true
  if (field === 'fullName') errors.fullName = validateFullName(quickForm.fullName)
  if (field === 'email') errors.email = validateEmail(quickForm.email)
  if (field === 'phone') errors.phone = validatePhone(quickForm.phone)
  if (field === 'service') errors.service = validateService(quickForm.service)
  if (field === 'date') errors.date = validateDate(quickForm.date)
  if (field === 'time') errors.time = validateTime(quickForm.time, quickForm.date)
}

function onDateChange() {
  touched.date = true
  errors.date = validateDate(quickForm.date)
  // Si la hora ya estaba seleccionada, verificar si sigue siendo válida para la nueva fecha seleccionada
  if (quickForm.time) {
    errors.time = validateTime(quickForm.time, quickForm.date)
  }
}

function onSelectChange(field: 'service' | 'time') {
  touched[field] = true
  if (field === 'service') errors.service = validateService(quickForm.service)
  if (field === 'time') errors.time = validateTime(quickForm.time, quickForm.date)
}

function handleQuickBooking() {
  // Marcar todos los campos como interactuados
  touched.fullName = true
  touched.email = true
  touched.phone = true
  touched.service = true
  touched.date = true
  touched.time = true

  // Validar todos los campos
  errors.fullName = validateFullName(quickForm.fullName)
  errors.email = validateEmail(quickForm.email)
  errors.phone = validatePhone(quickForm.phone)
  errors.service = validateService(quickForm.service)
  errors.date = validateDate(quickForm.date)
  errors.time = validateTime(quickForm.time, quickForm.date)

  const hasErrors = Object.values(errors).some((err) => !!err)
  if (hasErrors) {
    // Enfocar el primer elemento con error
    const firstInvalidKey = (Object.keys(errors) as (keyof FormErrors)[]).find((k) => !!errors[k])
    if (firstInvalidKey) {
      const el = document.getElementById(`quick-${firstInvalidKey}`)
      el?.focus()
    }
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    quickFormSuccess.value = true
    setTimeout(() => {
      router.push('/reservar')
    }, 1500)
  }, 600)
}
</script>

<template>
  <section id="contacto" class="section-container contact-section">
    <div class="section-header">
      <h2 class="section-title">Reserva tu Cita</h2>
      <p class="section-subtitle">
        Agenda tu consulta y da el primer paso hacia tu sonrisa perfecta
      </p>
    </div>

    <div class="contact-card-grid">
      <!-- Columna Izquierda: Imagen / Ilustración Clínica -->
      <div class="clinic-image-box">
        <div class="reception-visual">
          <div class="reception-badge">
            <span class="reception-tag">Clínica SoliDent</span>
            <span class="reception-sub">Atención Premium</span>
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Formulario de Contacto -->
      <div class="contact-form-card">
        <h3 class="contact-form-title">Datos de contacto</h3>
        <p class="contact-form-desc">
          Completa el formulario y te contactaremos para confirmar tu cita.
        </p>

        <!-- Estado de éxito -->
        <div v-if="quickFormSuccess" class="quick-success-alert">
          <div class="success-icon-wrap">
            <svg class="success-check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <p class="success-title">¡Pre-reserva enviada con éxito!</p>
          <p class="success-desc">
            Gracias por tu confianza. Te estamos redirigiendo al portal de citas...
          </p>
        </div>

        <!-- Formulario con validaciones en tiempo real -->
        <form v-else class="quick-form" novalidate @submit.prevent="handleQuickBooking">
          <div class="form-fields-grid">
            <!-- Nombre completo -->
            <div class="quick-field">
              <label class="quick-label" for="quick-fullName">
                Nombre completo <span class="required-star">*</span>
              </label>
              <input
                id="quick-fullName"
                v-model="quickForm.fullName"
                type="text"
                class="quick-input"
                :class="{ 'has-error': touched.fullName && errors.fullName }"
                placeholder="Ej. María Pérez"
                maxlength="70"
                @input="onFieldInput('fullName')"
                @blur="onBlur('fullName')"
              />
              <span v-if="touched.fullName && errors.fullName" class="field-error-msg">
                {{ errors.fullName }}
              </span>
            </div>

            <!-- Correo electrónico -->
            <div class="quick-field">
              <label class="quick-label" for="quick-email">
                Correo electrónico <span class="required-star">*</span>
              </label>
              <input
                id="quick-email"
                v-model="quickForm.email"
                type="email"
                class="quick-input"
                :class="{ 'has-error': touched.email && errors.email }"
                placeholder="maria@email.com"
                maxlength="90"
                @input="onFieldInput('email')"
                @blur="onBlur('email')"
              />
              <span v-if="touched.email && errors.email" class="field-error-msg">
                {{ errors.email }}
              </span>
            </div>

            <!-- Teléfono -->
            <div class="quick-field">
              <label class="quick-label" for="quick-phone">
                Teléfono <span class="required-star">*</span>
              </label>
              <input
                id="quick-phone"
                v-model="quickForm.phone"
                type="tel"
                class="quick-input"
                :class="{ 'has-error': touched.phone && errors.phone }"
                placeholder="+51 912 000 000"
                maxlength="16"
                @input="onFieldInput('phone')"
                @blur="onBlur('phone')"
              />
              <span v-if="touched.phone && errors.phone" class="field-error-msg">
                {{ errors.phone }}
              </span>
            </div>

            <!-- Servicio -->
            <div class="quick-field">
              <label class="quick-label" for="quick-service">
                Servicio <span class="required-star">*</span>
              </label>
              <select
                id="quick-service"
                v-model="quickForm.service"
                class="quick-select"
                :class="{ 'has-error': touched.service && errors.service }"
                @change="onSelectChange('service')"
                @blur="onBlur('service')"
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option value="limpieza">Limpieza Dental</option>
                <option value="ortodoncia">Ortodoncia</option>
                <option value="implantes">Implantes Dentales</option>
                <option value="estetica">Estética Dental</option>
              </select>
              <span v-if="touched.service && errors.service" class="field-error-msg">
                {{ errors.service }}
              </span>
            </div>

            <!-- Fecha preferida -->
            <div class="quick-field">
              <label class="quick-label" for="quick-date">
                Fecha preferida <span class="required-star">*</span>
              </label>
              <input
                id="quick-date"
                v-model="quickForm.date"
                type="date"
                :min="minDate"
                class="quick-input"
                :class="{ 'has-error': touched.date && errors.date }"
                @change="onDateChange"
                @blur="onBlur('date')"
              />
              <span v-if="touched.date && errors.date" class="field-error-msg">
                {{ errors.date }}
              </span>
            </div>

            <!-- Hora -->
            <div class="quick-field">
              <label class="quick-label" for="quick-time">
                Hora <span class="required-star">*</span>
              </label>
              <select
                id="quick-time"
                v-model="quickForm.time"
                class="quick-select"
                :class="{ 'has-error': touched.time && errors.time }"
                @change="onSelectChange('time')"
                @blur="onBlur('time')"
              >
                <option value="" disabled>Selecciona una hora</option>
                <option
                  v-for="slot in timeOptions"
                  :key="slot"
                  :value="slot"
                  :disabled="isTimeSlotPastToday(slot, quickForm.date)"
                >
                  {{ slot }}{{ isTimeSlotPastToday(slot, quickForm.date) ? ' (No disponible hoy)' : '' }}
                </option>
              </select>
              <span v-if="touched.time && errors.time" class="field-error-msg">
                {{ errors.time }}
              </span>
            </div>
          </div>

          <!-- Botón Reservar Cita -->
          <button
            type="submit"
            class="btn-submit-quick"
            :disabled="isSubmitting"
          >
            <svg class="btn-check-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ isSubmitting ? 'Validando y enviando...' : 'Reservar Cita' }}</span>
          </button>

          <p class="form-disclaimer">
            Al reservar, aceptas nuestra política de privacidad y confirmas que los datos
            son correctos.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-container {
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 5rem 1.5rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3.25rem;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.section-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  font-weight: 500;
}

.contact-section {
  padding-bottom: 6rem;
}

.contact-card-grid {
  display: grid;
  grid-template-columns: 1fr 1.35fr;
  gap: 2rem;
  align-items: stretch;
}

.clinic-image-box {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
}

.reception-visual {
  width: 100%;
  height: 100%;
  min-height: 380px;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 50%, #94a3b8 100%);
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  position: relative;
}

.reception-badge {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1rem 1.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.reception-tag {
  font-size: 1.1rem;
  font-weight: 800;
  color: #1e293b;
}

.reception-sub {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5046e5;
}

.contact-form-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
}

.contact-form-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.35rem;
}

.contact-form-desc {
  font-size: 0.92rem;
  color: #64748b;
  margin-bottom: 1.75rem;
}

.form-fields-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  margin-bottom: 1.75rem;
}

.quick-field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.quick-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
}

.required-star {
  color: #ef4444;
  font-weight: 700;
  margin-left: 0.2rem;
}

.quick-input,
.quick-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  font-size: 0.92rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s ease;
}

.quick-input:hover,
.quick-select:hover {
  border-color: #cbd5e1;
}

.quick-input:focus,
.quick-select:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.12);
}

/* Estados de Error */
.quick-input.has-error,
.quick-select.has-error {
  border-color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.quick-input.has-error:focus,
.quick-select.has-error:focus {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15) !important;
}

.field-error-msg {
  font-size: 0.8rem;
  color: #dc2626;
  font-weight: 500;
  animation: fadeIn 0.2s ease;
  line-height: 1.25;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.btn-submit-quick {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.95rem;
  background: linear-gradient(135deg, #2563eb 0%, #5046e5 50%, #7c3aed 100%);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
  transition: all 0.25s ease;
  margin-bottom: 1rem;
}

.btn-submit-quick:hover:not(:disabled) {
  filter: brightness(1.06);
  transform: translateY(-1px);
}

.btn-submit-quick:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-check-icon {
  width: 20px;
  height: 20px;
}

.form-disclaimer {
  font-size: 0.82rem;
  color: #94a3b8;
  text-align: center;
}

.quick-success-alert {
  background-color: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #166534;
  padding: 2rem 1.5rem;
  border-radius: 16px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.success-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #dcfce7;
  color: #16a34a;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.success-check-icon {
  width: 24px;
  height: 24px;
}

.success-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #15803d;
  margin: 0;
}

.success-desc {
  font-size: 0.92rem;
  color: #374151;
  margin: 0;
}

@media (max-width: 880px) {
  .contact-card-grid {
    grid-template-columns: 1fr;
  }

  .form-fields-grid {
    grid-template-columns: 1fr;
  }

  .contact-form-card {
    padding: 1.5rem;
  }
}
</style>
