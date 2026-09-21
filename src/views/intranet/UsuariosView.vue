<template>
  <DashboardLayout>
    <div class="usuarios-page">
      <!-- Encabezado de la página -->
      <div class="header-section">
        <div class="header-titles">
          <div class="title-with-badge">
            <h2>Gestión de Usuarios</h2>
            <span class="count-badge">{{ usuarios.length }} usuarios</span>
          </div>
          <p class="subtitle">
            Visualiza, administra y controla los accesos y roles de los usuarios en SoliDent.
          </p>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="abrirModalCrear">
            <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      <!-- Tarjetas de métricas y estadísticas rápidas -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Usuarios</span>
            <span class="stat-value">{{ usuarios.length }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper indigo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Administradores</span>
            <span class="stat-value">{{ totalAdmins }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Odontólogos</span>
            <span class="stat-value">{{ totalOdontologos }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper green">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Pacientes</span>
            <span class="stat-value">{{ totalPacientes }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Usuarios Activos</span>
            <span class="stat-value">{{ totalActivos }}</span>
          </div>
        </div>
      </div>

      <!-- Notificación flash de mensaje -->
      <transition name="fade">
        <div v-if="mensajeExito" class="toast-success">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="toast-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <span>{{ mensajeExito }}</span>
        </div>
      </transition>

      <!-- Tabla Principal de Listado de Usuarios -->
      <div class="table-card">
        <!-- Estado de Carga -->
        <div v-if="cargando" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando usuarios registrados...</p>
        </div>

        <!-- Estado de Error -->
        <div v-else-if="error" class="error-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" />
            <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
            <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
          </svg>
          <p>{{ error }}</p>
          <button class="btn-retry" @click="cargarUsuarios">Reintentar</button>
        </div>

        <!-- Tabla con información básica del usuario -->
        <div v-else class="table-responsive">
          <table class="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Contacto</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in usuarios" :key="user.username" class="user-row">
                <!-- Columna Usuario: Avatar, Nombre y Username -->
                <td>
                  <div class="user-profile-cell">
                    <div class="avatar" :class="getAvatarClass(user.user_role)">
                      {{ getInitials(user.nombre_completo || user.username) }}
                    </div>
                    <div class="user-names">
                      <strong class="display-name">{{ user.nombre_completo || user.username }}</strong>
                      <span class="user-tag">@{{ user.username }}</span>
                    </div>
                  </div>
                </td>

                <!-- Columna Rol con Badge temático -->
                <td>
                  <span class="role-badge" :class="getRoleBadgeClass(user.user_role)">
                    <span class="role-icon">{{ getRoleIcon(user.user_role) }}</span>
                    {{ getRoleLabel(user.user_role) }}
                  </span>
                </td>

                <!-- Columna Contacto: Correo y Teléfono -->
                <td>
                  <div class="contact-info">
                    <div class="contact-item" v-if="user.correo">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{{ user.correo }}</span>
                    </div>
                    <div class="contact-item" v-if="user.telefono">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>{{ user.telefono }}</span>
                    </div>
                    <span v-if="!user.correo && !user.telefono" class="text-muted-sm">Sin datos de contacto</span>
                  </div>
                </td>

                <!-- Columna Estado -->
                <td>
                  <span class="status-pill" :class="user.activo ? 'status-active' : 'status-inactive'">
                    <span class="status-dot"></span>
                    {{ user.activo ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>

                <!-- Columna Fecha de Registro -->
                <td>
                  <div class="date-cell">
                    <span class="date-main">{{ formatearFecha(user.fecha_registro) }}</span>
                    <span class="date-sub">{{ formatearHora(user.fecha_registro) }}</span>
                  </div>
                </td>

                <!-- Columna Acciones -->
                <td>
                  <div class="actions-cell">
                    <button
                      class="btn-action view"
                      title="Ver Detalle del Usuario"
                      @click="verDetalle(user)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>Detalle</span>
                    </button>
                    <button
                      class="btn-action status"
                      :class="user.activo ? 'btn-deactivate' : 'btn-activate'"
                      :title="user.activo ? 'Desactivar usuario' : 'Activar usuario'"
                      @click="toggleEstado(user)"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Estado Vacío -->
              <tr v-if="usuarios.length === 0">
                <td colspan="6" class="empty-state">
                  <div class="empty-content">
                    <div class="empty-icon">👥</div>
                    <h4>No se encontraron usuarios</h4>
                    <p>No hay usuarios registrados actualmente en la base de datos.</p>
                    <button class="btn-primary" @click="abrirModalCrear">Registrar primer usuario</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DashboardLayout from '@/components/dashboard/DashboardLayout.vue'
import { usuariosService } from '@/services/usuarios.service'
import type { Usuario, UserRole } from '@/types'

// Estado reactivo
const usuarios = ref<Usuario[]>([])
const cargando = ref(true)
const error = ref<string | null>(null)
const mensajeExito = ref<string | null>(null)

// Métricas computadas
const totalAdmins = computed(() => usuarios.value.filter(u => u.user_role === 'SYSTEM_ADMIN').length)
const totalOdontologos = computed(() => usuarios.value.filter(u => u.user_role === 'ODONTOLOGO').length)
const totalPacientes = computed(() => usuarios.value.filter(u => u.user_role === 'PACIENTE').length)
const totalActivos = computed(() => usuarios.value.filter(u => u.activo).length)

// Cargar usuarios al montar
const cargarUsuarios = async () => {
  try {
    cargando.value = true
    error.value = null
    usuarios.value = await usuariosService.getAll()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al cargar la lista de usuarios.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarUsuarios()
})

// Acciones provisionales (se completarán en sus tareas respectivas)
const abrirModalCrear = () => {
  console.log('Abrir modal de creación de usuario')
}

const verDetalle = (user: Usuario) => {
  console.log('Ver detalle de usuario:', user.username)
}

const toggleEstado = async (user: Usuario) => {
  try {
    const actualizado = await usuariosService.toggleStatus(user.username)
    const idx = usuarios.value.findIndex(u => u.username === user.username)
    if (idx !== -1) {
      usuarios.value[idx] = actualizado
    }
    mostrarMensaje(`Usuario ${actualizado.username} ahora está ${actualizado.activo ? 'activo' : 'inactivo'}.`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error al actualizar el estado.'
  }
}

const mostrarMensaje = (msg: string) => {
  mensajeExito.value = msg
  setTimeout(() => {
    mensajeExito.value = null
  }, 3500)
}

// Helpers de formateo visual
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

const getRoleLabel = (role: UserRole): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return 'Administrador'
    case 'ODONTOLOGO':
      return 'Odontólogo'
    case 'PACIENTE':
      return 'Paciente'
    default:
      return role
  }
}

const getRoleIcon = (role: UserRole): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return '🛡️'
    case 'ODONTOLOGO':
      return '🩺'
    case 'PACIENTE':
      return '👤'
    default:
      return '•'
  }
}

const getRoleBadgeClass = (role: UserRole): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return 'role-admin'
    case 'ODONTOLOGO':
      return 'role-odontologo'
    case 'PACIENTE':
      return 'role-paciente'
    default:
      return 'role-default'
  }
}

const getAvatarClass = (role: UserRole): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return 'avatar-admin'
    case 'ODONTOLOGO':
      return 'avatar-odontologo'
    case 'PACIENTE':
      return 'avatar-paciente'
    default:
      return 'avatar-default'
  }
}

const formatearFecha = (fechaIso: string): string => {
  if (!fechaIso) return '—'
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const formatearHora = (fechaIso: string): string => {
  if (!fechaIso) return ''
  const fecha = new Date(fechaIso)
  return fecha.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.usuarios-page {
  padding: 4px 0 32px;
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
}

.header-section h2 {
  font-size: 26px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
  letter-spacing: -0.02em;
}

.count-badge {
  background: var(--primary-purple-light, #eef2ff);
  color: var(--primary-purple, #4f46e5);
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
}

.subtitle {
  color: var(--text-muted);
  font-size: 14px;
  margin: 6px 0 0 0;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--accent-teal-gradient, linear-gradient(135deg, #00c49f 0%, #00b4d8 100%));
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.25);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 196, 159, 0.35);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05));
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0,0,0,0.08));
}

.stat-icon-wrapper {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper svg {
  width: 22px;
  height: 22px;
}

.stat-icon-wrapper.purple {
  background: #f3e8ff;
  color: #9333ea;
}

.stat-icon-wrapper.indigo {
  background: #eef2ff;
  color: #4f46e5;
}

.stat-icon-wrapper.teal {
  background: #e6fffa;
  color: #0d9488;
}

.stat-icon-wrapper.green {
  background: #ecfdf5;
  color: #059669;
}

.stat-icon-wrapper.amber {
  background: #fffbeb;
  color: #d97706;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 12px;
  color: var(--text-muted, #64748b);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text-main, #1e293b);
  margin-top: 2px;
}

/* Toast */
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

.toast-icon {
  width: 20px;
  height: 20px;
  color: #10b981;
}

/* Table Card */
.table-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.users-table th {
  background: #f8fafc;
  color: var(--text-muted, #64748b);
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 14px 20px;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
}

.users-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  color: var(--text-main, #1e293b);
  font-size: 14px;
  vertical-align: middle;
}

.user-row {
  transition: background-color 0.15s ease;
}

.user-row:hover {
  background-color: rgba(241, 245, 249, 0.6);
}

/* Profile Cell */
.user-profile-cell {
  display: flex;
  align-items: center;
  gap: 14px;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.avatar-admin {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.avatar-odontologo {
  background: linear-gradient(135deg, #0d9488 0%, #0284c7 100%);
}

.avatar-paciente {
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
}

.avatar-default {
  background: linear-gradient(135deg, #64748b 0%, #94a3b8 100%);
}

.user-names {
  display: flex;
  flex-direction: column;
}

.display-name {
  font-size: 14.5px;
  font-weight: 600;
  color: var(--text-main);
}

.user-tag {
  font-size: 12.5px;
  color: var(--text-muted);
}

/* Role Badges */
.role-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 600;
}

.role-icon {
  font-size: 13px;
}

.role-admin {
  background: #ede9fe;
  color: #6d28d9;
}

.role-odontologo {
  background: #ccfbf1;
  color: #0f766e;
}

.role-paciente {
  background: #e0f2fe;
  color: #0369a1;
}

.role-default {
  background: #f1f5f9;
  color: #475569;
}

/* Contact Info */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-main);
}

.contact-item svg {
  width: 14px;
  height: 14px;
  color: var(--text-muted);
  flex-shrink: 0;
}

.text-muted-sm {
  font-size: 12px;
  color: var(--text-muted);
  font-style: italic;
}

/* Status Pill */
.status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.status-active {
  background: #dcfce7;
  color: #15803d;
}

.status-active .status-dot {
  background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
}

.status-inactive {
  background: #fee2e2;
  color: #b91c1c;
}

.status-inactive .status-dot {
  background: #ef4444;
}

/* Date Cell */
.date-cell {
  display: flex;
  flex-direction: column;
}

.date-main {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-main);
}

.date-sub {
  font-size: 11.5px;
  color: var(--text-muted);
}

/* Actions */
.actions-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid var(--border-light, #e2e8f0);
  background: var(--bg-card, #ffffff);
  color: var(--text-main);
  transition: all 0.2s ease;
}

.btn-action svg {
  width: 15px;
  height: 15px;
}

.btn-action.view:hover {
  background: var(--primary-purple-light, #eef2ff);
  color: var(--primary-purple, #4f46e5);
  border-color: #c7d2fe;
}

.btn-action.status {
  padding: 6px 8px;
}

.btn-deactivate:hover {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-activate:hover {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

/* Loading, Error and Empty states */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  gap: 14px;
  color: var(--text-muted);
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(79, 70, 229, 0.15);
  border-top-color: var(--primary-purple, #4f46e5);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-state svg {
  width: 40px;
  height: 40px;
  color: #ef4444;
}

.btn-retry {
  background: var(--primary-purple, #4f46e5);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 48px 20px !important;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 4px;
}

.empty-content h4 {
  margin: 0;
  font-size: 16px;
  color: var(--text-main);
}

.empty-content p {
  margin: 0 0 12px 0;
  font-size: 13.5px;
  color: var(--text-muted);
}

/* Dark theme overrides */
html.dark .users-table th {
  background: #111827;
  border-bottom-color: #1f2937;
}

html.dark .users-table td {
  border-bottom-color: #1f2937;
}

html.dark .user-row:hover {
  background-color: rgba(31, 41, 55, 0.5);
}

html.dark .role-admin {
  background: rgba(124, 58, 237, 0.2);
  color: #c4b5fd;
}

html.dark .role-odontologo {
  background: rgba(13, 148, 136, 0.2);
  color: #5eead4;
}

html.dark .role-paciente {
  background: rgba(2, 132, 199, 0.2);
  color: #7dd3fc;
}

html.dark .status-active {
  background: rgba(21, 128, 61, 0.2);
  color: #86efac;
}

html.dark .status-inactive {
  background: rgba(185, 28, 28, 0.2);
  color: #fca5a5;
}

html.dark .stat-icon-wrapper.purple {
  background: rgba(147, 51, 234, 0.2);
  color: #d8b4fe;
}

html.dark .stat-icon-wrapper.indigo {
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
}

html.dark .stat-icon-wrapper.teal {
  background: rgba(13, 148, 136, 0.2);
  color: #5eead4;
}

html.dark .stat-icon-wrapper.green {
  background: rgba(5, 150, 105, 0.2);
  color: #6ee7b7;
}

html.dark .stat-icon-wrapper.amber {
  background: rgba(217, 119, 6, 0.2);
  color: #fcd34d;
}

html.dark .toast-success {
  background: rgba(6, 95, 70, 0.3);
  border-color: rgba(16, 185, 129, 0.4);
  color: #a7f3d0;
}

/* Responsiveness */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-primary {
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
