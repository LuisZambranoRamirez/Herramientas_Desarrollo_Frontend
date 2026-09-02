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

      <div v-else class="tabla-container">
        <table class="tabla-generica">
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

    <div v-else>
      <div v-if="cargandoProveedores" class="estado-info">
        Cargando proveedores...
      </div>

      <div v-else-if="errorProveedores" class="estado-error">
        {{ errorProveedores }}
      </div>

      <div v-else class="tabla-container">
        <table class="tabla-generica">
          <thead>
            <tr>
              <th>RUC</th>
              <th>Nombre</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proveedor in proveedores" :key="proveedor.ruc">
              <td>{{ proveedor.ruc }}</td>
              <td>{{ proveedor.nombre }}</td>
              <td>{{ proveedor.telefono }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-box">
        <h3>Nuevo insumo</h3>

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
              {{ guardando ? 'Guardando...' : 'Guardar' }}
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

const abrirModalCrear = () => {
  nuevoInsumo.value = insumoVacio()
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
    const creado = await insumoApi.create(nuevoInsumo.value)
    insumos.value.push(creado)
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
  color: #1a2b3c;
  margin: 0 0 6px 0;
}

.subtitle {
  color: #7f8c8d;
  margin: 0;
  font-size: 15px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e8edf3;
}

.tab-btn {
  background: none;
  border: none;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  color: #7f8c8d;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  color: #2c3e50;
}

.tab-btn-active {
  color: #3498db;
  border-bottom-color: #3498db;
}

.estado-info,
.estado-error {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.estado-error {
  color: #e74c3c;
}

.tabla-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.tabla-generica {
  width: 100%;
  border-collapse: collapse;
}

.tabla-generica th {
  text-align: left;
  padding: 14px 20px;
  background: #f5f7fa;
  color: #2c3e50;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.tabla-generica td {
  padding: 14px 20px;
  border-top: 1px solid #f0f0f0;
  color: #2c3e50;
  font-size: 14px;
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
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-primario:hover {
  background: #2d84c2;
}

.btn-primario:disabled {
  background: #a9c6d8;
  cursor: not-allowed;
}

.btn-secundario {
  background: #ecf0f1;
  color: #2c3e50;
  border: none;
  padding: 10px 18px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secundario:hover {
  background: #dfe4e6;
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
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-box {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
}

.modal-box h3 {
  margin: 0 0 16px 0;
  color: #1a2b3c;
}

.campo {
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo label {
  font-size: 13px;
  color: #7f8c8d;
  font-weight: 600;
}

.campo input {
  padding: 8px 10px;
  border: 1px solid #dfe4e6;
  border-radius: 6px;
  font-size: 14px;
}

.modal-acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
</style>