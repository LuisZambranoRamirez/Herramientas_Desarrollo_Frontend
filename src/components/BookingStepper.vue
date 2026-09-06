<script setup lang="ts">
interface Step {
  id: number
  title: string
}

const props = withDefaults(
  defineProps<{
    currentStep?: number
  }>(),
  {
    currentStep: 3,
  },
)

const emit = defineEmits<{
  (e: 'change-step', stepId: number): void
}>()

const steps: Step[] = [
  { id: 1, title: 'Servicio' },
  { id: 2, title: 'Especialista' },
  { id: 3, title: 'Fecha y Hora' },
  { id: 4, title: 'Confirmación' },
]

function handleStepClick(stepId: number) {
  if (stepId <= props.currentStep) {
    emit('change-step', stepId)
  }
}
</script>

<template>
  <nav class="stepper-container" aria-label="Progreso de la reserva">
    <div class="stepper">
      <template v-for="(step, index) in steps" :key="step.id">
        <!-- Step Item -->
        <div
          class="step-item"
          :class="{
            completed: step.id < currentStep,
            active: step.id === currentStep,
            pending: step.id > currentStep,
          }"
          @click="handleStepClick(step.id)"
          :role="step.id <= currentStep ? 'button' : undefined"
          :tabindex="step.id <= currentStep ? 0 : -1"
        >
          <!-- Badge / Icon -->
          <div class="step-badge">
            <template v-if="step.id < currentStep">
              <svg class="check-icon" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
            </template>
            <template v-else>
              <span class="step-number">{{ step.id }}</span>
            </template>
          </div>

          <!-- Title -->
          <span class="step-title">{{ step.title }}</span>
        </div>

        <!-- Connector Line between steps -->
        <div
          v-if="index < steps.length - 1"
          class="step-connector"
          :class="{ completed: step.id < currentStep }"
          aria-hidden="true"
        ></div>
      </template>
    </div>
  </nav>
</template>

<style scoped>
.stepper-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 2rem;
}

.stepper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 0.5rem;
  max-width: 800px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: default;
  transition: transform 0.15s ease;
  user-select: none;
}

.step-item[role='button'] {
  cursor: pointer;
}

.step-item[role='button']:hover .step-badge {
  transform: scale(1.05);
}

.step-badge {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 700;
  transition: all 0.25s ease;
  flex-shrink: 0;
}

/* Completed Step */
.step-item.completed .step-badge {
  background-color: #5046e5;
  color: #ffffff;
}

.step-item.completed .step-title {
  color: #1e293b;
  font-weight: 600;
}

.check-icon {
  width: 16px;
  height: 16px;
}

/* Active Step */
.step-item.active .step-badge {
  background-color: #5046e5;
  color: #ffffff;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.2);
}

.step-item.active .step-title {
  color: #1e293b;
  font-weight: 700;
}

/* Pending Step */
.step-item.pending .step-badge {
  background-color: #ffffff;
  color: #94a3b8;
  border: 1.5px solid #cbd5e1;
}

.step-item.pending .step-title {
  color: #94a3b8;
  font-weight: 500;
}

.step-title {
  font-size: 0.9rem;
  white-space: nowrap;
}

/* Connector Line */
.step-connector {
  width: 40px;
  height: 2px;
  background-color: #e2e8f0;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
}

.step-connector.completed {
  background-color: #5046e5;
}

@media (max-width: 640px) {
  .stepper {
    gap: 0.25rem;
  }

  .step-connector {
    width: 20px;
  }

  .step-title {
    display: none;
  }

  .step-item.active .step-title {
    display: inline;
    font-size: 0.8rem;
  }
}
</style>
