<script setup lang="ts">
// CAMBIO: Importaciones reactivas de Vue y Vue Router
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

// CAMBIO: Tipos e interfaz de dominio enriquecida para Pago (módulo dental)
export type MetodoPagoTipo = 'Efectivo' | 'Tarjeta' | 'Yape' | 'Plin' | 'Transferencia'
export type EstadoPagoTipo = 'Completado' | 'Pendiente' | 'Anulado'

export interface Pago {
  id: string | number
  pacienteDni: string
  pacienteNombre: string
  tratamiento: string
  monto: number
  metodoPago: MetodoPagoTipo
  fecha: string
  estado: EstadoPagoTipo
  numeroComprobante?: string
  observaciones?: string
}

// CAMBIO: Interfaces para selectores dinámicos sincronizados
interface PacienteOption {
  dni: string
  nombreCompleto: string
}

interface TratamientoOption {
  id: string | number
  nombre: string
  precioReferencial: number
}

const route = useRoute()
const STORAGE_KEY = 'pagos'

// CAMBIO: Catálogo inicial de pagos (Seed Data)
const SEED_PAGOS: Pago[] = [
  {
    id: 'PAG-1092',
    pacienteDni: '72845631',
    pacienteNombre: 'Carlos Mendoza Ramos',
    tratamiento: 'Limpieza Dental Profunda',
    monto: 70,
    metodoPago: 'Yape',
    fecha: '2026-09-02',
    estado: 'Completado',
    numeroComprobante: 'B001-0001092',
    observaciones: 'Pago completo de la consulta',
  },
  {
    id: 'PAG-1091',
    pacienteDni: '45678912',
    pacienteNombre: 'Lucía Fernández Torres',
    tratamiento: 'Ortodoncia Control Mensual',
    monto: 180,
    metodoPago: 'Tarjeta',
    fecha: '2026-09-02',
    estado: 'Completado',
    numeroComprobante: 'B001-0001091',
    observaciones: 'Ajuste de brackets mensual',
  },
  {
    id: 'PAG-1090',
    pacienteDni: '12345678',
    pacienteNombre: 'Jorge Morales Vega',
    tratamiento: 'Implante Dental Primera Cuota',
    monto: 300,
    metodoPago: 'Transferencia',
    fecha: '2026-09-01',
    estado: 'Completado',
    numeroComprobante: 'F001-0000450',
    observaciones: 'Cuota 1 de 3 del implante',
  },
  {
    id: 'PAG-1089',
    pacienteDni: '87654321',
    pacienteNombre: 'Ana Paula Gómez',
    tratamiento: 'Evaluación y Diagnóstico',
    monto: 50,
    metodoPago: 'Efectivo',
    fecha: '2026-09-01',
    estado: 'Completado',
    numeroComprobante: 'B001-0001089',
  },
  {
    id: 'PAG-1088',
    pacienteDni: '23456789',
    pacienteNombre: 'María Elena Suárez',
    tratamiento: 'Blanqueamiento Dental',
    monto: 450,
    metodoPago: 'Plin',
    fecha: '2026-08-30',
    estado: 'Pendiente',
    numeroComprobante: 'B001-0001088',
    observaciones: 'Falta validar transferencia',
  },
]

// CAMBIO: Inicialización desde localStorage con fallback a Seed Data
const cargarPagosIniciales = (): Pago[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Error al leer pagos de localStorage:', e)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PAGOS))
  return [...SEED_PAGOS]
}

// CAMBIO: Lector dinámico de pacientes desde la clave exacta 'pacientes' de localStorage
const cargarPacientesOpciones = (): PacienteOption[] => {
  try {
    const raw = localStorage.getItem('pacientes')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p: Record<string, unknown>, i: number) => {
          const dni = String(p.dni || `DNI-${i + 1}`)
          const nombres = (p.nombres as string) || ''
          const apellidos = (p.apellidos as string) || ''
          const nombreCompleto =
            (p.nombreCompleto as string) ||
            `${nombres} ${apellidos}`.trim() ||
            (p.nombre as string) ||
            'Paciente'
          return { dni, nombreCompleto }
        })
      }
    }
  } catch (e) {
    console.error('Error al leer pacientes en PagosView:', e)
  }
  return [
    { dni: '72845631', nombreCompleto: 'Carlos Mendoza Ramos' },
    { dni: '45678912', nombreCompleto: 'Lucía Fernández Torres' },
    { dni: '12345678', nombreCompleto: 'Jorge Morales Vega' },
    { dni: '87654321', nombreCompleto: 'Ana Paula Gómez' },
    { dni: '23456789', nombreCompleto: 'María Elena Suárez' },
  ]
}

// CAMBIO: Lector dinámico de tratamientos desde la clave 'tratamientos' de localStorage
const cargarTratamientosOpciones = (): TratamientoOption[] => {
  try {
    const raw = localStorage.getItem('tratamientos')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((t: Record<string, unknown>, i: number) => {
          const id = (t.id || i + 1) as string | number
          const nombre = (t.nombre || t.tratamiento || 'Tratamiento') as string
          const precioReferencial = Number(t.precioReferencial || t.precio || 0)
          return { id, nombre, precioReferencial }
        })
      }
    }
  } catch (e) {
    console.error('Error al leer tratamientos en PagosView:', e)
  }
  return [
    { id: 1, nombre: 'Limpieza Dental Profunda', precioReferencial: 70 },
    { id: 2, nombre: 'Ortodoncia Control Mensual', precioReferencial: 180 },
    { id: 3, nombre: 'Implante Dental Primera Cuota', precioReferencial: 300 },
    { id: 4, nombre: 'Evaluación y Diagnóstico', precioReferencial: 50 },
    { id: 5, nombre: 'Blanqueamiento Dental', precioReferencial: 450 },
  ]
}

// Estado reactivo principal
const pagos = ref<Pago[]>(cargarPagosIniciales())
const busqueda = ref('')
const opcionesPacientes = ref<PacienteOption[]>(cargarPacientesOpciones())
const opcionesTratamientos = ref<TratamientoOption[]>(cargarTratamientosOpciones())

// CAMBIO: Auto-guardado en localStorage mediante watch profundo
watch(
  pagos,
  (nuevosPagos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevosPagos))
  },
  { deep: true }
)

// CAMBIO: Métricas computadas reactivamente
const totalRecaudado = computed(() => {
  const suma = pagos.value
    .filter((p) => p.estado === 'Completado')
    .reduce((acc, p) => acc + p.monto, 0)
  return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(suma)
})

const totalTransaccionesCompletadas = computed(
  () => pagos.value.filter((p) => p.estado === 'Completado').length
)

const totalPendientes = computed(
  () => pagos.value.filter((p) => p.estado === 'Pendiente').length
)

const metodoMasUsado = computed(() => {
  const conteo: Record<string, number> = {}
  pagos.value
    .filter((p) => p.estado === 'Completado')
    .forEach((p) => {
      conteo[p.metodoPago] = (conteo[p.metodoPago] || 0) + 1
    })

  let maxMetodo = '—'
  let maxCount = 0
  for (const [metodo, count] of Object.entries(conteo)) {
    if (count > maxCount) {
      maxCount = count
      maxMetodo = metodo
    }
  }
  return maxMetodo
})

// CAMBIO: Búsqueda inteligente por DNI, nombre de paciente, tratamiento, recibo u observaciones
const pagosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()
  if (!q) return pagos.value
  return pagos.value.filter(
    (p) =>
      p.pacienteNombre.toLowerCase().includes(q) ||
      p.pacienteDni.toLowerCase().includes(q) ||
      p.tratamiento.toLowerCase().includes(q) ||
      p.metodoPago.toLowerCase().includes(q) ||
      p.estado.toLowerCase().includes(q) ||
      (p.numeroComprobante && p.numeroComprobante.toLowerCase().includes(q)) ||
      (p.observaciones && p.observaciones.toLowerCase().includes(q)) ||
      String(p.id).toLowerCase().includes(q)
  )
})

// CAMBIO: Modo modal de registro / edición
type ModoModal = 'crear' | 'editar' | null
const modoModal = ref<ModoModal>(null)
const idSeleccionado = ref<string | number | null>(null)

const METODOS_OPCIONES: MetodoPagoTipo[] = ['Efectivo', 'Tarjeta', 'Yape', 'Plin', 'Transferencia']
const ESTADOS_OPCIONES: EstadoPagoTipo[] = ['Completado', 'Pendiente', 'Anulado']

const formVacio = () => ({
  pacienteDni: '',
  pacienteNombre: '',
  tratamiento: '',
  monto: 0,
  metodoPago: 'Efectivo' as MetodoPagoTipo,
  estado: 'Completado' as EstadoPagoTipo,
  numeroComprobante: '',
  observaciones: '',
})

const form = ref(formVacio())

// CAMBIO: Abrir modal re-consultando localStorage para reflejar pacientes/tratamientos recién agregados
const abrirModalRegistro = (pacienteInicial?: { dni?: string; nombre?: string }) => {
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()

  modoModal.value = 'crear'
  idSeleccionado.value = null
  form.value = formVacio()

  const numRandom = Math.floor(1000 + Math.random() * 9000)
  form.value.numeroComprobante = `B001-${numRandom}`

  if (pacienteInicial?.dni) {
    const enc = opcionesPacientes.value.find((p) => p.dni === pacienteInicial.dni)
    if (enc) {
      form.value.pacienteDni = enc.dni
      form.value.pacienteNombre = enc.nombreCompleto
    } else if (pacienteInicial.nombre) {
      form.value.pacienteDni = pacienteInicial.dni
      form.value.pacienteNombre = pacienteInicial.nombre
    }
  } else {
    const primerPaciente = opcionesPacientes.value[0]
    if (primerPaciente) {
      form.value.pacienteDni = primerPaciente.dni
      form.value.pacienteNombre = primerPaciente.nombreCompleto
    }
  }

  const primerTratamiento = opcionesTratamientos.value[0]
  if (primerTratamiento) {
    form.value.tratamiento = primerTratamiento.nombre
    form.value.monto = primerTratamiento.precioReferencial
  }
}

// CAMBIO: Abrir modal en modo edición
const abrirEditarPago = (pago: Pago) => {
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()

  modoModal.value = 'editar'
  idSeleccionado.value = pago.id
  form.value = {
    pacienteDni: pago.pacienteDni,
    pacienteNombre: pago.pacienteNombre,
    tratamiento: pago.tratamiento,
    monto: pago.monto,
    metodoPago: pago.metodoPago,
    estado: pago.estado,
    numeroComprobante: pago.numeroComprobante || '',
    observaciones: pago.observaciones || '',
  }
}

const cerrarModal = () => {
  modoModal.value = null
  idSeleccionado.value = null
}

// CAMBIO: Evento al seleccionar paciente en el selector desplegable
const alSeleccionarPaciente = (e: Event) => {
  const dniSel = (e.target as HTMLSelectElement).value
  const pEncontrado = opcionesPacientes.value.find((p) => p.dni === dniSel)
  if (pEncontrado) {
    form.value.pacienteDni = pEncontrado.dni
    form.value.pacienteNombre = pEncontrado.nombreCompleto
  }
}

// CAMBIO: Evento al seleccionar tratamiento en el selector desplegable
const alSeleccionarTratamiento = (e: Event) => {
  const nombreSel = (e.target as HTMLSelectElement).value
  const tEncontrado = opcionesTratamientos.value.find((t) => t.nombre === nombreSel)
  if (tEncontrado && tEncontrado.precioReferencial > 0) {
    form.value.monto = tEncontrado.precioReferencial
  }
}

// CAMBIO: Guardar pago creado o editado con tipado estricto
const guardarPago = () => {
  const pacienteDni = form.value.pacienteDni?.trim()
  const pacienteNombre = form.value.pacienteNombre?.trim()
  const tratamiento = form.value.tratamiento?.trim()
  const monto = Number(form.value.monto)

  if (!pacienteNombre || !tratamiento || isNaN(monto) || monto <= 0) {
    return
  }

  const hoy = new Date().toISOString().slice(0, 10)

  if (modoModal.value === 'crear') {
    const nuevoId: string = `PAG-${Date.now()}`
    const nuevoPago: Pago = {
      id: nuevoId,
      pacienteDni: pacienteDni || '72845631',
      pacienteNombre,
      tratamiento,
      monto,
      metodoPago: form.value.metodoPago,
      fecha: hoy,
      estado: form.value.estado,
      numeroComprobante: form.value.numeroComprobante?.trim() || undefined,
      observaciones: form.value.observaciones?.trim() || undefined,
    }
    pagos.value.unshift(nuevoPago)
  } else if (modoModal.value === 'editar' && idSeleccionado.value !== null) {
    const pagoExistente = pagos.value.find((p) => p.id === idSeleccionado.value)
    if (pagoExistente) {
      pagoExistente.pacienteDni = pacienteDni || pagoExistente.pacienteDni
      pagoExistente.pacienteNombre = pacienteNombre
      pagoExistente.tratamiento = tratamiento
      pagoExistente.monto = monto
      pagoExistente.metodoPago = form.value.metodoPago
      pagoExistente.estado = form.value.estado
      pagoExistente.numeroComprobante = form.value.numeroComprobante?.trim() || undefined
      pagoExistente.observaciones = form.value.observaciones?.trim() || undefined
    }
  }

  cerrarModal()
}

// CAMBIO: Eliminar pago con confirmación
const eliminarPago = (id: string | number) => {
  if (confirm('¿Estás seguro de eliminar este registro de pago?')) {
    pagos.value = pagos.value.filter((p) => p.id !== id)
  }
}

// CAMBIO: Detección de query parameters al montar si viene desde PacientesView
onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PAGOS))
  }
  opcionesPacientes.value = cargarPacientesOpciones()
  opcionesTratamientos.value = cargarTratamientosOpciones()

  if (route.query.dni) {
    abrirModalRegistro({
      dni: String(route.query.dni),
      nombre: route.query.nombre ? String(route.query.nombre) : undefined,
    })
  }
})

// CAMBIO: Formateadores
const formatPrecio = (monto: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(monto)

const formatFecha = (f: string): string => {
  if (!f) return '—'
  const partes = f.slice(0, 10).split('-')
  if (partes.length === 3) {
    return `${partes[2]}/${partes[1]}/${partes[0]}`
  }
  return f
}
</script>

<template>
  <DashboardLayout>
    <div class="pagos-view">

      <!-- ── Cabecera ─────────────────────────────────────────── -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Registro de Pagos</h2>
          <p class="view-desc">Historial de transacciones, cobros e ingresos de la clínica.</p>
        </div>
        <button class="btn-nuevo" type="button" @click="() => abrirModalRegistro()">
          + Registrar Pago
        </button>
      </div>

      <!-- ── Tarjetas de Estadísticas Reactivas ───────────────── -->
      <div class="stats-row">
        <div class="stat-mini-card">
          <span class="stat-label">Ingresos Recaudados</span>
          <span class="stat-val text-emerald">{{ totalRecaudado }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Transacciones Completadas</span>
          <span class="stat-val">{{ totalTransaccionesCompletadas }} Realizadas</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Pagos Pendientes</span>
          <span class="stat-val text-amber">{{ totalPendientes }} Pendiente(s)</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Método Más Usado</span>
          <span class="stat-val">{{ metodoMasUsado }}</span>
        </div>
      </div>

      <!-- ── Tabla de Pagos ───────────────────────────────────── -->
      <div class="table-card">
        <div class="filter-bar">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por DNI, paciente, tratamiento, recibo u observaciones..."
            class="search-input"
          />
          <span class="resultado-count">{{ pagosFiltrados.length }} pago(s)</span>
        </div>

        <div v-if="pagosFiltrados.length === 0" class="estado-vacio">
          <span class="vacio-icono">💳</span>
          <p class="vacio-titulo">Sin pagos registrados</p>
          <p class="vacio-desc">
            {{ busqueda ? 'No se encontraron pagos con el criterio buscado.' : 'Registra el primer pago haciendo clic en "+ Registrar Pago".' }}
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>N° Recibo / ID</th>
                <th>DNI</th>
                <th>Paciente</th>
                <th>Tratamiento</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagosFiltrados" :key="pago.id" class="tabla-fila">
                <td class="font-mono">{{ pago.numeroComprobante || pago.id }}</td>
                <td class="font-mono text-purple">{{ pago.pacienteDni || '—' }}</td>
                <td class="font-semibold">{{ pago.pacienteNombre }}</td>
                <td>{{ pago.tratamiento }}</td>
                <td class="font-bold text-emerald">{{ formatPrecio(pago.monto) }}</td>
                <td>
                  <span class="badge-method">{{ pago.metodoPago }}</span>
                </td>
                <td>{{ formatFecha(pago.fecha) }}</td>
                <td>
                  <span
                    class="badge-status"
                    :class="{
                      completado: pago.estado === 'Completado',
                      pendiente: pago.estado === 'Pendiente',
                      anulado: pago.estado === 'Anulado',
                    }"
                  >
                    {{ pago.estado }}
                  </span>
                </td>
                <td class="td-acciones">
                  <button
                    class="btn-action edit"
                    title="Editar pago"
                    @click="abrirEditarPago(pago)"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn-action delete"
                    title="Eliminar pago"
                    @click="eliminarPago(pago.id)"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ── Modal para Registrar / Editar Pago ───────────────── -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">
        <div class="modal-header">
          <h3>{{ modoModal === 'crear' ? 'Registrar Nuevo Pago' : 'Editar Pago' }}</h3>
          <button class="modal-close" @click="cerrarModal">✕</button>
        </div>

        <form @submit.prevent="guardarPago" class="form-grid">

          <!-- CAMBIO: Selector dinámico de Paciente mostrando [DNI] - Nombre Completo -->
          <div class="form-group form-full">
            <label>Paciente *</label>
            <select
              :value="form.pacienteDni"
              required
              class="form-select"
              @change="alSeleccionarPaciente"
            >
              <option value="" disabled>Seleccione un paciente</option>
              <option
                v-for="pac in opcionesPacientes"
                :key="pac.dni"
                :value="pac.dni"
              >
                {{ pac.dni }} - {{ pac.nombreCompleto }}
              </option>
            </select>
          </div>

          <!-- CAMBIO: Selector dinámico de Tratamiento con autocompletado de precio -->
          <div class="form-group form-full">
            <label>Tratamiento o Servicio *</label>
            <select
              v-model="form.tratamiento"
              required
              class="form-select"
              @change="alSeleccionarTratamiento"
            >
              <option value="" disabled>Seleccione un tratamiento</option>
              <option
                v-for="trat in opcionesTratamientos"
                :key="trat.id"
                :value="trat.nombre"
              >
                {{ trat.nombre }} (Ref: S/ {{ trat.precioReferencial }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Monto (S/) *</label>
            <input
              v-model.number="form.monto"
              type="number"
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div class="form-group">
            <label>Método de Pago *</label>
            <select v-model="form.metodoPago" required class="form-select">
              <option v-for="met in METODOS_OPCIONES" :key="met" :value="met">
                {{ met }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Estado del Pago *</label>
            <select v-model="form.estado" required class="form-select">
              <option v-for="est in ESTADOS_OPCIONES" :key="est" :value="est">
                {{ est }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>N° Comprobante / Recibo</label>
            <input
              v-model="form.numeroComprobante"
              type="text"
              placeholder="B001-0001093"
            />
          </div>

          <!-- CAMBIO: Campo adicional de Observaciones clínicas/financieras -->
          <div class="form-group form-full">
            <label>Observaciones / Notas de Cobro</label>
            <textarea
              v-model="form.observaciones"
              rows="2"
              placeholder="Ej. Cuota 1 de 3, descuento de 10% aplicado..."
            ></textarea>
          </div>

          <div class="modal-footer form-full">
            <button type="button" class="btn-secundario" @click="cerrarModal">Cancelar</button>
            <button type="submit" class="btn-primario">
              {{ modoModal === 'crear' ? 'Guardar Pago' : 'Actualizar Pago' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.pagos-view {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #1e293b);
  margin: 0;
}

.view-desc {
  font-size: 0.92rem;
  color: #64748b;
  margin: 0.25rem 0 0;
}

.btn-nuevo {
  background: linear-gradient(135deg, #00c49f 0%, #00b4d8 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.25);
}

.btn-nuevo:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-mini-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.stat-label {
  font-size: 0.82rem;
  color: #64748b;
  font-weight: 600;
}

.stat-val {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main, #1e293b);
}

.text-emerald { color: #059669; }
.text-amber   { color: #d97706; }
.text-purple  { color: #6366f1; font-weight: 700; }
.text-right   { text-align: right; }

.table-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.filter-bar {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  width: 100%;
  max-width: 420px;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.9rem;
  outline: none;
  color: var(--text-main, #1e293b);
  background: transparent;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #00c49f;
  box-shadow: 0 0 0 3px rgba(0, 196, 159, 0.1);
}

.resultado-count {
  margin-left: auto;
  font-size: 0.82rem;
  color: #94a3b8;
  white-space: nowrap;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.9rem;
}

.data-table th {
  background: var(--bg-disabled, #f8fafc);
  padding: 0.9rem 1.25rem;
  font-weight: 700;
  color: #475569;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.data-table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  color: var(--text-main, #334155);
  vertical-align: middle;
}

.tabla-fila:hover {
  background: var(--bg-disabled, #fafbff);
}

.font-mono {
  font-family: monospace;
  font-size: 0.85rem;
  color: #64748b;
}

.font-semibold { font-weight: 600; }
.font-bold     { font-weight: 700; }

.badge-method {
  background: #f1f5f9;
  color: #475569;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-status {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
}

.badge-status.completado { background: #dcfce7; color: #15803d; }
.badge-status.pendiente  { background: #fef3c7; color: #b45309; }
.badge-status.anulado    { background: #fee2e2; color: #b91c1c; }

.td-acciones {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  justify-content: flex-end;
}

.btn-action {
  background: #f1f5f9;
  border: 1px solid transparent;
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-action:hover { opacity: 0.8; transform: translateY(-1px); }
.btn-action.edit   { background: #fef9c3; }
.btn-action.delete { background: #fee2e2; }

.estado-vacio {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 0.5rem;
  text-align: center;
}

.vacio-icono  { font-size: 2.5rem; }
.vacio-titulo { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.vacio-desc   { font-size: 0.875rem; color: #94a3b8; margin: 0; max-width: 320px; }

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
}

.modal {
  background: var(--bg-card, #ffffff);
  border-radius: 16px;
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s ease;
  border: 1px solid var(--border-light, transparent);
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
  border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.1rem;
  color: #94a3b8;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-full  { grid-column: 1 / -1; }

.form-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
}

.form-group input,
.form-group textarea,
.form-select {
  padding: 0.6rem 0.8rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-main, #1e293b);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-select:focus {
  border-color: #00c49f;
  box-shadow: 0 0 0 3px rgba(0, 196, 159, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-light, #e2e8f0);
}

.form-full.modal-footer { padding: 0; border-top: none; padding-top: 0.5rem; }

.btn-primario {
  padding: 0.55rem 1.2rem;
  background: linear-gradient(135deg, #00c49f, #00b4d8);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primario:hover { opacity: 0.9; transform: translateY(-1px); }

.btn-secundario {
  padding: 0.55rem 1.2rem;
  background: var(--bg-card, white);
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
}

.btn-secundario:hover { background: #f1f5f9; }

/* Dark mode */
:global(html.dark) .view-title        { color: #f8fafc; }
:global(html.dark) .stat-mini-card    { background: #131b2e; border-color: #1e293b; }
:global(html.dark) .stat-val          { color: #f8fafc; }
:global(html.dark) .table-card        { background: var(--bg-card, #131b2e); border-color: #1e293b; }
:global(html.dark) .filter-bar        { border-bottom-color: #1e293b; }
:global(html.dark) .search-input      { color: #f8fafc; border-color: #334155; }
:global(html.dark) .search-input:focus{ border-color: #34d399; }
:global(html.dark) .data-table th     { background: #0f172a; color: #94a3b8; border-bottom-color: #1e293b; }
:global(html.dark) .data-table td     { color: #cbd5e1; border-bottom-color: #1e293b; }
:global(html.dark) .tabla-fila:hover  { background: rgba(255,255,255,0.02); }
:global(html.dark) .text-purple       { color: #818cf8; }
:global(html.dark) .badge-method      { background: #1e293b; color: #cbd5e1; }
:global(html.dark) .btn-action        { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .btn-action.edit   { background: rgba(234,179,8,0.2); }
:global(html.dark) .btn-action.delete { background: rgba(239,68,68,0.2); }
:global(html.dark) .vacio-titulo      { color: #f8fafc; }
:global(html.dark) .modal-overlay     { background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
:global(html.dark) .modal             { background: #131b2e; border-color: #1e293b; }
:global(html.dark) .modal-header      { border-bottom-color: #1e293b; }
:global(html.dark) .modal-header h3   { color: #f8fafc; }
:global(html.dark) .form-group label  { color: #cbd5e1; }
:global(html.dark) .form-group input,
:global(html.dark) .form-group textarea,
:global(html.dark) .form-select       { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .form-select option{ background: #131b2e; color: #f8fafc; }
:global(html.dark) .btn-secundario    { background: #1e293b; color: #cbd5e1; border-color: #334155; }
:global(html.dark) .btn-secundario:hover { background: #334155; color: #f8fafc; }

@media (max-width: 600px) {
  .form-grid   { grid-template-columns: 1fr; }
  .form-full   { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
