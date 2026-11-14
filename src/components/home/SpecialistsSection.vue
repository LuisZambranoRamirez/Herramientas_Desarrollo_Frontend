<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { odontologosService } from '@/services/odontologos.service'
import type { OdontologoPublico } from '@/types'

const router = useRouter()
const specialists = ref<OdontologoPublico[]>([])
const isLoading = ref<boolean>(true)
const errorMessage = ref<string>('')

function formatEspecialidad(spec?: string): string {
  if (!spec) return 'Odontología General'
  const clean = spec.replace(/_/g, ' ').toLowerCase()
  return clean.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}

function formatNombreDoctor(nombre?: string): string {
  if (!nombre) return 'Dr(a). Especialista'
  const trimmed = nombre.trim()
  if (/^dr(\.|a\.|\(a\)\.)/i.test(trimmed)) {
    return trimmed
  }
  return `Dr(a). ${trimmed}`
}

function formatDescripcion(desc?: string, especialidad?: string): string {
  if (desc && desc.trim().length > 10) return desc.trim()
  const esp = formatEspecialidad(especialidad)
  return `Especialista en ${esp}, comprometido con una atención clínica integral y el cuidado personalizado de tu sonrisa.`
}

function getAvatarEmoji(index: number): string {
  return index % 2 === 0 ? '👩‍⚕️' : '👨‍⚕️'
}

async function cargarEspecialistas() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const data = await odontologosService.getActiveDentists()
    specialists.value = data
  } catch (err) {
    errorMessage.value = 'No se pudo cargar la lista de especialistas en este momento.'
  } finally {
    isLoading.value = false
  }
}

onMounted(cargarEspecialistas)

function navigateToBooking(doctor?: OdontologoPublico) {
  if (doctor) {
    router.push({
      path: '/reservar',
      query: { especialista: doctor.id || doctor.dni || doctor.username },
    })
  } else {
    router.push('/reservar')
  }
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

    <!-- Estado de carga: Skeletons elegantes -->
    <div v-if="isLoading" class="doctors-cards-grid">
      <div v-for="i in 2" :key="`skeleton-${i}`" class="doctor-profile-card skeleton-card">
        <div class="doctor-photo-wrapper">
          <div class="skeleton-avatar"></div>
        </div>
        <div class="doctor-profile-info">
          <div class="skeleton-line skeleton-title"></div>
          <div class="skeleton-line skeleton-spec"></div>
          <div class="skeleton-line skeleton-text"></div>
          <div class="skeleton-line skeleton-text short"></div>
          <div class="skeleton-actions">
            <div class="skeleton-btn"></div>
            <div class="skeleton-btn"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Estado vacío: Cuando no hay odontólogos activos registrados -->
    <div v-else-if="specialists.length === 0" class="empty-specialists-state">
      <div class="empty-icon-box">🦷</div>
      <h3 class="empty-title">Próximamente más especialistas</h3>
      <p class="empty-desc">
        Actualmente estamos actualizando la disponibilidad de nuestro equipo médico.
        Puedes comunicarte directamente con nosotros o reservar tu cita para asignarte un especialista disponible.
      </p>
      <button type="button" class="btn-doctor-book" @click="navigateToBooking()">
        <span>Reservar Consulta General</span>
      </button>
    </div>

    <!-- Grid de tarjetas dinámicas -->
    <div v-else class="doctors-cards-grid">
      <div
        v-for="(doctor, index) in specialists"
        :key="doctor.id || doctor.dni || doctor.username"
        class="doctor-profile-card"
      >
        <div class="doctor-photo-wrapper">
          <div
            class="doctor-photo-placeholder"
            :class="index % 2 === 0 ? 'doctor-1' : 'doctor-2'"
          >
            <span class="doctor-avatar-emoji">{{ getAvatarEmoji(index) }}</span>
          </div>
        </div>
        <div class="doctor-profile-info">
          <h3 class="doctor-profile-name">{{ formatNombreDoctor(doctor.nombre) }}</h3>
          <span class="doctor-profile-spec">{{ formatEspecialidad(doctor.especialidad) }}</span>
          <p class="doctor-profile-bio">
            {{ formatDescripcion(doctor.descripcion, doctor.especialidad) }}
          </p>
          <div class="doctor-card-actions">
            <button
              type="button"
              class="btn-doctor-book"
              @click="navigateToBooking(doctor)"
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
              @click="navigateToBooking(doctor)"
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
  color: var(--text-main);
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.section-subtitle {
  font-size: 1.05rem;
  color: var(--text-muted);
  font-weight: 500;
}

.doctors-cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.doctor-profile-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: 24px;
  padding: 2.25rem 2rem;
  box-shadow: var(--shadow-card);
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  transition: background-color 0.3s ease, border-color 0.3s ease;
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
  color: var(--text-main);
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
  color: var(--text-muted);
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
  background-color: var(--bg-card);
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

/* Skeleton Loading */
.skeleton-card {
  pointer-events: none;
}

.skeleton-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line {
  height: 14px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
}

.skeleton-title {
  width: 60%;
  height: 20px;
  margin-bottom: 0.6rem;
}

.skeleton-spec {
  width: 40%;
  height: 14px;
  margin-bottom: 1rem;
}

.skeleton-text {
  width: 90%;
  margin-bottom: 0.5rem;
}

.skeleton-text.short {
  width: 70%;
  margin-bottom: 1.5rem;
}

.skeleton-actions {
  display: flex;
  gap: 0.75rem;
}

.skeleton-btn {
  width: 110px;
  height: 38px;
  border-radius: 9999px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* Empty State */
.empty-specialists-state {
  text-align: center;
  padding: 3.5rem 2rem;
  background: var(--bg-card);
  border: 1.5px dashed var(--border-light);
  border-radius: 24px;
  max-width: 640px;
  margin: 0 auto;
}

.empty-icon-box {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.empty-desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 860px) {
  .doctors-cards-grid {
    grid-template-columns: 1fr;
  }
}
</style>
