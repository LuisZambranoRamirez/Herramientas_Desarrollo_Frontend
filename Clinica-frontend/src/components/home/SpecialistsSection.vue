<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToBooking() {
  router.push('/reservar')
}
</script>

<template>
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
              @click="navigateToBooking"
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
              @click="navigateToBooking"
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
              @click="navigateToBooking"
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
              @click="navigateToBooking"
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

@media (max-width: 860px) {
  .doctors-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
