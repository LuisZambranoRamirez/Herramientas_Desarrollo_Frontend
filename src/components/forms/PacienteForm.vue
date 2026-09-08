<template>
  <form @submit.prevent="guardarPaciente" class="formulario">
    <h2>Registrar paciente</h2>

    <div class="campo">
      <label for="dni">DNI</label>
      <input
        id="dni"
        v-model="form.dni"
        type="text"
        maxlength="8"
        required
      />
    </div>

    <div class="campo">
      <label for="username">Usuario</label>
      <input
        id="username"
        v-model="form.username"
        type="text"
        maxlength="50"
        required
      />
    </div>

    <div class="campo">
      <label for="nombres">Nombres</label>
      <input
        id="nombres"
        v-model="form.nombres"
        type="text"
        maxlength="100"
        required
      />
    </div>

    <div class="campo">
      <label for="apellidos">Apellidos</label>
      <input
        id="apellidos"
        v-model="form.apellidos"
        type="text"
        maxlength="100"
        required
      />
    </div>

    <div class="campo">
      <label for="direccion">Dirección</label>
      <input
        id="direccion"
        v-model="form.direccion"
        type="text"
        maxlength="200"
      />
    </div>

    <div class="campo">
      <label for="telefono">Teléfono</label>
      <input
        id="telefono"
        v-model="form.telefono"
        type="text"
        maxlength="9"
      />
    </div>

    <div class="campo">
      <label for="correo">Correo</label>
      <input
        id="correo"
        v-model="form.correo"
        type="email"
        maxlength="150"
      />
    </div>

    <div class="campo">
      <label for="fecha_nacimiento">Fecha de nacimiento</label>
      <input
        id="fecha_nacimiento"
        v-model="form.fecha_nacimiento"
        type="date"
        required
      />
    </div>

    <div class="campo">
      <label for="observaciones">Observaciones</label>
      <textarea
        id="observaciones"
        v-model="form.observaciones"
        required
      ></textarea>
    </div>

    <button type="submit">
      Guardar paciente
    </button>
  </form>
</template>

<script setup>
import { reactive } from 'vue'

const emit = defineEmits(['guardar'])

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

const guardarPaciente = () => {
  emit('guardar', { ...form })
}
</script>

<style scoped>
.formulario {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
}

input,
textarea,
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

textarea {
  min-height: 100px;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}
</style>
