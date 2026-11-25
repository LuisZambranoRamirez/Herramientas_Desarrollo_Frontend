<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { useAuthStore } from '@/stores/auth.store'
import { tratamientosService } from '@/services/tratamientos.service'
import { pacientesService } from '@/services/pacientes.service'
import { citasService } from '@/services/citas.service'
import type {
  TratamientoPaciente,
  AgendaTratamiento,
  EstadoTratamiento,
  TratamientoOdontologico,
  DiaSemana,
  CitaOdontologoResumen,
  Paciente,
} from '@/types'

interface PacienteOption {
  dni: string
  nombreCompleto: string
}

interface FormTratamiento {
  dni_paciente: string
  dni_odontologo: string
  tratamiento: TratamientoOdontologico
  precio: number
  estado: EstadoTratamiento
  observaciones: string
}

interface FormAgenda {
  dia_semana: DiaSemana
  hora_inicio: string
  hora_fin: string
}

const router = useRouter()
const authStore = useAuthStore()

const TRATAMIENTOS_META: Record<
  TratamientoOdontologico,
  { label: string; categoria: string; precioRef: number }
> = {
  Limpieza_dental_profunda: {
    label: 'Limpieza dental profunda',
    categoria: 'Diagnóstico y Prevención',
    precioRef: 120,
  },
  Aplicacion_de_fluor: {
    label: 'Aplicación de flúor',
    categoria: 'Diagnóstico y Prevención',
    precioRef: 60,
  },
  Selladores_de_fosas_y_fisuras: {
    label: 'Selladores de fosas y fisuras',
    categoria: 'Diagnóstico y Prevención',
    precioRef: 50,
  },
  Restauracion_con_resina: {
    label: 'Restauración con resina',
    categoria: 'Odontología Restauradora',
    precioRef: 150,
  },
  Ortopedia_maxilar: {
    label: 'Ortopedia maxilar',
    categoria: 'Ortodoncia y Ortopedia',
    precioRef: 1200,
  },
  Implante_dental: {
    label: 'Implante dental',
    categoria: 'Implantología',
    precioRef: 2500,
  },
}

const TIPOS_TRATAMIENTO = Object.keys(TRATAMIENTOS_META) as TratamientoOdontologico[]

const ESTADO_META: Record<EstadoTratamiento, { label: string; clase: string }> = {
  INICIADO: { label: 'Iniciado', clase: 'estado-iniciado' },
  EN_PROCESO: { label: 'En Proceso', clase: 'estado-proceso' },
  PENDIENTE: { label: 'Pendiente', clase: 'estado-pendiente' },
  FINALIZADO: { label: 'Finalizado', clase: 'estado-finalizado' },
}

const ESTADOS_OPCIONES: EstadoTratamiento[] = [
  'INICIADO',
  'EN_PROCESO',
  'PENDIENTE',
  'FINALIZADO',
]

const DIAS_SEMANA: DiaSemana[] = [
  'LUNES',
  'MARTES',
  'MIERCOLES',
  'JUEVES',
  'VIERNES',
  'SABADO',
  'DOMINGO',
]

// Estado reactivo conectado al backend
const tratamientos = ref<TratamientoPaciente[]>([])
const opcionesPacientes = ref<PacienteOption[]>([])
const opcionesOdontologos = ref<CitaOdontologoResumen[]>([])

const cargando = ref(false)
const guardando = ref(false)
const cargandoDetalle = ref(false)
const guardandoAgenda = ref(false)

const errorCarga = ref<string | null>(null)
const errorAccion = ref<string | null>(null)
const errorModal = ref<string | null>(null)
const errorAgenda = ref<string | null>(null)

const busqueda = ref('')
const filtroEstado = ref<EstadoTratamiento | 'TODOS'>('TODOS')

const puedeGestionar = computed(
  () => authStore.userRole === 'SYSTEM_ADMIN' || authStore.userRole === 'ODONTOLOGO',
)
const esAdmin = computed(() => authStore.userRole === 'SYSTEM_ADMIN')

const cargarDatos = async () => {
  cargando.value = true
  errorCarga.value = null
  try {
    const [tratData, odonData, pacData] = await Promise.all([
      tratamientosService.getAll(),
      citasService.getOdontologos().catch(() => [] as CitaOdontologoResumen[]),
      pacientesService.getAll().catch(() => [] as Paciente[]),
    ])

    tratamientos.value = tratData
    opcionesOdontologos.value = odonData
    opcionesPacientes.value = pacData.map((p) => ({
      dni: p.dni,
      nombreCompleto: `${p.nombres} ${p.apellidos}`.trim(),
    }))
  } catch (err) {
    errorCarga.value =
      err instanceof Error
        ? err.message
        : 'No se pudieron cargar los tratamientos desde el servidor.'
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)

const obtenerLabelTratamiento = (tipo: TratamientoOdontologico | string): string => {
  const meta = TRATAMIENTOS_META[tipo as TratamientoOdontologico]
  return meta ? meta.label : String(tipo).replace(/_/g, ' ')
}

const obtenerCategoriaTratamiento = (tipo: TratamientoOdontologico | string): string => {
  const meta = TRATAMIENTOS_META[tipo as TratamientoOdontologico]
  return meta ? meta.categoria : 'Odontología Clínica'
}

const obtenerNombrePaciente = (dni: string): string => {
  const enc = opcionesPacientes.value.find((p) => p.dni === dni)
  return enc ? enc.nombreCompleto : `Paciente (${dni})`
}

const obtenerNombreOdontologo = (dni: string): string => {
  const enc = opcionesOdontologos.value.find((doc) => doc.dni === dni)
  return enc ? `Dr(a). ${enc.nombres} ${enc.apellidos}`.trim() : `Dr(a). (${dni})`
}

// Métricas reactivas por estado
const totalPorEstado = computed(() => ({
  total: tratamientos.value.length,
  INICIADO: tratamientos.value.filter((t) => t.estado === 'INICIADO').length,
  EN_PROCESO: tratamientos.value.filter((t) => t.estado === 'EN_PROCESO').length,
  PENDIENTE: tratamientos.value.filter((t) => t.estado === 'PENDIENTE').length,
  FINALIZADO: tratamientos.value.filter((t) => t.estado === 'FINALIZADO').length,
}))

const tratamientosFiltrados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()

  return tratamientos.value.filter((t) => {
    if (filtroEstado.value !== 'TODOS' && t.estado !== filtroEstado.value) {
      return false
    }

    if (!q) return true

    const nombrePac = obtenerNombrePaciente(t.dni_paciente).toLowerCase()
    const nombreDoc = obtenerNombreOdontologo(t.dni_odontologo).toLowerCase()
    const nombreTrat = obtenerLabelTratamiento(t.tratamiento).toLowerCase()
    const categoria = obtenerCategoriaTratamiento(t.tratamiento).toLowerCase()

    return (
      t.dni_paciente.toLowerCase().includes(q) ||
      nombrePac.includes(q) ||
      t.dni_odontologo.toLowerCase().includes(q) ||
      nombreDoc.includes(q) ||
      nombreTrat.includes(q) ||
      categoria.includes(q) ||
      (t.observaciones && t.observaciones.toLowerCase().includes(q)) ||
      t.tratamiento_paciente_id.toLowerCase().includes(q)
    )
  })
})

// Control de modales (crear | editar | ver | null)
type ModoModal = 'crear' | 'editar' | 'ver' | null
const modoModal = ref<ModoModal>(null)
const idSeleccionado = ref<string | null>(null)
const tratamientoActivo = ref<TratamientoPaciente | null>(null)
const agendaSesiones = ref<AgendaTratamiento[]>([])

const formVacio = (): FormTratamiento => ({
  dni_paciente: opcionesPacientes.value[0]?.dni || '',
  dni_odontologo: opcionesOdontologos.value[0]?.dni || '',
  tratamiento: 'Limpieza_dental_profunda',
  precio: TRATAMIENTOS_META.Limpieza_dental_profunda.precioRef,
  estado: 'INICIADO',
  observaciones: '',
})

const form = ref<FormTratamiento>(formVacio())

const agendaVacia = (): FormAgenda => ({
  dia_semana: 'LUNES',
  hora_inicio: '09:00',
  hora_fin: '10:00',
})

const agendaForm = ref<FormAgenda>(agendaVacia())

const pacientesSelect = computed<PacienteOption[]>(() => {
  const lista = [...opcionesPacientes.value]
  if (
    tratamientoActivo.value &&
    !lista.some((p) => p.dni === tratamientoActivo.value!.dni_paciente)
  ) {
    lista.unshift({
      dni: tratamientoActivo.value.dni_paciente,
      nombreCompleto: obtenerNombrePaciente(tratamientoActivo.value.dni_paciente),
    })
  }
  return lista
})

const odontologosSelect = computed<CitaOdontologoResumen[]>(() => {
  const lista = [...opcionesOdontologos.value]
  if (
    tratamientoActivo.value &&
    !lista.some((o) => o.dni === tratamientoActivo.value!.dni_odontologo)
  ) {
    lista.unshift({
      dni: tratamientoActivo.value.dni_odontologo,
      nombres: 'Odontólogo',
      apellidos: `(${tratamientoActivo.value.dni_odontologo})`,
      especialidad: '',
      colegiatura: '',
    })
  }
  return lista
})

const alCambiarTipoTratamiento = () => {
  if (modoModal.value === 'crear') {
    const meta = TRATAMIENTOS_META[form.value.tratamiento]
    if (meta) {
      form.value.precio = meta.precioRef
    }
  }
}

const abrirCrear = () => {
  errorModal.value = null
  errorAccion.value = null
  idSeleccionado.value = null
  tratamientoActivo.value = null
  form.value = formVacio()
  modoModal.value = 'crear'
}

const abrirEditar = (item: TratamientoPaciente) => {
  errorModal.value = null
  errorAccion.value = null
  idSeleccionado.value = item.tratamiento_paciente_id
  tratamientoActivo.value = item
  form.value = {
    dni_paciente: item.dni_paciente,
    dni_odontologo: item.dni_odontologo,
    tratamiento: item.tratamiento,
    precio: Number(item.precio),
    estado: item.estado,
    observaciones: item.observaciones || '',
  }
  modoModal.value = 'editar'
}

const abrirVer = async (item: TratamientoPaciente) => {
  errorModal.value = null
  errorAgenda.value = null
  idSeleccionado.value = item.tratamiento_paciente_id
  tratamientoActivo.value = item
  agendaSesiones.value = []
  agendaForm.value = agendaVacia()
  modoModal.value = 'ver'

  cargandoDetalle.value = true
  try {
    const [detalle, sesiones] = await Promise.all([
      tratamientosService.getById(item.tratamiento_paciente_id),
      tratamientosService.getAgenda(item.tratamiento_paciente_id),
    ])
    if (detalle) {
      tratamientoActivo.value = detalle
    }
    agendaSesiones.value = sesiones
  } catch (err) {
    errorAgenda.value =
      err instanceof Error
        ? err.message
        : 'No se pudo cargar el detalle o las sesiones del tratamiento.'
  } finally {
    cargandoDetalle.value = false
  }
}

const cerrarModal = () => {
  if (guardando.value || guardandoAgenda.value) return
  modoModal.value = null
  idSeleccionado.value = null
  tratamientoActivo.value = null
  errorModal.value = null
  errorAgenda.value = null
}

const guardar = async () => {
  const dniPaciente = form.value.dni_paciente.trim()
  const dniOdontologo = form.value.dni_odontologo.trim()
  const observaciones = form.value.observaciones.trim()
  const precio = Number(form.value.precio)

  if (modoModal.value === 'crear') {
    if (!/^\d{8}$/.test(dniPaciente)) {
      errorModal.value = 'El DNI del paciente debe contener exactamente 8 dígitos numéricos.'
      return
    }
    if (!/^\d{8}$/.test(dniOdontologo)) {
      errorModal.value = 'El DNI del odontólogo debe contener exactamente 8 dígitos numéricos.'
      return
    }
  }

  if (!observaciones) {
    errorModal.value = 'Ingresa las observaciones o notas clínicas del tratamiento.'
    return
  }

  if (Number.isNaN(precio) || precio <= 0) {
    errorModal.value = 'El precio del tratamiento debe ser mayor a cero.'
    return
  }

  guardando.value = true
  errorModal.value = null

  try {
    if (modoModal.value === 'crear') {
      const creado = await tratamientosService.create({
        dni_paciente: dniPaciente,
        dni_odontologo: dniOdontologo,
        tratamiento: form.value.tratamiento,
        precio,
        observaciones,
        estado: form.value.estado,
      })
      tratamientos.value.unshift(creado)
    } else if (modoModal.value === 'editar' && idSeleccionado.value) {
      const actualizado = await tratamientosService.update(idSeleccionado.value, {
        tratamiento: form.value.tratamiento,
        precio,
        estado: form.value.estado,
        observaciones,
      })
      const idx = tratamientos.value.findIndex(
        (t) => t.tratamiento_paciente_id === idSeleccionado.value,
      )
      if (idx !== -1) {
        tratamientos.value[idx] = actualizado
      }
    }

    guardando.value = false
    cerrarModal()
  } catch (err) {
    errorModal.value =
      err instanceof Error ? err.message : 'Ocurrió un error al guardar el tratamiento.'
  } finally {
    guardando.value = false
  }
}

const agregarSesionAgenda = async () => {
  if (!tratamientoActivo.value) return
  if (agendaForm.value.hora_fin <= agendaForm.value.hora_inicio) {
    errorAgenda.value = 'La hora de fin debe ser posterior a la hora de inicio.'
    return
  }

  guardandoAgenda.value = true
  errorAgenda.value = null
  try {
    const nueva = await tratamientosService.createAgenda({
      id_tratamiento_paciente: tratamientoActivo.value.tratamiento_paciente_id,
      dia_semana: agendaForm.value.dia_semana,
      hora_inicio: `${agendaForm.value.hora_inicio}:00`,
      hora_fin: `${agendaForm.value.hora_fin}:00`,
    })
    agendaSesiones.value.push(nueva)
  } catch (err) {
    errorAgenda.value =
      err instanceof Error ? err.message : 'No se pudo registrar la sesión del tratamiento.'
  } finally {
    guardandoAgenda.value = false
  }
}

const irAPagarTratamiento = (item: TratamientoPaciente) => {
  router.push({
    path: '/pagos',
    query: {
      dni: item.dni_paciente,
      tratamientoId: item.tratamiento_paciente_id,
    },
  })
}

const formatPrecio = (val: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val)

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
    <div class="tratamientos-view">

      <!-- ── Cabecera ─────────────────────────────────────────── -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Planes y Tratamientos Odontológicos</h2>
          <p class="view-desc">
            Gestiona los tratamientos clínicos asignados a pacientes, seguimiento de estado y agenda de sesiones.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-secundario" type="button" :disabled="cargando" @click="cargarDatos">
            {{ cargando ? 'Actualizando...' : '↻ Actualizar' }}
          </button>
          <button
            v-if="puedeGestionar"
            class="btn-nuevo"
            type="button"
            :disabled="cargando"
            @click="abrirCrear"
          >
            + Nuevo Tratamiento
          </button>
        </div>
      </div>

      <!-- Banner de error de acción -->
      <div v-if="errorAccion" class="alert-banner" role="alert">
        <span>⚠️ {{ errorAccion }}</span>
        <button type="button" class="alert-close" @click="errorAccion = null">✕</button>
      </div>

      <!-- KPIs por estado -->
      <div class="stats-row">
        <div class="stat-mini-card">
          <span class="stat-label">Total Planes</span>
          <span class="stat-val">{{ totalPorEstado.total }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Iniciados</span>
          <span class="stat-val text-indigo">{{ totalPorEstado.INICIADO }}</span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">En Proceso / Pendientes</span>
          <span class="stat-val text-amber">
            {{ totalPorEstado.EN_PROCESO + totalPorEstado.PENDIENTE }}
          </span>
        </div>
        <div class="stat-mini-card">
          <span class="stat-label">Finalizados</span>
          <span class="stat-val text-emerald">{{ totalPorEstado.FINALIZADO }}</span>
        </div>
      </div>

      <!-- Estado de carga inicial -->
      <div v-if="cargando && tratamientos.length === 0" class="estado-carga" role="status">
        <div class="spinner"></div>
        <p class="vacio-titulo">Cargando tratamientos desde el servidor...</p>
      </div>

      <!-- Estado de error de carga -->
      <div v-else-if="errorCarga && tratamientos.length === 0" class="estado-error" role="alert">
        <p class="vacio-titulo">No se pudieron cargar los tratamientos</p>
        <p class="vacio-desc">{{ errorCarga }}</p>
        <button type="button" class="btn-primario" @click="cargarDatos">
          Reintentar carga
        </button>
      </div>

      <!-- ── Card principal con tabla ──────────────────────────── -->
      <div v-else class="table-card">
        <div class="filter-bar">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por DNI, paciente, odontólogo, tratamiento u observaciones..."
            class="search-input"
          />
          <select v-model="filtroEstado" class="estado-filter">
            <option value="TODOS">Todos los estados</option>
            <option value="INICIADO">Iniciado</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="FINALIZADO">Finalizado</option>
          </select>
          <span class="resultado-count">{{ tratamientosFiltrados.length }} tratamiento(s)</span>
        </div>

        <div v-if="tratamientosFiltrados.length === 0" class="estado-vacio">
          <span class="vacio-icono">🦷</span>
          <p class="vacio-titulo">Sin tratamientos encontrados</p>
          <p class="vacio-desc">
            {{
              busqueda || filtroEstado !== 'TODOS'
                ? 'No se encontraron tratamientos con el filtro seleccionado.'
                : 'Aún no hay tratamientos registrados en el sistema. Haz clic en "+ Nuevo Tratamiento".'
            }}
          </p>
        </div>

        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Tratamiento</th>
                <th>Odontólogo</th>
                <th>Observaciones</th>
                <th>Precio</th>
                <th>Estado</th>
                <th>Registro</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tratamientosFiltrados"
                :key="item.tratamiento_paciente_id"
                class="tabla-fila"
              >
                <td>
                  <div class="cell-stacked">
                    <span class="font-semibold">{{ obtenerNombrePaciente(item.dni_paciente) }}</span>
                    <span class="font-mono text-secondary">DNI: {{ item.dni_paciente }}</span>
                  </div>
                </td>
                <td>
                  <div class="cell-stacked">
                    <span class="font-semibold">{{ obtenerLabelTratamiento(item.tratamiento) }}</span>
                    <span class="categoria-inline">
                      {{ obtenerCategoriaTratamiento(item.tratamiento) }}
                    </span>
                  </div>
                </td>
                <td>{{ obtenerNombreOdontologo(item.dni_odontologo) }}</td>
                <td class="text-secondary">{{ item.observaciones || '—' }}</td>
                <td class="font-semibold text-emerald">{{ formatPrecio(Number(item.precio)) }}</td>
                <td>
                  <span
                    class="badge-estado"
                    :class="ESTADO_META[item.estado]?.clase || 'estado-iniciado'"
                  >
                    {{ ESTADO_META[item.estado]?.label || item.estado }}
                  </span>
                </td>
                <td class="font-mono">{{ formatFecha(item.fecha_registro) }}</td>
                <td class="td-acciones">
                  <button
                    class="btn-action view"
                    title="Ver detalle y sesiones"
                    type="button"
                    @click="abrirVer(item)"
                  >
                    👁
                  </button>
                  <button
                    v-if="puedeGestionar"
                    class="btn-action edit"
                    title="Editar tratamiento"
                    type="button"
                    @click="abrirEditar(item)"
                  >
                    ✏️
                  </button>
                  <button
                    v-if="esAdmin"
                    class="btn-action pay"
                    title="Registrar pago de este tratamiento"
                    type="button"
                    @click="irAPagarTratamiento(item)"
                  >
                    💳
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Ver / Crear / Editar -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">

        <!-- Modo VER + Agenda de Sesiones -->
        <template v-if="modoModal === 'ver' && tratamientoActivo">
          <div class="modal-header">
            <h3>Detalle del Tratamiento</h3>
            <button class="modal-close" type="button" @click="cerrarModal">✕</button>
          </div>

          <div class="detalle-grid">
            <div class="detalle-item detalle-full">
              <span class="detalle-label">Categoría Clínica</span>
              <span class="categoria-badge-modal">
                {{ obtenerCategoriaTratamiento(tratamientoActivo.tratamiento) }}
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Tratamiento</span>
              <span class="font-semibold text-lg">
                {{ obtenerLabelTratamiento(tratamientoActivo.tratamiento) }}
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Estado Actual</span>
              <span
                class="badge-estado"
                :class="ESTADO_META[tratamientoActivo.estado]?.clase || 'estado-iniciado'"
              >
                {{ ESTADO_META[tratamientoActivo.estado]?.label || tratamientoActivo.estado }}
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Paciente</span>
              <span>
                {{ obtenerNombrePaciente(tratamientoActivo.dni_paciente) }}
                ({{ tratamientoActivo.dni_paciente }})
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Odontólogo Asignado</span>
              <span>
                {{ obtenerNombreOdontologo(tratamientoActivo.dni_odontologo) }}
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Precio Acordado</span>
              <span class="text-emerald font-semibold text-lg">
                {{ formatPrecio(Number(tratamientoActivo.precio)) }}
              </span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Fecha de Registro</span>
              <span>{{ formatFecha(tratamientoActivo.fecha_registro) }}</span>
            </div>
            <div class="detalle-item detalle-full">
              <span class="detalle-label">Observaciones Clínicas</span>
              <span>{{ tratamientoActivo.observaciones || 'Sin observaciones' }}</span>
            </div>
          </div>

          <!-- Sesiones / Agenda del tratamiento -->
          <div class="agenda-panel">
            <h4 class="agenda-titulo">📅 Sesiones Agendadas del Tratamiento</h4>

            <div v-if="errorAgenda" class="modal-alerta-error" role="alert">
              {{ errorAgenda }}
            </div>

            <p v-if="cargandoDetalle" class="text-secondary">Cargando sesiones...</p>

            <ul v-else-if="agendaSesiones.length > 0" class="agenda-lista">
              <li
                v-for="sesion in agendaSesiones"
                :key="sesion.agenda_tratamientos_id"
                class="agenda-item"
              >
                <span class="font-semibold">{{ sesion.dia_semana }}</span>
                <span class="font-mono">
                  {{ sesion.hora_inicio.slice(0, 5) }} - {{ sesion.hora_fin.slice(0, 5) }}
                </span>
              </li>
            </ul>
            <p v-else class="text-secondary">No hay sesiones semanales registradas aún.</p>

            <form
              v-if="puedeGestionar"
              class="agenda-form"
              @submit.prevent="agregarSesionAgenda"
            >
              <select v-model="agendaForm.dia_semana" class="form-select">
                <option v-for="dia in DIAS_SEMANA" :key="dia" :value="dia">
                  {{ dia }}
                </option>
              </select>
              <input v-model="agendaForm.hora_inicio" type="time" required class="form-time" />
              <input v-model="agendaForm.hora_fin" type="time" required class="form-time" />
              <button type="submit" class="btn-primario" :disabled="guardandoAgenda">
                {{ guardandoAgenda ? 'Agregando...' : '+ Sesión' }}
              </button>
            </form>
          </div>

          <div class="modal-footer">
            <button class="btn-secundario" type="button" @click="cerrarModal">Cerrar</button>
            <button
              v-if="esAdmin"
              class="btn-secundario"
              type="button"
              @click="irAPagarTratamiento(tratamientoActivo)"
            >
              💳 Ir a Pagar
            </button>
            <button
              v-if="puedeGestionar"
              class="btn-primario"
              type="button"
              @click="abrirEditar(tratamientoActivo)"
            >
              ✏️ Editar
            </button>
          </div>
        </template>

        <!-- Modo CREAR / EDITAR -->
        <template v-else-if="modoModal === 'crear' || modoModal === 'editar'">
          <div class="modal-header">
            <h3>
              {{ modoModal === 'crear' ? 'Nuevo Plan de Tratamiento' : 'Editar Tratamiento' }}
            </h3>
            <button class="modal-close" type="button" :disabled="guardando" @click="cerrarModal">
              ✕
            </button>
          </div>

          <form @submit.prevent="guardar" class="form-grid">
            <div v-if="errorModal" class="modal-alerta-error form-full" role="alert">
              {{ errorModal }}
            </div>

            <div class="form-group">
              <label>Paciente *</label>
              <select
                v-if="pacientesSelect.length > 0"
                v-model="form.dni_paciente"
                required
                :disabled="modoModal === 'editar'"
                class="form-select"
              >
                <option value="" disabled>Seleccione un paciente</option>
                <option v-for="pac in pacientesSelect" :key="pac.dni" :value="pac.dni">
                  {{ pac.dni }} - {{ pac.nombreCompleto }}
                </option>
              </select>
              <input
                v-else
                v-model="form.dni_paciente"
                type="text"
                maxlength="8"
                required
                :disabled="modoModal === 'editar'"
                placeholder="DNI de 8 dígitos"
              />
            </div>

            <div class="form-group">
              <label>Odontólogo Tratante *</label>
              <select
                v-if="odontologosSelect.length > 0"
                v-model="form.dni_odontologo"
                required
                :disabled="modoModal === 'editar'"
                class="form-select"
              >
                <option value="" disabled>Seleccione un odontólogo</option>
                <option v-for="doc in odontologosSelect" :key="doc.dni" :value="doc.dni">
                  Dr(a). {{ doc.nombres }} {{ doc.apellidos }} ({{ doc.dni }})
                </option>
              </select>
              <input
                v-else
                v-model="form.dni_odontologo"
                type="text"
                maxlength="8"
                required
                :disabled="modoModal === 'editar'"
                placeholder="DNI de 8 dígitos"
              />
            </div>

            <div class="form-group form-full">
              <label>Procedimiento / Tipo de Tratamiento *</label>
              <select
                v-model="form.tratamiento"
                required
                class="form-select"
                @change="alCambiarTipoTratamiento"
              >
                <option v-for="tipo in TIPOS_TRATAMIENTO" :key="tipo" :value="tipo">
                  {{ TRATAMIENTOS_META[tipo].label }} ({{ TRATAMIENTOS_META[tipo].categoria }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label>Precio Acordado (S/) *</label>
              <input
                v-model.number="form.precio"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div class="form-group">
              <label>Estado del Tratamiento *</label>
              <select v-model="form.estado" required class="form-select">
                <option v-for="est in ESTADOS_OPCIONES" :key="est" :value="est">
                  {{ ESTADO_META[est].label }}
                </option>
              </select>
            </div>

            <div class="form-group form-full">
              <label>Observaciones Clínicas *</label>
              <textarea
                v-model="form.observaciones"
                rows="3"
                required
                placeholder="Detalle de piezas tratadas, indicaciones clínicas o plan por sesiones..."
              ></textarea>
            </div>

            <div class="modal-footer form-full">
              <button type="button" class="btn-secundario" :disabled="guardando" @click="cerrarModal">
                Cancelar
              </button>
              <button type="submit" class="btn-primario" :disabled="guardando">
                {{ guardando ? 'Guardando...' : (modoModal === 'crear' ? 'Registrar Tratamiento' : 'Actualizar Tratamiento') }}
              </button>
            </div>
          </form>
        </template>

      </div>
    </div>
  </DashboardLayout>
</template>

<style scoped>
.tratamientos-view {
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
  background: linear-gradient(135deg, #5046e5 0%, #4338ca 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem 1.4rem;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.92rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(80, 70, 229, 0.25);
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

.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.stat-mini-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
}

.stat-val {
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--text-main, #1e293b);
}

.text-indigo { color: #4f46e5; }
.text-amber { color: #d97706; }

.estado-filter {
  padding: 0.6rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  font-size: 0.88rem;
  color: var(--text-main, #1e293b);
  background: transparent;
  outline: none;
}

.cell-stacked {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.categoria-inline {
  font-size: 0.75rem;
  color: #4f46e5;
  font-weight: 600;
}

.badge-estado {
  display: inline-block;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  width: fit-content;
}

.estado-iniciado   { background: #e0e7ff; color: #3730a3; }
.estado-proceso    { background: #fef3c7; color: #b45309; }
.estado-pendiente  { background: #fee2e2; color: #b91c1c; }
.estado-finalizado { background: #dcfce7; color: #15803d; }

.alert-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.85rem 1.1rem;
  border-radius: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  font-size: 0.9rem;
  font-weight: 600;
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
  border-top-color: #5046e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 0.9rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.modal-alerta-error {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.7rem 0.9rem;
  border-radius: 10px;
  font-size: 0.86rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.agenda-panel {
  margin: 0 1.5rem 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.agenda-titulo {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-main, #1e293b);
}

.agenda-lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.agenda-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0.75rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 0.85rem;
}

.agenda-form {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  align-items: center;
}

.form-time {
  padding: 0.5rem 0.65rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--text-main, #1e293b);
  background: white;
}

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
  max-width: 380px;
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
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.1);
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
  padding: 0.9rem 1.25rem;
  border-bottom: 1px solid var(--border-light, #f1f5f9);
  color: var(--text-main, #334155);
  vertical-align: middle;
}

.categoria-header-row td {
  background: rgba(80, 70, 229, 0.05);
  border-bottom: 1px solid rgba(80, 70, 229, 0.15);
  padding: 0.6rem 1.25rem;
}

.categoria-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.categoria-badge {
  font-weight: 800;
  font-size: 0.85rem;
  color: #4338ca;
}

.categoria-count {
  font-size: 0.78rem;
  color: #6366f1;
  font-weight: 600;
}

.tabla-fila:hover {
  background: var(--bg-disabled, #fafbff);
}

.font-mono {
  font-family: monospace;
  font-size: 0.85rem;
  color: #64748b;
}

.font-semibold {
  font-weight: 600;
}

.text-secondary {
  color: #64748b;
  font-size: 0.85rem;
}

.text-emerald {
  color: #059669;
}

.text-right {
  text-align: right;
}

.text-lg {
  font-size: 1.1rem;
}

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
  font-size: 0.85rem;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-action:hover {
  opacity: 0.8;
  transform: translateY(-1px);
}

.btn-action.view { background: #dbeafe; }
.btn-action.edit { background: #fef9c3; }
.btn-action.pay { background: #dcfce7; }
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

.vacio-icono { font-size: 2.5rem; }
.vacio-titulo { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.vacio-desc { font-size: 0.875rem; color: #94a3b8; margin: 0; max-width: 340px; }

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
  max-width: 640px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.2s ease;
  border: 1px solid var(--border-light, transparent);
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
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

.detalle-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.detalle-item { display: flex; flex-direction: column; gap: 0.3rem; }
.detalle-full { grid-column: 1 / -1; }
.detalle-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.categoria-badge-modal {
  display: inline-block;
  background: #e0e7ff;
  color: #4338ca;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 700;
  font-size: 0.85rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.4rem; }
.form-full { grid-column: 1 / -1; }

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
  resize: vertical;
  background: transparent;
  width: 100%;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group textarea:focus,
.form-select:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.1);
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
  background: linear-gradient(135deg, #5046e5, #4338ca);
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
:global(html.dark) .view-title { color: #f8fafc; }
:global(html.dark) .table-card { background: var(--bg-card, #131b2e); border-color: #1e293b; }
:global(html.dark) .filter-bar { border-bottom-color: #1e293b; }
:global(html.dark) .search-input { color: #f8fafc; border-color: #334155; }
:global(html.dark) .search-input:focus { border-color: #818cf8; }
:global(html.dark) .data-table th { background: #0f172a; color: #94a3b8; border-bottom-color: #1e293b; }
:global(html.dark) .data-table td { color: #cbd5e1; border-bottom-color: #1e293b; }
:global(html.dark) .categoria-header-row td { background: rgba(129, 140, 248, 0.1); border-bottom-color: rgba(129, 140, 248, 0.2); }
:global(html.dark) .categoria-badge { color: #818cf8; }
:global(html.dark) .categoria-count { color: #a5b4fc; }
:global(html.dark) .tabla-fila:hover { background: rgba(255,255,255,0.02); }
:global(html.dark) .btn-action { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .btn-action.view { background: rgba(59,130,246,0.2); }
:global(html.dark) .btn-action.edit { background: rgba(234,179,8,0.2); }
:global(html.dark) .btn-action.delete { background: rgba(239,68,68,0.2); }
:global(html.dark) .vacio-titulo { color: #f8fafc; }
:global(html.dark) .modal-overlay { background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
:global(html.dark) .modal { background: #131b2e; border-color: #1e293b; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7); }
:global(html.dark) .modal-header { border-bottom-color: #1e293b; }
:global(html.dark) .modal-header h3 { color: #f8fafc; }
:global(html.dark) .modal-close { color: #94a3b8; }
:global(html.dark) .detalle-label { color: #94a3b8; }
:global(html.dark) .categoria-badge-modal { background: rgba(129, 140, 248, 0.2); color: #818cf8; }
:global(html.dark) .form-group label { color: #cbd5e1; }
:global(html.dark) .form-group input,
:global(html.dark) .form-group textarea,
:global(html.dark) .form-select { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .form-group input:focus,
:global(html.dark) .form-group textarea:focus,
:global(html.dark) .form-select:focus { border-color: #818cf8; box-shadow: 0 0 0 3px rgba(129,140,248,0.2); }
:global(html.dark) .modal-footer { border-top-color: #1e293b; }
:global(html.dark) .btn-secundario { background: #1e293b; color: #cbd5e1; border-color: #334155; }
:global(html.dark) .btn-secundario:hover { background: #334155; color: #f8fafc; }
:global(html.dark) .stat-mini-card { background: #131b2e; border-color: #1e293b; }
:global(html.dark) .stat-val { color: #f8fafc; }
:global(html.dark) .estado-filter { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .estado-filter option { background: #131b2e; color: #f8fafc; }
:global(html.dark) .form-select option { background: #131b2e; color: #f8fafc; }
:global(html.dark) .estado-carga,
:global(html.dark) .estado-error { background: #131b2e; border-color: #334155; color: #f8fafc; }
:global(html.dark) .estado-error { border-color: #7f1d1d; color: #fca5a5; }
:global(html.dark) .spinner { border-color: #334155; border-top-color: #818cf8; }
:global(html.dark) .alert-banner,
:global(html.dark) .modal-alerta-error { background: rgba(127, 29, 29, 0.35); border-color: #7f1d1d; color: #fca5a5; }
:global(html.dark) .agenda-panel { background: #0f172a; border-color: #1e293b; }
:global(html.dark) .agenda-titulo { color: #f8fafc; }
:global(html.dark) .agenda-item { background: #131b2e; border-color: #334155; color: #cbd5e1; }
:global(html.dark) .form-time { background: #1e293b; border-color: #334155; color: #f8fafc; }
:global(html.dark) .btn-action.pay { background: rgba(16, 185, 129, 0.2); }

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .detalle-grid { grid-template-columns: 1fr; }
  .detalle-full { grid-column: 1; }
  .form-full { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
