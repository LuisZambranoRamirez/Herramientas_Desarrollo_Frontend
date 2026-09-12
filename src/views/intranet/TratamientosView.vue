<script setup lang="ts">
// CAMBIO: Importación de funciones reactivas de Vue
import { ref, computed, watch, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'

// CAMBIO: Interfaz del modelo de Tratamiento según especificación
export interface Tratamiento {
  id: string | number
  categoria: string
  nombre: string
  descripcion: string
  precioReferencial: number
  duracionEstimadaMin: number
}

// CAMBIO: Constante de clave de localStorage
const STORAGE_KEY = 'tratamientos'

// CAMBIO: Catálogo inicial (Seed Data) con 10 categorías y procedimientos
const SEED_TRATAMIENTOS: Tratamiento[] = [
  // 1. Diagnóstico y Prevención
  { id: 1, categoria: 'Diagnóstico y Prevención', nombre: 'Consulta y examen clínico general', descripcion: 'Evaluación integral de la cavidad bucal', precioReferencial: 50, duracionEstimadaMin: 30 },
  { id: 2, categoria: 'Diagnóstico y Prevención', nombre: 'Odontograma digital', descripcion: 'Registro gráfico digital del estado dental', precioReferencial: 40, duracionEstimadaMin: 20 },
  { id: 3, categoria: 'Diagnóstico y Prevención', nombre: 'Profilaxis dental (limpieza simple)', descripcion: 'Limpieza e higiene dental de rutina', precioReferencial: 80, duracionEstimadaMin: 30 },
  { id: 4, categoria: 'Diagnóstico y Prevención', nombre: 'Destartraje supragingival (ultrasonido)', descripcion: 'Eliminación de sarro con ultrasonido', precioReferencial: 120, duracionEstimadaMin: 45 },
  { id: 5, categoria: 'Diagnóstico y Prevención', nombre: 'Aplicación tópica de flúor barniz', descripcion: 'Tratamiento preventivo para remineralización', precioReferencial: 60, duracionEstimadaMin: 20 },
  { id: 6, categoria: 'Diagnóstico y Prevención', nombre: 'Sellantes de fosas y fisuras (por pieza)', descripcion: 'Protección preventiva de fosas dentales', precioReferencial: 50, duracionEstimadaMin: 20 },
  { id: 7, categoria: 'Diagnóstico y Prevención', nombre: 'Radiografía periapical', descripcion: 'Toma radiográfica individual de pieza dental', precioReferencial: 30, duracionEstimadaMin: 15 },
  { id: 8, categoria: 'Diagnóstico y Prevención', nombre: 'Radiografía panorámica', descripcion: 'Imagen radiográfica completa maxilofacial', precioReferencial: 80, duracionEstimadaMin: 20 },

  // 2. Odontología Restauradora y Operatoria
  { id: 9, categoria: 'Odontología Restauradora y Operatoria', nombre: 'Restauración con resina simple (1 superficie)', descripcion: 'Obturación estética en 1 cara dental', precioReferencial: 100, duracionEstimadaMin: 30 },
  { id: 10, categoria: 'Odontología Restauradora y Operatoria', nombre: 'Restauración con resina compuesta (2 o más superficies)', descripcion: 'Obturación estética múltiple cara dental', precioReferencial: 150, duracionEstimadaMin: 45 },
  { id: 11, categoria: 'Odontología Restauradora y Operatoria', nombre: 'Restauración con ionómero de vidrio', descripcion: 'Restauración biocompatible y liberadora de flúor', precioReferencial: 90, duracionEstimadaMin: 30 },
  { id: 12, categoria: 'Odontología Restauradora y Operatoria', nombre: 'Incrustación dental estética (Inlay / Onlay en resina o cerámica)', descripcion: 'Restauración indirecta para alta pérdida estructural', precioReferencial: 450, duracionEstimadaMin: 60 },
  { id: 13, categoria: 'Odontología Restauradora y Operatoria', nombre: 'Reconstrucción dental con perno de fibra de vidrio', descripcion: 'Refuerzo intrarradicular post-endodoncia', precioReferencial: 250, duracionEstimadaMin: 50 },

  // 3. Endodoncia
  { id: 14, categoria: 'Endodoncia', nombre: 'Pulpotomía / Pulpectomía (dientes deciduos)', descripcion: 'Tratamiento pulpar en piezas pediátricas', precioReferencial: 180, duracionEstimadaMin: 40 },
  { id: 15, categoria: 'Endodoncia', nombre: 'Tratamiento de conducto unirradicular (incisivos/caninos)', descripcion: 'Endodoncia en piezas anteriores de 1 conducto', precioReferencial: 300, duracionEstimadaMin: 60 },
  { id: 16, categoria: 'Endodoncia', nombre: 'Tratamiento de conducto birradicular (premolares)', descripcion: 'Endodoncia en piezas de 2 conductos', precioReferencial: 400, duracionEstimadaMin: 60 },
  { id: 17, categoria: 'Endodoncia', nombre: 'Tratamiento de conducto multirradicular (molares)', descripcion: 'Endodoncia en molares de 3 o más conductos', precioReferencial: 550, duracionEstimadaMin: 90 },
  { id: 18, categoria: 'Endodoncia', nombre: 'Retratamiento endodóntico (por conducto)', descripcion: 'Desobturación y re-tratamiento de conducto', precioReferencial: 350, duracionEstimadaMin: 60 },

  // 4. Periodoncia
  { id: 19, categoria: 'Periodoncia', nombre: 'Raspaje y alisado radicular por cuadrante (curetaje)', descripcion: 'Limpieza profunda periodontal bajo encía', precioReferencial: 180, duracionEstimadaMin: 45 },
  { id: 20, categoria: 'Periodoncia', nombre: 'Cirugía a colgajo periodontal', descripcion: 'Procedimiento quirúrgico para sacos periodontales', precioReferencial: 600, duracionEstimadaMin: 90 },
  { id: 21, categoria: 'Periodoncia', nombre: 'Gingivectomía / Gingivoplastia estética (por pieza o sector)', descripcion: 'Remodelado estético de encías', precioReferencial: 250, duracionEstimadaMin: 45 },
  { id: 22, categoria: 'Periodoncia', nombre: 'Injerto de encía / tejido conectivo', descripcion: 'Recubrimiento de recesiones gingivales', precioReferencial: 800, duracionEstimadaMin: 90 },
  { id: 23, categoria: 'Periodoncia', nombre: 'Mantenimiento periodontal periódico', descripcion: 'Control y soporte periodontal continuo', precioReferencial: 130, duracionEstimadaMin: 30 },

  // 5. Ortodoncia y Ortopedia Maxilar
  { id: 24, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Estudio ortodóntico completo (fotos, modelos, trazado cefalométrico)', descripcion: 'Diagnóstico integral para planificación ortodóntica', precioReferencial: 250, duracionEstimadaMin: 45 },
  { id: 25, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Brackets metálicos convencionales (instalación)', descripcion: 'Montaje de aparatología fija metálica', precioReferencial: 1200, duracionEstimadaMin: 90 },
  { id: 26, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Brackets estéticos (cerámica / zafiro)', descripcion: 'Instalación de aparatos de alta estética', precioReferencial: 2200, duracionEstimadaMin: 90 },
  { id: 27, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Brackets de autoligado', descripcion: 'Sistema de baja fricción y tratamiento eficiente', precioReferencial: 2800, duracionEstimadaMin: 90 },
  { id: 28, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Alineadores invisibles (tratamiento correctivo)', descripcion: 'Ortodoncia transparente mediante alineadores secuenciales', precioReferencial: 6000, duracionEstimadaMin: 60 },
  { id: 29, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Control mensual de ortodoncia', descripcion: 'Ajuste y activación periódica de brackets', precioReferencial: 150, duracionEstimadaMin: 30 },
  { id: 30, categoria: 'Ortodoncia y Ortopedia Maxilar', nombre: 'Retenedores post-ortodoncia (Hawley o Essix)', descripcion: 'Aparato de contención post-tratamiento', precioReferencial: 300, duracionEstimadaMin: 30 },

  // 6. Cirugía Bucal y Maxilofacial
  { id: 31, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Exodoncia simple (diente permanente o temporal)', descripcion: 'Extracción dental convencional no compleja', precioReferencial: 100, duracionEstimadaMin: 30 },
  { id: 32, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Exodoncia compleja / por disección', descripcion: 'Extracción con osteotomía o odontosección', precioReferencial: 220, duracionEstimadaMin: 45 },
  { id: 33, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Extracción quirúrgica de tercera molar erupcionada', descripcion: 'Cirugía de muela del juicio erupcionada', precioReferencial: 300, duracionEstimadaMin: 45 },
  { id: 34, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Extracción quirúrgica de tercera molar impactada / retenida', descripcion: 'Cirugía compleja de muela del juicio retenida', precioReferencial: 500, duracionEstimadaMin: 60 },
  { id: 35, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Frenectomía labial o lingual', descripcion: 'Corrección quirúrgica de frenillos bucales', precioReferencial: 350, duracionEstimadaMin: 40 },
  { id: 36, categoria: 'Cirugía Bucal y Maxilofacial', nombre: 'Drenaje de absceso periapical', descripcion: 'Evacuación de infección aguda en cavidad oral', precioReferencial: 150, duracionEstimadaMin: 30 },

  // 7. Rehabilitación Oral y Prótesis
  { id: 37, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Prótesis total acrílica (por arcada)', descripcion: 'Dentadura completa removible en acrílico', precioReferencial: 900, duracionEstimadaMin: 60 },
  { id: 38, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Prótesis parcial removible metálica (cromo-cobalto)', descripcion: 'Prótesis parcial esquelética metálica', precioReferencial: 1200, duracionEstimadaMin: 60 },
  { id: 39, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Prótesis flexible (Valplast)', descripcion: 'Prótesis removible estética altamente flexible', precioReferencial: 950, duracionEstimadaMin: 60 },
  { id: 40, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Corona metal-porcelana', descripcion: 'Funda dental con estructura metálica y revestimiento cerámico', precioReferencial: 650, duracionEstimadaMin: 60 },
  { id: 41, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Corona libre de metal (Zirconio / Disilicato de litio E-max)', descripcion: 'Corona estética libre de metal de alta resistencia', precioReferencial: 1200, duracionEstimadaMin: 60 },
  { id: 42, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Carilla dental de porcelana / disilicato', descripcion: 'Lámina estética frontal cerámico de alta definición', precioReferencial: 1100, duracionEstimadaMin: 60 },
  { id: 43, categoria: 'Rehabilitación Oral y Prótesis', nombre: 'Carilla dental directa en resina', descripcion: 'Modelado estético directo sobre esmalte', precioReferencial: 350, duracionEstimadaMin: 45 },

  // 8. Implantología
  { id: 44, categoria: 'Implantología', nombre: 'Colocación de implante dental de titanio (quirúrgico)', descripcion: 'Fase quirúrgica de colocación de raíz artificial', precioReferencial: 2500, duracionEstimadaMin: 90 },
  { id: 45, categoria: 'Implantología', nombre: 'Corona sobre implante (fase protésica)', descripcion: 'Restauración protésica sobre implante integrado', precioReferencial: 1400, duracionEstimadaMin: 60 },
  { id: 46, categoria: 'Implantología', nombre: 'Regeneración ósea guiada / Injerto óseo', descripcion: 'Aumento de volumen óseo maxilar o mandibular', precioReferencial: 900, duracionEstimadaMin: 60 },
  { id: 47, categoria: 'Implantología', nombre: 'Elevación de seno maxilar', descripcion: 'Procedimiento para ganar altura ósea posterior superior', precioReferencial: 1800, duracionEstimadaMin: 90 },

  // 9. Odontopediatría
  { id: 48, categoria: 'Odontopediatría', nombre: 'Restauración preventiva en niños', descripcion: 'Obturación selladora en piezas deciduas', precioReferencial: 80, duracionEstimadaMin: 30 },
  { id: 49, categoria: 'Odontopediatría', nombre: 'Corona de acero infantil', descripcion: 'Corona preformada para molares primarias destruidas', precioReferencial: 200, duracionEstimadaMin: 40 },
  { id: 50, categoria: 'Odontopediatría', nombre: 'Mantenedor de espacio fijo o removible', descripcion: 'Dispositivo para prevenir pérdida de espacio dental', precioReferencial: 350, duracionEstimadaMin: 40 },
  { id: 51, categoria: 'Odontopediatría', nombre: 'Terapia pulpar infantil', descripcion: 'Tratamiento desinfectante de pulpa en niños', precioReferencial: 160, duracionEstimadaMin: 40 },

  // 10. Estética Dental y Blanqueamiento
  { id: 52, categoria: 'Estética Dental y Blanqueamiento', nombre: 'Blanqueamiento dental en consultorio (fotoactivado)', descripcion: 'Aclaramiento dental intensivo con luz en clínica', precioReferencial: 450, duracionEstimadaMin: 60 },
  { id: 53, categoria: 'Estética Dental y Blanqueamiento', nombre: 'Blanqueamiento dental casero (con férulas personalizadas)', descripcion: 'Tratamiento de aclaramiento ambulatorio con cubetas', precioReferencial: 300, duracionEstimadaMin: 30 },
  { id: 54, categoria: 'Estética Dental y Blanqueamiento', nombre: 'Microabrasión del esmalte dental', descripcion: 'Eliminación superficial de manchas en esmalte', precioReferencial: 200, duracionEstimadaMin: 40 },
]

// CAMBIO: Carga condicional desde localStorage con fallback a Seed Data
const cargarTratamientosIniciales = (): Tratamiento[] => {
  try {
    const guardados = localStorage.getItem(STORAGE_KEY)
    if (guardados) {
      const parsed = JSON.parse(guardados)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error al leer tratamientos de localStorage:', e)
  }
  // Si está vacío o es null, inicializar con el catálogo completo
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRATAMIENTOS))
  return [...SEED_TRATAMIENTOS]
}

// CAMBIO: Estado reactivo de tratamientos
const tratamientos = ref<Tratamiento[]>(cargarTratamientosIniciales())
const busqueda = ref('')

// CAMBIO: Persistencia automática en localStorage ante cualquier cambio
watch(
  tratamientos,
  (nuevos) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevos))
  },
  { deep: true }
)

// CAMBIO: Asegura la inicialización en la carga inicial del componente
onMounted(() => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRATAMIENTOS))
  }
})

// CAMBIO: Categorías clínicas disponibles para el selector del formulario
const CATEGORIAS_DISPONIBLES = [
  'Diagnóstico y Prevención',
  'Odontología Restauradora y Operatoria',
  'Endodoncia',
  'Periodoncia',
  'Ortodoncia y Ortopedia Maxilar',
  'Cirugía Bucal y Maxilofacial',
  'Rehabilitación Oral y Prótesis',
  'Implantología',
  'Odontopediatría',
  'Estética Dental y Blanqueamiento',
]

// CAMBIO: Computed para ordenar por categoría (alfabéticamente) y nombre dentro de cada categoría
const tratamientosOrdenados = computed(() => {
  const q = busqueda.value.toLowerCase().trim()

  // Filtrado reactivo por término de búsqueda
  const filtrados = tratamientos.value.filter((t) => {
    if (!q) return true
    return (
      t.nombre.toLowerCase().includes(q) ||
      t.categoria.toLowerCase().includes(q) ||
      t.descripcion.toLowerCase().includes(q)
    )
  })

  // Obtener categorías únicas presentes en los resultados filtrados y ordenarlas alfabéticamente
  const categoriasUnicas = [...new Set(filtrados.map((t) => t.categoria))].sort((a, b) =>
    a.localeCompare(b, 'es', { sensitivity: 'base' })
  )

  // Agrupar elementos por categoría y ordenarlos alfabéticamente por nombre
  return categoriasUnicas.map((cat) => ({
    categoria: cat,
    items: filtrados
      .filter((t) => t.categoria === cat)
      .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' })),
  }))
})

// CAMBIO: Total global de tratamientos filtrados
const totalFiltrados = computed(() =>
  tratamientosOrdenados.value.reduce((acc, grupo) => acc + grupo.items.length, 0)
)

// CAMBIO: Manejo de modales (crear / editar / ver)
type ModoModal = 'crear' | 'editar' | 'ver' | null
const modoModal = ref<ModoModal>(null)
const idSeleccionado = ref<string | number | null>(null)

const formVacio = (): Omit<Tratamiento, 'id'> => ({
  categoria: 'Diagnóstico y Prevención',
  nombre: '',
  descripcion: '',
  precioReferencial: 0,
  duracionEstimadaMin: 30,
})

const form = ref<Omit<Tratamiento, 'id'>>(formVacio())

const tratamientoSeleccionado = computed(() =>
  tratamientos.value.find((t) => t.id === idSeleccionado.value) ?? null
)

const resetForm = () => {
  form.value = formVacio()
  idSeleccionado.value = null
}

const abrirCrear = () => {
  resetForm()
  modoModal.value = 'crear'
}

const abrirEditar = (item: Tratamiento) => {
  idSeleccionado.value = item.id
  form.value = {
    categoria: item.categoria,
    nombre: item.nombre,
    descripcion: item.descripcion,
    precioReferencial: item.precioReferencial,
    duracionEstimadaMin: item.duracionEstimadaMin,
  }
  modoModal.value = 'editar'
}

const abrirVer = (id: string | number) => {
  idSeleccionado.value = id
  modoModal.value = 'ver'
}

const cerrarModal = () => {
  modoModal.value = null
  resetForm()
}

// CAMBIO: Guardar creación o edición
const guardar = () => {
  if (!form.value.nombre.trim()) return

  if (modoModal.value === 'crear') {
    const nuevoId = Date.now()
    tratamientos.value.push({
      id: nuevoId,
      ...form.value,
    })
  } else if (modoModal.value === 'editar' && idSeleccionado.value !== null) {
    const idx = tratamientos.value.findIndex((t) => t.id === idSeleccionado.value)
    if (idx !== -1) {
      tratamientos.value.splice(idx, 1, {
        id: idSeleccionado.value,
        ...form.value,
      })
    }
  }
  cerrarModal()
}

// CAMBIO: Eliminar procedimiento del catálogo
const eliminarTratamiento = (id: string | number) => {
  if (confirm('¿Estás seguro de eliminar este tratamiento del catálogo?')) {
    tratamientos.value = tratamientos.value.filter((t) => t.id !== id)
  }
}

// CAMBIO: Formateador de moneda en soles peruanos
const formatPrecio = (val: number): string =>
  new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(val)
</script>

<template>
  <DashboardLayout>
    <div class="tratamientos-view">

      <!-- ── Cabecera ─────────────────────────────────────────── -->
      <div class="view-header">
        <div>
          <h2 class="view-title">Catálogo Odontológico de Tratamientos</h2>
          <p class="view-desc">
            Explora, gestiona y clasifica el catálogo de procedimientos por categorías clínicas.
          </p>
        </div>
        <!-- CAMBIO: Botón para añadir procedimiento -->
        <button class="btn-nuevo" type="button" @click="abrirCrear">
          + Nuevo Tratamiento
        </button>
      </div>

      <!-- ── Card principal con tabla agrupada ────────────────── -->
      <div class="table-card">
        <div class="filter-bar">
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar por procedimiento, categoría o descripción..."
            class="search-input"
          />
          <span class="resultado-count">{{ totalFiltrados }} procedimiento(s)</span>
        </div>

        <!-- CAMBIO: Estado vacío cuando no hay coincidencias -->
        <div v-if="totalFiltrados === 0" class="estado-vacio">
          <span class="vacio-icono">🦷</span>
          <p class="vacio-titulo">Sin procedimientos encontrados</p>
          <p class="vacio-desc">
            {{
              busqueda
                ? 'No se encontraron registros para tu búsqueda.'
                : 'El catálogo se encuentra vacío. Haz clic en "+ Nuevo Tratamiento".'
            }}
          </p>
        </div>

        <!-- CAMBIO: Visualización de tabla agrupada y ordenada por categoría -->
        <div v-else class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Procedimiento / Tratamiento</th>
                <th>Descripción</th>
                <th>Duración Est.</th>
                <th>Precio Referencial</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="grupo in tratamientosOrdenados" :key="grupo.categoria">
                <!-- CAMBIO: Encabezado de fila por categoría clínica -->
                <tr class="categoria-header-row">
                  <td colspan="5">
                    <div class="categoria-header">
                      <span class="categoria-badge">🏷️ {{ grupo.categoria }}</span>
                      <span class="categoria-count">{{ grupo.items.length }} item(s)</span>
                    </div>
                  </td>
                </tr>

                <!-- CAMBIO: Filas de procedimientos ordenados alfabéticamente dentro de la categoría -->
                <tr
                  v-for="item in grupo.items"
                  :key="item.id"
                  class="tabla-fila"
                >
                  <td class="font-semibold">{{ item.nombre }}</td>
                  <td class="text-secondary">{{ item.descripcion || '—' }}</td>
                  <td class="font-mono">⏱️ {{ item.duracionEstimadaMin }} min</td>
                  <td class="font-semibold text-emerald">{{ formatPrecio(item.precioReferencial) }}</td>
                  <td class="td-acciones">
                    <button
                      class="btn-action view"
                      title="Ver detalles"
                      @click="abrirVer(item.id)"
                    >
                      👁
                    </button>
                    <button
                      class="btn-action edit"
                      title="Editar"
                      @click="abrirEditar(item)"
                    >
                      ✏️
                    </button>
                    <button
                      class="btn-action delete"
                      title="Eliminar"
                      @click="eliminarTratamiento(item.id)"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- CAMBIO: Modal de Crear / Editar / Ver -->
    <div v-if="modoModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal">

        <!-- Modo VER -->
        <template v-if="modoModal === 'ver' && tratamientoSeleccionado">
          <div class="modal-header">
            <h3>Detalle del Procedimiento</h3>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>
          <div class="detalle-grid">
            <div class="detalle-item detalle-full">
              <span class="detalle-label">Categoría Clínica</span>
              <span class="categoria-badge-modal">{{ tratamientoSeleccionado.categoria }}</span>
            </div>
            <div class="detalle-item detalle-full">
              <span class="detalle-label">Nombre del Tratamiento</span>
              <span class="font-semibold text-lg">{{ tratamientoSeleccionado.nombre }}</span>
            </div>
            <div class="detalle-item detalle-full">
              <span class="detalle-label">Descripción</span>
              <span>{{ tratamientoSeleccionado.descripcion || 'Sin descripción' }}</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Duración Estimada</span>
              <span>⏱️ {{ tratamientoSeleccionado.duracionEstimadaMin }} minutos</span>
            </div>
            <div class="detalle-item">
              <span class="detalle-label">Precio Referencial</span>
              <span class="text-emerald font-semibold text-lg">
                {{ formatPrecio(tratamientoSeleccionado.precioReferencial) }}
              </span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-secundario" @click="cerrarModal">Cerrar</button>
            <button class="btn-primario" @click="abrirEditar(tratamientoSeleccionado)">
              ✏️ Editar
            </button>
          </div>
        </template>

        <!-- Modo CREAR / EDITAR -->
        <template v-else-if="modoModal === 'crear' || modoModal === 'editar'">
          <div class="modal-header">
            <h3>{{ modoModal === 'crear' ? 'Nuevo Procedimiento' : 'Editar Procedimiento' }}</h3>
            <button class="modal-close" @click="cerrarModal">✕</button>
          </div>

          <form @submit.prevent="guardar" class="form-grid">

            <div class="form-group form-full">
              <label>Categoría Clínica *</label>
              <select v-model="form.categoria" required class="form-select">
                <option v-for="cat in CATEGORIAS_DISPONIBLES" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div class="form-group form-full">
              <label>Nombre del Tratamiento *</label>
              <input
                v-model="form.nombre"
                type="text"
                required
                placeholder="Ej. Profilaxis dental"
              />
            </div>

            <div class="form-group form-full">
              <label>Descripción Breve</label>
              <textarea
                v-model="form.descripcion"
                rows="2"
                placeholder="Resumen del procedimiento..."
              ></textarea>
            </div>

            <div class="form-group">
              <label>Precio Referencial (S/) *</label>
              <input
                v-model.number="form.precioReferencial"
                type="number"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>

            <div class="form-group">
              <label>Duración Estimada (min) *</label>
              <input
                v-model.number="form.duracionEstimadaMin"
                type="number"
                required
                min="5"
                step="5"
                placeholder="30"
              />
            </div>

            <div class="modal-footer form-full">
              <button type="button" class="btn-secundario" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn-primario">
                Guardar
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

@media (max-width: 600px) {
  .form-grid { grid-template-columns: 1fr; }
  .detalle-grid { grid-template-columns: 1fr; }
  .detalle-full { grid-column: 1; }
  .form-full { grid-column: 1; }
  .td-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>
