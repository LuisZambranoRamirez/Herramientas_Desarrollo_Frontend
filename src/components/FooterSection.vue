<script setup lang="ts">
// FooterSection component for SoliDent
</script>

<template>
  <footer class="footer-root">
    <div class="footer-container">
      <!-- Grid Superior: 3 Columnas -->
      <div class="footer-grid">
        <!-- Columna 1: Marca y Redes Sociales -->
        <div class="footer-col brand-col">
          <h3 class="footer-brand-title">Soli<span class="brand-accent">Dent</span></h3>
          <p class="footer-brand-desc">
            Clínica dental especializada en tratamientos de alta calidad con tecnología de
            vanguardia.
          </p>

          <div class="social-links">
            <!-- Instagram -->
            <a href="#" class="social-btn" aria-label="Instagram" target="_blank" rel="noopener">
              <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke-width="2" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" stroke-width="2" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke-width="2" />
              </svg>
            </a>

            <!-- Facebook -->
            <a href="#" class="social-btn" aria-label="Facebook" target="_blank" rel="noopener">
              <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </a>

            <!-- LinkedIn -->
            <a href="#" class="social-btn" aria-label="LinkedIn" target="_blank" rel="noopener">
              <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"
                  stroke-width="2"
                />
                <rect x="2" y="9" width="4" height="12" stroke-width="2" />
                <circle cx="4" cy="4" r="2" stroke-width="2" />
              </svg>
            </a>

            <!-- YouTube -->
            <a href="#" class="social-btn" aria-label="YouTube" target="_blank" rel="noopener">
              <svg class="social-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"
                  stroke-width="2"
                />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Columna 2: Contacto -->
        <div class="footer-col">
          <h4 class="footer-heading">Contacto</h4>
          <ul class="footer-info-list">
            <li class="info-item">Av. Tupac Amaru 3551, Comas</li>
            <li class="info-item">
              <a href="tel:+51912045471" class="info-link">+51 912 045 471</a>
            </li>
            <li class="info-item">
              <a href="mailto:contacto@solident.com" class="info-link">contacto@solident.com</a>
            </li>
          </ul>
        </div>

        <!-- Columna 3: Horarios -->
        <div class="footer-col">
          <h4 class="footer-heading">Horarios</h4>
          <ul class="footer-info-list">
            <li class="info-item">Lun - Vie: 8:00 AM - 7:00 PM</li>
            <li class="info-item">Sábados: 8:00 AM - 1:00 PM</li>
            <li class="info-item text-muted">Domingos: Cerrado</li>
          </ul>
        </div>
      </div>

      <!-- Barra Inferior de Copyright -->
      <div class="footer-bottom">
        <p class="copyright-text">
          &copy; 2024 SoliDent. Todos los derechos reservados.
        </p>
        <div class="legal-links">
          <a href="#" class="legal-link">Política de privacidad</a>
          <a href="#" class="legal-link">Términos</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-root {
  width: 100%;
  background-color: #111827;
  color: #f1f5f9;
  padding: 4.5rem 1.5rem 2.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1140px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 3.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.footer-brand-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.brand-accent {
  color: #818cf8;
}

.footer-brand-desc {
  font-size: 0.92rem;
  color: #94a3b8;
  line-height: 1.65;
  margin-bottom: 1.75rem;
  max-width: 320px;
}

.social-links {
  display: flex;
  gap: 0.75rem;
}

.social-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background-color: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
}

.social-btn:hover {
  background-color: #5046e5;
  border-color: #5046e5;
  color: #ffffff;
  transform: translateY(-2px);
}

.social-icon {
  width: 18px;
  height: 18px;
}

.footer-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.25rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.footer-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.info-item {
  font-size: 0.92rem;
  color: #94a3b8;
  line-height: 1.5;
}

.info-link {
  color: #94a3b8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.info-link:hover {
  color: #ffffff;
}

.text-muted {
  color: #64748b;
}

/* Barra Inferior */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.copyright-text {
  font-size: 0.88rem;
  color: #64748b;
}

.legal-links {
  display: flex;
  gap: 1.5rem;
}

.legal-link {
  font-size: 0.88rem;
  color: #64748b;
  text-decoration: none;
  transition: color 0.2s ease;
}

.legal-link:hover {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-bottom: 2rem;
  }

  .footer-bottom {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
