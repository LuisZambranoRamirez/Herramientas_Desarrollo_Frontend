<template>
  <form @submit.prevent="guardar" class="formulario">
    <h2>{{ editando ? 'Editar personal' : 'Registrar personal' }}</h2>

    <!-- DNI -->
    <div class="campo">
      <label for="dni">DNI</label>

      <input
        id="dni"
        v-model="form.dni"
        type="text"
        maxlength="8"
        minlength="8"
        inputmode="numeric"
        placeholder="Ingrese el DNI"
        required
        :disabled="editando"
      />
    </div>

    <!-- Nombres -->
    <div class="campo">
      <label for="nombres">Nombres</label>

      <input
        id="nombres"
        v-model="form.nombres"
        type="text"
        maxlength="100"
        placeholder="Ingrese los nombres"
        required
      />
    </div>

    <!-- Apellidos -->
    <div class="campo">
      <label for="apellidos">Apellidos</label>

      <input
        id="apellidos"
        v-model="form.apellidos"
        type="text"
        maxlength="100"
        placeholder="Ingrese los apellidos"
        required
      />
    </div>

    <!-- Teléfono -->
    <div class="campo">
      <label for="telefono">Teléfono</label>

      <input
        id="telefono"
        v-model="form.telefono"
        type="tel"
        maxlength="9"
        minlength="9"
        inputmode="numeric"
        placeholder="987654321"
        required
      />
    </div>

    <!-- Correo -->
    <div class="campo">
      <label for="correo">Correo</label>

      <input
        id="correo"
        v-model="form.correo"
        type="email"
        maxlength="150"
        placeholder="correo@ejemplo.com"
        required
      />
    </div>

    <!-- Activo -->
    <div class="campo checkbox">
      <label>
        <input
          v-model="form.activo"
          type="checkbox"
        />

        Personal activo
      </label>
    </div>

    <!-- Botones -->
    <div class="acciones">
      <button
        type="button"
        class="btn-cancelar"
        @click="$emit('cancelar')"
      >
        Cancelar
      </button>

      <button
        type="submit"
        class="btn-guardar"
      >
        {{ editando ? 'Actualizar' : 'Guardar' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, computed } from 'vue'

const props = defineProps({
  personal: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'guardar',
  'cancelar'
])

const editando = computed(() => {
  return !!props.personal
})

const form = reactive({
  dni: props.personal?.dni ?? '',
  nombres: props.personal?.nombres ?? '',
  apellidos: props.personal?.apellidos ?? '',
  telefono: props.personal?.telefono ?? '',
  correo: props.personal?.correo ?? '',
  activo: props.personal?.activo ?? true
})

const guardar = () => {
  emit('guardar', {
    dni: form.dni,
    nombres: form.nombres,
    apellidos: form.apellidos,
    telefono: form.telefono,
    correo: form.correo,
    activo: form.activo
  })
}
</script>

<style scoped>
.formulario {
  max-width: 500px;
  padding: 24px;
  background: white;
  border-radius: 10px;
}

.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
}

.campo label {
  margin-bottom: 6px;
  font-weight: 600;
}

input {
  padding: 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.checkbox {
  flex-direction: row;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.checkbox input {
  width: auto;
}

.acciones {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-guardar {
  background: #2563eb;
  color: white;
}

.btn-cancelar {
  background: #e5e7eb;
  color: #111827;
}
</style>
