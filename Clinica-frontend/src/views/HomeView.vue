<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Formulario de reserva rápida
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
    // Redirige al flujo completo de reserva
    setTimeout(() => {
      router.push('/reservar')
    }, 1200)
  }, 600)
}

function navigateToBooking(serviceId?: string) {
  router.push('/reservar')
}

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="home-page">
    <!-- ================= 1. HERO SECTION ================= -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Excelencia en Salud Dental</h1>
        <p class="hero-subtitle">
          Más de una década cuidando sonrisas con tecnología de vanguardia y un equipo de
          especialistas certificados
        </p>

        <div class="hero-actions">
          <button type="button" class="btn-hero-primary" @click="navigateToBooking()">
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Reservar Primera Cita</span>
          </button>

          <button
            type="button"
            class="btn-hero-secondary"
            @click="scrollToSection('servicios')"
          >
            <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Ver servicios</span>
          </button>
        </div>
      </div>
      <div class="hero-glow"></div>
    </section>

    <!-- ================= 2. SOBRE NOSOTROS ================= -->
    <section id="nosotros" class="section-container">
      <div class="section-header">
        <h2 class="section-title">Sobre Nosotros</h2>
        <p class="section-subtitle">
          Comprometidos con tu salud bucal y tu sonrisa perfecta
        </p>
      </div>

      <div class="about-grid">
        <!-- Tarjeta Izquierda: Nuestra Filosofía -->
        <div class="about-card philosophy-card">
          <div class="card-accent-bar"></div>
          <h3 class="card-heading">Nuestra Filosofía</h3>
          <p class="card-text">
            En SoliDent creemos que una sonrisa saludable es la puerta de entrada a una
            vida plena. Con más de 10 años de experiencia, combinamos tecnología de
            vanguardia con atención humana personalizada.
          </p>

          <div class="badges-row">
            <!-- Badge 1: Certificación -->
            <div class="badge-item">
              <div class="badge-icon-box">
                <svg class="badge-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="badge-text-box">
                <span class="badge-title">Certificación</span>
                <span class="badge-desc">Calidad garantizada</span>
              </div>
            </div>

            <!-- Badge 2: Seguridad -->
            <div class="badge-item">
              <div class="badge-icon-box">
                <svg class="badge-svg" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="badge-text-box">
                <span class="badge-title">Seguridad</span>
                <span class="badge-desc">Protocolos estrictos</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta Derecha: Banner Visual Médico -->
        <div class="about-card visual-card">
          <div class="visual-icon-glow">
            <svg class="stethoscope-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.75"
                d="M4.5 4.5v5.25a6.75 6.75 0 0013.5 0V4.5M9 16.5v1.5a3 3 0 006 0v-1.5m-3-12v6m0 0a3 3 0 106 0 3 3 0 00-6 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 3. SERVICIOS ESPECIALIZADOS ================= -->
    <section id="servicios" class="section-container">
      <div class="section-header">
        <h2 class="section-title">Servicios Especializados</h2>
        <p class="section-subtitle">
          Ofrecemos una amplia gama de tratamientos con la más alta tecnología
        </p>
      </div>

      <div class="services-cards-grid">
        <!-- Servicio 1: Limpieza Dental -->
        <div class="service-preview-card" @click="navigateToBooking('limpieza')">
          <div class="service-preview-icon purple-gradient">
            <svg class="preview-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <h3 class="service-preview-title">Limpieza Dental</h3>
          <p class="service-preview-desc">
            Eliminación profesional de placa y sarro para una sonrisa radiante y saludable.
          </p>
          <span class="service-link">Ver detalles &rarr;</span>
        </div>

        <!-- Servicio 2: Ortodoncia -->
        <div class="service-preview-card" @click="navigateToBooking('ortodoncia')">
          <div class="service-preview-icon blue-gradient">
            <svg class="preview-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <h3 class="service-preview-title">Ortodoncia</h3>
          <p class="service-preview-desc">
            Corrección de alineación dental con brackets metálicos y transparentes.
          </p>
          <span class="service-link">Ver detalles &rarr;</span>
        </div>

        <!-- Servicio 3: Implantes -->
        <div class="service-preview-card" @click="navigateToBooking('implantes')">
          <div class="service-preview-icon indigo-gradient">
            <svg class="preview-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 class="service-preview-title">Implantes</h3>
          <p class="service-preview-desc">
            Soluciones permanentes para dientes perdidos con tecnología de titanio.
          </p>
          <span class="service-link">Ver detalles &rarr;</span>
        </div>
      </div>
    </section>

    <!-- ================= 4. NUESTROS ESPECIALISTAS ================= -->
    <section id="especialistas" class="section-container">
      <div class="section-header">
        <h2 class="section-title">Nuestros Especialistas</h2>
        <p class="section-subtitle">
          Conoce a nuestro equipo de profesionales altamente calificados
        </p>
      </div>

      <div class="doctors-cards-grid">
        <!-- Doctora 1 -->
        <div class="doctor-profile-card">
          <div class="doctor-photo-wrapper">
            <div class="doctor-photo-placeholder doctor-1">
              <span class="doctor-avatar-emoji">👩‍⚕️</span>
            </div>
          </div>
          <div class="doctor-profile-info">
            <h3 class="doctor-profile-name">Dra. María González</h3>
            <span class="doctor-profile-spec">Ortodoncista Especialista</span>
            <p class="doctor-profile-bio">
              Especialista en ortodoncia con más de 8 años de experiencia. Graduada de la
              Universidad Nacional Mayor de San Marcos.
            </p>
            <div class="doctor-card-actions">
              <button
                type="button"
                class="btn-doctor-book"
                @click="navigateToBooking()"
              >
                <svg class="btn-sm-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Reservar</span>
              </button>
              <button
                type="button"
                class="btn-doctor-profile"
                @click="navigateToBooking()"
              >
                <svg class="btn-sm-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Ver perfil</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Doctora 2 -->
        <div class="doctor-profile-card">
          <div class="doctor-photo-wrapper">
            <div class="doctor-photo-placeholder doctor-2">
              <span class="doctor-avatar-emoji">👩‍⚕️</span>
            </div>
          </div>
          <div class="doctor-profile-info">
            <h3 class="doctor-profile-name">Dra. Carmen Rodríguez</h3>
            <span class="doctor-profile-spec">Implantóloga y Cirujana</span>
            <p class="doctor-profile-bio">
              Cirujana oral especialista en implantología con 10 años de experiencia.
              Certificada por la Universidad Cayetano Heredia.
            </p>
            <div class="doctor-card-actions">
              <button
                type="button"
                class="btn-doctor-book"
                @click="navigateToBooking()"
              >
                <svg class="btn-sm-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Reservar</span>
              </button>
              <button
                type="button"
                class="btn-doctor-profile"
                @click="navigateToBooking()"
              >
                <svg class="btn-sm-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span>Ver perfil</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 5. RESERVA TU CITA (FORMULARIO RÁPIDO) ================= -->
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
            <div class="glass-reflection"></div>
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
  </div>
</template>

<style scoped>
.home-page {
  width: 100%;
  background-color: #f8fafc;
  display: flex;
  flex-direction: column;
}

/* ================= 1. HERO ================= */
.hero-section {
  width: 100%;
  min-height: 520px;
  background: linear-gradient(135deg, #3b82f6 0%, #5046e5 40%, #7c3aed 75%, #9333ea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1.5rem 6rem;
  position: relative;
  overflow: hidden;
}

.hero-content {
  max-width: 820px;
  margin: 0 auto;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-title {
  font-size: 3.25rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1.25rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  max-width: 680px;
  margin-bottom: 2.5rem;
  font-weight: 400;
}

.hero-actions {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-hero-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 2rem;
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  border: none;
  border-radius: 9999px;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(0, 196, 159, 0.4);
  transition: all 0.25s ease;
}

.btn-hero-primary:hover {
  filter: brightness(1.06);
  transform: translateY(-2px);
}

.btn-hero-secondary {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.95rem 2rem;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  border-radius: 9999px;
  color: #ffffff;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
}

.btn-hero-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.hero-glow {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 6px;
  background: linear-gradient(90deg, #3b82f6, #a855f7);
  border-radius: 4px;
}

/* ================= GENERIC SECTIONS ================= */
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

/* ================= 2. SOBRE NOSOTROS ================= */
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: stretch;
}

.about-card {
  border-radius: 24px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
}

.philosophy-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  position: relative;
}

.card-accent-bar {
  width: 40px;
  height: 4px;
  background: #5046e5;
  border-radius: 2px;
  margin-bottom: 1.5rem;
}

.card-heading {
  font-size: 1.45rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 1rem;
}

.card-text {
  font-size: 0.98rem;
  color: #64748b;
  line-height: 1.7;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.badges-row {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.badge-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5b4ae4 0%, #4338ca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(91, 74, 228, 0.25);
}

.badge-svg {
  width: 22px;
  height: 22px;
}

.badge-text-box {
  display: flex;
  flex-direction: column;
}

.badge-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
}

.badge-desc {
  font-size: 0.82rem;
  color: #64748b;
}

.visual-card {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
  box-shadow: 0 12px 30px -4px rgba(79, 70, 229, 0.25);
}

.visual-icon-glow {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.stethoscope-icon {
  width: 48px;
  height: 48px;
}

/* ================= 3. SERVICIOS ================= */
.services-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
}

.service-preview-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.25s ease;
}

.service-preview-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px -4px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.service-preview-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  margin-bottom: 1.5rem;
}

.purple-gradient {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.blue-gradient {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.indigo-gradient {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
}

.preview-svg {
  width: 26px;
  height: 26px;
}

.service-preview-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.service-preview-desc {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.75rem;
  flex-grow: 1;
}

.service-link {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2563eb;
  transition: transform 0.2s ease;
}

.service-preview-card:hover .service-link {
  transform: translateX(4px);
}

/* ================= 4. ESPECIALISTAS ================= */
.doctors-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.doctor-profile-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.doctor-photo-wrapper {
  flex-shrink: 0;
}

.doctor-photo-placeholder {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}

.doctor-1 {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.doctor-2 {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.doctor-avatar-emoji {
  font-size: 2rem;
}

.doctor-profile-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.doctor-profile-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.2rem;
}

.doctor-profile-spec {
  font-size: 0.95rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.75rem;
}

.doctor-profile-bio {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.doctor-card-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-doctor-book {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background-color: #2563eb;
  color: #ffffff;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-doctor-book:hover {
  background-color: #1d4ed8;
}

.btn-doctor-profile {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  background-color: #ffffff;
  border: 1px solid #2563eb;
  color: #2563eb;
  font-weight: 700;
  font-size: 0.9rem;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-doctor-profile:hover {
  background-color: #eff6ff;
}

.btn-sm-icon {
  width: 16px;
  height: 16px;
}

/* ================= 5. RESERVA TU CITA ================= */
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
  .hero-title {
    font-size: 2.35rem;
  }

  .about-grid,
  .services-cards-grid,
  .doctors-cards-grid,
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
