<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface PatientData {
  fullName: string
  email: string
  phone: string
}

export interface FormErrors {
  fullName: string
  email: string
  phone: string
}

const props = defineProps<{
  modelValue?: PatientData
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: PatientData): void
}>()

const formData = reactive<PatientData>({
  fullName: props.modelValue?.fullName || '',
  email: props.modelValue?.email || '',
  phone: props.modelValue?.phone || '',
})

const errors = reactive<FormErrors>({
  fullName: '',
  email: '',
  phone: '',
})

const touched = reactive<{
  fullName: boolean
  email: boolean
  phone: boolean
}>({
  fullName: false,
  email: false,
  phone: false,
})

// Validación de Nombre
function validateFullName(val: string): string {
  if (!val.trim()) {
    return 'El nombre completo es obligatorio.'
  }
  if (val.trim().length < 3) {
    return 'El nombre debe tener al menos 3 caracteres.'
  }
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/
  if (!nameRegex.test(val)) {
    return 'El nombre solo puede contener letras y espacios.'
  }
  return ''
}

// Validación de Email
function validateEmail(val: string): string {
  if (!val.trim()) {
    return 'El correo electrónico es obligatorio.'
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
  if (!emailRegex.test(val.trim())) {
    return 'Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).'
  }
  return ''
}

// Validación de Teléfono (Celular)
function validatePhone(val: string): string {
  if (!val.trim()) {
    return 'El teléfono celular es obligatorio.'
  }
  if (val.length < 9) {
    return `Faltan dígitos (${val.length}/9 dígitos). Debe tener 9 dígitos.`
  }
  if (!val.startsWith('9')) {
    return 'El número de celular debe comenzar con 9.'
  }
  return ''
}

// Filtro en tiempo real para Nombre (bloquear números)
function onNameInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Reemplaza dígitos y caracteres especiales no permitidos
  const sanitized = target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]/g, '')
  formData.fullName = sanitized
  if (touched.fullName) {
    errors.fullName = validateFullName(sanitized)
  }
}

// Filtro en tiempo real para Teléfono (solo 9 dígitos numéricos)
function onPhoneInput(e: Event) {
  const target = e.target as HTMLInputElement
  // Extrae solo dígitos y limita a 9
  const digitsOnly = target.value.replace(/\D/g, '').slice(0, 9)
  formData.phone = digitsOnly
  if (touched.phone) {
    errors.phone = validatePhone(digitsOnly)
  }
}

function onEmailInput(e: Event) {
  const target = e.target as HTMLInputElement
  formData.email = target.value
  if (touched.email) {
    errors.email = validateEmail(target.value)
  }
}

function handleBlur(field: 'fullName' | 'email' | 'phone') {
  touched[field] = true
  if (field === 'fullName') errors.fullName = validateFullName(formData.fullName)
  if (field === 'email') errors.email = validateEmail(formData.email)
  if (field === 'phone') errors.phone = validatePhone(formData.phone)
}

// Método público para validar todo el formulario antes de enviar
function validateAll(): boolean {
  touched.fullName = true
  touched.email = true
  touched.phone = true

  errors.fullName = validateFullName(formData.fullName)
  errors.email = validateEmail(formData.email)
  errors.phone = validatePhone(formData.phone)

  return !errors.fullName && !errors.email && !errors.phone
}

defineExpose({
  validateAll,
})

watch(
  formData,
  (newVal) => {
    emit('update:modelValue', { ...newVal })
  },
  { deep: true },
)
</script>

<template>
  <div class="patient-card">
    <h3 class="card-title">Datos del Paciente</h3>

    <form class="patient-form" @submit.prevent>
      <!-- Nombre Completo -->
      <div class="form-group">
        <label for="fullName" class="form-label">
          Nombre completo <span class="required-star">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="fullName"
            :value="formData.fullName"
            type="text"
            class="form-input"
            :class="{ 'has-error': touched.fullName && errors.fullName }"
            placeholder="Ingresa tu nombre y apellido"
            maxlength="70"
            @input="onNameInput"
            @blur="handleBlur('fullName')"
            required
          />
        </div>
        <span v-if="touched.fullName && errors.fullName" class="error-msg">
          {{ errors.fullName }}
        </span>
      </div>

      <!-- Correo Electrónico -->
      <div class="form-group">
        <label for="email" class="form-label">
          Correo electrónico <span class="required-star">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="email"
            :value="formData.email"
            type="email"
            class="form-input"
            :class="{ 'has-error': touched.email && errors.email }"
            placeholder="ejemplo@correo.com"
            maxlength="100"
            @input="onEmailInput"
            @blur="handleBlur('email')"
            required
          />
        </div>
        <span v-if="touched.email && errors.email" class="error-msg">
          {{ errors.email }}
        </span>
      </div>

      <!-- Teléfono Celular -->
      <div class="form-group">
        <label for="phone" class="form-label">
          Teléfono celular <span class="required-star">*</span>
        </label>
        <div class="input-wrapper">
          <input
            id="phone"
            :value="formData.phone"
            type="tel"
            inputmode="numeric"
            class="form-input"
            :class="{ 'has-error': touched.phone && errors.phone }"
            placeholder="999 999 999"
            maxlength="9"
            @input="onPhoneInput"
            @blur="handleBlur('phone')"
            required
          />
        </div>
        <span v-if="touched.phone && errors.phone" class="error-msg">
          {{ errors.phone }}
        </span>
      </div>
    </form>
  </div>
</template>

<style scoped>
.patient-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 2rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.patient-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
}

.required-star {
  color: #ef4444;
  font-weight: 700;
}

.input-wrapper {
  position: relative;
  width: 100%;
}

.form-input {
  width: 100%;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
}

.form-input::placeholder {
  color: #94a3b8;
  font-size: 0.92rem;
}

.form-input:hover {
  border-color: #cbd5e1;
}

.form-input:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.12);
  background-color: #ffffff;
}

/* Error State */
.form-input.has-error {
  border-color: #ef4444;
  background-color: #fffaf0;
}

.form-input.has-error:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.error-msg {
  font-size: 0.82rem;
  color: #dc2626;
  font-weight: 500;
  animation: fadeIn 0.2s ease;
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

@media (max-width: 640px) {
  .patient-card {
    padding: 1.25rem 1rem;
  }

  .form-input {
    padding: 0.75rem 0.9rem;
    font-size: 0.9rem;
  }
}
</style>
