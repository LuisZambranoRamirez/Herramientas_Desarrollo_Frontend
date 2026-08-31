<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToBooking(serviceName: string) {
  router.push('/reservar')
}
</script>

<template>
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

@media (max-width: 860px) {
  .services-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
