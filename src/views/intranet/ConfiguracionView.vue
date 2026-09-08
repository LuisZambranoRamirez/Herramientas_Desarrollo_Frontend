<script setup lang="ts">
import { reactive } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

const config = reactive({
  nombreClinica: 'Clínica Dental SoliDent',
  telefono: '+51 912 045 471',
  correo: 'contacto@solident.com',
  direccion: 'Av. Tupac Amaru 3551, Comas',
  notificacionesEmail: true,
  recordatoriosWhatsapp: true,
})

function guardarCambios() {
  alert('Configuración guardada correctamente.')
}
</script>

<template>
  <DashboardLayout>
    <div class="config-view">
      <div class="view-header">
        <div>
          <h2 class="view-title">Configuración General</h2>
          <p class="view-desc">Ajustes del perfil institucional, datos de contacto y notificaciones.</p>
        </div>
      </div>

      <div class="config-grid">
        <!-- Tarjeta de Datos de Clínica -->
        <div class="config-card">
          <h3 class="card-title">Información de la Clínica</h3>
          <div class="form-group">
            <label class="form-label">Nombre Comercial</label>
            <input v-model="config.nombreClinica" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Teléfono de Atención</label>
            <input v-model="config.telefono" type="tel" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Correo Oficial</label>
            <input v-model="config.correo" type="email" class="form-input" />
          </div>
          <div class="form-group">
            <label class="form-label">Dirección Principal</label>
            <input v-model="config.direccion" type="text" class="form-input" />
          </div>
        </div>

        <!-- Tarjeta de Notificaciones -->
        <div class="config-card">
          <h3 class="card-title">Canales de Notificación a Pacientes</h3>
          <label class="toggle-row">
            <input v-model="config.notificacionesEmail" type="checkbox" />
            <div class="toggle-text">
              <span class="toggle-title">Confirmación por Email</span>
              <span class="toggle-desc">Envío de correo automático al reservar cita.</span>
            </div>
          </label>
          <label class="toggle-row">
            <input v-model="config.recordatoriosWhatsapp" type="checkbox" />
            <div class="toggle-text">
              <span class="toggle-title">Recordatorios por WhatsApp</span>
              <span class="toggle-desc">Notificación 24 horas antes de la cita pactada.</span>
            </div>
          </label>

          <div class="save-box">
            <button type="button" class="btn-guardar" @click="guardarCambios">
              Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.config-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.view-desc {
  font-size: 0.92rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.config-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 0.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-label {
  font-size: 0.88rem;
  font-weight: 600;
  color: #475569;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.92rem;
  outline: none;
}

.form-input:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.1);
}

.toggle-row {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  cursor: pointer;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f8fafc;
}

.toggle-text {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.toggle-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #1e293b;
}

.toggle-desc {
  font-size: 0.82rem;
  color: #64748b;
}

.save-box {
  margin-top: 1rem;
}

.btn-guardar {
  background: linear-gradient(135deg, #5046e5 0%, #4338ca 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25);
}

.btn-guardar:hover {
  filter: brightness(1.08);
}
</style>
