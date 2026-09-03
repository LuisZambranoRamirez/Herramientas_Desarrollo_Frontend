<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const mostrarPassword = ref(false)
const mensajeError = ref('')
const errorEmail = ref('')
const errorPassword = ref('')

async function iniciarSesion() {
    mensajeError.value = ''
    errorEmail.value = ''
    errorPassword.value = ''

    const emailNormalizado = email.value.trim().toLowerCase()

  if (!email.value.trim()) {
    errorEmail.value = 'El correo es obligatorio.'
    } else if (!emailNormalizado.includes('@')) {
    errorEmail.value = 'Ingresa un correo electrónico válido.'
  }

  if (!password.value) {
    errorPassword.value = 'La contraseña es obligatoria.'
  }

  if (errorEmail.value || errorPassword.value) {
    mensajeError.value = 'Revisa los datos ingresados.'
    return
  }

  const exito = await authStore.login({
    username: emailNormalizado,
    password: password.value
  })

  if (exito) {
    router.push('/dashboard')
  } else {
    mensajeError.value = 'Credenciales incorrectas. Verifica tu correo y contraseña.'
  }
}
</script>

<template>
  <main class="login-page">
    <div class="login-background">
      <div class="background-glow glow-one"></div>
      <div class="background-glow glow-two"></div>
      <div class="background-grid"></div>
    </div>

    <section class="login-card">

      <RouterLink to="/" class="back-arrow" aria-label="Volver al inicio">
        ←
      </RouterLink>

      <div class="login-header">

        <div class="brand-logo">
          <span>S</span>
        </div>

        <h1>Soli<span>Dent</span></h1>

        <p class="login-subtitle">
        Intranet Clínica Dental
        </p>

        <p class="login-tagline">
        Gestión inteligente para una atención dental excepcional.
        </p>

        <div class="welcome-text">
          <h2>Bienvenido</h2>
          <p>
            Ingresa tus credenciales para acceder a la plataforma.
          </p>
        </div>

      </div>

      <div v-if="mensajeError" class="error-message">
        ⚠️ {{ mensajeError }}
      </div>

      <form @submit.prevent="iniciarSesion" novalidate>

        <div class="form-group">
          <label for="email">Correo electrónico</label>

          <div class="input-wrapper">
            <span class="input-icon">✉</span>

          
              <input
                id="email"
                v-model="email"
                @input="errorEmail = ''"
                type="text"
                inputmode="email"
                autocomplete="username"
                placeholder="admin@solident.com"
                :class="{ 'input-error': errorEmail }"
              />
          </div>

          <span v-if="errorEmail" class="field-error">
            ⚠ {{ errorEmail }}
          </span>
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>

          <div class="input-wrapper password-container">

            <span class="input-icon">🔐</span>

            <input
              id="password"
              v-model="password"
              @input="errorPassword = ''"
              :type="mostrarPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :class="{ 'input-error': errorPassword }"
            />

            <button
              type="button"
              class="toggle-password"
              @click="mostrarPassword = !mostrarPassword"
              :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              👁
            </button>

          </div>

          <span v-if="errorPassword" class="field-error">
            ⚠ {{ errorPassword }}
          </span>
        </div>

        <button type="submit" class="login-button">
          <span>Iniciar Sesión</span>
          <span class="button-arrow">→</span>
        </button>

      </form>

      <div class="security-info">
        <span class="security-icon">◈</span>
        <span>Acceso seguro a SoliDent</span>
      </div>

    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  background: #0f172a;
}

/* Fondo */

.login-background {
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
  width: 500px;
  height: 500px;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.18;
}

.glow-one {
  top: -250px;
  left: -150px;
  background: #6366f1;
}

.glow-two {
  right: -200px;
  bottom: -250px;
  background: #7c3aed;
}

/* Tarjeta */

.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 460px;
  padding: 3rem;
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 24px;
  background: rgba(17, 24, 39, 0.92);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.45),
    0 0 40px rgba(79, 70, 229, 0.08);
  backdrop-filter: blur(18px);
  animation: loginAppear 0.6s ease-out;
}

/* Botón volver */

.back-arrow {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #334155;
  border-radius: 10px;
  color: #94a3b8;
  background: rgba(30, 41, 59, 0.7);
  text-decoration: none;
  font-size: 1.4rem;
  transition: all 0.25s ease;
}

.back-arrow:hover {
  color: #ffffff;
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.15);
  transform: translateX(-2px);
}

/* Encabezado */

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  width: 64px;
  height: 64px;
  margin: 0 auto 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.35);
  animation: logoFloat 3s ease-in-out infinite;
}

.brand-logo span {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 800;
}

.login-header h1 {
  margin: 0;
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.login-header h1 span {
  color: #818cf8;
}

.login-subtitle {
  margin: 0.4rem 0 1.8rem;
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.login-tagline {
  margin: -1.2rem 0 1.8rem;
  color: #94a3b8;
  font-size: 0.78rem;
  line-height: 1.5;
  font-weight: 400;
  text-align: center;
}

.welcome-text h2 {
  margin: 0 0 0.4rem;
  color: #f8fafc;
  font-size: 1.35rem;
  font-weight: 700;
}

.welcome-text p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Formulario */

.form-group {
  margin-bottom: 1.3rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.55rem;
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 1rem;
  z-index: 1;
  color: #64748b;
  font-size: 0.95rem;
  pointer-events: none;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.95rem 1rem 0.95rem 2.8rem;
  border: 1px solid #334155;
  border-radius: 11px;
  outline: none;
  color: #f8fafc;
  background: #1e293b;
  font-size: 0.9rem;
  transition: all 0.25s ease;
}

.form-group input::placeholder {
  color: #64748b;
}

.form-group input:focus {
  border-color: #6366f1;
  background: #1e293b;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
}

.password-container input {
  padding-right: 3.2rem;
}

/* Mostrar contraseña */

.toggle-password {
  position: absolute;
  right: 0.7rem;
  top: 50%;
  width: 36px !important;
  height: 36px;
  margin: 0 !important;
  padding: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none !important;
  color: #64748b !important;
  background: transparent !important;
  font-size: 1rem !important;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: none !important;
}

.toggle-password:hover {
  color: #818cf8 !important;
  transform: translateY(-50%) !important;
  box-shadow: none !important;
}

/* Errores */

.error-message {
  margin-bottom: 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 11px;
  color: #fca5a5;
  background: rgba(127, 29, 29, 0.2);
  font-size: 0.85rem;
  font-weight: 600;
}

.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.field-error {
  display: block;
  margin-top: 0.45rem;
  color: #f87171;
  font-size: 0.78rem;
  font-weight: 600;
}

/* Botón */

.login-button {
  width: 100%;
  margin-top: 0.4rem;
  padding: 0.95rem 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;
  border: none;
  border-radius: 11px;
  color: #ffffff;
  background: linear-gradient(135deg, #6366f1, #7c3aed);
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(79, 70, 229, 0.25);
  transition: all 0.25s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 30px rgba(79, 70, 229, 0.4);
}

.button-arrow {
  font-size: 1.1rem;
  transition: transform 0.25s ease;
}

.login-button:hover .button-arrow {
  transform: translateX(4px);
}

/* Seguridad */

.security-info {
  margin-top: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.75rem;
}

.security-icon {
  color: #6366f1;
  font-size: 0.9rem;
}

/* Animaciones */

@keyframes loginAppear {
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes logoFloat {
  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-4px);
  }
}

/* Responsive */

@media (max-width: 600px) {
  .login-page {
    padding: 1rem;
  }

  .login-card {
    padding: 2.5rem 1.5rem;
    border-radius: 20px;
  }

  .back-arrow {
    top: 1rem;
    left: 1rem;
  }

  .login-header h1 {
    font-size: 1.6rem;
  }
}
</style>