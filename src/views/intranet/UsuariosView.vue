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

      <!-- Filtros y Barra de Búsqueda -->
      <div class="filters-card">
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="busqueda"
            type="text"
            class="search-input"
            placeholder="Buscar por usuario, nombre, correo o teléfono..."
          />
          <button v-if="busqueda" class="clear-search-btn" @click="busqueda = ''" title="Limpiar búsqueda">
            ×
          </button>
        </div>

        <div class="filter-controls">
          <!-- Filtro por Rol -->
          <div class="filter-group">
            <label class="filter-label">Rol:</label>
            <select v-model="filtroRol" class="filter-select">
              <option value="TODOS">Todos los roles</option>
              <option value="SYSTEM_ADMIN">🛡️ Administrador</option>
              <option value="ODONTOLOGO">🩺 Odontólogo</option>
              <option value="PACIENTE">👤 Paciente</option>
            </select>
          </div>

          <!-- Filtro por Estado -->
          <div class="filter-group">
            <label class="filter-label">Estado:</label>
            <select v-model="filtroEstado" class="filter-select">
              <option value="TODOS">Todos los estados</option>
              <option value="ACTIVOS">Solo Activos</option>
              <option value="INACTIVOS">Solo Inactivos</option>
            </select>
          </div>

          <!-- Ordenar por -->
          <div class="filter-group">
            <label class="filter-label">Ordenar:</label>
            <select v-model="ordenarPor" class="filter-select">
              <option value="recientes">Más recientes</option>
              <option value="antiguos">Más antiguos</option>
              <option value="nombre_asc">Nombre (A - Z)</option>
              <option value="nombre_desc">Nombre (Z - A)</option>
            </select>
          </div>

          <!-- Botón de Reset si hay filtros activos -->
          <button
            v-if="filtrosActivos"
            class="btn-reset-filters"
            @click="limpiarFiltros"
            title="Restablecer todos los filtros"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Limpiar
          </button>
        </div>
      </div>

      <!-- Resumen de resultados filtrados -->
      <div class="results-summary">
        <span class="results-count">
          Mostrando <strong>{{ usuariosFiltrados.length }}</strong> de <strong>{{ usuarios.length }}</strong> usuarios
        </span>
        <span v-if="filtrosActivos" class="filtered-badge">Filtros aplicados</span>
      </div>

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
              <tr v-for="user in usuariosFiltrados" :key="user.username" class="user-row">
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
              <tr v-if="usuariosFiltrados.length === 0">
                <td colspan="6" class="empty-state">
                  <div class="empty-content">
                    <div class="empty-icon">{{ filtrosActivos ? '🔍' : '👥' }}</div>
                    <h4>{{ filtrosActivos ? 'No se encontraron coincidencias' : 'No se encontraron usuarios' }}</h4>
                    <p v-if="filtrosActivos">
                      No hay usuarios que coincidan con los criterios de búsqueda o filtros seleccionados.
                    </p>
                    <p v-else>No hay usuarios registrados actualmente en el sistema.</p>
                    <button v-if="filtrosActivos" class="btn-primary" @click="limpiarFiltros">
                      Restablecer filtros
                    </button>
                    <button v-else class="btn-primary" @click="abrirModalCrear">
                      Registrar primer usuario
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Crear Usuario -->
      <transition name="modal-fade">
        <div v-if="mostrarModalCrear" class="modal-overlay" @click.self="cerrarModalCrear">
          <div class="modal-card">
            <div class="modal-header">
              <div class="modal-header-title">
                <div class="modal-icon-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div>
                  <h3>Registrar Nuevo Usuario</h3>
                  <p class="modal-subtitle">Completa la información para crear una nueva cuenta de acceso.</p>
                </div>
              </div>
              <button class="modal-close-btn" @click="cerrarModalCrear" title="Cerrar">×</button>
            </div>

            <form @submit.prevent="guardarNuevoUsuario" class="modal-body">
              <div class="form-grid">
                <!-- Nombre de Usuario -->
                <div class="form-group">
                  <label class="form-label required">Nombre de Usuario (Username)</label>
                  <div class="input-with-icon">
                    <span class="input-prefix">@</span>
                    <input
                      v-model="formCrear.username"
                      type="text"
                      class="form-input with-prefix"
                      :class="{ 'has-error': erroresForm.username }"
                      placeholder="ej. juan.perez"
                      @input="validarCampo('username')"
                    />
                  </div>
                  <span v-if="erroresForm.username" class="error-text">{{ erroresForm.username }}</span>
                </div>

                <!-- Contraseña -->
                <div class="form-group">
                  <label class="form-label required">Contraseña Inicial</label>
                  <div class="input-with-icon">
                    <input
                      v-model="formCrear.password"
                      :type="mostrarPassword ? 'text' : 'password'"
                      class="form-input"
                      :class="{ 'has-error': erroresForm.password }"
                      placeholder="Mínimo 6 caracteres"
                      @input="validarCampo('password')"
                    />
                    <button
                      type="button"
                      class="btn-toggle-password"
                      @click="mostrarPassword = !mostrarPassword"
                      tabindex="-1"
                    >
                      <svg v-if="!mostrarPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    </button>
                  </div>
                  <span v-if="erroresForm.password" class="error-text">{{ erroresForm.password }}</span>
                </div>

                <!-- Nombre Completo -->
                <div class="form-group span-2">
                  <label class="form-label required">Nombre Completo</label>
                  <input
                    v-model="formCrear.nombre_completo"
                    type="text"
                    class="form-input"
                    :class="{ 'has-error': erroresForm.nombre_completo }"
                    placeholder="ej. Juan Carlos Pérez Silva"
                    @input="validarCampo('nombre_completo')"
                  />
                  <span v-if="erroresForm.nombre_completo" class="error-text">{{ erroresForm.nombre_completo }}</span>
                </div>

                <!-- Rol -->
                <div class="form-group">
                  <label class="form-label required">Rol del Usuario</label>
                  <select
                    v-model="formCrear.user_role"
                    class="form-select"
                  >
                    <option value="SYSTEM_ADMIN">🛡️ Administrador del Sistema</option>
                    <option value="ODONTOLOGO">🩺 Odontólogo / Especialista</option>
                    <option value="PACIENTE">👤 Paciente</option>
                  </select>
                </div>

                <!-- Correo Electrónico -->
                <div class="form-group">
                  <label class="form-label">Correo Electrónico</label>
                  <input
                    v-model="formCrear.correo"
                    type="email"
                    class="form-input"
                    :class="{ 'has-error': erroresForm.correo }"
                    placeholder="ej. usuario@solident.com"
                    @input="validarCampo('correo')"
                  />
                  <span v-if="erroresForm.correo" class="error-text">{{ erroresForm.correo }}</span>
                </div>

                <!-- Teléfono -->
                <div class="form-group">
                  <label class="form-label">Teléfono (9 dígitos)</label>
                  <input
                    v-model="formCrear.telefono"
                    type="tel"
                    maxlength="9"
                    class="form-input"
                    :class="{ 'has-error': erroresForm.telefono }"
                    placeholder="ej. 987654321"
                    @input="validarCampo('telefono')"
                  />
                  <span v-if="erroresForm.telefono" class="error-text">{{ erroresForm.telefono }}</span>
                </div>

                <!-- Estado Inicial -->
                <div class="form-group">
                  <label class="form-label">Estado Inicial</label>
                  <div class="toggle-control">
                    <label class="switch-label">
                      <input type="checkbox" v-model="formCrear.activo" class="toggle-checkbox" />
                      <span class="toggle-slider"></span>
                      <span class="toggle-text">{{ formCrear.activo ? 'Usuario Activo' : 'Usuario Inactivo' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Mensaje de error general si ocurre al guardar -->
              <div v-if="errorCreacion" class="error-banner">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" stroke-width="2" />
                  <line x1="12" y1="8" x2="12" y2="12" stroke-width="2" />
                  <line x1="12" y1="16" x2="12.01" y2="16" stroke-width="2" />
                </svg>
                <span>{{ errorCreacion }}</span>
              </div>

              <div class="modal-footer">
                <button type="button" class="btn-cancel" @click="cerrarModalCrear">
                  Cancelar
                </button>
                <button type="submit" class="btn-submit" :disabled="guardandoUsuario">
                  <span v-if="guardandoUsuario" class="btn-spinner"></span>
                  <span>{{ guardandoUsuario ? 'Guardando...' : 'Crear Usuario' }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>

      <!-- Modal: Detalle de Usuario -->
      <transition name="modal-fade">
        <div v-if="usuarioSeleccionado" class="modal-overlay" @click.self="cerrarDetalle">
          <div class="modal-card modal-detail-card">
            <div class="modal-header detail-header">
              <div class="detail-header-profile">
                <div class="avatar avatar-large" :class="getAvatarClass(usuarioSeleccionado.user_role)">
                  {{ getInitials(usuarioSeleccionado.nombre_completo || usuarioSeleccionado.username) }}
                </div>
                <div class="detail-header-info">
                  <div class="detail-name-row">
                    <h3>{{ usuarioSeleccionado.nombre_completo || usuarioSeleccionado.username }}</h3>
                    <span class="status-pill" :class="usuarioSeleccionado.activo ? 'status-active' : 'status-inactive'">
                      <span class="status-dot"></span>
                      {{ usuarioSeleccionado.activo ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                  <div class="detail-sub-row">
                    <span class="user-tag-lg">@{{ usuarioSeleccionado.username }}</span>
                    <span class="role-badge" :class="getRoleBadgeClass(usuarioSeleccionado.user_role)">
                      <span class="role-icon">{{ getRoleIcon(usuarioSeleccionado.user_role) }}</span>
                      {{ getRoleLabel(usuarioSeleccionado.user_role) }}
                    </span>
                  </div>
                </div>
              </div>
              <button class="modal-close-btn" @click="cerrarDetalle" title="Cerrar">×</button>
            </div>

            <div class="modal-body detail-body">
              <!-- Grid de información de cuenta y contacto -->
              <div class="detail-sections-grid">
                <!-- Tarjeta 1: Cuenta y Acceso -->
                <div class="detail-card-box">
                  <div class="detail-box-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h4>Información de Cuenta</h4>
                  </div>
                  <div class="detail-items-list">
                    <div class="detail-item">
                      <span class="detail-item-label">Identificador:</span>
                      <span class="detail-item-value">@{{ usuarioSeleccionado.username }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-item-label">Fecha de Registro:</span>
                      <span class="detail-item-value">{{ formatearFecha(usuarioSeleccionado.fecha_registro) }} a las {{ formatearHora(usuarioSeleccionado.fecha_registro) }}</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-item-label">Último Acceso:</span>
                      <span class="detail-item-value">
                        {{ usuarioSeleccionado.ultimo_acceso ? formatearFecha(usuarioSeleccionado.ultimo_acceso) + ' ' + formatearHora(usuarioSeleccionado.ultimo_acceso) : 'Sin inicio de sesión reciente' }}
                      </span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-item-label">Estado de la cuenta:</span>
                      <div class="detail-status-action">
                        <span class="badge-status-text" :class="usuarioSeleccionado.activo ? 'text-green' : 'text-red'">
                          {{ usuarioSeleccionado.activo ? 'Habilitado para ingresar' : 'Acceso restringido' }}
                        </span>
                        <button
                          class="btn-text-action"
                          @click="toggleEstadoModal(usuarioSeleccionado)"
                        >
                          {{ usuarioSeleccionado.activo ? 'Desactivar' : 'Activar' }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tarjeta 2: Datos de Contacto -->
                <div class="detail-card-box">
                  <div class="detail-box-title">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <h4>Datos de Contacto</h4>
                  </div>
                  <div class="detail-items-list">
                    <div class="detail-item">
                      <span class="detail-item-label">Correo Electrónico:</span>
                      <span class="detail-item-value" v-if="usuarioSeleccionado.correo">
                        <a :href="'mailto:' + usuarioSeleccionado.correo" class="link-contact">
                          {{ usuarioSeleccionado.correo }}
                        </a>
                      </span>
                      <span class="detail-item-value text-muted" v-else>No especificado</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-item-label">Teléfono / Celular:</span>
                      <span class="detail-item-value" v-if="usuarioSeleccionado.telefono">
                        <a :href="'tel:' + usuarioSeleccionado.telefono" class="link-contact">
                          {{ usuarioSeleccionado.telefono }}
                        </a>
                      </span>
                      <span class="detail-item-value text-muted" v-else>No especificado</span>
                    </div>
                    <div class="detail-item">
                      <span class="detail-item-label">Tipo de Perfil:</span>
                      <span class="detail-item-value font-medium">{{ getRoleLabel(usuarioSeleccionado.user_role) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tarjeta 3: Alcance y Permisos del Rol -->
              <div class="detail-card-box full-width">
                <div class="detail-box-title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <h4>Privilegios y Permisos Asignados</h4>
                </div>
                <p class="role-desc-text">{{ getRoleDescription(usuarioSeleccionado.user_role) }}</p>
                <div class="permissions-chips">
                  <div
                    v-for="perm in getPermissionsList(usuarioSeleccionado.user_role)"
                    :key="perm"
                    class="perm-chip"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{{ perm }}</span>
                  </div>
                </div>
              </div>

              <div class="modal-footer">
                <button
                  type="button"
                  class="btn-action-status-modal"
                  :class="usuarioSeleccionado.activo ? 'btn-deactivate-lg' : 'btn-activate-lg'"
                  @click="toggleEstadoModal(usuarioSeleccionado)"
                >
                  {{ usuarioSeleccionado.activo ? 'Desactivar Cuenta' : 'Activar Cuenta' }}
                </button>
                <button type="button" class="btn-primary" @click="cerrarDetalle">
                  Entendido / Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
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

// Búsqueda y filtros
const busqueda = ref('')
const filtroRol = ref<'TODOS' | UserRole>('TODOS')
const filtroEstado = ref<'TODOS' | 'ACTIVOS' | 'INACTIVOS'>('TODOS')
const ordenarPor = ref<'recientes' | 'antiguos' | 'nombre_asc' | 'nombre_desc'>('recientes')

const filtrosActivos = computed(() => {
  return (
    busqueda.value.trim() !== '' ||
    filtroRol.value !== 'TODOS' ||
    filtroEstado.value !== 'TODOS' ||
    ordenarPor.value !== 'recientes'
  )
})

const limpiarFiltros = () => {
  busqueda.value = ''
  filtroRol.value = 'TODOS'
  filtroEstado.value = 'TODOS'
  ordenarPor.value = 'recientes'
}

const usuariosFiltrados = computed(() => {
  let resultado = [...usuarios.value]

  // Búsqueda por texto
  if (busqueda.value.trim()) {
    const q = busqueda.value.trim().toLowerCase()
    resultado = resultado.filter(u => {
      const usernameMatch = u.username.toLowerCase().includes(q)
      const nombreMatch = (u.nombre_completo || '').toLowerCase().includes(q)
      const correoMatch = (u.correo || '').toLowerCase().includes(q)
      const telMatch = (u.telefono || '').toLowerCase().includes(q)
      return usernameMatch || nombreMatch || correoMatch || telMatch
    })
  }

  // Filtro por Rol
  if (filtroRol.value !== 'TODOS') {
    resultado = resultado.filter(u => u.user_role === filtroRol.value)
  }

  // Filtro por Estado
  if (filtroEstado.value === 'ACTIVOS') {
    resultado = resultado.filter(u => u.activo)
  } else if (filtroEstado.value === 'INACTIVOS') {
    resultado = resultado.filter(u => !u.activo)
  }

  // Ordenamiento
  resultado.sort((a, b) => {
    if (ordenarPor.value === 'recientes') {
      return new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
    }
    if (ordenarPor.value === 'antiguos') {
      return new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime()
    }
    if (ordenarPor.value === 'nombre_asc') {
      const nombreA = a.nombre_completo || a.username
      const nombreB = b.nombre_completo || b.username
      return nombreA.localeCompare(nombreB)
    }
    if (ordenarPor.value === 'nombre_desc') {
      const nombreA = a.nombre_completo || a.username
      const nombreB = b.nombre_completo || b.username
      return nombreB.localeCompare(nombreA)
    }
    return 0
  })

  return resultado
})

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

// Estado del modal de creación
const mostrarModalCrear = ref(false)
const guardandoUsuario = ref(false)
const errorCreacion = ref<string | null>(null)
const mostrarPassword = ref(false)

const formCrear = ref({
  username: '',
  password: '',
  nombre_completo: '',
  correo: '',
  telefono: '',
  user_role: 'PACIENTE' as UserRole,
  activo: true,
})

const erroresForm = ref({
  username: '',
  password: '',
  nombre_completo: '',
  correo: '',
  telefono: '',
})

const abrirModalCrear = () => {
  formCrear.value = {
    username: '',
    password: '',
    nombre_completo: '',
    correo: '',
    telefono: '',
    user_role: 'PACIENTE',
    activo: true,
  }
  erroresForm.value = {
    username: '',
    password: '',
    nombre_completo: '',
    correo: '',
    telefono: '',
  }
  errorCreacion.value = null
  mostrarPassword.value = false
  mostrarModalCrear.value = true
}

const cerrarModalCrear = () => {
  mostrarModalCrear.value = false
}

const validarCampo = (campo: string) => {
  switch (campo) {
    case 'username': {
      formCrear.value.username = (formCrear.value.username || '').replace(/[^a-zA-Z0-9._-]/g, '')
      const u = formCrear.value.username.trim()
      if (!u) {
        erroresForm.value.username = 'El nombre de usuario es obligatorio.'
      } else if (u.length < 3) {
        erroresForm.value.username = 'Debe tener al menos 3 caracteres.'
      } else {
        erroresForm.value.username = ''
      }
      break
    }
    case 'password': {
      const p = formCrear.value.password
      if (!p) {
        erroresForm.value.password = 'La contraseña es obligatoria.'
      } else if (p.length < 6) {
        erroresForm.value.password = 'La contraseña debe tener al menos 6 caracteres.'
      } else {
        erroresForm.value.password = ''
      }
      break
    }
    case 'nombre_completo': {
      const n = formCrear.value.nombre_completo.trim()
      if (!n) {
        erroresForm.value.nombre_completo = 'El nombre completo es obligatorio.'
      } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(n)) {
        erroresForm.value.nombre_completo = 'El nombre solo debe contener letras.'
      } else {
        erroresForm.value.nombre_completo = ''
      }
      break
    }
    case 'correo': {
      const c = formCrear.value.correo.trim()
      if (c && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)) {
        erroresForm.value.correo = 'Formato de correo electrónico inválido.'
      } else {
        erroresForm.value.correo = ''
      }
      break
    }
    case 'telefono': {
      formCrear.value.telefono = (formCrear.value.telefono || '').replace(/\D/g, '')
      const t = formCrear.value.telefono
      if (t && t.length !== 9) {
        erroresForm.value.telefono = 'El teléfono debe tener exactamente 9 dígitos.'
      } else {
        erroresForm.value.telefono = ''
      }
      break
    }
  }
}

const validarFormularioCompleto = (): boolean => {
  validarCampo('username')
  validarCampo('password')
  validarCampo('nombre_completo')
  validarCampo('correo')
  validarCampo('telefono')
  return !Object.values(erroresForm.value).some(err => err !== '')
}

const guardarNuevoUsuario = async () => {
  if (!validarFormularioCompleto()) {
    return
  }

  try {
    guardandoUsuario.value = true
    errorCreacion.value = null

    const nuevo = await usuariosService.create({
      username: formCrear.value.username.trim(),
      password: formCrear.value.password,
      nombre_completo: formCrear.value.nombre_completo.trim(),
      correo: formCrear.value.correo.trim() || undefined,
      telefono: formCrear.value.telefono.trim() || undefined,
      user_role: formCrear.value.user_role,
      activo: formCrear.value.activo,
    })

    usuarios.value.unshift(nuevo)
    cerrarModalCrear()
    mostrarMensaje(`¡Usuario @${nuevo.username} creado exitosamente!`)
  } catch (err) {
    errorCreacion.value = err instanceof Error ? err.message : 'Error al registrar el usuario.'
  } finally {
    guardandoUsuario.value = false
  }
}

// Estado del modal de detalle
const usuarioSeleccionado = ref<Usuario | null>(null)

const verDetalle = (user: Usuario) => {
  usuarioSeleccionado.value = { ...user }
}

const cerrarDetalle = () => {
  usuarioSeleccionado.value = null
}

const toggleEstadoModal = async (user: Usuario) => {
  await toggleEstado(user)
  const actualizado = usuarios.value.find(u => u.username === user.username)
  if (actualizado) {
    usuarioSeleccionado.value = { ...actualizado }
  }
}

const getRoleDescription = (role: UserRole): string => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return 'Acceso administrativo total. Permite configurar la plataforma, gestionar usuarios, auditar pagos y supervisar la operación global de la clínica.'
    case 'ODONTOLOGO':
      return 'Perfil médico clínico. Permite visualizar la agenda de citas médicas, registrar diagnósticos, ejecutar tratamientos y solicitar insumos.'
    case 'PACIENTE':
      return 'Perfil de usuario final. Permite gestionar y agendar sus citas odontológicas personales, visualizar historiales y verificar estados de pago.'
    default:
      return 'Perfil estándar de usuario del sistema.'
  }
}

const getPermissionsList = (role: UserRole): string[] => {
  switch (role) {
    case 'SYSTEM_ADMIN':
      return [
        'Gestión total de usuarios y credenciales',
        'Control y administración de inventario y stock',
        'Registro y visualización de pagos e ingresos',
        'Administración y supervisión de citas clínicas',
        'Configuración general del sistema SoliDent',
      ]
    case 'ODONTOLOGO':
      return [
        'Gestión de agenda y citas asignadas',
        'Registro clínico de atenciones odontológicas',
        'Evolución y seguimiento de tratamientos',
        'Consulta de pacientes e insumos médicos',
      ]
    case 'PACIENTE':
      return [
        'Reserva y reprogramación de citas propias',
        'Consulta de historial médico y odontológico',
        'Visualización de pagos y comprobantes',
        'Actualización de datos personales de contacto',
      ]
    default:
      return ['Acceso básico de consulta']
  }
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

/* Filters Card */
.filters-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  padding: 16px 20px;
  margin-bottom: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  box-shadow: var(--shadow-sm);
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 280px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 14px;
  width: 18px;
  height: 18px;
  color: var(--text-muted, #64748b);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px 38px 10px 42px;
  background: var(--bg-input, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-main, #1e293b);
  transition: all 0.2s ease;
  outline: none;
}

.search-input:focus {
  border-color: var(--border-focus, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.clear-search-btn {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 20px;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
}

.clear-search-btn:hover {
  color: var(--text-main);
  background: var(--border-light);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
}

.filter-select {
  padding: 9px 14px;
  background: var(--bg-input, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 10px;
  font-size: 13.5px;
  color: var(--text-main);
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  border-color: var(--border-focus, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.btn-reset-filters {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 9px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset-filters:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.btn-reset-filters svg {
  width: 14px;
  height: 14px;
}

/* Results Summary */
.results-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding: 0 4px;
  font-size: 13.5px;
  color: var(--text-muted);
}

.results-count strong {
  color: var(--text-main);
}

.filtered-badge {
  background: #eef2ff;
  color: #4f46e5;
  font-size: 12px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
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

html.dark .filters-card {
  background-color: var(--bg-card);
  border-color: var(--border-light);
}

html.dark .search-input,
html.dark .filter-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

html.dark .btn-reset-filters {
  background: #1e293b;
  border-color: #334155;
  color: #cbd5e1;
}

html.dark .btn-reset-filters:hover {
  background: #334155;
  color: #ffffff;
}

html.dark .filtered-badge {
  background: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
}

/* Modal Overlay and Card */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.65);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.modal-card {
  background: var(--bg-card, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 18px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalScaleUp {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(8px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--border-light, #e2e8f0);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #f8fafc;
}

.modal-header-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.modal-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #eef2ff;
  color: #4f46e5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon-badge svg {
  width: 22px;
  height: 22px;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: var(--text-main);
}

.modal-subtitle {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--text-muted);
}

.modal-close-btn {
  background: none;
  border: none;
  font-size: 26px;
  line-height: 1;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.modal-close-btn:hover {
  background: var(--border-light);
  color: var(--text-main);
}

.modal-body {
  padding: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group.span-2 {
  grid-column: span 2;
}

.form-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-main);
}

.form-label.required::after {
  content: ' *';
  color: #ef4444;
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 12px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-muted);
  pointer-events: none;
}

.form-input.with-prefix {
  padding-left: 30px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 14px;
  background: var(--bg-input, #ffffff);
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 10px;
  font-size: 14px;
  color: var(--text-main);
  outline: none;
  transition: all 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: var(--border-focus, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.form-input.has-error {
  border-color: #ef4444;
  background-color: #fffbfa;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  font-weight: 500;
}

.btn-toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
}

.btn-toggle-password svg {
  width: 18px;
  height: 18px;
}

.btn-toggle-password:hover {
  color: var(--text-main);
}

/* Toggle Control */
.toggle-control {
  padding: 6px 0;
}

.switch-label {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-checkbox {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: #cbd5e1;
  border-radius: 9999px;
  position: relative;
  transition: background-color 0.2s ease;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  top: 3px;
  left: 3px;
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.toggle-checkbox:checked + .toggle-slider {
  background: #10b981;
}

.toggle-checkbox:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-text {
  font-size: 13.5px;
  font-weight: 500;
  color: var(--text-main);
}

.error-banner {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
}

.error-banner svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.modal-footer {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 18px;
  border-top: 1px solid var(--border-light, #e2e8f0);
}

.btn-cancel {
  padding: 10px 18px;
  border-radius: 10px;
  border: 1px solid var(--border-light, #e2e8f0);
  background: transparent;
  color: var(--text-main);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-cancel:hover {
  background: #f1f5f9;
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  border-radius: 10px;
  border: none;
  background: var(--accent-teal-gradient, linear-gradient(135deg, #00c49f 0%, #00b4d8 100%));
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 196, 159, 0.25);
  transition: all 0.2s ease;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(0, 196, 159, 0.35);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Dark mode for Modal */
html.dark .modal-card {
  background-color: #131b2e;
  border-color: #1e293b;
}

html.dark .modal-header {
  background-color: #0f172a;
  border-bottom-color: #1e293b;
}

html.dark .modal-icon-badge {
  background-color: rgba(79, 70, 229, 0.2);
  color: #a5b4fc;
}

html.dark .form-input,
html.dark .form-select {
  background-color: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

html.dark .form-input.has-error {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

html.dark .toggle-slider {
  background: #334155;
}

html.dark .error-banner {
  background: rgba(185, 28, 28, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

html.dark .modal-footer {
  border-top-color: #1e293b;
}

html.dark .btn-cancel {
  border-color: #334155;
  color: #cbd5e1;
}

html.dark .btn-cancel:hover {
  background-color: #1e293b;
  color: #f8fafc;
}

/* User Detail Modal Styles */
.modal-detail-card {
  max-width: 680px;
}

.detail-header {
  padding: 24px;
}

.detail-header-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-large {
  width: 58px;
  height: 58px;
  font-size: 20px;
  border-radius: 16px;
}

.detail-header-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-name-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.detail-name-row h3 {
  font-size: 20px;
  font-weight: 700;
  color: var(--text-main);
  margin: 0;
}

.detail-sub-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-tag-lg {
  font-size: 14px;
  color: var(--text-muted);
  font-weight: 500;
}

.detail-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-sections-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-card-box {
  background: #f8fafc;
  border: 1px solid var(--border-light, #e2e8f0);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-card-box.full-width {
  grid-column: span 2;
}

.detail-box-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--primary-purple, #4f46e5);
}

.detail-box-title svg {
  width: 18px;
  height: 18px;
}

.detail-box-title h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main);
}

.detail-items-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.detail-item-label {
  font-size: 11.5px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
  color: var(--text-muted);
}

.detail-item-value {
  font-size: 13.5px;
  color: var(--text-main);
}

.detail-item-value.font-medium {
  font-weight: 600;
}

.link-contact {
  color: var(--primary-purple, #4f46e5);
  text-decoration: none;
  font-weight: 500;
}

.link-contact:hover {
  text-decoration: underline;
}

.detail-status-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
}

.badge-status-text {
  font-size: 12.5px;
  font-weight: 600;
}

.text-green {
  color: #16a34a;
}

.text-red {
  color: #dc2626;
}

.btn-text-action {
  background: none;
  border: none;
  color: var(--primary-purple, #4f46e5);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: all 0.15s ease;
}

.btn-text-action:hover {
  background: rgba(79, 70, 229, 0.1);
}

.role-desc-text {
  margin: 0;
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}

.permissions-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
}

.perm-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid var(--border-light, #e2e8f0);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  color: var(--text-main);
  font-weight: 500;
}

.perm-chip svg {
  width: 14px;
  height: 14px;
  color: #10b981;
}

.btn-action-status-modal {
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.btn-deactivate-lg {
  background: #fef2f2;
  color: #dc2626;
  border-color: #fecaca;
}

.btn-deactivate-lg:hover {
  background: #fee2e2;
}

.btn-activate-lg {
  background: #f0fdf4;
  color: #16a34a;
  border-color: #bbf7d0;
}

.btn-activate-lg:hover {
  background: #dcfce7;
}

/* Dark mode for Detail Modal */
html.dark .detail-card-box {
  background: #0b0f19;
  border-color: #1e293b;
}

html.dark .perm-chip {
  background: #1e293b;
  border-color: #334155;
  color: #f8fafc;
}

html.dark .detail-box-title {
  color: #a5b4fc;
}

html.dark .btn-deactivate-lg {
  background: rgba(220, 38, 38, 0.15);
  border-color: rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

html.dark .btn-activate-lg {
  background: rgba(22, 163, 74, 0.15);
  border-color: rgba(34, 197, 94, 0.3);
  color: #86efac;
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
