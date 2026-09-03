<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

async function iniciarSesion() {
  if (!email.value || !password.value) {
    alert('Completa todos los campos')
    return
  }

  const exito = await authStore.login({
    username: email.value,
    password: password.value
  })

  if (exito) {
    router.push('/dashboard')
  } else {
    alert('Credenciales incorrectas (simuladas)')
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

        <form @submit.prevent="iniciarSesion">
          <div class="form-group">
            <label for="email">Correo electrónico</label>

            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="admin@solident.com"
            />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>

            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
            />
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

.login-form button {
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