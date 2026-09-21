import type {
  Usuario,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
} from '@/types'
import { usuarioApi } from '@/services/mock-api'

const STORAGE_KEY = 'solident_usuarios'

// Helper de persistencia en localStorage
const obtenerDeStorage = (): Usuario[] | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Usuario[]) : null
  } catch {
    return null
  }
}

const guardarEnStorage = (usuarios: Usuario[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios))
  } catch (err) {
    console.error('Error al guardar usuarios en localStorage:', err)
  }
}

// Validaciones
export const validarDatosUsuario = (data: Partial<CrearUsuarioDto & ActualizarUsuarioDto>): void => {
  if (data.username !== undefined) {
    const cleanUsername = data.username.trim()
    if (!cleanUsername) {
      throw new Error('El nombre de usuario es obligatorio.')
    }
    if (cleanUsername.length < 3) {
      throw new Error('El nombre de usuario debe tener al menos 3 caracteres.')
    }
    if (!/^[a-zA-Z0-9._-]+$/.test(cleanUsername)) {
      throw new Error('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos.')
    }
  }

  if (data.password !== undefined) {
    if (!data.password || data.password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres.')
    }
  }

  if (data.correo !== undefined && data.correo.trim() !== '') {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!regexEmail.test(data.correo.trim())) {
      throw new Error('El formato del correo electrónico no es válido.')
    }
  }

  if (data.telefono !== undefined && data.telefono.trim() !== '') {
    const cleanTel = data.telefono.replace(/\D/g, '')
    if (cleanTel.length !== 9) {
      throw new Error('El teléfono debe contener exactamente 9 dígitos.')
    }
  }
}

export const usuariosService = {
  async getAll(): Promise<Usuario[]> {
    const guardados = obtenerDeStorage()
    if (guardados && guardados.length > 0) {
      return guardados
    }

    const desdeApi = await usuarioApi.getAll()
    guardarEnStorage(desdeApi)
    return desdeApi
  },

  async getByUsername(username: string): Promise<Usuario | undefined> {
    const lista = await this.getAll()
    return lista.find(u => u.username.toLowerCase() === username.toLowerCase())
  },

  async create(data: CrearUsuarioDto): Promise<Usuario> {
    validarDatosUsuario(data)

    const lista = await this.getAll()
    const existe = lista.some(u => u.username.toLowerCase() === data.username.trim().toLowerCase())
    if (existe) {
      throw new Error(`El nombre de usuario "${data.username.trim()}" ya existe en el sistema.`)
    }

    const nuevo = await usuarioApi.create(data)

    // Sincronizar storage
    const actualizada = [nuevo, ...lista.filter(u => u.username !== nuevo.username)]
    guardarEnStorage(actualizada)
    return nuevo
  },

  async update(username: string, data: ActualizarUsuarioDto): Promise<Usuario> {
    validarDatosUsuario(data)

    const lista = await this.getAll()
    const index = lista.findIndex(u => u.username.toLowerCase() === username.toLowerCase())
    if (index === -1 || !lista[index]) {
      throw new Error('Usuario no encontrado.')
    }

    const actualizado = await usuarioApi.update(username, data)
    lista[index] = actualizado
    guardarEnStorage(lista)
    return actualizado
  },

  async toggleStatus(username: string): Promise<Usuario> {
    const lista = await this.getAll()
    const index = lista.findIndex(u => u.username.toLowerCase() === username.toLowerCase())
    const item = lista[index]
    if (index === -1 || !item) {
      throw new Error('Usuario no encontrado.')
    }

    item.activo = !item.activo
    guardarEnStorage(lista)
    return item
  },

  async delete(username: string): Promise<void> {
    const lista = await this.getAll()
    const filtrados = lista.filter(u => u.username.toLowerCase() !== username.toLowerCase())
    guardarEnStorage(filtrados)
    try {
      await usuarioApi.delete(username)
    } catch {
      // Si no estaba en memoria del mock, ya fue eliminado del storage
    }
  },
}
