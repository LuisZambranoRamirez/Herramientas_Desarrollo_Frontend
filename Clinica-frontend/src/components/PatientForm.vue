<script setup lang="ts">
import { reactive, watch } from 'vue'

export interface PatientData {
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
        <input
          id="fullName"
          v-model="formData.fullName"
          type="text"
          class="form-input"
          placeholder="Ingresa tu nombre y apellido"
          required
        />
      </div>

      <!-- Correo Electrónico -->
      <div class="form-group">
        <label for="email" class="form-label">
          Correo electrónico <span class="required-star">*</span>
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-input"
          placeholder="ejemplo@correo.com"
          required
        />
      </div>

      <!-- Teléfono Celular -->
      <div class="form-group">
        <label for="phone" class="form-label">
          Teléfono celular <span class="required-star">*</span>
        </label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          class="form-input"
          placeholder="999 999 999"
          required
        />
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
  gap: 0.5rem;
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
