<script setup lang="ts">
export interface ServiceItem {
  id: string
  name: string
  description: string
  duration: string
  priceRange: string
  iconType: 'cleaning' | 'orthodontics' | 'implants'
}

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', serviceId: string): void
  (e: 'next'): void
}>()

const services: ServiceItem[] = [
  {
    id: 'limpieza-dental',
    name: 'Limpieza Dental',
    description:
      'Eliminación profesional de placa y sarro para una sonrisa radiante y libre de caries.',
    duration: '45 mins',
    priceRange: '$50 - $70',
    iconType: 'cleaning',
  },
  {
    id: 'ortodoncia',
    name: 'Ortodoncia',
    description:
      'Corrección de alineación dental con brackets convencionales o estéticos personalizados.',
    duration: '60 mins',
    priceRange: '$120 - $180',
    iconType: 'orthodontics',
  },
  {
    id: 'implantes-dentales',
    name: 'Implantes Dentales',
    description:
      'Soluciones permanentes para dientes perdidos utilizando tecnología de titanio de alta gama.',
    duration: '90 mins',
    priceRange: '$450 - $600',
    iconType: 'implants',
  },
]

function selectService(serviceId: string) {
  emit('update:modelValue', serviceId)
}
</script>

<template>
  <div class="step-container">
    <!-- Header -->
    <div class="step-header">
      <h1 class="main-title">Elige tu Servicio</h1>
      <p class="subtitle">Selecciona el tratamiento odontológico que deseas agendar</p>
    </div>

    <!-- 3 Service Cards Grid -->
    <div class="services-grid">
      <div
        v-for="service in services"
        :key="service.id"
        class="service-card"
        :class="{ active: modelValue === service.id }"
        @click="selectService(service.id)"
        role="button"
        :tabindex="0"
        @keydown.enter="selectService(service.id)"
        @keydown.space.prevent="selectService(service.id)"
      >
        <!-- Top Icon -->
        <div class="card-icon-wrapper" :class="{ 'icon-active': modelValue === service.id }">
          <!-- Icon 1: Limpieza / Tooth Sparkle -->
          <svg
            v-if="service.iconType === 'cleaning'"
            class="service-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6M6 9l12 6M18 9l-12 6"
            />
          </svg>

          <!-- Icon 2: Ortodoncia / Brackets -->
          <svg
            v-else-if="service.iconType === 'orthodontics'"
            class="service-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2.2"
              d="M8 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2"
            />
          </svg>

          <!-- Icon 3: Implantes / Clean Tooth Circle -->
          <svg
            v-else
            class="service-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="9" stroke-width="2" />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 9l6 6M15 9l-6 6"
            />
          </svg>
        </div>

        <!-- Service Info -->
        <h3 class="service-name">{{ service.name }}</h3>
        <p class="service-desc">{{ service.description }}</p>

        <!-- Divider line -->
        <div class="card-divider"></div>

        <!-- Card Footer -->
        <div class="card-footer">
          <div class="duration-info">
            <svg class="clock-icon" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
            <span>{{ service.duration }}</span>
          </div>
          <span class="price-text">{{ service.priceRange }}</span>
        </div>
      </div>
    </div>

    <!-- Bottom Action -->
    <div class="actions-row">
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

.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.75rem;
  margin-bottom: 3rem;
}

.service-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 24px;
  padding: 2rem 1.75rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  outline: none;
  user-select: none;
}

.service-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.service-card.active {
  border-color: #5046e5;
  border-width: 2px;
  box-shadow: 0 0 0 1px #5046e5, 0 12px 30px -4px rgba(80, 70, 229, 0.12);
}

.card-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: #f1f5f9;
  color: #5046e5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.25s ease;
}

.card-icon-wrapper.icon-active {
  background: linear-gradient(135deg, #5b4ae4 0%, #4338ca 100%);
  color: #ffffff;
  box-shadow: 0 6px 16px rgba(91, 74, 228, 0.3);
}

.service-svg {
  width: 26px;
  height: 26px;
}

.service-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.75rem;
}

.service-desc {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.55;
  margin-bottom: 1.75rem;
  flex-grow: 1;
}

.card-divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 1.25rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.duration-info {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.88rem;
  color: #64748b;
  font-weight: 500;
}

.clock-icon {
  width: 16px;
  height: 16px;
  color: #94a3b8;
}

.price-text {
  font-size: 1.05rem;
  font-weight: 800;
  color: #2563eb;
}

/* Actions */
.actions-row {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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

@media (max-width: 960px) {
  .services-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  .main-title {
    font-size: 1.75rem;
  }

  .btn-siguiente {
    width: 100%;
    justify-content: center;
  }
}
</style>
