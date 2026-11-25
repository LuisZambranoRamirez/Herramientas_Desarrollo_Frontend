<script setup lang="ts">
// MapSection component for SoliDent
</script>

<template>
  <section class="map-section">
    <div class="map-container">
      <div class="map-header">
        <h2 class="map-title">📍 Visítanos</h2>
        <p class="map-subtitle">Estamos ubicados en Av. Tupac Amaru 3551, Comas</p>
      </div>

      <!-- Mapa embebido de Google Maps -->
      <div class="map-wrapper">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d975.8864735837088!2d-77.04961330863401!3d-11.936658363108966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105d0313efa7f67%3A0x4ac8235e5f644ed2!2sAv.%20T%C3%BApac%20Amaru%203551%2C%20Comas%2015312!5e0!3m2!1ses-419!2spe!4v1789401992856!5m2!1ses-419!2spe" width="600" height="450" style="border:0;" allowfullscreen loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>
      </div>

      <!-- Información adicional -->
      <div class="map-info">
        <div class="info-item">
          <span class="info-icon">📍</span>
          <div>
            <strong>Dirección</strong>
            <p>Av. Tupac Amaru 3551, Comas</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">🕒</span>
          <div>
            <strong>Horarios</strong>
            <p>Lun - Vie: 8:00 AM - 7:00 PM</p>
            <p>Sábados: 8:00 AM - 1:00 PM</p>
          </div>
        </div>
        <div class="info-item">
          <span class="info-icon">📞</span>
          <div>
            <strong>Teléfono</strong>
            <p>+51 912 045 471</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.map-section {
  width: 100%;
  padding: 4rem 1.5rem;
  background-color: var(--bg-page);
  transition: background-color 0.3s ease;
}

.map-container {
  max-width: 1140px;
  margin: 0 auto;
}

.map-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.map-title {
  font-size: 2rem;
  font-weight: 800;
  color: #eeeeee;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.map-subtitle {
  font-size: 1rem;
  color: #d6dbe2;
  font-weight: 500;
}

.map-wrapper {
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.1);
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
}

.map-wrapper iframe {
  display: block;
  width: 100%;
  height: 450px;
}

.map-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
  border: 1px solid #e2e8f0;
}

.info-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.info-item strong {
  display: block;
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.25rem;
}

.info-item p {
  font-size: 0.9rem;
  color: #64748b;
  margin: 0;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .map-section {
    padding: 3rem 1rem;
  }

  .map-title {
    font-size: 1.6rem;
  }

  .map-wrapper iframe {
    height: 300px;
  }

  .map-info {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>