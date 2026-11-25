<template>
  <form @submit.prevent="validarYGuardar" class="formulario">
    <h2>Registrar paciente</h2>

    <!-- Alerta general dentro de la caja -->
    <div v-if="errorGeneral" class="alerta-error">
      ⚠️ {{ errorGeneral }}
    </div>

    <div class="campo">
      <label for="dni">DNI *</label>
      <input
        id="dni"
        v-model="form.dni"
        type="text"
        maxlength="8"
        placeholder="Ej: 71234567"
        @keypress="soloNumeros"
      />
      <span v-if="errores.dni" class="error">{{ errores.dni }}</span>
    </div>

    <div class="campo">
      <label for="username">Usuario *</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        maxlength="50"
        placeholder="Nombre de usuario"
      />
      <span v-if="errores.username" class="error">{{ errores.username }}</span>
    </div>

    <div class="campo">
      <label for="nombres">Nombres *</label>
      <input
        id="nombres"
        v-model="form.nombres"
        type="text"
        maxlength="100"
        placeholder="Ej: Juan Carlos"
        @keypress="soloLetras"
      />
      <span v-if="errores.nombres" class="error">{{ errores.nombres }}</span>
    </div>

    <div class="campo">
      <label for="apellidos">Apellidos *</label>
      <input
        id="apellidos"
        v-model="form.apellidos"
        type="text"
        maxlength="100"
        placeholder="Ej: Pérez Gómez"
        @keypress="soloLetras"
      />
      <span v-if="errores.apellidos" class="error">{{ errores.apellidos }}</span>
    </div>

    <div class="campo">
      <label for="direccion">Dirección</label>
      <input
        id="direccion"
        v-model="form.direccion"
        type="text"
        maxlength="200"
        placeholder="Ej: Mz. A Lt. 3"
      />
    </div>

    <div class="campo">
      <label for="telefono">Teléfono</label>
      <input
        id="telefono"
        v-model="form.telefono"
        type="text"
        maxlength="9"
        placeholder="Ej: 987654321"
        @keypress="soloNumeros"
      />
      <span v-if="errores.telefono" class="error">{{ errores.telefono }}</span>
    </div>

    <div class="campo">
      <label for="correo">Correo</label>
      <input
        id="correo"
        v-model="form.correo"
        type="email"
        maxlength="150"
        placeholder="correo@ejemplo.com"
      />
      <span v-if="errores.correo" class="error">{{ errores.correo }}</span>
    </div>

    <div class="campo">
      <label for="fecha_nacimiento">Fecha de nacimiento *</label>
      <input
        id="fecha_nacimiento"
        v-model="form.fecha_nacimiento"
        type="date"
      />
      <span v-if="errores.fecha_nacimiento" class="error">{{ errores.fecha_nacimiento }}</span>
    </div>

    <div class="campo">
      <label for="observaciones">Observaciones</label>
      <textarea
        id="observaciones"
        v-model="form.observaciones"
        placeholder="Notas clínicas..."
      ></textarea>
    </div>

    <button type="submit">
      Guardar paciente
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const emit = defineEmits<{
  (e: 'guardar', paciente: Record<string, any>): void
}>()

const form = reactive({
  dni: '',
  username: '',
  nombres: '',
  apellidos: '',
  direccion: '',
  telefono: '',
  correo: '',
  observaciones: '',
  fecha_nacimiento: ''
})

const errores = reactive<Record<string, string>>({})
const errorGeneral = ref('')

// Restricción: Solo números en tiempo real para DNI y Teléfono
const soloNumeros = (event: KeyboardEvent) => {
  const charCode = event.which ? event.which : event.keyCode
  if (charCode < 48 || charCode > 57) {
    event.preventDefault()
  }
}

// Restricción: Solo letras y espacios en tiempo real para Nombres y Apellidos
const soloLetras = (event: KeyboardEvent) => {
  const char = String.fromCharCode(event.keyCode || event.which)
  const patron = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/
  if (!patron.test(char)) {
    event.preventDefault()
  }
}

const validarYGuardar = () => {
  Object.keys(errores).forEach(key => delete errores[key])
  errorGeneral.value = ''

  // 1. DNI: Exactamente 8 dígitos numéricos
  const regexDni = /^\d{8}$/
  if (!regexDni.test(form.dni)) {
    errores.dni = 'El DNI debe contener exactamente 8 números.'
  }

  // 2. Usuario obligatorio
  if (!form.username.trim()) {
    errores.username = 'El nombre de usuario es obligatorio.'
  }

  // 3 y 4. Nombres y Apellidos: solo letras, sin números ni símbolos raros
  const regexLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  if (!form.nombres.trim() || !regexLetras.test(form.nombres)) {
    errores.nombres = 'Los nombres son obligatorios y solo deben contener letras.'
  }
  if (!form.apellidos.trim() || !regexLetras.test(form.apellidos)) {
    errores.apellidos = 'Los apellidos son obligatorios y solo deben contener letras.'
  }

  // 5. Teléfono (opcional, pero si se escribe debe tener 9 dígitos)
  const regexTelefono = /^\d{9}$/
  if (form.telefono && !regexTelefono.test(form.telefono)) {
    errores.telefono = 'El teléfono debe contener exactamente 9 números.'
  }

  // 6. Correo (opcional, pero con formato válido si se llena)
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.correo && !regexCorreo.test(form.correo)) {
    errores.correo = 'Ingrese un correo electrónico válido.'
  }

  // 7. Fecha de nacimiento obligatoria
  if (!form.fecha_nacimiento) {
    errores.fecha_nacimiento = 'La fecha de nacimiento es obligatoria.'
  }

  // Si hay errores, detenemos el envío y mostramos la alerta arriba en la caja
  if (Object.keys(errores).length > 0) {
    errorGeneral.value = 'Por favor, corrija los errores marcados en el formulario.'
    return
  }

  // Éxito: emitimos los datos limpios
  emit('guardar', { ...form })
}
</script>

<style scoped>
.formulario {
  max-width: 600px;
  margin: auto;
  padding: 10px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

label {
  margin-bottom: 4px;
  font-weight: bold;
  font-size: 0.9rem;
}

input,
textarea,
select {
  padding: 8px 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 0.95rem;
}

textarea {
  min-height: 80px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
  width: 100%;
  font-weight: bold;
  margin-top: 10px;
}

.error {
  color: #dc2626;
  font-size: 0.8rem;
  margin-top: 4px;
}

.alerta-error {
  background: #fee2e2;
  color: #991b1b;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  border: 1px solid #f87171;
}
</style>