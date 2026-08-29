<template>
  <form @submit.prevent="guardar" class="formulario">
    <h2>{{ editando ? 'Editar usuario' : 'Registrar usuario' }}</h2>

    <!-- Username -->
    <div class="campo">
      <label for="username">Username</label>

      <input
        id="username"
        v-model="form.username"
        type="text"
        maxlength="50"
        placeholder="Ingrese el username"
        required
        :disabled="editando"
      />
    </div>

    <!-- Password -->
    <div class="campo">
      <label for="password">Contraseña</label>

      <input
        id="password"
        v-model="form.password"
        type="password"
        maxlength="255"
        placeholder="Ingrese la contraseña"
        :required="!editando"
      />
    </div>

    <!-- Rol -->
    <div class="campo">
      <label for="user_role">Rol</label>

      <select
        id="user_role"
        v-model="form.user_role"
        required
      >
        <option value="">Seleccione un rol</option>

        <option value="SYSTEM_ADMIN">
          Administrador del sistema
        </option>

        <option value="ODONTOLOGO">
          Odontólogo
        </option>

        <option value="PACIENTE">
          Paciente
        </option>
      </select>
    </div>

    <!-- Activo -->
    <div class="campo checkbox">
      <label>
        <input
          v-model="form.activo"
          type="checkbox"
        />

        Usuario activo
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
  usuario: {
    type: Object,
    default: null
  }
})

const emit = defineEmits([
  'guardar',
  'cancelar'
])

const editando = computed(() => {
  return !!props.usuario
})

const form = reactive({
  username: props.usuario?.username ?? '',
  password: '',
  activo: props.usuario?.activo ?? true,
  user_role: props.usuario?.user_role ?? ''
})

const guardar = () => {
  const datos = {
    username: form.username,
    activo: form.activo,
    user_role: form.user_role
  }

  // La contraseña solamente se manda
  // si el usuario la ha ingresado.
  if (form.password) {
    datos.password = form.password
  }

  emit('guardar', datos)
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

input,
select {
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
