<script setup lang="ts">
export interface SpecialistItem {
  id: string
  name: string
  specialty: string
  description: string
  availability: string
  avatarEmoji: string
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', specialistId: string): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

const specialists: SpecialistItem[] = [
  {
    id: 'dra-marta-gonzalez',
    name: 'Dra. Marta González',
    specialty: 'Odontología General & Estética',
    description:
      'Especialista en odontología conservadora con más de 8 años de experiencia. Dedicada a restaurar la funcionalidad y belleza natural de tu sonrisa.',
    availability: 'Disponible hoy',
    avatarEmoji: '👩‍⚕️',
  },
  {
    id: 'dra-carmen-rodriguez',
    name: 'Dra. Carmen Rodríguez',
    specialty: 'Implantología & Cirugía Oral',
    description:
      'Cirujana oral certificada internacionalmente con 10 años de trayectoria. Experta en implantes dentales avanzados y regeneración ósea.',
    availability: 'Disponible desde mañana',
    avatarEmoji: '👩‍⚕️',
  },
]

function selectSpecialist(specialistId: string) {
  emit('update:modelValue', specialistId)
}
</script>

<template>
  <div class="step-container">
    <!-- Header -->
    <div class="step-header">
      <h1 class="main-title">Elige tu Especialista</h1>
      <p class="subtitle">Contamos con expertos altamente calificados para tu tratamiento</p>
    </div>

    <!-- 2 Specialists Cards Grid -->
    <div class="specialists-grid">
      <div
        v-for="doctor in specialists"
        :key="doctor.id"
        class="specialist-card"
        :class="{ active: modelValue === doctor.id }"
        @click="selectSpecialist(doctor.id)"
        role="button"
        :tabindex="0"
        @keydown.enter="selectSpecialist(doctor.id)"
        @keydown.space.prevent="selectSpecialist(doctor.id)"
      >
        <!-- Header with Avatar & Name -->
        <div class="doctor-header">
          <div class="doctor-avatar">
            <span class="avatar-emoji">{{ doctor.avatarEmoji }}</span>
          </div>
          <div class="doctor-title-box">
            <h3 class="doctor-name">{{ doctor.name }}</h3>
            <span class="doctor-specialty">{{ doctor.specialty }}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="doctor-desc">{{ doctor.description }}</p>

        <!-- Availability Footer -->
        <div class="doctor-footer">
          <svg class="calendar-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="availability-text">{{ doctor.availability }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Actions (Anterior / Siguiente) -->
    <div class="actions-row">
      <button
        type="button"
        class="btn-anterior"
        @click="emit('prev')"
        aria-label="Regresar al paso anterior"
      >
        <svg class="btn-arrow-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
            clip-rule="evenodd"
          />
        </svg>
        <span>Anterior</span>
      </button>

      <button
        type="button"
        class="btn-siguiente"
        @click="emit('next')"
        aria-label="Continuar al siguiente paso"
      >
        <span>Siguiente</span>
        <svg class="arrow-right-icon" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.step-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.main-title {
  font-size: 2.15rem;
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.03em;
  margin-bottom: 0.5rem;
  font-family: 'Plus Jakarta Sans', Inter, sans-serif;
}

.subtitle {
  font-size: 1rem;
  color: #64748b;
  font-weight: 500;
}

.specialists-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
}

.specialist-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 2.25rem 2rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  user-select: none;
}

.specialist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.specialist-card.active {
  border-color: #5046e5;
  border-width: 2px;
  box-shadow: 0 0 0 1px #5046e5, 0 12px 30px -4px rgba(80, 70, 229, 0.12);
}

.doctor-header {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 1.5rem;
}

.doctor-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5b4ae4 0%, #4338ca 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 6px 16px rgba(91, 74, 228, 0.25);
}

.avatar-emoji {
  font-size: 1.75rem;
  line-height: 1;
}

.doctor-title-box {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.doctor-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1e293b;
}

.doctor-specialty {
  font-size: 0.92rem;
  font-weight: 600;
  color: #2563eb;
}

.doctor-desc {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.75rem;
  flex-grow: 1;
}

.doctor-footer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #f1f5f9;
}

.calendar-icon {
  width: 18px;
  height: 18px;
  color: #00c49f;
}

.availability-text {
  font-size: 0.92rem;
  font-weight: 700;
  color: #00a887;
}

/* Actions */
.actions-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-anterior {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 1.75rem;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 9999px;
  color: #1e293b;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.btn-anterior:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
  transform: translateX(-2px);
}

.btn-arrow-icon {
  width: 18px;
  height: 18px;
}

.btn-siguiente {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.85rem 2.25rem;
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  border: none;
  border-radius: 9999px;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 196, 159, 0.35);
  transition: all 0.25s ease;
}

.btn-siguiente:hover {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(0, 196, 159, 0.45);
  transform: translateY(-1px);
}

.arrow-right-icon {
  width: 20px;
  height: 20px;
}

@media (max-width: 860px) {
  .specialists-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .main-title {
    font-size: 1.75rem;
  }

  .actions-row {
    flex-direction: column-reverse;
    gap: 1rem;
  }

  .btn-anterior,
  .btn-siguiente {
    width: 100%;
    justify-content: center;
  }
}
</style>
