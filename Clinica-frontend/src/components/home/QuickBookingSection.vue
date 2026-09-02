<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const quickForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
})

const isSubmitting = ref(false)
const quickFormSuccess = ref(false)

function handleQuickBooking() {
  if (!quickForm.fullName || !quickForm.phone) {
    alert('Por favor ingresa tu nombre y número de teléfono.')
    return
  }

  isSubmitting.value = true
  setTimeout(() => {
    isSubmitting.value = false
    quickFormSuccess.value = true
    setTimeout(() => {
      router.push('/reservar')
    }, 1200)
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

        <div v-if="quickFormSuccess" class="quick-success-alert">
          ✓ ¡Gracias! Te estamos redirigiendo al portal de reserva de citas...
        </div>

        <form v-else class="quick-form" @submit.prevent="handleQuickBooking">
          <div class="form-fields-grid">
            <!-- Nombre completo -->
            <div class="quick-field">
              <label class="quick-label">Nombre completo</label>
              <input
                v-model="quickForm.fullName"
                type="text"
                class="quick-input"
                placeholder="Ej. María Pérez"
                required
              />
            </div>

            <!-- Correo electrónico -->
            <div class="quick-field">
              <label class="quick-label">Correo electrónico</label>
              <input
                v-model="quickForm.email"
                type="email"
                class="quick-input"
                placeholder="maria@email.com"
                required
              />
            </div>

            <!-- Teléfono -->
            <div class="quick-field">
              <label class="quick-label">Teléfono</label>
              <input
                v-model="quickForm.phone"
                type="tel"
                class="quick-input"
                placeholder="+51 912 000 000"
                required
              />
            </div>

            <!-- Servicio -->
            <div class="quick-field">
              <label class="quick-label">Servicio</label>
              <select v-model="quickForm.service" class="quick-select">
                <option value="" disabled selected>Selecciona un servicio</option>
                <option value="limpieza">Limpieza Dental</option>
                <option value="ortodoncia">Ortodoncia</option>
                <option value="implantes">Implantes Dentales</option>
                <option value="estetica">Estética Dental</option>
              </select>
            </div>

            <!-- Fecha preferida -->
            <div class="quick-field">
              <label class="quick-label">Fecha preferida</label>
              <input
                v-model="quickForm.date"
                type="date"
                class="quick-input"
              />
            </div>

            <!-- Hora -->
            <div class="quick-field">
              <label class="quick-label">Hora</label>
              <select v-model="quickForm.time" class="quick-select">
                <option value="" disabled selected>Selecciona una hora</option>
                <option value="09:00 AM">09:00 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM</option>
                <option value="06:00 PM">06:00 PM</option>
              </select>
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
            <span>{{ isSubmitting ? 'Procesando...' : 'Reservar Cita' }}</span>
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
  gap: 0.4rem;
}

.quick-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #1e293b;
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
  transition: border-color 0.2s ease;
}

.quick-input:focus,
.quick-select:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.12);
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

.btn-submit-quick:hover {
  filter: brightness(1.06);
  transform: translateY(-1px);
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
  color: #16a34a;
  padding: 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
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
