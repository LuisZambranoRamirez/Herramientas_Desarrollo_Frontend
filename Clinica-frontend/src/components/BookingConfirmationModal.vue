<script setup lang="ts">
import type { PatientData } from './PatientForm.vue'

defineProps<{
  isOpen: boolean
  appointmentData: {
    serviceName: string
    specialistName: string
    dateText: string
    time: string
    patient: PatientData
    bookingCode: string
  }
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'new-booking'): void
}>()
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-card" role="dialog" aria-modal="true">
        <!-- Success Icon Badge -->
        <div class="success-icon-wrapper">
          <div class="icon-circle">
            <svg class="success-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="3"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        <h3 class="modal-title">¡Cita Confirmada con Éxito!</h3>
        <p class="modal-subtitle">
          Tu reserva en <strong>SoliDent</strong> ha sido programada. Te enviamos los detalles a
          <span class="patient-email">{{ appointmentData.patient.email || 'tu correo' }}</span>
        </p>

        <!-- Summary Ticket -->
        <div class="summary-ticket">
          <div class="ticket-header">
            <span class="ticket-label">Código de Cita</span>
            <span class="ticket-code">{{ appointmentData.bookingCode }}</span>
          </div>

          <div class="ticket-divider"></div>

          <div class="ticket-details">
            <div class="detail-row">
              <span class="row-label">📅 Fecha:</span>
              <span class="row-value">{{ appointmentData.dateText }}</span>
            </div>

            <div class="detail-row">
              <span class="row-label">⏰ Hora:</span>
              <span class="row-value highlight">{{ appointmentData.time }}</span>
            </div>

            <div class="detail-row">
              <span class="row-label">🩺 Especialista:</span>
              <span class="row-value">{{ appointmentData.specialistName }}</span>
            </div>

            <div class="detail-row">
              <span class="row-label">✨ Servicio:</span>
              <span class="row-value">{{ appointmentData.serviceName }}</span>
            </div>

            <div class="detail-row">
              <span class="row-label">👤 Paciente:</span>
              <span class="row-value">{{ appointmentData.patient.fullName || 'No especificado' }}</span>
            </div>

            <div class="detail-row">
              <span class="row-label">📞 Teléfono:</span>
              <span class="row-value">{{ appointmentData.patient.phone || 'No especificado' }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="modal-actions">
          <button type="button" class="btn-new-booking" @click="emit('new-booking')">
            Agendar otra cita
          </button>
          <button type="button" class="btn-close" @click="emit('close')">
            Aceptar
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 24px;
  max-width: 520px;
  width: 100%;
  padding: 2.25rem 2rem;
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.2);
  text-align: center;
  animation: modal-pop 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

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
  box-shadow: 0 8px 20px rgba(0, 196, 159, 0.35);
}

.success-svg {
  width: 36px;
  height: 36px;
}

.modal-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.modal-subtitle {
  font-size: 0.95rem;
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.patient-email {
  color: #5046e5;
  font-weight: 600;
}

/* Ticket */
.summary-ticket {
  background-color: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  text-align: left;
  margin-bottom: 1.75rem;
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ticket-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ticket-code {
  font-size: 1rem;
  font-weight: 800;
  color: #5046e5;
  background-color: #eef2ff;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
}

.ticket-divider {
  border-top: 1px solid #e2e8f0;
  margin: 0.85rem 0;
}

.ticket-details {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.row-label {
  color: #64748b;
  font-weight: 500;
}

.row-value {
  color: #1e293b;
  font-weight: 600;
}

.row-value.highlight {
  color: #5046e5;
  font-weight: 700;
}

/* Actions */
.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-new-booking {
  flex: 1;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-new-booking:hover {
  background-color: #e2e8f0;
  color: #1e293b;
}

.btn-close {
  flex: 1;
  padding: 0.85rem 1.25rem;
  border-radius: 12px;
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.3);
  transition: all 0.2s ease;
}

.btn-close:hover {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop {
  0% {
    opacity: 0;
    transform: scale(0.92) translateY(10px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
</style>
