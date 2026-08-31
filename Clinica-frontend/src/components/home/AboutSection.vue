<script setup lang="ts">
// AboutSection component for SoliDent
</script>

<template>
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

@media (max-width: 840px) {
  .about-grid {
    grid-template-columns: 1fr;
  }

  .philosophy-card {
    padding: 1.75rem;
  }
}
</style>
