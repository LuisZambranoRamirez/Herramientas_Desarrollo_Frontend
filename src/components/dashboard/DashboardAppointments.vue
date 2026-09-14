<template>
  <div class="appointments-container">
    <div class="section-header">
      <h2>Próximas Citas</h2>
      <button class="view-all" @click="verTodas">
        Ver todas
        <svg viewBox="0 0 20 20" fill="currentColor" class="arrow-icon" aria-hidden="true">
          <path fill-rule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <div class="table-responsive">
      <table>
        <thead>
          <tr>
            <th>Paciente</th>
            <th>Hora</th>
            <th>Tratamiento</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cita in citas" :key="cita.id">
            <td>
              <strong class="paciente-name">{{ cita.paciente }}</strong>
            </td>
            <td class="cita-hora">{{ cita.hora }}</td>
            <td class="cita-tratamiento">{{ cita.tratamiento }}</td>
            <td>
              <span :class="['status-badge', 'status-' + cita.estado.toLowerCase().replace(/\s+/g, '-')]">
                {{ cita.estado }}
              </span>
            </td>
          </tr>
          <tr v-if="!citas || citas.length === 0">
            <td colspan="4" class="empty-state">
              No hay citas próximas registradas
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

interface Cita {
  id: number
  paciente: string
  hora: string
  tratamiento: string
  estado: 'Confirmada' | 'En curso' | 'Pendiente' | 'Completada'
}

defineProps<{
  citas: Cita[]
}>()

const router = useRouter()

function verTodas() {
  router.push('/agenda')
}
</script>

<style scoped>
.appointments-container {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  padding: 24px;
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  margin-bottom: 30px;
  transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: var(--text-main);
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  transition: color 0.3s ease;
}

.view-all {
  background: transparent;
  border: none;
  color: var(--primary-purple);
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.view-all:hover {
  background-color: var(--primary-purple-light);
  color: var(--primary-purple-hover);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
}

.view-all:hover .arrow-icon {
  transform: translateX(3px);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th {
  background: var(--bg-disabled);
  padding: 12px 14px;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border-light);
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}

th:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

th:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

td {
  padding: 14px;
  border-bottom: 1px solid var(--border-light);
  color: var(--text-main);
  font-size: 14px;
  transition: color 0.3s ease, border-color 0.3s ease;
}

tbody tr {
  transition: background-color 0.15s ease;
}

tbody tr:hover {
  background-color: rgba(79, 70, 229, 0.04);
}

.paciente-name {
  color: var(--text-main);
  font-weight: 600;
  transition: color 0.3s ease;
}

.cita-hora {
  color: var(--text-muted);
  font-variant-numeric: tabular-nums;
  font-size: 13px;
}

.cita-tratamiento {
  color: var(--text-main);
}

/* Badges de Estado legibles en modo claro y oscuro */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.2;
}

.status-confirmada {
  background-color: rgba(16, 185, 129, 0.14);
  color: #059669;
}

.status-en-curso {
  background-color: rgba(59, 130, 246, 0.14);
  color: #2563eb;
}

.status-pendiente {
  background-color: rgba(245, 158, 11, 0.14);
  color: #d97706;
}

.status-completada {
  background-color: rgba(99, 102, 241, 0.14);
  color: #4f46e5;
}

html.dark .status-confirmada {
  color: #34d399;
}

html.dark .status-en-curso {
  color: #60a5fa;
}

html.dark .status-pendiente {
  color: #fbbf24;
}

html.dark .status-completada {
  color: #a5b4fc;
}

.empty-state {
  text-align: center;
  padding: 24px 12px;
  color: var(--text-muted);
  font-style: italic;
}
</style>