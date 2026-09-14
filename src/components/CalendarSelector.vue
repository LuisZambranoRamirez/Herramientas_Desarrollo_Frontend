<script setup lang="ts">
import { ref } from 'vue'

interface CalendarDay {
  dayName: string
  dayNumber: number
  dateStr: string
  isAvailable: boolean
  isToday?: boolean
}

interface TimeSlot {
  time: string
  available: boolean
}

const props = withDefaults(
  defineProps<{
    modelValueDate?: number
    modelValueTime?: string
    monthName?: string
  }>(),
  {
    modelValueDate: 26,
    modelValueTime: '10:00 AM',
    monthName: 'Agosto 2026',
  },
)

const emit = defineEmits<{
  (e: 'update:selectedDate', dayNumber: number): void
  (e: 'update:selectedTime', time: string): void
}>()

const selectedDay = ref<number>(props.modelValueDate)
const selectedTimeSlot = ref<string>(props.modelValueTime)

// Days list reflecting the design (August 2026 week)
const days = ref<CalendarDay[]>([
  { dayName: 'Dom', dayNumber: 23, dateStr: '2026-08-23', isAvailable: false },
  { dayName: 'Lun', dayNumber: 24, dateStr: '2026-08-24', isAvailable: true },
  { dayName: 'Mar', dayNumber: 25, dateStr: '2026-08-25', isAvailable: true },
  { dayName: 'Mié', dayNumber: 26, dateStr: '2026-08-26', isAvailable: true },
  { dayName: 'Jue', dayNumber: 27, dateStr: '2026-08-27', isAvailable: true },
  { dayName: 'Vie', dayNumber: 28, dateStr: '2026-08-28', isAvailable: true },
  { dayName: 'Sáb', dayNumber: 29, dateStr: '2026-08-29', isAvailable: false },
])

// Time slots reflecting the design
const timeSlots = ref<TimeSlot[]>([
  { time: '9:00 AM', available: true },
  { time: '10:00 AM', available: true },
  { time: '11:00 AM', available: true },
  { time: '12:00 PM', available: false },
  { time: '4:00 PM', available: true },
  { time: '5:00 PM', available: true },
  { time: '6:00 PM', available: true },
])

function selectDay(day: CalendarDay) {
  if (!day.isAvailable) return
  selectedDay.value = day.dayNumber
  emit('update:selectedDate', day.dayNumber)
}

function selectTime(slot: TimeSlot) {
  if (!slot.available) return
  selectedTimeSlot.value = slot.time
  emit('update:selectedTime', slot.time)
}
</script>

<template>
  <div class="calendar-card">
    <!-- Month and Year Header -->
    <div class="month-header">
      <h3 class="month-title">{{ monthName }}</h3>
    </div>

    <!-- Week Days Grid -->
    <div class="days-container">
      <div class="days-header-row">
        <span
          v-for="day in days"
          :key="'header-' + day.dayNumber"
          class="day-name"
          :class="{ disabled: !day.isAvailable }"
        >
          {{ day.dayName }}
        </span>
      </div>

      <div class="days-numbers-row">
        <button
          v-for="day in days"
          :key="'number-' + day.dayNumber"
          type="button"
          class="day-pill"
          :class="{
            active: selectedDay === day.dayNumber,
            disabled: !day.isAvailable,
            selectable: day.isAvailable && selectedDay !== day.dayNumber,
          }"
          :disabled="!day.isAvailable"
          @click="selectDay(day)"
          :aria-label="`Seleccionar ${day.dayName} ${day.dayNumber}`"
        >
          {{ day.dayNumber }}
        </button>
      </div>
    </div>

    <!-- Divider -->
    <hr class="card-divider" />

    <!-- Available Hours Section -->
    <div class="hours-section">
      <h4 class="section-subtitle">Horas Disponibles</h4>

      <div class="slots-grid">
        <button
          v-for="slot in timeSlots"
          :key="slot.time"
          type="button"
          class="time-pill"
          :class="{
            active: selectedTimeSlot === slot.time,
            disabled: !slot.available,
            selectable: slot.available && selectedTimeSlot !== slot.time,
          }"
          :disabled="!slot.available"
          @click="selectTime(slot)"
        >
          {{ slot.time }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 1.75rem 2rem;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.04);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.month-header {
  margin-bottom: 1.25rem;
}

.month-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
}

/* Days row */
.days-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.days-header-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.day-name {
  font-size: 0.85rem;
  font-weight: 500;
  color: #94a3b8;
}

.day-name.disabled {
  color: #cbd5e1;
}

.days-numbers-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.day-pill {
  width: 44px;
  height: 44px;
  margin: 0 auto;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-pill.selectable:hover {
  border-color: #5046e5;
  color: #5046e5;
  background-color: #f5f3ff;
  transform: translateY(-1px);
}

.day-pill.active {
  background-color: #5046e5;
  border-color: #5046e5;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(80, 70, 229, 0.3);
}

.day-pill.disabled {
  background-color: transparent;
  border: none;
  color: #cbd5e1;
  cursor: not-allowed;
}

/* Divider */
.card-divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 1.75rem 0 1.5rem;
}

/* Hours section */
.hours-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-subtitle {
  font-size: 1.05rem;
  font-weight: 700;
  color: #1e293b;
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.time-pill {
  padding: 0.6rem 1.15rem;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  background-color: #ffffff;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.time-pill.selectable:hover {
  border-color: #5046e5;
  color: #5046e5;
  background-color: #f5f3ff;
  transform: translateY(-1px);
}

.time-pill.active {
  background-color: #5046e5;
  border-color: #5046e5;
  color: #ffffff;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25);
}

.time-pill.disabled {
  background-color: #f8fafc;
  border-color: #f1f5f9;
  color: #cbd5e1;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .calendar-card {
    padding: 1.25rem 1rem;
  }

  .day-pill {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
    border-radius: 8px;
  }

  .time-pill {
    padding: 0.5rem 0.85rem;
    font-size: 0.82rem;
  }
}
</style>
