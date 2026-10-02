<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

// Campos del formulario
const dni = ref('')
const nombres = ref('')
const apellidos = ref('')
const telefono = ref('')
const correo = ref('')
const fechaNacimiento = ref('')
const direccion = ref('')
const password = ref('')
const confirmPassword = ref('')

// Estados de interfaz
const mostrarPassword = ref(false)
const mostrarConfirmPassword = ref(false)
const cargando = ref(false)
const mensajeError = ref('')
const mensajeExito = ref('')

// Errores por campo
const errores = ref<Record<string, string>>({})

function limpiarErrores() {
  errores.value = {}
  mensajeError.value = ''
}

function validarFormulario(): boolean {
  limpiarErrores()
  let valido = true

  const dniLimpio = dni.value.trim()
  if (!dniLimpio) {
    errores.value.dni = 'El DNI es obligatorio.'
    valido = false
  } else if (!/^\d{8}$/.test(dniLimpio)) {
    errores.value.dni = 'El DNI debe tener exactamente 8 dígitos numéricos.'
    valido = false
  }

  const nombresLimpios = nombres.value.trim()
  if (!nombresLimpios) {
    errores.value.nombres = 'Los nombres son obligatorios.'
    valido = false
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombresLimpios)) {
    errores.value.nombres = 'Solo se permiten letras.'
    valido = false
  }

  const apellidosLimpios = apellidos.value.trim()
  if (!apellidosLimpios) {
    errores.value.apellidos = 'Los apellidos son obligatorios.'
    valido = false
  } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(apellidosLimpios)) {
    errores.value.apellidos = 'Solo se permiten letras.'
    valido = false
  }

  const telLimpio = telefono.value.trim().replace(/\D/g, '')
  if (!telLimpio) {
    errores.value.telefono = 'El teléfono es obligatorio.'
    valido = false
  } else if (telLimpio.length !== 9) {
    errores.value.telefono = 'El teléfono debe tener 9 dígitos.'
    valido = false
  }

  const correoLimpio = correo.value.trim().toLowerCase()
  if (!correoLimpio) {
    errores.value.correo = 'El correo electrónico es obligatorio.'
    valido = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
    errores.value.correo = 'Ingresa un correo electrónico válido.'
    valido = false
  }

  if (!fechaNacimiento.value) {
    errores.value.fechaNacimiento = 'La fecha de nacimiento es obligatoria.'
    valido = false
  }

  if (!password.value) {
    errores.value.password = 'La contraseña es obligatoria.'
    valido = false
  } else if (password.value.length < 6) {
    errores.value.password = 'La contraseña debe tener al menos 6 caracteres.'
    valido = false
  }

  if (!confirmPassword.value) {
    errores.value.confirmPassword = 'Debes confirmar la contraseña.'
    valido = false
  } else if (password.value !== confirmPassword.value) {
    errores.value.confirmPassword = 'Las contraseñas no coinciden.'
    valido = false
  }

  if (!valido) {
    mensajeError.value = 'Por favor corrige los campos señalados.'
  }

  return valido
}

async function registrarse() {
  if (!validarFormulario()) return

  cargando.value = true
  mensajeError.value = ''
  mensajeExito.value = ''

  try {
    const payload = {
      username: correo.value.trim().toLowerCase(),
      password: password.value,
      dni: dni.value.trim(),
      nombres: nombres.value.trim(),
      apellidos: apellidos.value.trim(),
      telefono: telefono.value.trim().replace(/\D/g, ''),
      correo: correo.value.trim().toLowerCase(),
      fecha_nacimiento: fechaNacimiento.value,
      direccion: direccion.value.trim() || undefined,
    }

    const resultado = await authStore.register(payload)

    if (resultado.success) {
      mensajeExito.value = '¡Tu cuenta ha sido creada exitosamente! Redirigiendo...'
      setTimeout(() => {
        if (authStore.isAuthenticated) {
          if (authStore.userRole === 'PACIENTE') {
            router.push('/')
          } else {
            router.push('/dashboard')
          }
        } else {
          router.push('/login')
        }
      }, 1500)
    } else {
      mensajeError.value = resultado.message || 'No se pudo completar el registro.'
    }
  } catch (err: any) {
    mensajeError.value = err.message || 'Ocurrió un error inesperado al registrarte.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <main class="register-page">
    <div class="register-background">
      <div class="background-glow glow-one"></div>
      <div class="background-glow glow-two"></div>
      <div class="background-grid"></div>
    </div>

    <section class="register-card">
      <RouterLink to="/login" class="back-arrow" aria-label="Volver al login">
        ←
      </RouterLink>

      <div class="register-header">
        <div class="brand-logo">
          <span>S</span>
        </div>
        <h1>Soli<span>Dent</span></h1>
        <p class="register-subtitle">Portal de Pacientes</p>
        <div class="welcome-text">
          <h2>Crea tu Cuenta</h2>
          <p>Regístrate para gestionar tus citas, tratamientos y pagos en línea.</p>
        </div>
      </div>

      <div v-if="mensajeError" class="alert-box error-alert">
        ⚠️ {{ mensajeError }}
      </div>

      <div v-if="mensajeExito" class="alert-box success-alert">
        ✅ {{ mensajeExito }}
      </div>

      <form @submit.prevent="registrarse" novalidate class="register-form">
        <div class="form-grid">
          <!-- DNI -->
          <div class="form-group">
            <label for="dni">DNI / Documento</label>
            <div class="input-wrapper">
              <span class="input-icon">🪪</span>
              <input
                id="dni"
                v-model="dni"
                @input="errores.dni = ''"
                type="text"
                maxlength="8"
                inputmode="numeric"
                placeholder="8 dígitos (ej. 71234567)"
                :class="{ 'input-error': errores.dni }"
              />
            </div>
            <span v-if="errores.dni" class="field-error">⚠ {{ errores.dni }}</span>
          </div>

          <!-- Teléfono -->
          <div class="form-group">
            <label for="telefono">Teléfono / WhatsApp</label>
            <div class="input-wrapper">
              <span class="input-icon">📱</span>
              <input
                id="telefono"
                v-model="telefono"
                @input="errores.telefono = ''"
                type="tel"
                maxlength="9"
                inputmode="numeric"
                placeholder="9 dígitos (ej. 987654321)"
                :class="{ 'input-error': errores.telefono }"
              />
            </div>
            <span v-if="errores.telefono" class="field-error">⚠ {{ errores.telefono }}</span>
          </div>

          <!-- Nombres -->
          <div class="form-group">
            <label for="nombres">Nombres</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                id="nombres"
                v-model="nombres"
                @input="errores.nombres = ''"
                type="text"
                placeholder="Ej. Juan Carlos"
                :class="{ 'input-error': errores.nombres }"
              />
            </div>
            <span v-if="errores.nombres" class="field-error">⚠ {{ errores.nombres }}</span>
          </div>

          <!-- Apellidos -->
          <div class="form-group">
            <label for="apellidos">Apellidos</label>
            <div class="input-wrapper">
              <span class="input-icon">👤</span>
              <input
                id="apellidos"
                v-model="apellidos"
                @input="errores.apellidos = ''"
                type="text"
                placeholder="Ej. Pérez García"
                :class="{ 'input-error': errores.apellidos }"
              />
            </div>
            <span v-if="errores.apellidos" class="field-error">⚠ {{ errores.apellidos }}</span>
          </div>

          <!-- Correo -->
          <div class="form-group full-width">
            <label for="correo">Correo electrónico (será tu usuario)</label>
            <div class="input-wrapper">
              <span class="input-icon">✉</span>
              <input
                id="correo"
                v-model="correo"
                @input="errores.correo = ''"
                type="email"
                inputmode="email"
                autocomplete="email"
                placeholder="paciente@ejemplo.com"
                :class="{ 'input-error': errores.correo }"
              />
            </div>
            <span v-if="errores.correo" class="field-error">⚠ {{ errores.correo }}</span>
          </div>

          <!-- Fecha Nacimiento -->
          <div class="form-group">
            <label for="fechaNacimiento">Fecha de nacimiento</label>
            <div class="input-wrapper">
              <span class="input-icon">📅</span>
              <input
                id="fechaNacimiento"
                v-model="fechaNacimiento"
                @input="errores.fechaNacimiento = ''"
                type="date"
                :class="{ 'input-error': errores.fechaNacimiento }"
              />
            </div>
            <span v-if="errores.fechaNacimiento" class="field-error">⚠ {{ errores.fechaNacimiento }}</span>
          </div>

          <!-- Dirección -->
          <div class="form-group">
            <label for="direccion">Dirección (Opcional)</label>
            <div class="input-wrapper">
              <span class="input-icon">📍</span>
              <input
                id="direccion"
                v-model="direccion"
                type="text"
                placeholder="Av. Principal 123"
              />
            </div>
          </div>

          <!-- Contraseña -->
          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper password-container">
              <span class="input-icon">🔐</span>
              <input
                id="password"
                v-model="password"
                @input="errores.password = ''"
                :type="mostrarPassword ? 'text' : 'password'"
                placeholder="Mínimo 6 caracteres"
                :class="{ 'input-error': errores.password }"
              />
              <button
                type="button"
                class="toggle-password"
                @click="mostrarPassword = !mostrarPassword"
                :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                {{ mostrarPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <span v-if="errores.password" class="field-error">⚠ {{ errores.password }}</span>
          </div>

          <!-- Confirmar Contraseña -->
          <div class="form-group">
            <label for="confirmPassword">Confirmar contraseña</label>
            <div class="input-wrapper password-container">
              <span class="input-icon">🔐</span>
              <input
                id="confirmPassword"
                v-model="confirmPassword"
                @input="errores.confirmPassword = ''"
                :type="mostrarConfirmPassword ? 'text' : 'password'"
                placeholder="Repite tu contraseña"
                :class="{ 'input-error': errores.confirmPassword }"
              />
              <button
                type="button"
                class="toggle-password"
                @click="mostrarConfirmPassword = !mostrarConfirmPassword"
                :aria-label="mostrarConfirmPassword ? 'Ocultar' : 'Mostrar'"
              >
                {{ mostrarConfirmPassword ? '🙈' : '👁' }}
              </button>
            </div>
            <span v-if="errores.confirmPassword" class="field-error">⚠ {{ errores.confirmPassword }}</span>
          </div>
        </div>

        <button type="submit" class="submit-button" :disabled="cargando">
          <span v-if="cargando">Registrando cuenta...</span>
          <template v-else>
            <span>Crear mi Cuenta</span>
            <span class="button-arrow">→</span>
          </template>
        </button>
      </form>

      <div class="login-prompt">
        <span>¿Ya tienes una cuenta registrada?</span>
        <RouterLink to="/login" class="login-link">Inicia sesión aquí</RouterLink>
      </div>

      <div class="security-info">
        <span class="security-icon">◈</span>
        <span>Tus datos médicos y personales están protegidos por SoliDent</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.register-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1rem;
  overflow-x: hidden;
  background: #0f172a;
}

.register-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.background-grid {
  position: absolute;
  inset: 0;
  opacity: 0.18;
  background-image:
    linear-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(99, 102, 241, 0.08) 1px, transparent 1px);
  background-size: 50px 50px;
}

.background-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
}

.glow-one {
  top: -100px;
  right: -50px;
  width: 450px;
  height: 450px;
  background: rgba(99, 102, 241, 0.22);
}

.glow-two {
  bottom: -100px;
  left: -50px;
  width: 450px;
  height: 450px;
  background: rgba(14, 165, 233, 0.22);
}

.register-card {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 760px;
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.back-arrow {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.2s ease;
}

.back-arrow:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  transform: translateX(-2px);
}

.register-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 1rem;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: white;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  box-shadow: 0 8px 16px -4px rgba(79, 70, 229, 0.4);
}

.register-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #f8fafc;
  margin: 0;
}

.register-header h1 span {
  color: #38bdf8;
}

.register-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin: 0.25rem 0 1rem;
}

.welcome-text h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 0.35rem;
}

.welcome-text p {
  color: #94a3b8;
  font-size: 0.925rem;
  margin: 0;
}

.alert-box {
  padding: 0.875rem 1.25rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.error-alert {
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #fca5a5;
}

.success-alert {
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem 1.5rem;
}

.full-width {
  grid-column: 1 / -1;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: #cbd5e1;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 0.875rem;
  color: #64748b;
  font-size: 1rem;
  pointer-events: none;
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 0.875rem 0.75rem 2.5rem;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 0.75rem;
  color: #f8fafc;
  font-size: 0.925rem;
  transition: all 0.2s ease;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.15);
  background: rgba(15, 23, 42, 0.8);
}

.input-wrapper input.input-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.password-container input {
  padding-right: 2.5rem;
}

.toggle-password {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #94a3b8;
  padding: 0.25rem;
  transition: transform 0.2s ease;
}

.toggle-password:hover {
  transform: scale(1.15);
}

.field-error {
  font-size: 0.775rem;
  color: #f87171;
}

.submit-button {
  margin-top: 1.75rem;
  width: 100%;
  padding: 0.875rem 1.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, #4f46e5, #0ea5e9);
  color: white;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
  transition: all 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  opacity: 0.95;
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -5px rgba(79, 70, 229, 0.5);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-prompt {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.login-link {
  color: #38bdf8;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #7dd3fc;
  text-decoration: underline;
}

.security-info {
  margin-top: 1.75rem;
  text-align: center;
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
}

.security-icon {
  color: #38bdf8;
}

@media (max-width: 640px) {
  .register-card {
    padding: 2rem 1.25rem;
  }
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
