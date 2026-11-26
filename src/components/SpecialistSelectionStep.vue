<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { odontologosService } from '@/services/odontologos.service'
import type { OdontologoPublico } from '@/types'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    specialists?: OdontologoPublico[]
    loading?: boolean
  }>(),
  {
    modelValue: '',
    specialists: undefined,
    loading: false,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', specialistId: string): void
  (e: 'next'): void
  (e: 'prev'): void
}>()

// Estado interno para cuando el componente se usa standalone sin props de lista
const localSpecialists = ref<OdontologoPublico[]>([])
const localLoading = ref<boolean>(false)
const localError = ref<string>('')

const effectiveSpecialists = computed<OdontologoPublico[]>(() => {
  return props.specialists !== undefined ? props.specialists : localSpecialists.value
})

const effectiveLoading = computed<boolean>(() => {
 return props.specialists !== undefined ? props.loading : localLoading.value
})

const filtroEspecialidad = ref<string>('TODAS')

const especialidades = computed<string[]>(() => {
  const unicas = new Set<string>()
  for (const doc of effectiveSpecialists.value) {
    unicas.add((doc.especialidad || '').trim())
  }
  return [...unicas].sort((a, b) =>
    formatEspecialidad(a).localeCompare(formatEspecialidad(b), 'es'),
  )
})

const filtroActivo = computed<string>(() =>
  especialidades.value.includes(filtroEspecialidad.value) ? filtroEspecialidad.value : 'TODAS',
)

const especialistasFiltrados = computed<OdontologoPublico[]>(() =>
  effectiveSpecialists.value
    .filter((doc) => filtroActivo.value === 'TODAS' || (doc.especialidad || '').trim() === filtroActivo.value)
    .slice()
    .sort(
      (a, b) =>
        formatEspecialidad(a.especialidad).localeCompare(formatEspecialidad(b.especialidad), 'es') ||
        (a.nombre || '').localeCompare(b.nombre || '', 'es'),
    ),
)

function getDoctorId(doc: OdontologoPublico): string {
  return doc.dni || doc.id || doc.username
}

function isSelected(doc: OdontologoPublico): boolean {
  if (!props.modelValue) return false
  const target = props.modelValue.trim().toLowerCase()
  return Boolean(
    (doc.dni && doc.dni.toLowerCase() === target) ||
    (doc.id && doc.id.toLowerCase() === target) ||
    (doc.username && doc.username.toLowerCase() === target)
  )
}

function formatEspecialidad(spec?: string): string {
  if (!spec || !spec.trim()) return 'Odontología General'
  const clean = spec.replace(/_/g, ' ').toLowerCase()
  return clean.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
}

function formatNombreDoctor(doc: OdontologoPublico): string {
  if (doc.nombre && doc.nombre.trim()) {
    const trimmed = doc.nombre.trim()
    if (/^dr(\.|a\.|\(a\)\.)/i.test(trimmed)) {
      return trimmed
    }
    return `Dr(a). ${trimmed}`
  }
  if (doc.nombres || doc.apellidos) {
    return `Dr(a). ${doc.nombres || ''} ${doc.apellidos || ''}`.trim()
  }
  return 'Dr(a). Especialista'
}

function formatDescripcion(doc: OdontologoPublico): string {
  if (doc.descripcion && doc.descripcion.trim().length > 10) {
    return doc.descripcion.trim()
  }
  const esp = formatEspecialidad(doc.especialidad)
  return `Especialista en ${esp}, comprometido con una atención clínica de calidad y el cuidado integral de tu sonrisa.`
}

function getAvatarEmoji(index: number): string {
  return index % 2 === 0 ? '👩‍⚕️' : '👨‍⚕️'
}

function selectSpecialist(doc: OdontologoPublico) {
  const id = getDoctorId(doc)
  emit('update:modelValue', id)
}


function handleNext() {
  if (!props.modelValue && especialistasFiltrados.value.length > 0) {
    const first = especialistasFiltrados.value[0]
    if (first) {
      emit('update:modelValue', getDoctorId(first))
    }
  }
  emit('next')
}

// Carga local si no se le pasaron especialistas mediante props
async function fetchSpecialistsIfNeeded() {
  if (props.specialists !== undefined) return
  localLoading.value = true
  localError.value = ''
  try {
    const list = await odontologosService.getActiveDentists()
    localSpecialists.value = list
  } catch (err) {
    localError.value = 'No se pudo cargar la lista de especialistas activos.'
  } finally {
    localLoading.value = false
  }
}

// Auto-seleccionar primer odontólogo si aún no hay ninguno seleccionado
watch(
  effectiveSpecialists,
  (list) => {
    if (list.length > 0 && !props.modelValue) {
      const first = list[0]
      if (first) {
        emit('update:modelValue', getDoctorId(first))
      }
    }
  },
  { immediate: true },
)

onMounted(fetchSpecialistsIfNeeded)
</script>

<template>
  <div class="step-container">
    <!-- Header -->
    <div class="step-header">
      <h1 class="main-title">Elige tu Especialista</h1>
      <p class="subtitle">Contamos con expertos altamente calificados para tu tratamiento</p>
    </div>

    <!-- Filtro por especialidad -->
    <div
      v-if="!effectiveLoading && effectiveSpecialists.length > 1"
      class="specialty-filter"
      role="group"
      aria-label="Filtrar por especialidad"
    >
      <button
        type="button"
        class="specialty-chip"
        :class="{ active: filtroActivo === 'TODAS' }"
        @click="filtroEspecialidad = 'TODAS'"
      >
        Todas
      </button>
      <button
        v-for="esp in especialidades"
        :key="esp || 'general'"
        type="button"
        class="specialty-chip"
        :class="{ active: filtroActivo === esp }"
        @click="filtroEspecialidad = esp"
      >
        {{ formatEspecialidad(esp) }}
      </button>
    </div>
    <!-- Estado de Carga (Skeletons) -->
    <div v-if="effectiveLoading" class="specialists-grid" aria-busy="true">
      <div v-for="n in 2" :key="`skeleton-${n}`" class="specialist-card skeleton-card">
        <div class="doctor-header">
          <div class="skeleton-avatar"></div>
          <div class="doctor-title-box skeleton-title-box">
            <div class="skeleton-line skeleton-name"></div>
            <div class="skeleton-line skeleton-spec"></div>
          </div>
        </div>
        <div class="skeleton-line skeleton-desc"></div>
        <div class="skeleton-line skeleton-desc short"></div>
        <div class="doctor-footer skeleton-footer">
          <div class="skeleton-line skeleton-avail"></div>
        </div>
      </div>
    </div>

    <!-- Estado Vacío (Sin odontólogos activos registrados) -->
    <div
      v-else-if="effectiveSpecialists.length === 0"
      class="empty-specialists-step"
      role="status"
    >
      <div class="empty-icon-wrap">🦷</div>
      <h3 class="empty-title">No hay especialistas disponibles</h3>
      <p class="empty-desc">
        Actualmente estamos actualizando los horarios de nuestros odontólogos.
        Puedes contactarnos directamente para coordinar tu cita o consultar más tarde.
      </p>
    </div>

<!-- Grid de Especialistas Dinámicos -->
    <div v-else class="specialists-grid">
      <div
        v-for="(doctor, index) in especialistasFiltrados"
        :key="getDoctorId(doctor)"
        class="specialist-card"
        :class="{ active: isSelected(doctor) }"
        @click="selectSpecialist(doctor)"
        role="button"
        :tabindex="0"
        :aria-selected="isSelected(doctor)"
        @keydown.enter="selectSpecialist(doctor)"
        @keydown.space.prevent="selectSpecialist(doctor)"
      >
        <!-- Header with Avatar & Name -->
        <div class="doctor-header">
          <div
            class="doctor-avatar"
            :class="index % 2 === 0 ? 'avatar-theme-1' : 'avatar-theme-2'"
          >
            <span class="avatar-emoji">{{ getAvatarEmoji(index) }}</span>
          </div>
          <div class="doctor-title-box">
            <h3 class="doctor-name">{{ formatNombreDoctor(doctor) }}</h3>
            <span class="doctor-specialty">{{ formatEspecialidad(doctor.especialidad) }}</span>
          </div>
        </div>

        <!-- Description -->
        <p class="doctor-desc">{{ formatDescripcion(doctor) }}</p>

        <!-- Availability Footer -->
        <div class="doctor-footer">
          <svg class="calendar-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="availability-text">Disponible hoy</span>
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
        :disabled="effectiveLoading || effectiveSpecialists.length === 0"
        @click="handleNext"
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
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-theme-1 {
  background: linear-gradient(135deg, #5b4ae4 0%, #4338ca 100%);
  box-shadow: 0 6px 16px rgba(91, 74, 228, 0.25);
}

.avatar-theme-2 {
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  box-shadow: 0 6px 16px rgba(14, 165, 233, 0.25);
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

/* Skeletons */
.skeleton-card {
  pointer-events: none;
  cursor: default;
}

.skeleton-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite;
  flex-shrink: 0;
}

.skeleton-title-box {
  flex-grow: 1;
  gap: 0.5rem;
}

.skeleton-line {
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: skeletonPulse 1.5s infinite;
  border-radius: 6px;
}

.skeleton-name {
  height: 20px;
  width: 60%;
}

.skeleton-spec {
  height: 14px;
  width: 40%;
}

.skeleton-desc {
  height: 14px;
  width: 100%;
  margin-bottom: 0.5rem;
}

.skeleton-desc.short {
  width: 75%;
  margin-bottom: 1.5rem;
}

.skeleton-avail {
  height: 16px;
  width: 35%;
}

@keyframes skeletonPulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Estado Vacío */
.empty-specialists-step {
  text-align: center;
  padding: 3.5rem 2rem;
  background: #ffffff;
  border: 1.5px dashed #cbd5e1;
  border-radius: 24px;
  margin-bottom: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.empty-icon-wrap {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.35rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-desc {
  color: #64748b;
  font-size: 0.95rem;
  max-width: 500px;
  line-height: 1.6;
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

.btn-siguiente:hover:not(:disabled) {
  filter: brightness(1.05);
  box-shadow: 0 6px 20px rgba(0, 196, 159, 0.45);
  transform: translateY(-1px);
}

.btn-siguiente:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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

.specialty-filter {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.specialty-chip {
  padding: 0.45rem 1rem;
  border-radius: 999px;
  border: 1px solid var(--border-light, #cbd5e1);
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #1e293b);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.specialty-chip:hover {
  border-color: #6366f1;
}

.specialty-chip.active {
  background: #6366f1;
  border-color: #6366f1;
  color: #ffffff;
}
</style>