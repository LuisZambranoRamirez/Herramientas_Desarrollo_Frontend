<script setup lang="ts">
import type { PatientData } from './PatientForm.vue'

defineProps<{
  serviceName: string
  specialistName: string
  dateText: string
  time: string
  patient: PatientData
}>()

const emit = defineEmits<{
  (e: 'go-home'): void
  (e: 'new-booking'): void
}>()
</script>

<template>
  <div class="step-container">
    <!-- Success Icon Badge -->
    <div class="success-icon-wrapper">
      <div class="icon-circle">
        <svg class="check-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>

    <!-- Header Title & Subtitle -->
    <div class="step-header">
      <h1 class="main-title">¡Cita Confirmada!</h1>
      <p class="subtitle">
        Tu reserva ha sido registrada de manera exitosa en nuestro sistema
      </p>
    </div>

    <!-- Summary Card: Resumen de tu Consulta -->
    <div class="summary-card">
      <h3 class="card-title">Resumen de tu Consulta</h3>

      <div class="details-list">
        <!-- Tratamiento -->
        <div class="detail-item">
          <span class="detail-label">Tratamiento</span>
          <span class="detail-value">{{ serviceName }}</span>
        </div>

        <div class="item-divider"></div>

        <!-- Especialista -->
        <div class="detail-item">
          <span class="detail-label">Especialista</span>
          <span class="detail-value">{{ specialistName }}</span>
        </div>

        <div class="item-divider"></div>

        <!-- Fecha y Hora -->
        <div class="detail-item">
          <span class="detail-label">Fecha y Hora</span>
          <span class="detail-value highlight-date">{{ dateText }} - {{ time }}</span>
        </div>

        <div class="item-divider"></div>

        <!-- Paciente -->
        <div class="detail-item">
          <span class="detail-label">Paciente</span>
          <span class="detail-value">{{ patient.fullName || 'Paciente SoliDent' }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Notice Text -->
    <p class="notice-text">
      Recibirás un correo de confirmación con los detalles y recordatorios en breve.
    </p>

    <!-- Action Buttons -->
    <div class="actions-row">
      <!-- Volver al Inicio -->
      <button
        type="button"
        class="btn-inicio"
        @click="emit('go-home')"
        aria-label="Volver a la página principal"
      >
        <svg class="btn-home-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
          />
        </svg>
        <span>Volver al Inicio</span>
      </button>

      <!-- Agendar Otra Cita -->
      <button
        type="button"
        class="btn-nueva-cita"
        @click="emit('new-booking')"
        aria-label="Agendar una nueva cita"
      >
        <svg class="btn-plus-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Agendar Otra Cita</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

/* Success Badge */
.success-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.icon-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 196, 159, 0.35);
  animation: pulse-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.check-svg {
  width: 36px;
  height: 36px;
}

/* Header */
.step-header {
  text-align: center;
  margin-bottom: 2rem;
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

/* Summary Card */
.summary-card {
  width: 100%;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2rem 2.25rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  margin-bottom: 1.75rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1.5rem;
}

.details-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
}

.detail-value {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 700;
  text-align: right;
}

.detail-value.highlight-date {
  color: #2563eb;
  font-weight: 700;
}

.item-divider {
  border-top: 1px solid #f1f5f9;
}

/* Notice */
.notice-text {
  font-size: 0.95rem;
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 500;
}

/* Actions Row */
.actions-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
}

.btn-inicio {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.btn-inicio:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateY(-1px);
}

.btn-home-icon {
  width: 18px;
  height: 18px;
  color: #1e293b;
}

.btn-nueva-cita {
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

.btn-nueva-cita:hover {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(0, 196, 159, 0.45);
  transform: translateY(-1px);
}

.btn-plus-icon {
  width: 20px;
  height: 20px;
}

@keyframes pulse-pop {
  0% {
    opacity: 0;
    transform: scale(0.6);
  }
  70% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@media (max-width: 640px) {
  .summary-card {
    padding: 1.5rem 1.25rem;
  }

  .actions-row {
    flex-direction: column;
    width: 100%;
  }

  .btn-inicio,
  .btn-nueva-cita {
    width: 100%;
    justify-content: center;
  }
}
</style>
