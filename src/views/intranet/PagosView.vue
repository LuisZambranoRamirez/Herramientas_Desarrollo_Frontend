<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { pagosService } from '@/services/pagos.service'
import { tratamientosService } from '@/services/tratamientos.service'
import { pacientesService } from '@/services/pacientes.service'
import { citasService } from '@/services/citas.service'
import type {
  Pago,
  MetodoPago,
  TratamientoPaciente,
  TratamientoOdontologico,
  Paciente,
  CitaOdontologoResumen,
} from '@/types'

interface FormPago {
  id_tratamiento_paciente: string
  monto: number
  metodo_pago: MetodoPago
}

const route = useRoute()
const authStore = useAuthStore()

const TRATAMIENTO_LABELS: Record<TratamientoOdontologico, string> = {
  Limpieza_dental_profunda: 'Limpieza dental profunda',
  Aplicacion_de_fluor: 'Aplicación de flúor',
  Selladores_de_fosas_y_fisuras: 'Selladores de fosas y fisuras',
  Restauracion_con_resina: 'Restauración con resina',
  Ortopedia_maxilar: 'Ortopedia maxilar',
  Implante_dental: 'Implante dental',
}

const METODO_LABELS: Record<MetodoPago, string> = {
  efectivo: 'Efectivo',
  digital: 'Digital (Yape / Plin / Tarjeta)',
}

// Estado reactivo conectado al backend
const pagos = ref<Pago[]>([])
const todosPagosParaSaldo = ref<Pago[]>([])
const tratamientos = ref<TratamientoPaciente[]>([])
const pacientes = ref<Paciente[]>([])
const odontologos = ref<CitaOdontologoResumen[]>([])

const cargando = ref(false)
const guardando = ref(false)
const cargandoComprobante = ref(false)

const errorCarga = ref<string | null>(null)
const errorAccion = ref<string | null>(null)
const errorModal = ref<string | null>(null)
const errorComprobante = ref<string | null>(null)
const exitoAccion = ref<string | null>(null)

const busqueda = ref('')
const filtroMetodo = ref<MetodoPago | 'TODOS'>('TODOS')
const filtroTratamientoId = ref<string>('TODOS')

const esAdmin = computed(() => authStore.userRole === 'SYSTEM_ADMIN')

const cargarDatos = async () => {
  cargando.value = true
  errorCarga.value = null
  try {
    const [pagosData, tratData, pacData, odonData] = await Promise.all([
      pagosService.getAll(),
      tratamientosService.getAll().catch(() => [] as TratamientoPaciente[]),
      pacientesService.getAll().catch(() => [] as Paciente[]),
      citasService.getOdontologos().catch(() => [] as CitaOdontologoResumen[]),
    ])

    pagos.value = pagosData
    todosPagosParaSaldo.value = pagosData
    tratamientos.value = tratData
    pacientes.value = pacData
    odontologos.value = odonData
    filtroTratamientoId.value = 'TODOS'
  } catch (err) {
    errorCarga.value =
      err instanceof Error
        ? err.message
        : 'No se pudieron cargar los pagos desde el servidor.'
  } finally {
    cargando.value = false
  }
}

const filtrarPorTratamiento = async () => {
  errorAccion.value = null
  cargando.value = true
  try {
    if (filtroTratamientoId.value === 'TODOS') {
      const lista = await pagosService.getAll()
      pagos.value = lista
      todosPagosParaSaldo.value = lista
    } else {
      pagos.value = await pagosService.getByTratamiento(filtroTratamientoId.value)
    }
  } catch (err) {
    errorAccion.value =
      err instanceof Error ? err.message : 'No se pudo filtrar los pagos por tratamiento.'
  } finally {
    cargando.value = false
  }
}

// Mapas de consulta rápida para enriquecer la tabla y comprobantes
const mapaTratamientos = computed(
  () => new Map(tratamientos.value.map((t) => [t.tratamiento_paciente_id, t])),
)

const mapaPacientes = computed(
  () => new Map(pacientes.value.map((p) => [p.dni, p])),
)

const mapaOdontologos = computed(
  () => new Map(odontologos.value.map((o) => [o.dni, o])),
)

const pagadoPorTratamiento = computed(() => {
  const totales = new Map<string, number>()
  for (const p of todosPagosParaSaldo.value) {
    totales.set(
      p.id_tratamiento_paciente,
      (totales.get(p.id_tratamiento_paciente) || 0) + Number(p.monto),
    )
  }
  return totales
})

const formatNombreTratamiento = (slug?: TratamientoOdontologico | string): string => {
  if (!slug) return 'Tratamiento asociado'
  return TRATAMIENTO_LABELS[slug as TratamientoOdontologico] || slug.replace(/_/g, ' ')
}

const obtenerInfoPago = (pago: Pago) => {
  const trat = mapaTratamientos.value.get(pago.id_tratamiento_paciente)
  const dniPaciente = trat?.dni_paciente || ''
  const pac = dniPaciente ? mapaPacientes.value.get(dniPaciente) : undefined
  const odon = trat?.dni_odontologo ? mapaOdontologos.value.get(trat.dni_odontologo) : undefined

  return {
    dniPaciente,
    nombrePaciente: pac
      ? `${pac.nombres} ${pac.apellidos}`.trim()
      : dniPaciente
        ? `Paciente (${dniPaciente})`
        : '—',
    nombreOdontologo: odon
      ? `Dr(a). ${odon.nombres} ${odon.apellidos}`.trim()
      : trat?.dni_odontologo
        ? `Dr(a). (${trat.dni_odontologo})`
        : '—',
    nombreTratamiento: trat
      ? formatNombreTratamiento(trat.tratamiento)
      : `Tratamiento ${pago.id_tratamiento_paciente.slice(0, 8)}`,
    observacionesTratamiento: trat?.observaciones || '',
    precioTratamiento: trat ? Number(trat.precio) : null,
  }
}

// Métricas computadas reactivamente
const totalRecaudado = computed(() => {
  const suma = pagos.value.reduce((acc, p) => acc + Number(p.monto), 0)
  return formatPrecio(suma)
})

const totalTransacciones = computed(() => pagos.value.length)

const totalEfectivo = computed(
  () => pagos.value.filter((p) => p.metodo_pago === 'efectivo').length,
)

const totalDigital = computed(
  () => pagos.value.filter((p) => p.metodo_pago === 'digital').length,
)

const metodoMasUsado = computed(() => {
  if (pagos.value.length === 0) return '—'
  if (totalEfectivo.value === totalDigital.value) return 'Efectivo / Digital'
  return totalEfectivo.value > totalDigital.value ? 'Efectivo' : 'Digital'
})

// Búsqueda reactiva en la tabla cargada
const pagosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()

  return pagos.value.filter((p) => {
    if (filtroMetodo.value !== 'TODOS' && p.metodo_pago !== filtroMetodo.value) {
      return false
    }

    if (!q) return true

    const info = obtenerInfoPago(p)
    return (
      p.pago_id.toLowerCase().includes(q) ||
      p.id_tratamiento_paciente.toLowerCase().includes(q) ||
      info.dniPaciente.toLowerCase().includes(q) ||
      info.nombrePaciente.toLowerCase().includes(q) ||
      info.nombreTratamiento.toLowerCase().includes(q) ||
      p.metodo_pago.toLowerCase().includes(q)
    )
  })
})

// Modales: Registrar pago / Consultar comprobante
type ModoModal = 'crear' | 'comprobante' | null
const modoModal = ref<ModoModal>(null)
const comprobanteActual = ref<Pago | null>(null)
const dniPacienteFiltro = ref<string>('')

const form = ref<FormPago>({
  id_tratamiento_paciente: '',
  monto: 0,
  metodo_pago: 'efectivo',
})

const tratamientosDisponiblesModal = computed(() => {
  if (!dniPacienteFiltro.value) return tratamientos.value
  return tratamientos.value.filter((t) => t.dni_paciente === dniPacienteFiltro.value)
})

const tratamientoSeleccionadoModal = computed(() =>
  tratamientos.value.find(
    (t) => t.tratamiento_paciente_id === form.value.id_tratamiento_paciente,
  ) || null,
)

const resumenSaldoTratamiento = computed(() => {
  const trat = tratamientoSeleccionadoModal.value
  if (!trat) return null
  const total = Number(trat.precio)
  const pagado = pagadoPorTratamiento.value.get(trat.tratamiento_paciente_id) || 0
  const pendiente = Math.max(0, Number((total - pagado).toFixed(2)))
  return { total, pagado, pendiente }
})

const aplicarSaldoSugerido = () => {
  const trat = tratamientoSeleccionadoModal.value
  if (!trat) {
    form.value.monto = 0
    return
  }
  const pagado = pagadoPorTratamiento.value.get(trat.tratamiento_paciente_id) || 0
  const saldo = Number((Number(trat.precio) - pagado).toFixed(2))
  form.value.monto = saldo > 0 ? saldo : Number(trat.precio)
}

const alCambiarPacienteModal = () => {
  const primero = tratamientosDisponiblesModal.value[0]
  form.value.id_tratamiento_paciente = primero?.tratamiento_paciente_id || ''
  aplicarSaldoSugerido()
}

const abrirModalRegistro = (preseleccion?: { dni?: string; tratamientoId?: string }) => {
  errorModal.value = null
  errorAccion.value = null
  modoModal.value = 'crear'

  dniPacienteFiltro.value = preseleccion?.dni || ''

  let tratInicial: TratamientoPaciente | undefined
  if (preseleccion?.tratamientoId) {
    tratInicial = tratamientos.value.find(
      (t) => t.tratamiento_paciente_id === preseleccion.tratamientoId,
    )
    if (tratInicial && !dniPacienteFiltro.value) {
      dniPacienteFiltro.value = tratInicial.dni_paciente
    }
  }

  if (!tratInicial) {
    const lista = tratamientosDisponiblesModal.value
    tratInicial = lista.find((t) => t.estado !== 'FINALIZADO') || lista[0]
  }

  form.value = {
    id_tratamiento_paciente: tratInicial?.tratamiento_paciente_id || '',
    monto: 0,
    metodo_pago: 'efectivo',
  }
  aplicarSaldoSugerido()
}

const verComprobante = async (pago: Pago) => {
  errorComprobante.value = null
  comprobanteActual.value = pago
  modoModal.value = 'comprobante'
  cargandoComprobante.value = true

  try {
    const detalle = await pagosService.getById(pago.pago_id)
    if (detalle) {
      comprobanteActual.value = detalle
    }
  } catch (err) {
    errorComprobante.value =
      err instanceof Error
        ? err.message
        : 'No se pudo consultar el comprobante en el servidor.'
  } finally {
    cargandoComprobante.value = false
  }
}

const cerrarModal = () => {
  if (guardando.value) return
  modoModal.value = null
  comprobanteActual.value = null
  errorModal.value = null
  errorComprobante.value = null
}

const guardarPago = async () => {
  const idTratamiento = form.value.id_tratamiento_paciente.trim()
  const monto = Number(form.value.monto)

  if (!idTratamiento) {
    errorModal.value = 'Debes seleccionar un tratamiento registrado para asociar el pago.'
    return
  }

  if (Number.isNaN(monto) || monto <= 0) {
    errorModal.value = 'El monto del pago debe ser mayor a cero.'
    return
  }

  guardando.value = true
  errorModal.value = null
  exitoAccion.value = null

  try {
    const creado = await pagosService.create({
      id_tratamiento_paciente: idTratamiento,
      monto,
      metodo_pago: form.value.metodo_pago,
    })

    todosPagosParaSaldo.value = [creado, ...todosPagosParaSaldo.value]
    if (
      filtroTratamientoId.value === 'TODOS' ||
      filtroTratamientoId.value === creado.id_tratamiento_paciente
    ) {
      pagos.value.unshift(creado)
    }

    exitoAccion.value = `Pago registrado correctamente. Comprobante #${creado.pago_id.slice(0, 8).toUpperCase()}`
    guardando.value = false
    cerrarModal()
  } catch (err) {
    errorModal.value =
      err instanceof Error ? err.message : 'Ocurrió un error al registrar el pago en el servidor.'
  } finally {
    guardando.value = false
  }
}

onMounted(async () => {
  await cargarDatos()

  const dniQuery = route.query.dni ? String(route.query.dni) : undefined
  const tratIdQuery = route.query.tratamientoId
    ? String(route.query.tratamientoId)
    : undefined

  if ((dniQuery || tratIdQuery) && !errorCarga.value) {
    if (esAdmin.value) {
      abrirModalRegistro({ dni: dniQuery, tratamientoId: tratIdQuery })
    } else if (dniQuery) {
      busqueda.value = dniQuery
    }
  }
})

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

const formatFechaHora = (f: string): string => {
  if (!f) return '—'
  const parsed = new Date(f)
  if (!Number.isNaN(parsed.getTime())) {
    return new Intl.DateTimeFormat('es-PE', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(parsed)
  }
  return formatFecha(f)
}
</script>

<template>
  <DashboardLayout>
    <div class="pagos-view">

      <!-- ── Cabecera ─────────────────────────────────────────── -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Registro de Pagos y Comprobantes</h2>
          <p class="view-desc">Historial de transacciones, cobros asociados a tratamientos y consulta de comprobantes.</p>
        </div>
        <div class="header-actions">
          <button class="btn-secundario" type="button" :disabled="cargando" @click="cargarDatos">
            {{ cargando ? 'Actualizando...' : '↻ Actualizar' }}
          </button>
          <button
            v-if="esAdmin"
            class="btn-nuevo"
            type="button"
            :disabled="cargando"
            @click="() => abrirModalRegistro()"
          >
            + Registrar Pago
          </button>
        </div>
      </div>

      <!-- Aviso de permisos si accede un perfil odontólogo (backend exige SYSTEM_ADMIN para POST /pagos) -->
      <div v-if="!esAdmin" class="alert-info" role="status">
        <span>ℹ️ Solo el perfil Administrador puede registrar nuevos pagos. Puedes consultar historial y comprobantes.</span>
      </div>

      <!-- Banner de éxito o error de acción -->
      <div v-if="exitoAccion" class="alert-success" role="status">
        <span>✅ {{ exitoAccion }}</span>
        <button type="button" class="alert-close" @click="exitoAccion = null">✕</button>
      </div>

      <div v-if="errorAccion" class="alert-banner" role="alert">
        <span>⚠️ {{ errorAccion }}</span>
        <button type="button" class="alert-close" @click="errorAccion = null">✕</button>
      </div>

      <!-- ── Tarjetas de Estadísticas Reactivas ───────────────── -->
      <div class="stats-row">
        <div class="stat-mini-card">
          <span class="stat-label">Ingresos Recaudados</span>
          <span class="stat-val text-emerald">{{ totalRecaudado }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Comprobantes Emitidos</span>
          <span class="stat-val">{{ totalTransacciones }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Efectivo / Digital</span>
          <span class="stat-val text-purple">{{ totalEfectivo }} / {{ totalDigital }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Método Más Usado</span>
          <span class="stat-val">{{ metodoMasUsado }}</span>
        </div>
      </div>

      <!-- Estado de carga inicial -->
      <div v-if="cargando && pagos.length === 0" class="estado-carga" role="status">
        <div class="spinner"></div>
        <p class="vacio-titulo">Cargando comprobantes de pago...</p>
      </div>

      <!-- Estado de error de carga -->
      <div v-else-if="errorCarga && pagos.length === 0" class="estado-error" role="alert">
        <p class="vacio-titulo">No se pudieron cargar los pagos</p>
        <p class="vacio-desc">{{ errorCarga }}</p>
        <button type="button" class="btn-primario" @click="cargarDatos">
          Reintentar carga
        </button>
      </div>

      <!-- ── Tabla de Pagos ───────────────────────────────────── -->
      <div v-else class="table-card">
        <div class="filter-bar">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por ID de comprobante, DNI, paciente o tratamiento..."
            class="search-input"
          />
          <select v-model="filtroMetodo" class="filter-select">
            <option value="TODOS">Todos los métodos</option>
            <option value="efectivo">Efectivo</option>
            <option value="digital">Digital</option>
          </select>
          <select
            v-model="filtroTratamientoId"
            class="filter-select"
            :disabled="cargando"
            @change="filtrarPorTratamiento"
          >
            <option value="TODOS">Todos los tratamientos</option>
            <option
              v-for="trat in tratamientos"
              :key="trat.tratamiento_paciente_id"
              :value="trat.tratamiento_paciente_id"
            >
              {{ trat.dni_paciente }} - {{ formatNombreTratamiento(trat.tratamiento) }}
            </option>
          </select>
          <span class="resultado-count">{{ pagosFiltrados.length }} comprobante(s)</span>
        </div>

        <div v-if="pagosFiltrados.length === 0" class="estado-vacio">
          <span class="vacio-icono">💳</span>
          <p class="vacio-titulo">Sin pagos registrados</p>
          <p class="vacio-desc">
            {{
              busqueda || filtroMetodo !== 'TODOS' || filtroTratamientoId !== 'TODOS'
                ? 'No se encontraron comprobantes con el filtro aplicado.'
                : 'Registra el primer pago haciendo clic en "+ Registrar Pago".'
            }}
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>N° Comprobante</th>
                <th>DNI</th>
                <th>Paciente</th>
                <th>Tratamiento Asociado</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Fecha</th>
                <th class="text-right">Comprobante</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="pago in pagosFiltrados" :key="pago.pago_id" class="tabla-fila">
                <td class="font-mono" :title="pago.pago_id">
                  #{{ pago.pago_id.slice(0, 8).toUpperCase() }}
                </td>
                <td class="font-mono text-purple">
                  {{ obtenerInfoPago(pago).dniPaciente || '—' }}
                </td>
                <td class="font-semibold">{{ obtenerInfoPago(pago).nombrePaciente }}</td>
                <td>{{ obtenerInfoPago(pago).nombreTratamiento }}</td>
                <td class="font-bold text-emerald">{{ formatPrecio(Number(pago.monto)) }}</td>
                <td>
                  <span
                    class="badge-method"
                    :class="pago.metodo_pago === 'digital' ? 'digital' : 'efectivo'"
                  >
                    {{ pago.metodo_pago === 'digital' ? 'Digital' : 'Efectivo' }}
                  </span>
                </td>
                <td>{{ formatFecha(pago.fecha_registro) }}</td>
                <td class="td-acciones">
                  <button
                    class="btn-action view"
                    title="Consultar comprobante"
                    type="button"
                    @click="verComprobante(pago)"
                  >
                    🧾 Ver
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ── Modal para Registrar Pago / Consultar Comprobante ──── -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">

        <!-- Modo COMPROBANTE (GET /api/pagos/{pago_id}) -->
        <template v-if="modoModal === 'comprobante' && comprobanteActual">
          <div class="modal-header">
            <h3>Detalle del Comprobante</h3>
            <button class="modal-close" type="button" @click="cerrarModal">✕</button>
          </div>

          <div class="comprobante-body">
            <div v-if="errorComprobante" class="modal-alerta-error" role="alert">
              {{ errorComprobante }}
            </div>

            <div v-if="cargandoComprobante" class="comprobante-loading">
              Consultando comprobante en el servidor...
            </div>

            <div class="comprobante-card">
              <div class="comprobante-row">
                <span class="detalle-label">ID Comprobante</span>
                <span class="font-mono">{{ comprobanteActual.pago_id }}</span>
              </div>
              <div class="comprobante-row">
                <span class="detalle-label">Fecha de Emisión</span>
                <span>{{ formatFechaHora(comprobanteActual.fecha_registro) }}</span>
              </div>
              <div class="comprobante-row">
                <span class="detalle-label">Paciente</span>
                <span class="font-semibold">
                  {{ obtenerInfoPago(comprobanteActual).nombrePaciente }}
                  <template v-if="obtenerInfoPago(comprobanteActual).dniPaciente">
                    (DNI: {{ obtenerInfoPago(comprobanteActual).dniPaciente }})
                  </template>
                </span>
              </div>
              <div class="comprobante-row">
                <span class="detalle-label">Tratamiento</span>
                <span>{{ obtenerInfoPago(comprobanteActual).nombreTratamiento }}</span>
              </div>
              <div class="comprobante-row">
                <span class="detalle-label">Odontólogo Tratante</span>
                <span>{{ obtenerInfoPago(comprobanteActual).nombreOdontologo }}</span>
              </div>
              <div class="comprobante-row">
                <span class="detalle-label">Método de Pago</span>
                <span class="badge-method">
                  {{ METODO_LABELS[comprobanteActual.metodo_pago] || comprobanteActual.metodo_pago }}
                </span>
              </div>
              <div class="comprobante-total">
                <span>Monto Abonado</span>
                <span class="text-emerald">{{ formatPrecio(Number(comprobanteActual.monto)) }}</span>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-primario" @click="cerrarModal">Cerrar</button>
          </div>
        </template>

        <!-- Modo REGISTRAR PAGO (POST /api/pagos) -->
        <template v-else-if="modoModal === 'crear'">
          <div class="modal-header">
            <h3>Registrar Nuevo Pago</h3>
            <button class="modal-close" type="button" :disabled="guardando" @click="cerrarModal">
              ✕
            </button>
          </div>

          <form @submit.prevent="guardarPago" class="form-grid">
            <div v-if="errorModal" class="modal-alerta-error form-full" role="alert">
              {{ errorModal }}
            </div>

            <div class="form-group form-full">
              <label>Filtrar por Paciente (opcional)</label>
              <select
                v-model="dniPacienteFiltro"
                class="form-select"
                @change="alCambiarPacienteModal"
              >
                <option value="">Todos los pacientes con tratamientos</option>
                <option v-for="pac in pacientes" :key="pac.dni" :value="pac.dni">
                  {{ pac.dni }} - {{ pac.nombres }} {{ pac.apellidos }}
                </option>
              </select>
            </div>

            <div v-if="tratamientosDisponiblesModal.length === 0" class="aviso-sin-tratamiento form-full">
              <p>
                No hay planes de tratamiento disponibles
                <template v-if="dniPacienteFiltro">para el DNI {{ dniPacienteFiltro }}</template>.
                Para registrar un cobro debes vincularlo a un tratamiento existente.
              </p>
              <div class="aviso-acciones">
                <button
                  v-if="dniPacienteFiltro"
                  type="button"
                  class="btn-secundario"
                  @click="() => { dniPacienteFiltro = ''; alCambiarPacienteModal() }"
                >
                  Ver todos los tratamientos
                </button>
                <RouterLink to="/tratamientos" class="btn-primario link-btn">
                  Ir a Tratamientos
                </RouterLink>
              </div>
            </div>

            <template v-else>
              <div class="form-group form-full">
                <label>Tratamiento del Paciente *</label>
                <select
                  v-model="form.id_tratamiento_paciente"
                  required
                  class="form-select"
                  @change="aplicarSaldoSugerido"
                >
                  <option value="" disabled>Seleccione un tratamiento</option>
                  <option
                    v-for="trat in tratamientosDisponiblesModal"
                    :key="trat.tratamiento_paciente_id"
                    :value="trat.tratamiento_paciente_id"
                  >
                    {{ trat.dni_paciente }} - {{ formatNombreTratamiento(trat.tratamiento) }}
                    ({{ formatPrecio(Number(trat.precio)) }} · {{ trat.estado }})
                  </option>
                </select>
              </div>

              <div v-if="resumenSaldoTratamiento" class="resumen-saldo form-full">
                <div>
                  <span class="detalle-label">Costo del Plan</span>
                  <strong>{{ formatPrecio(resumenSaldoTratamiento.total) }}</strong>
                </div>
                <div>
                  <span class="detalle-label">Total Abonado</span>
                  <strong>{{ formatPrecio(resumenSaldoTratamiento.pagado) }}</strong>
                </div>
                <div>
                  <span class="detalle-label">Saldo Pendiente</span>
                  <strong class="text-emerald">
                    {{ formatPrecio(resumenSaldoTratamiento.pendiente) }}
                  </strong>
                </div>
              </div>

              <div class="form-group">
                <label>Monto a Pagar (S/) *</label>
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
                <select v-model="form.metodo_pago" required class="form-select">
                  <option value="efectivo">Efectivo</option>
                  <option value="digital">Digital (Yape / Plin / Tarjeta)</option>
                </select>
              </div>
            </template>

            <div class="modal-footer form-full">
              <button
                type="button"
                class="btn-secundario"
                :disabled="guardando"
                @click="cerrarModal"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="btn-primario"
                :disabled="guardando || !form.id_tratamiento_paciente"
              >
                {{ guardando ? 'Registrando pago...' : 'Registrar Pago' }}
              </button>
            </div>
          </form>
        </template>

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
.btn-nuevo:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.alert-info,
.alert-success,
.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.alert-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
}

.alert-success {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #15803d;
}

.alert-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
}

.alert-close {
  background: transparent;
  border: none;
  color: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.2rem 0.45rem;
  border-radius: 6px;
}

.estado-carga,
.estado-error {
  text-align: center;
  padding: 3.5rem 2rem;
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 16px;
}

.estado-error {
  border-color: #fecaca;
  color: #b91c1c;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #00b4d8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.9rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.filter-select {
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.88rem;
  color: var(--text-main, #1e293b);
  background: transparent;
  outline: none;
  max-width: 280px;
}

.modal-alerta-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
}

.comprobante-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.comprobante-loading {
  font-size: 0.86rem;
  color: #0369a1;
  font-weight: 600;
}

.comprobante-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.comprobante-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  font-size: 0.9rem;
}

.detalle-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.comprobante-total {
  margin-top: 0.35rem;
  padding-top: 0.75rem;
  border-top: 1px dashed #cbd5e1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.05rem;
  font-weight: 800;
}

.aviso-sin-tratamiento {
  background: #fffbeb;
  border: 1px solid #fde68a;
  color: #92400e;
  border-radius: 12px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  font-size: 0.9rem;
}

.aviso-sin-tratamiento p {
  margin: 0;
}

.aviso-acciones {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.link-btn {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
}

.resumen-saldo {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.resumen-saldo > div {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
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

.badge-method.efectivo { background: #dcfce7; color: #15803d; }
.badge-method.digital  { background: #e0f2fe; color: #0369a1; }

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
.btn-action.view   { background: #dbeafe; }
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
.btn-primario:disabled,
.btn-secundario:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }

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
:global(html.dark) .filter-select     { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .filter-select option { background: #131b2e; color: #f8fafc; }
:global(html.dark) .estado-carga,
:global(html.dark) .estado-error      { background: #131b2e; border-color: #334155; color: #f8fafc; }
:global(html.dark) .estado-error      { border-color: #7f1d1d; color: #fca5a5; }
:global(html.dark) .spinner           { border-color: #334155; border-top-color: #38bdf8; }
:global(html.dark) .alert-info        { background: rgba(3, 105, 161, 0.25); border-color: #0369a1; color: #bae6fd; }
:global(html.dark) .alert-success     { background: rgba(21, 128, 61, 0.25); border-color: #15803d; color: #bbf7d0; }
:global(html.dark) .alert-banner,
:global(html.dark) .modal-alerta-error{ background: rgba(127, 29, 29, 0.35); border-color: #7f1d1d; color: #fca5a5; }
:global(html.dark) .comprobante-card,
:global(html.dark) .resumen-saldo     { background: #0f172a; border-color: #334155; }
:global(html.dark) .btn-action.view   { background: rgba(59, 130, 246, 0.2); }

@media (max-width: 600px) {
  .form-grid   { grid-template-columns: 1fr; }
  .form-full   { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
