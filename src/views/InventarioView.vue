<template>
  <DashboardLayout>
    <div class="inventario-header">
      <p class="subtitle">Insumos registrados, su nivel de stock y proveedores</p>
    </div>

    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ 'tab-btn-active': tabActiva === 'insumos' }"
        @click="tabActiva = 'insumos'"
      >
        Insumos
      </button>
      <button
        class="tab-btn"
        :class="{ 'tab-btn-active': tabActiva === 'proveedores' }"
        @click="tabActiva = 'proveedores'"
      >
        Proveedores
      </button>
    </div>

    <div v-if="tabActiva === 'insumos'">
      <div class="acciones">
        <button class="btn-primario" @click="abrirModalCrear">+ Nuevo insumo</button>
      </div>

      <div v-if="cargandoInsumos" class="estado-info">
        Cargando insumos...
      </div>

      <div v-else-if="errorInsumos" class="estado-error">
        {{ errorInsumos }}
      </div>

      <div v-else class="table-card tabla-card tabla-container">
        <div class="table-responsive">
          <table class="data-table tabla tabla-generica">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Stock</th>
                <th>Stock mínimo</th>
                <th>Estado</th>
                <th>Vencimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="insumo in insumos"
                :key="insumo.insumo_id"
                class="tabla-fila"
                :class="{ 'fila-alerta': insumo.stock < insumo.stock_minimo }"
              >
                <td>{{ insumo.nombre }}</td>
                <td>{{ insumo.stock }}</td>
                <td>{{ insumo.stock_minimo }}</td>
                <td>
                  <span
                    class="badge"
                    :class="insumo.stock < insumo.stock_minimo ? 'badge-bajo' : 'badge-ok'"
                  >
                    {{ insumo.stock < insumo.stock_minimo ? 'Stock bajo' : 'OK' }}
                  </span>
                </td>
                <td>{{ insumo.fecha_vencimiento ?? '—' }}</td>
                <td>
                  <button class="btn-secundario btn-accion" @click="abrirModalEditar(insumo)">
                    Editar
                  </button>
                  <button class="btn-eliminar" @click="eliminarInsumo(insumo.insumo_id)">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-else>
      <div v-if="cargandoProveedores" class="estado-info">
        Cargando proveedores...
      </div>

      <div v-else-if="errorProveedores" class="estado-error">
        {{ errorProveedores }}
      </div>

      <div v-else class="table-card tabla-card tabla-container">
        <div class="table-responsive">
          <table class="data-table tabla tabla-generica">
            <thead>
              <tr>
                <th>RUC</th>
                <th>Nombre</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="proveedor in proveedores" :key="proveedor.ruc" class="tabla-fila">
                <td>{{ proveedor.ruc }}</td>
                <td>{{ proveedor.nombre }}</td>
                <td>{{ proveedor.telefono }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-box">
      <h3>{{ insumoEditandoId ? 'Editar insumo' : 'Nuevo insumo' }}</h3>

        <form @submit.prevent="guardarInsumo">
          <div class="campo">
            <label>Nombre</label>
            <input v-model="nuevoInsumo.nombre" type="text" required />
          </div>

          <div class="campo">
            <label>Stock</label>
            <input v-model.number="nuevoInsumo.stock" type="number" min="0" required />
          </div>

          <div class="campo">
            <label>Stock mínimo</label>
            <input v-model.number="nuevoInsumo.stock_minimo" type="number" min="0" required />
          </div>

          <div class="campo">
            <label>Fecha de vencimiento</label>
            <input v-model="nuevoInsumo.fecha_vencimiento" type="date" />
          </div>

          <p v-if="errorFormulario" class="estado-error">{{ errorFormulario }}</p>

          <div class="modal-acciones">
            <button type="button" class="btn-secundario" @click="cerrarModal">Cancelar</button>
          <button type="submit" class="btn-primario" :disabled="guardando">
           {{ guardando ? 'Guardando...' : (insumoEditandoId ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Insumo, Proveedor, CrearInsumoDto } from '@/types'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { insumoApi, proveedorApi } from '@/services/mock-api'

const tabActiva = ref<'insumos' | 'proveedores'>('insumos')

const insumos = ref<Insumo[]>([])
const cargandoInsumos = ref(true)
const errorInsumos = ref('')

const proveedores = ref<Proveedor[]>([])
const cargandoProveedores = ref(true)
const errorProveedores = ref('')

onMounted(async () => {
  try {
    insumos.value = await insumoApi.getAll()
  } catch (e) {
    errorInsumos.value = 'No se pudo cargar el inventario.'
  } finally {
    cargandoInsumos.value = false
  }

  try {
    proveedores.value = await proveedorApi.getAll()
  } catch (e) {
    errorProveedores.value = 'No se pudo cargar los proveedores.'
  } finally {
    cargandoProveedores.value = false
  }
})

const mostrarModal = ref(false)
const guardando = ref(false)
const errorFormulario = ref('')

const insumoVacio = (): CrearInsumoDto => ({
  nombre: '',
  stock: 0,
  stock_minimo: 0,
  fecha_vencimiento: '',
})

const nuevoInsumo = ref<CrearInsumoDto>(insumoVacio())

const insumoEditandoId = ref<string | null>(null)

const abrirModalCrear = () => {
  insumoEditandoId.value = null
  nuevoInsumo.value = insumoVacio()
  errorFormulario.value = ''
  mostrarModal.value = true
}
const abrirModalEditar = (insumo: Insumo) => {
  insumoEditandoId.value = insumo.insumo_id
  nuevoInsumo.value = {
    nombre: insumo.nombre,
    stock: insumo.stock,
    stock_minimo: insumo.stock_minimo,
    fecha_vencimiento: insumo.fecha_vencimiento ?? '',
  }
  errorFormulario.value = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarInsumo = async () => {
  guardando.value = true
  errorFormulario.value = ''

  try {
    if (insumoEditandoId.value) {
      const actualizado = await insumoApi.update(insumoEditandoId.value, nuevoInsumo.value)
      const index = insumos.value.findIndex(insumo => insumo.insumo_id === insumoEditandoId.value)
      if (index !== -1) {
        insumos.value[index] = actualizado
      }
    } else {
      const creado = await insumoApi.create(nuevoInsumo.value)
      insumos.value.push(creado)
    }

    mostrarModal.value = false
  } catch (e) {
    errorFormulario.value = 'No se pudo guardar el insumo.'
  } finally {
    guardando.value = false
  }
}
const eliminarInsumo = async (id: string) => {
  const confirmar = confirm('¿Seguro que quieres eliminar este insumo?')

  if (!confirmar) {
    return
  }

  try {
    await insumoApi.delete(id)
    insumos.value = insumos.value.filter(insumo => insumo.insumo_id !== id)
  } catch (e) {
    alert('No se pudo eliminar el insumo.')
  }
}
</script>

<style scoped>
.inventario-header {
  margin-bottom: 24px;
}

.inventario-header h2 {
  font-size: 24px;
  color: var(--text-main);
  margin: 0 0 6px 0;
  transition: color 0.2s ease;
}

.subtitle {
  color: var(--text-muted);
  margin: 0;
  font-size: 15px;
  transition: color 0.2s ease;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border-light);
  transition: border-color 0.2s ease;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color 0.2s ease;
}

.tab-btn:hover {
  color: var(--text-main);
}

.tab-btn-active {
  color: var(--primary-purple, #4f46e5);
  border-bottom-color: var(--primary-purple, #4f46e5);
}

.estado-info,
.estado-error {
  background: var(--bg-card);
  padding: 20px;
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  color: var(--text-main);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.estado-error {
  color: #e74c3c;
}

.tabla-container {
  background: var(--bg-card);
  border-radius: 12px;
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
  transition: background-color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.tabla-generica {
  width: 100%;
  border-collapse: collapse;
}

.tabla-generica th {
  text-align: left;
  padding: 14px 20px;
  background: var(--bg-disabled);
  color: var(--text-muted);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.tabla-generica td {
  padding: 14px 20px;
  border-top: 1px solid var(--border-light);
  color: var(--text-main);
  font-size: 14px;
  transition: color 0.2s ease, border-color 0.2s ease;
}

.tabla-generica tbody tr:hover {
  background-color: var(--bg-disabled);
}

.fila-alerta {
  background: #fdf2f2;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-ok {
  background: #eafaf1;
  color: #27ae60;
}

.badge-bajo {
  background: #fdecea;
  color: #e74c3c;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.btn-primario {
  background: var(--primary-purple, #4f46e5);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primario:hover {
  filter: brightness(1.1);
}

.btn-primario:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secundario {
  background: var(--bg-disabled);
  color: var(--text-main);
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-secundario:hover {
  filter: brightness(0.95);
}

.btn-eliminar {
  background: #fdecea;
  color: #e74c3c;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.btn-eliminar:hover {
  background: #f8d7d5;
}

.btn-accion {
  margin-right: 8px;
  padding: 6px 12px;
  font-size: 13px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-box {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.modal-box h3 {
  margin: 0 0 16px 0;
  color: var(--text-main);
  transition: color 0.2s ease;
}

.campo {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo label {
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 600;
  transition: color 0.2s ease;
}

.campo input {
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-input);
  color: var(--text-main);
  outline: none;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}

.campo input:focus {
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.modal-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* ── Modo Oscuro ─────────────────────────────── */
:global(html.dark .tabla-container) {
  background: var(--bg-card) !important;
  border-color: var(--border-light) !important;
}

:global(html.dark .tabla-generica th) {
  background-color: #0f172a !important;
  color: #94a3b8 !important;
  border-bottom-color: #1f2937 !important;
}

:global(html.dark .tabla-generica td) {
  color: #e2e8f0 !important;
  border-top-color: #1f2937 !important;
}

:global(html.dark .tabla-generica tbody tr:hover),
:global(html.dark .tabla-fila:hover) {
  background-color: rgba(255, 255, 255, 0.02) !important;
}

:global(html.dark .fila-alerta) {
  background: rgba(239, 68, 68, 0.12) !important;
}

:global(html.dark .fila-alerta:hover) {
  background: rgba(239, 68, 68, 0.18) !important;
}

:global(html.dark .badge-ok) {
  background: rgba(34, 197, 94, 0.15) !important;
  color: #4ade80 !important;
}

:global(html.dark .badge-bajo) {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #f87171 !important;
}

:global(html.dark .btn-eliminar) {
  background: rgba(239, 68, 68, 0.15) !important;
  color: #f87171 !important;
}

:global(html.dark .btn-eliminar:hover) {
  background: rgba(239, 68, 68, 0.25) !important;
}

:global(html.dark .btn-secundario) {
  background: #1e293b !important;
  color: #cbd5e1 !important;
  border: 1px solid #334155 !important;
}

:global(html.dark .btn-secundario:hover) {
  background: #334155 !important;
  color: #f8fafc !important;
}

:global(html.dark .tab-btn-active) {
  color: #818cf8 !important;
  border-bottom-color: #818cf8 !important;
}

:global(html.dark .modal-overlay) {
  background: rgba(0, 0, 0, 0.7) !important;
  backdrop-filter: blur(4px);
}

:global(html.dark .modal-box) {
  background: #131b2e !important;
  border-color: #1e293b !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5) !important;
}

:global(html.dark .modal-box h3) {
  color: #f8fafc !important;
}

:global(html.dark .campo label) {
  color: #cbd5e1 !important;
}

:global(html.dark .campo input) {
  background: #1e293b !important;
  border-color: #334155 !important;
  color: #f8fafc !important;
}

:global(html.dark .campo input:focus) {
  border-color: #818cf8 !important;
  box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2) !important;
}
</style>