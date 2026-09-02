<template>
  <div class="appointments-container">
    <div class="section-header">
      <h2>Próximas Citas</h2>
      <button class="view-all">Ver todas →</button>
    </div>
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
          <td><strong>{{ cita.paciente }}</strong></td>
          <td>{{ cita.hora }}</td>
          <td>{{ cita.tratamiento }}</td>
          <td>
            <span :class="'status-' + cita.estado.toLowerCase().replace(' ', '-')">
              {{ cita.estado }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
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
</script>

<style scoped>
.appointments-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  color: #2c3e50;
  margin: 0;
}

.view-all {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 14px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  color: #7f8c8d;
  font-weight: 600;
}

td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.status-confirmada {
  color: #27ae60;
  font-weight: 600;
}

.status-en-curso {
  color: #3498db;
  font-weight: 600;
}

.status-pendiente {
  color: #f39c12;
  font-weight: 600;
}

.status-completada {
  color: #2c3e50;
  font-weight: 600;
}
</style>