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

  if (!email.value.trim()) {
    errorEmail.value = 'El correo es obligatorio.'
  }

  if (!password.value) {
    errorPassword.value = 'La contraseña es obligatoria.'
  }

  if (errorEmail.value || errorPassword.value) {
    mensajeError.value = 'Completa los campos obligatorios.'
    return
  }

  const emailNormalizado = email.value.trim().toLowerCase()

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
    <section class="login-container">

      <div class="login-brand">
        <div class="brand-logo">
          <span>S</span>
        </div>

        <h1>SoliDent</h1>
        <p>Excelencia en Salud Dental</p>
      </div>

      <div class="login-form">

        <RouterLink to="/" class="back-arrow">
          ←
        </RouterLink>

        <h2>Iniciar Sesión</h2>
        <p>Ingresa tus credenciales para acceder a la plataforma.</p>

        <div v-if="mensajeError" class="error-message">
        ⚠️  {{ mensajeError }}
        </div> 

        <form @submit.prevent="iniciarSesion">

          <div class="form-group">
            <label for="email">Correo electrónico</label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@solident.com"
              :class="{ 'input-error': errorEmail }"
            />
            <span v-if="errorEmail" class="field-error">
            ⚠ {{ errorEmail }}
            </span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>

            <div class="password-container">
              <input
                id="password"
                v-model="password"
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
                {{ mostrarPassword ? '👁' : '👁' }}
              </button>
            </div>
                <span v-if="errorPassword" class="field-error">
                 ⚠ {{ errorPassword }}
                </span>
          </div>

          <button type="submit">
            Iniciar Sesión
          </button>

        </form>

      </div>

    </section>
  </main>
</template>

<style scoped>
.login-page {
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  background-color: #f8fafc;
}

.login-container {
  width: 100%;
  max-width: 1000px;
  min-height: 600px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background-color: #ffffff;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(30, 41, 59, 0.15);
}

.login-brand {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #ffffff;
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.brand-logo {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
}

.brand-logo span {
  font-size: 2.5rem;
  font-weight: 800;
}

.login-brand h1 {
  margin: 0 0 0.75rem;
  font-size: 2.5rem;
  font-weight: 800;
}

.login-brand p {
  max-width: 320px;
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  opacity: 0.9;
}

.login-form {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4rem;
}

.back-arrow {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 28px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s ease;
  line-height: 1;
}

.back-arrow:hover {
  color: #4f46e5;
  transform: scale(1.1);
}

.login-form h2 {
  margin: 0 0 0.75rem;
  color: #1e293b;
  font-size: 2rem;
  font-weight: 800;
}

.login-form > p {
  margin: 0 0 2rem;
  color: #64748b;
  line-height: 1.5;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
}

.form-group label {
  color: #334155;
  font-size: 0.9rem;
  font-weight: 700;
}

.form-group input {
  width: 100%;
  box-sizing: border-box;
  padding: 0.9rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  outline: none;
  color: #1e293b;
  font-size: 0.95rem;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-group input:focus {
  border-color: #5046e5;
  box-shadow: 0 0 0 3px rgba(80, 70, 229, 0.12);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.login-form > form > button {
  width: 100%;
  margin-top: 0.5rem;
  padding: 0.95rem 1.5rem;
  border: none;
  border-radius: 10px;
  color: #ffffff;
  background: linear-gradient(135deg, #14b8a6, #06b6d4);
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.login-form button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(6, 182, 212, 0.25);
}
.password-container {
  position: relative;
  width: 100%;
}

.password-container input {
  padding-right: 3rem;
}

.toggle-password {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  width: auto !important;
  margin: 0 !important;
  padding: 0.25rem !important;
  border: none !important;
  color: #64748b !important;
  background: transparent !important;
  font-size: 1.1rem !important;
  cursor: pointer;
  transform: translateY(-50%);
  box-shadow: none !important;
}

.toggle-password:hover {
  color: #4f46e5 !important;
  transform: translateY(-50%) !important;
  box-shadow: none !important;
}
.error-message {
  margin-bottom: 1.25rem;
  padding: 0.85rem 1rem;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #b91c1c;
  background-color: #fef2f2;
  font-size: 0.9rem;
  font-weight: 600;
}
.input-error {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
}

.field-error {
  color: #dc2626;
  font-size: 0.8rem;
  font-weight: 600;
}
@media (max-width: 768px) {
  .login-page {
    padding: 2rem 1rem;
  }

  .login-container {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .login-brand {
    padding: 2.5rem 1.5rem;
  }

  .login-brand h1 {
    font-size: 2rem;
  }

  .login-form {
    padding: 2.5rem 1.5rem;
  }
}
</style>