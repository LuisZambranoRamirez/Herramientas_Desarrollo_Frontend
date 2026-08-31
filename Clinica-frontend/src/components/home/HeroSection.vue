<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToBooking() {
  router.push('/reservar')
}

function scrollToServices() {
  const el = document.getElementById('servicios')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="hero-section">
    <div class="hero-content">
      <h1 class="hero-title">Excelencia en Salud Dental</h1>
      <p class="hero-subtitle">
        Más de una década cuidando sonrisas con tecnología de vanguardia y un equipo de
        especialistas certificados
      </p>

      <div class="hero-actions">
        <button type="button" class="btn-hero-primary" @click="navigateToBooking">
          <svg class="btn-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span>Reservar Primera Cita</span>
        </button>

        <button type="button" class="btn-hero-secondary" @click="scrollToServices">
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
</template>

<style scoped>
.hero-section {
  width: 100%;
  min-height: 520px;
  background: linear-gradient(135deg, #3b82f6 0%, #5046e5 40%, #7c3aed 75%, #9333ea 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5.5rem 1.5rem 6.5rem;
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

@media (max-width: 640px) {
  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-hero-primary,
  .btn-hero-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
