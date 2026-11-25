<template>
  <DashboardLayout>
    <div class="perfil-page">
      <!-- Encabezado de la Página -->
      <div class="header-section">
        <div class="header-titles">
          <div class="title-with-badge">
            <h2>Mi Perfil</h2>
            <span class="role-pill-badge" :class="getRoleClass(perfil.user_role)">
              <span class="role-icon">{{ getRoleIcon(perfil.user_role) }}</span>
              {{ getRoleLabel(perfil.user_role) }}
            </span>
          </div>
          <p class="subtitle">
            Administra y actualiza tus datos personales y de contacto en SoliDent.
          </p>
        </div>

        <div class="header-actions">
          <router-link :to="dashboardRoute" class="btn-back-dashboard">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al Panel
          </router-link>
        </div>
      </div>

      <!-- Notificación Flash de Éxito -->
      <transition name="fade">
        <div v-if="mensajeExito" class="toast-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="toast-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ mensajeExito }}</span>
        </div>
      </transition>

      <!-- Notificación Flash de Error -->
      <transition name="fade">
        <div v-if="mensajeError" class="toast-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="toast-icon toast-icon-error">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
          </svg>
          <span>{{ mensajeError }}</span>
        </div>
      </transition>

      <!-- Estado de Carga Inicial -->
      <div v-if="cargando" class="loading-state-card">
        <div class="spinner"></div>
        <p>Cargando información de tu perfil...</p>
      </div>

      <!-- Contenido Principal: Perfil y Formulario -->
      <div v-else class="perfil-grid">
        <!-- Tarjeta Izquierda: Resumen de Cuenta e Identidad -->
        <div class="profile-card profile-summary-card">
          <div class="avatar-large-container">
            <div class="avatar-large" :class="getAvatarClass(perfil.user_role)">
              {{ getInitials(perfil.nombre_completo || perfil.username) }}
            </div>
            <div class="profile-status-indicator" :class="perfil.activo ? 'status-active' : 'status-inactive'">
              {{ perfil.activo ? 'Cuenta Activa' : 'Cuenta Inactiva' }}
            </div>
          </div>

          <h3 class="profile-name">{{ perfil.nombre_completo || perfil.username }}</h3>
          <span class="profile-username">@{{ perfil.username }}</span>

          <div class="summary-divider"></div>

          <!-- Metadatos de la Cuenta (Solo Lectura) -->
          <div class="account-meta-list">
            <div class="meta-item">
              <span class="meta-label">Rol del Sistema:</span>
              <span class="meta-value font-semibold">{{ getRoleLabel(perfil.user_role) }}</span>
            </div>

            <div v-if="esOdontologo && perfil.colegiatura" class="meta-item">
              <span class="meta-label">Colegiatura Profesional:</span>
              <span class="meta-value font-mono">{{ perfil.colegiatura }}</span>
            </div>

            <div v-if="esOdontologo && perfil.especialidad" class="meta-item">
              <span class="meta-label">Especialidad Actual:</span>
              <span class="meta-value">{{ formatearEspecialidad(perfil.especialidad) }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Fecha de Registro:</span>
              <span class="meta-value">{{ formatearFecha(perfil.fecha_registro) }}</span>
            </div>

            <div class="meta-item">
              <span class="meta-label">Último Acceso:</span>
              <span class="meta-value">
                {{ perfil.ultimo_acceso ? formatearFecha(perfil.ultimo_acceso) : 'Sesión activa' }}
              </span>
            </div>
          </div>

          <div class="role-info-box">
            <span class="role-info-title">💡 Alcance de tu cuenta</span>
            <p class="role-info-desc">{{ getRoleHelpText(perfil.user_role) }}</p>
          </div>
        </div>

        <!-- Tarjeta Derecha: Formulario de Edición -->
        <div class="profile-card profile-form-card">
          <div class="card-header-bar">
            <div>
              <h3>Información Personal y Contacto</h3>
              <p class="card-subtitle">
                Mantén tus datos de contacto actualizados para notificaciones de citas y gestión clínica.
              </p>
            </div>
          </div>

          <form @submit.prevent="guardarCambios" class="form-container">
            <div class="form-grid">
              <!-- Nombre de Usuario (Solo Lectura) -->
              <div class="form-group">
                <label class="form-label">
                  Nombre de Usuario
                  <span class="badge-readonly">Solo lectura</span>
                </label>
                <div class="input-with-prefix">
                  <span class="prefix">@</span>
                  <input
                    :value="perfil.username"
                    type="text"
                    class="form-input readonly"
                    readonly
                    tabindex="-1"
                    title="El nombre de usuario no puede ser modificado"
                  />
                </div>
                <span class="helper-text">Identificador institucional único asignado.</span>
              </div>

              <!-- Rol del Sistema (Solo Lectura) -->
              <div class="form-group">
                <label class="form-label">
                  Rol Asignado
                  <span class="badge-readonly">Solo lectura</span>
                </label>
                <input
                  :value="getRoleLabel(perfil.user_role)"
                  type="text"
                  class="form-input readonly"
                  readonly
                  tabindex="-1"
                  title="El rol administrativo solo puede ser alterado por un Administrador"
                />
                <span class="helper-text">Tu nivel de permisos en la plataforma.</span>
              </div>

              <!-- Nombre Completo (Editable) -->
              <div class="form-group span-2">
                <label class="form-label required" for="input-nombre">Nombre Completo</label>
                <input
                  id="input-nombre"
                  v-model="form.nombre_completo"
                  type="text"
                  class="form-input"
                  :class="{ 'has-error': errores.nombre_completo }"
                  placeholder="ej. Juan Carlos Pérez Silva"
                  @input="validar('nombre_completo')"
                  @blur="validar('nombre_completo')"
                />
                <span v-if="errores.nombre_completo" class="error-msg">{{ errores.nombre_completo }}</span>
              </div>

              <!-- Correo Electrónico (Editable) -->
              <div class="form-group">
                <label class="form-label" for="input-correo">Correo Electrónico</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="field-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="input-correo"
                    v-model="form.correo"
                    type="email"
                    class="form-input"
                    :class="{ 'has-error': errores.correo }"
                    placeholder="ej. usuario@solident.pe"
                    @input="validar('correo')"
                    @blur="validar('correo')"
                  />
                </div>
                <span v-if="errores.correo" class="error-msg">{{ errores.correo }}</span>
              </div>

              <!-- Teléfono Celular (Editable) -->
              <div class="form-group">
                <label class="form-label" for="input-telefono">Teléfono Celular (9 dígitos)</label>
                <div class="input-with-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="field-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    id="input-telefono"
                    v-model="form.telefono"
                    type="tel"
                    maxlength="9"
                    class="form-input"
                    :class="{ 'has-error': errores.telefono }"
                    placeholder="ej. 987654321"
                    @input="validar('telefono')"
                    @blur="validar('telefono')"
                  />
                </div>
                <span v-if="errores.telefono" class="error-msg">{{ errores.telefono }}</span>
              </div>

              <!-- SECCIÓN EXCLUSIVA PARA ODONTÓLOGOS -->
              <template v-if="esOdontologo">
                <div class="section-divider span-2">
                  <span>Información Profesional del Especialista</span>
                </div>

                <!-- Especialidad Odontológica -->
                <div class="form-group span-2">
                  <label class="form-label" for="select-especialidad">Especialidad Clínica</label>
                  <select
                    id="select-especialidad"
                    v-model="form.especialidad"
                    class="form-select"
                  >
                    <option value="">Selecciona una especialidad</option>
                    <option value="ORTODONCIA">🦷 Ortodoncia</option>
                    <option value="ENDODONCIA">🔬 Endodoncia</option>
                    <option value="PERIODONCIA">🛡️ Periodoncia</option>
                    <option value="ODONTOPEDIATRIA">👶 Odontopediatría</option>
                    <option value="CIRUGIA_MAXILOFACIAL">⚕️ Cirugía Maxilofacial</option>
                    <option value="IMPLANTOLOGIA">🔩 Implantología</option>
                    <option value="REHABILITACION_ORAL">✨ Rehabilitación Oral</option>
                    <option value="ODONTOLOGIA_ESTETICA">💎 Odontología Estética</option>
                  </select>
                  <span class="helper-text">Se mostrará en la sección pública de especialistas y agendamiento.</span>
                </div>

                <!-- Biografía / Descripción Profesional -->
                <div class="form-group span-2">
                  <label class="form-label" for="input-descripcion">Perfil Profesional / Resumen Clínico</label>
                  <textarea
                    id="input-descripcion"
                    v-model="form.descripcion"
                    class="form-textarea"
                    rows="3"
                    maxlength="500"
                    placeholder="Breve reseña sobre tu experiencia médica, posgrados o enfoque clínico..."
                  ></textarea>
                  <div class="textarea-counter">
                    <span>{{ (form.descripcion || '').length }} / 500 caracteres</span>
                  </div>
                </div>
              </template>
            </div>

            <!-- Botones de Acción -->
            <div class="form-actions-footer">
              <button
                type="button"
                class="btn-secondary"
                :disabled="guardando || !hayCambios"
                @click="restablecerFormulario"
              >
                Descartar Cambios
              </button>

              <button
                type="submit"
                class="btn-submit-primary"
                :disabled="guardando || !hayCambios"
              >
                <span v-if="guardando" class="btn-spinner"></span>
                <span>{{ guardando ? 'Guardando...' : 'Guardar Cambios' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { usuariosService } from '@/services/usuarios.service'
import { useAuthStore } from '@/stores/auth.store'
import type { Usuario, ActualizarPerfilDto, UserRole } from '@/types'
import {
  validarNombre,
  validarEmail,
  validarTelefono,
} from '@/utils/validators'
import { getDefaultRouteByRole, extractUserRole } from '@/utils/navigation'

const authStore = useAuthStore()

// Estados reactivos
const cargando = ref(true)
const guardando = ref(false)
const mensajeExito = ref<string | null>(null)
const mensajeError = ref<string | null>(null)

// Datos del perfil obtenidos del backend
const perfil = ref<Usuario>({
  username: '',
  nombre_completo: '',
  correo: '',
  telefono: '',
  activo: true,
  user_role: 'PACIENTE' as UserRole,
  fecha_registro: '',
})

// Formulario reactivo editable
const form = ref<ActualizarPerfilDto>({
  nombre_completo: '',
  correo: '',
  telefono: '',
  especialidad: '',
  descripcion: '',
})

// Errores de validación en tiempo real
const errores = ref({
  nombre_completo: '',
  correo: '',
  telefono: '',
})

// Rol y permisos
const currentRole = computed(() => {
  return extractUserRole(perfil.value.user_role) || extractUserRole(authStore.userRole) || 'PACIENTE'
})

const esOdontologo = computed(() => {
  const r = currentRole.value
  return r === 'ODONTOLOGO' || r === 'DOCTOR'
})

const dashboardRoute = computed(() => {
  return getDefaultRouteByRole(currentRole.value)
})

// Detección de cambios sin guardar
const hayCambios = computed(() => {
  const origNombre = perfil.value.nombre_completo || ''
  const origCorreo = perfil.value.correo || ''
  const origTel = perfil.value.telefono || ''
  const origEsp = (perfil.value as any).especialidad || ''
  const origDesc = (perfil.value as any).descripcion || ''

  return (
    (form.value.nombre_completo || '').trim() !== origNombre.trim() ||
    (form.value.correo || '').trim().toLowerCase() !== origCorreo.trim().toLowerCase() ||
    (form.value.telefono || '').trim() !== origTel.trim() ||
    (esOdontologo.value && (form.value.especialidad || '').trim() !== origEsp.trim()) ||
    (esOdontologo.value && (form.value.descripcion || '').trim() !== origDesc.trim())
  )
})

// Cargar perfil real desde el backend
const cargarPerfil = async () => {
  try {
    cargando.value = true
    mensajeError.value = null
    const data = await usuariosService.getMyProfile()
    perfil.value = data

    // Sincronizar formulario
    form.value = {
      nombre_completo: data.nombre_completo || '',
      correo: data.correo || '',
      telefono: data.telefono || '',
      especialidad: (data as any).especialidad || '',
      descripcion: (data as any).descripcion || '',
    }

    // Sincronizar store
    authStore.updateUserInSession(data)
  } catch (err) {
    mensajeError.value = err instanceof Error ? err.message : 'Error al cargar los datos del perfil.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarPerfil()
})

const restablecerFormulario = () => {
  form.value = {
    nombre_completo: perfil.value.nombre_completo || '',
    correo: perfil.value.correo || '',
    telefono: perfil.value.telefono || '',
    especialidad: (perfil.value as any).especialidad || '',
    descripcion: (perfil.value as any).descripcion || '',
  }
  errores.value = {
    nombre_completo: '',
    correo: '',
    telefono: '',
  }
}

// Validación de campos
const validar = (campo: 'nombre_completo' | 'correo' | 'telefono') => {
  switch (campo) {
    case 'nombre_completo': {
      const val = (form.value.nombre_completo || '').trim()
      errores.value.nombre_completo = val ? validarNombre(val, 'El nombre completo') : ''
      break
    }
    case 'correo': {
      const val = (form.value.correo || '').trim()
      errores.value.correo = val ? validarEmail(val) : ''
      break
    }
    case 'telefono': {
      form.value.telefono = (form.value.telefono || '').replace(/\D/g, '')
      const val = form.value.telefono
      errores.value.telefono = val ? validarTelefono(val, false) : ''
      break
    }
  }
}

const validarFormulario = (): boolean => {
  validar('nombre_completo')
  validar('correo')
  validar('telefono')
  return !Object.values(errores.value).some((e) => e !== '')
}

// Guardar cambios en el backend
const guardarCambios = async () => {
  if (!validarFormulario()) {
    return
  }

  try {
    guardando.value = true
    mensajeError.value = null
    mensajeExito.value = null

    const payload: ActualizarPerfilDto = {
      nombre_completo: form.value.nombre_completo?.trim() || undefined,
      correo: form.value.correo?.trim().toLowerCase() || undefined,
      telefono: form.value.telefono?.trim() || undefined,
    }

    if (esOdontologo.value) {
      payload.especialidad = form.value.especialidad?.trim() || undefined
      payload.descripcion = form.value.descripcion?.trim() || undefined
    }

    const actualizado = await usuariosService.updateMyProfile(payload)
    perfil.value = actualizado

    // Sincronizar en authStore y almacenamiento de sesión
    authStore.updateUserInSession(actualizado)

    mensajeExito.value = '¡Tu perfil ha sido actualizado exitosamente!'
    setTimeout(() => {
      mensajeExito.value = null
    }, 4000)
  } catch (err) {
    mensajeError.value = err instanceof Error ? err.message : 'Error al actualizar tu perfil.'
  } finally {
    guardando.value = false
  }
}

// Helpers de formateo y visualización
const getRoleLabel = (role?: string): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return 'Administrador'
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return 'Odontólogo Especialista'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'Paciente'
    default:
      return role || 'Usuario'
  }
}

const getRoleIcon = (role?: string): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return '🛡️'
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return '🩺'
    case 'PACIENTE':
    case 'CLIENTE':
      return '👤'
    default:
      return '•'
  }
}

const getRoleClass = (role?: string): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return 'role-admin'
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return 'role-odontologo'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'role-paciente'
    default:
      return 'role-default'
  }
}

const getAvatarClass = (role?: string): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return 'avatar-admin'
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return 'avatar-odontologo'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'avatar-paciente'
    default:
      return 'avatar-default'
  }
}

const getInitials = (nombre: string): string => {
  if (!nombre) return 'U'
  const partes = nombre.trim().split(/\s+/)
  const p0 = partes[0]
  const p1 = partes[1]
  if (p0 && p1 && p0.length > 0 && p1.length > 0) {
    return (p0.charAt(0) + p1.charAt(0)).toUpperCase()
  }
  return nombre.slice(0, 2).toUpperCase()
}

const formatearEspecialidad = (esp?: string): string => {
  if (!esp) return 'Odontología General'
  return esp
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

const formatearFecha = (fechaIso?: string): string => {
  if (!fechaIso) return '—'
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const getRoleHelpText = (role?: string): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
    case 'ADMIN':
      return 'Posees control y supervisión integral sobre la clínica, gestión de accesos, inventario y registros de ingresos.'
    case 'ODONTOLOGO':
    case 'DOCTOR':
      return 'Acceso a la agenda médica, gestión de atenciones de pacientes, ejecución de tratamientos y registro clínico.'
    case 'PACIENTE':
    case 'CLIENTE':
      return 'Acceso al portal personal para programar y revisar tus citas odontológicas, historial y estado de atenciones.'
    default:
      return 'Acceso estándar a las funciones autorizadas por la clínica.'
  }
}
</script>

<style scoped>
.perfil-page {
  padding: 4px 0 32px;
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 16px;
}

.title-with-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.header-section h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin: 0;
  letter-spacing: -0.02em;
}

.role-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
}

.role-admin {
  background: #ede9fe;
  color: #6366f1;
}

.role-odontologo {
  background: #e0f2fe;
  color: #0284c7;
}

.role-paciente {
  background: #ecfdf5;
  color: #059669;
}

.role-default {
  background: #f1f5f9;
  color: #64748b;
}

.subtitle {
  color: var(--text-muted, #64748b);
  font-size: 14.5px;
  margin: 6px 0 0;
}

.btn-back-dashboard {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid var(--border-light, #e2e8f0);
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #334155);
  font-size: 13.5px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.btn-back-dashboard:hover {
  background: var(--border-light, #f1f5f9);
  color: var(--primary-purple, #4f46e5);
}

.btn-back-dashboard svg {
  width: 16px;
  height: 16px;
}

/* Toasts */
.toast-success {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 12px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.toast-error {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 18px;
  border-radius: 10px;
  margin-bottom: 20px;
  font-size: 14px;
  font-weight: 500;
}

.toast-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
  flex-shrink: 0;
}

.toast-icon-error {
  color: #dc2626;
}

/* Loading state */
.loading-state-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  color: var(--text-muted, #64748b);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: var(--primary-purple, #4f46e5);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Layout Grid */
.perfil-grid {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.profile-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

/* Summary Card */
.profile-summary-card {
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-large-container {
  position: relative;
  margin-bottom: 16px;
}

.avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  font-size: 32px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.avatar-admin {
  background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
  color: white;
}

.avatar-odontologo {
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  color: white;
}

.avatar-paciente {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.avatar-default {
  background: #64748b;
  color: white;
}

.profile-status-indicator {
  margin-top: 10px;
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 600;
  display: inline-block;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-inactive {
  background: #fee2e2;
  color: #b91c1c;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin: 0;
}

.profile-username {
  font-size: 13.5px;
  color: var(--text-muted, #64748b);
  margin-top: 4px;
}

.summary-divider {
  width: 100%;
  height: 1px;
  background: var(--border-light, #e2e8f0);
  margin: 20px 0;
}

.account-meta-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  text-align: left;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  gap: 8px;
}

.meta-label {
  color: var(--text-muted, #64748b);
}

.meta-value {
  color: var(--text-main, #1e293b);
  text-align: right;
}

.role-info-box {
  width: 100%;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px;
  margin-top: 20px;
  text-align: left;
}

.role-info-title {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-main, #1e293b);
  margin-bottom: 4px;
}

.role-info-desc {
  font-size: 12px;
  color: var(--text-muted, #64748b);
  line-height: 1.5;
  margin: 0;
}

/* Form Card */
.profile-form-card {
  padding: 28px;
}

.card-header-bar {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.card-header-bar h3 {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin: 0;
}

.card-subtitle {
  color: var(--text-muted, #64748b);
  font-size: 13.5px;
  margin: 4px 0 0;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.span-2 {
  grid-column: span 2;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main, #334155);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-label.required::after {
  content: ' *';
  color: #dc2626;
}

.badge-readonly {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  background: #f1f5f9;
  color: #64748b;
  border-radius: 4px;
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid var(--border-light, #cbd5e1);
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #0f172a);
  font-size: 14px;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  border-color: var(--primary-purple, #4f46e5);
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.readonly {
  background: #f8fafc;
  color: #64748b;
  cursor: not-allowed;
  border-color: #e2e8f0;
}

.form-input.has-error {
  border-color: #ef4444;
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-prefix .prefix {
  position: absolute;
  left: 12px;
  color: #94a3b8;
  font-size: 14px;
  font-weight: 500;
}

.input-with-prefix .form-input {
  padding-left: 30px;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.field-icon {
  position: absolute;
  left: 12px;
  width: 18px;
  height: 18px;
  color: #94a3b8;
  pointer-events: none;
}

.input-with-icon .form-input {
  padding-left: 38px;
}

.helper-text {
  font-size: 12px;
  color: var(--text-muted, #64748b);
}

.error-msg {
  font-size: 12px;
  color: #dc2626;
  font-weight: 500;
}

.section-divider {
  display: flex;
  align-items: center;
  text-align: left;
  margin: 10px 0 0;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--primary-purple, #4f46e5);
  border-top: 1px dashed var(--border-light, #e2e8f0);
  padding-top: 16px;
}

.textarea-counter {
  text-align: right;
  font-size: 11.5px;
  color: #94a3b8;
}

/* Actions Footer */
.form-actions-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light, #e2e8f0);
}

.btn-secondary {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid var(--border-light, #cbd5e1);
  background: var(--bg-card, #ffffff);
  color: var(--text-main, #334155);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
  background: #f1f5f9;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-submit-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 10px;
  border: none;
  background: var(--primary-purple, #4f46e5);
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25);
  transition: all 0.2s ease;
}

.btn-submit-primary:hover:not(:disabled) {
  background: #4338ca;
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
}

.btn-submit-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Dark mode overrides */
html.dark .perfil-grid .profile-card {
  background: #1e293b;
  border-color: #334155;
}

html.dark .header-section h2,
html.dark .profile-name,
html.dark .card-header-bar h3,
html.dark .meta-value,
html.dark .form-label {
  color: #f8fafc;
}

html.dark .form-input,
html.dark .form-select,
html.dark .form-textarea {
  background: #0f172a;
  border-color: #334155;
  color: #f8fafc;
}

html.dark .form-input.readonly {
  background: #1e293b;
  border-color: #334155;
  color: #94a3b8;
}

html.dark .role-info-box {
  background: #0f172a;
  border-color: #334155;
}

html.dark .role-info-title {
  color: #e2e8f0;
}

html.dark .btn-secondary,
html.dark .btn-back-dashboard {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

html.dark .btn-secondary:hover:not(:disabled),
html.dark .btn-back-dashboard:hover {
  background: #334155;
}

/* Responsive */
@media (max-width: 900px) {
  .perfil-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  .span-2 {
    grid-column: span 1;
  }
  .header-section {
    flex-direction: column;
  }
}
</style>

