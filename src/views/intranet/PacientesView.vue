<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { pacientesService } from '@/services/pacientes.service'

import type {
  Paciente,
  CrearPacienteDto,
  ActualizarPacienteDto,
} from '@/types'

// Estado
const pacientes = ref<Paciente[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

// Búsqueda
const busqueda = ref('')

const pacientesFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase()

  if (!q) {
    return pacientes.value
  }

  return pacientes.value.filter(
    (p: Paciente) =>
      p.nombres.toLowerCase().includes(q) ||
      p.apellidos.toLowerCase().includes(q) ||
      p.dni.includes(q) ||
      (p.correo ?? '').toLowerCase().includes(q),
  )
})

// Modal
type ModoModal = 'crear' | 'editar' | 'ver' | null

const modoModal = ref<ModoModal>(null)
const dniSeleccionado = ref<string | null>(null)

const pacienteSeleccionado = computed(() =>
  pacientes.value.find(
    (p: Paciente) =>
      p.dni === dniSeleccionado.value,
  ) ?? null,
)

// Formulario
const form = ref<CrearPacienteDto>({
  dni: '',
  username: '',
  nombres: '',
  apellidos: '',
  direccion: '',
  telefono: '',
  correo: '',
  observaciones: '',
  fecha_nacimiento: '',
})

const resetForm = () => {
  form.value = {
    dni: '',
    username: '',
    nombres: '',
    apellidos: '',
    direccion: '',
    telefono: '',
    correo: '',
    observaciones: '',
    fecha_nacimiento: '',
  }
}

const abrirCrear = () => {
  resetForm()
  modoModal.value = 'crear'
}

const abrirEditar = (dni: string) => {
  const paciente = pacientes.value.find(
    x => x.dni === dni,
  )

  if (!paciente) {
    return
  }

  dniSeleccionado.value = dni

  form.value = {
    dni: paciente.dni,
    username: paciente.username,
    nombres: paciente.nombres,
    apellidos: paciente.apellidos,
    direccion: paciente.direccion ?? '',
    telefono: paciente.telefono ?? '',
    correo: paciente.correo ?? '',
    observaciones: paciente.observaciones,
    fecha_nacimiento:
      paciente.fecha_nacimiento,
  }

  modoModal.value = 'editar'
}

const abrirVer = (dni: string) => {
  dniSeleccionado.value = dni
  modoModal.value = 'ver'
}

const cerrarModal = () => {
  modoModal.value = null
  dniSeleccionado.value = null
  resetForm()
}

const fetchPacientes = async () => {
  isLoading.value = true
  error.value = null

  try {
    pacientes.value =
      await pacientesService.getAll()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Error al cargar pacientes'
  } finally {
    isLoading.value = false
  }
}

const guardar = async () => {
  isLoading.value = true
  error.value = null

  try {
    if (modoModal.value === 'crear') {
      const paciente =
        await pacientesService.create(
          form.value,
        )

      pacientes.value.push(paciente)
    } else if (
      modoModal.value === 'editar' &&
      dniSeleccionado.value
    ) {
      const dto: ActualizarPacienteDto = {
				nombres: form.value.nombres,
				apellidos: form.value.apellidos,
				direccion: form.value.direccion,
				telefono: form.value.telefono,
				correo: form.value.correo,
				observaciones: form.value.observaciones,
				fecha_nacimiento: form.value.fecha_nacimiento,
			}


      const paciente =
        await pacientesService.update(
          dniSeleccionado.value,
          dto,
        )

      const index =
        pacientes.value.findIndex(
          p =>
            p.dni ===
            dniSeleccionado.value,
        )

      if (index !== -1) {
        pacientes.value[index] = paciente
      }
    }

    cerrarModal()
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Error al guardar paciente'
  } finally {
    isLoading.value = false
  }
}

const formatFecha = (f: string) => {
  if (!f) {
    return '—'
  }

  const [y, m, d] = f.split('-')

  return `${d}/${m}/${y}`
}

onMounted(fetchPacientes)
</script>

<template>
  <DashboardLayout>
    <!-- Cabecera -->
    <div class="page-header">
      <p class="page-subtitle">Registra, consulta y gestiona la información de los pacientes</p>
      <button class="btn-primario" @click="abrirCrear">+ Nuevo paciente</button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre, DNI o correo..."
        class="search-input"
      />
      <span class="resultado-count">{{ pacientesFiltrados.length }} paciente(s)</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="estado-error">⚠️ {{ error }}</div>

    <!-- Loading -->
    <div v-if="isLoading && !pacientes.length" class="estado-carga">
      <div class="spinner"></div> <p>Cargando pacientes...</p>
    </div>

    <!-- Tabla -->
    <div v-else class="tabla-card table-card">
      <div class="tabla-responsive">
        <table class="tabla data-table">
          <thead>
            <tr>
              <th>DNI</th>
              <th>Nombre completo</th>
              <th>Teléfono</th>
              <th>Correo</th>
              <th>F. Nacimiento</th>
              <th>Registro</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in pacientesFiltrados" :key="p.dni" class="tabla-fila">
              <td class="td-dni">{{ p.dni }}</td>
              <td class="td-nombre">{{ p.nombres }} {{ p.apellidos }}</td>
              <td>{{ p.telefono ?? '—' }}</td>
              <td class="td-correo">{{ p.correo ?? '—' }}</td>
              <td>{{ formatFecha(p.fecha_nacimiento) }}</td>
              <td>{{ formatFecha(p.fecha_registro.slice(0, 10)) }}</td>
              <td class="td-acciones">
                <button class="btn-accion btn-ver" @click="abrirVer(p.dni)" title="Ver detalle">👁</button>
                <button class="btn-accion btn-editar" @click="abrirEditar(p.dni)" title="Editar">✏️</button>
              </td>
            </tr>
            <tr v-if="pacientesFiltrados.length === 0">
              <td colspan="7" class="td-vacio">No se encontraron pacientes.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ====== MODAL ====== -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">

        <!-- VER -->
        <template v-if="modoModal === 'ver' && pacienteSeleccionado">
          <div class="modal-header">
            <h3>Detalle del paciente</h3>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>
          <div class="detalle-grid">
            <div class="detalle-item"><span class="detalle-label">DNI</span><span>{{ pacienteSeleccionado.dni }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Usuario</span><span>{{ pacienteSeleccionado.username }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Nombres</span><span>{{ pacienteSeleccionado.nombres }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Apellidos</span><span>{{ pacienteSeleccionado.apellidos }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Teléfono</span><span>{{ pacienteSeleccionado.telefono ?? '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Correo</span><span>{{ pacienteSeleccionado.correo ?? '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">Dirección</span><span>{{ pacienteSeleccionado.direccion ?? '—' }}</span></div>
            <div class="detalle-item"><span class="detalle-label">F. Nacimiento</span><span>{{ formatFecha(pacienteSeleccionado.fecha_nacimiento) }}</span></div>
            <div class="detalle-item detalle-full"><span class="detalle-label">Observaciones</span><span>{{ pacienteSeleccionado.observaciones || '—' }}</span></div>
          </div>
          <div class="modal-footer">
            <button class="btn-secundario" @click="cerrarModal">Cerrar</button>
          </div>
        </template>

        <!-- CREAR / EDITAR -->
        <template v-else-if="modoModal === 'crear' || modoModal === 'editar'">
          <div class="modal-header">
            <h3>{{ modoModal === 'crear' ? 'Nuevo paciente' : 'Editar paciente' }}</h3>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>
          <form @submit.prevent="guardar" class="form-grid">
            <div class="form-group" v-if="modoModal === 'crear'">
              <label>DNI *</label>
              <input v-model="form.dni" type="text" required maxlength="8" placeholder="12345678" />
            </div>
            <div class="form-group" v-if="modoModal === 'crear'">
              <label>Usuario *</label>
              <input v-model="form.username" type="text" required placeholder="juan.perez" />
            </div>
            <div class="form-group">
              <label>Nombres *</label>
              <input v-model="form.nombres" type="text" required placeholder="Juan" />
            </div>
            <div class="form-group">
              <label>Apellidos *</label>
              <input v-model="form.apellidos" type="text" required placeholder="Pérez Torres" />
            </div>
            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="form.telefono" type="text" placeholder="987654321" />
            </div>
            <div class="form-group">
              <label>Correo</label>
              <input v-model="form.correo" type="email" placeholder="juan@email.com" />
            </div>
            <div class="form-group">
              <label>Dirección</label>
              <input v-model="form.direccion" type="text" placeholder="Av. Lima 123" />
            </div>
            <div class="form-group">
              <label>F. Nacimiento *</label>
              <input v-model="form.fecha_nacimiento" type="date" required />
            </div>
            <div class="form-group form-full">
              <label>Observaciones</label>
              <textarea v-model="form.observaciones" rows="3" placeholder="Notas clínicas..."></textarea>
            </div>
            <div class="modal-footer form-full">
              <button type="button" class="btn-secundario" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn-primario" :disabled="isLoading">
                {{ isLoading ? 'Guardando...' : 'Guardar' }}
              </button>
            </div>
          </form>
        </template>

      </div>
    </div>

  </DashboardLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.page-subtitle { color: #64748b; margin: 0; font-size: 0.875rem; transition: color 0.2s ease; }

/* Búsqueda */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 0.6rem 1rem;
  margin-bottom: 1.25rem;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-icon { font-size: 1rem; color: #94a3b8; }

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  color: #1e293b;
}

.resultado-count { font-size: 0.8rem; color: #94a3b8; white-space: nowrap; }

/* Botones globales */
.btn-primario {
  padding: 0.55rem 1.2rem;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}
.btn-primario:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-primario:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.btn-secundario {
  padding: 0.55rem 1.2rem;
  background: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}
.btn-secundario:hover { background: #f1f5f9; }

/* Estados */
.estado-carga { display: flex; align-items: center; gap: 1rem; padding: 2rem; color: #64748b; }
.spinner {
  width: 22px; height: 22px;
  border: 3px solid #e2e8f0;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.estado-error { padding: 1rem 1.5rem; background: #fee2e2; border-radius: 10px; color: #991b1b; font-size: 0.9rem; margin-bottom: 1rem; }

/* Tabla */
.tabla-card {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-card);
  overflow: hidden;
  border: 1px solid var(--border-light);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}
.tabla-responsive { width: 100%; overflow-x: auto; }
.tabla { width: 100%; border-collapse: collapse; }
.tabla thead tr { background: var(--bg-disabled); transition: background-color 0.2s ease; }
.tabla th {
  padding: 0.85rem 1rem;
  text-align: left;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--border-light);
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tabla-fila td {
  padding: 0.85rem 1rem;
  font-size: 0.875rem;
  color: var(--text-main);
  border-bottom: 1px solid var(--border-light);
  vertical-align: middle;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tabla-fila:last-child td {
  border-bottom: none;
}

.tabla-fila:hover {
  background: var(--bg-disabled);
}

.td-dni {
  font-family: monospace;
  font-weight: 600;
  color: var(--primary-purple);
}

.td-nombre {
  font-weight: 600;
  color: var(--text-main);
}

.td-correo {
  color: var(--text-muted);
  font-size: 0.82rem;
}

.td-acciones {
  display: flex;
  gap: 0.4rem;
}

.td-vacio {
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
  font-size: 0.9rem;
}

.btn-accion {
  padding: 0.35rem 0.6rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s, background-color 0.2s, border-color 0.2s;
  background: #f1f5f9;
}
.btn-accion:hover { opacity: 0.8; transform: translateY(-1px); }
.btn-ver     { background: #dbeafe; }
.btn-editar  { background: #fef9c3; }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 1rem;
  transition: background-color 0.2s ease;
}

.modal {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  animation: slideUp 0.2s ease;
  border: 1px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  transition: border-color 0.2s ease;
}

.modal-header h3 { margin: 0; font-size: 1.1rem; color: #1e293b; transition: color 0.2s ease; }

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: color 0.2s;
}
.modal-close:hover { color: #1e293b; }

/* Detalle ver */
.detalle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}
.detalle-item { display: flex; flex-direction: column; gap: 0.25rem; }
.detalle-full { grid-column: 1 / -1; }
.detalle-label { font-size: 0.75rem; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; }

/* Formulario */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-full  { grid-column: 1 / -1; }

.form-group label { font-size: 0.8rem; font-weight: 700; color: #475569; transition: color 0.2s ease; }

.form-group input,
.form-group textarea {
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: #1e293b;
  outline: none;
  transition: border-color 0.2s, background-color 0.2s, color 0.2s;
  resize: vertical;
}
.form-group input:focus,
.form-group textarea:focus { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  transition: border-color 0.2s ease;
}

/* Si es dentro del form-grid */
.form-full.modal-footer { padding: 0; border-top: none; padding-top: 0.5rem; }

/* ================= MODO OSCURO (DARK MODE) ================= */
:global(html.dark) .page-subtitle {
  color: #94a3b8;
}

:global(html.dark) .search-bar {
  background: var(--bg-card, #131b2e);
  border-color: var(--border-light, #1e293b);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
}

:global(html.dark) .search-bar:focus-within {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.15);
}

:global(html.dark) .search-icon {
  color: #64748b;
}

:global(html.dark) .search-input {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: #f8fafc !important;
}

:global(html.dark) .search-input::placeholder {
  color: #64748b;
}

:global(html.dark) .resultado-count {
  color: #94a3b8;
}

:global(html.dark) .tabla-card {
  background: var(--bg-card, #131b2e);
  border-color: var(--border-light, #1e293b);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
}

:global(html.dark) .tabla thead tr {
  background: #0f172a;
}

:global(html.dark) .tabla th {
  color: #94a3b8;
  border-bottom-color: #1e293b;
}

:global(html.dark) .tabla-fila td {
  color: #cbd5e1;
  border-bottom-color: #1e293b;
}

:global(html.dark) .tabla-fila:hover {
  background: rgba(255, 255, 255, 0.02);
}

:global(html.dark) .td-dni {
  color: #818cf8;
}

:global(html.dark) .td-nombre {
  color: #f8fafc;
}

:global(html.dark) .td-correo {
  color: #94a3b8;
}

:global(html.dark) .td-vacio {
  color: #64748b;
}

:global(html.dark) .btn-accion {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

:global(html.dark) .btn-ver {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.35);
}

:global(html.dark) .btn-editar {
  background: rgba(234, 179, 8, 0.2);
  border-color: rgba(234, 179, 8, 0.35);
}

:global(html.dark) .btn-eliminar {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.35);
}

:global(html.dark) .estado-carga {
  color: #94a3b8;
}

:global(html.dark) .spinner {
  border-color: #1e293b;
  border-top-color: #818cf8;
}

:global(html.dark) .estado-error {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

:global(html.dark) .modal-overlay {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
}

:global(html.dark) .modal {
  background: #131b2e;
  border-color: #1e293b;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
}

:global(html.dark) .modal-header {
  border-bottom-color: #1e293b;
}

:global(html.dark) .modal-header h3 {
  color: #f8fafc;
}

:global(html.dark) .modal-close {
  color: #94a3b8;
}

:global(html.dark) .modal-close:hover {
  color: #f8fafc;
}

:global(html.dark) .detalle-label {
  color: #94a3b8;
}

:global(html.dark) .detalle-item span:not(.detalle-label) {
  color: #e2e8f0;
}

:global(html.dark) .form-group label {
  color: #cbd5e1;
}

:global(html.dark) .form-group input,
:global(html.dark) .form-group textarea {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

:global(html.dark) .form-group input:focus,
:global(html.dark) .form-group textarea:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
}

:global(html.dark) .form-group input::placeholder,
:global(html.dark) .form-group textarea::placeholder {
  color: #64748b;
}

:global(html.dark) .modal-footer {
  border-top-color: #1e293b;
}

:global(html.dark) .btn-secundario {
  background: #1e293b;
  color: #cbd5e1;
  border-color: #334155;
}

:global(html.dark) .btn-secundario:hover {
  background: #334155;
  color: #f8fafc;
}

@media (max-width: 600px) {
  .form-grid  { grid-template-columns: 1fr; }
  .detalle-grid { grid-template-columns: 1fr; }
}
</style>
