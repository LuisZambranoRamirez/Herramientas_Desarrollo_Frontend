import type {
  Usuario,
  CrearUsuarioDto,
  ActualizarUsuarioDto,
  ActualizarPerfilDto,
  OdontologoPublico,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
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
    if (!env.useMock) {
      return api.get<Usuario[]>('/usuarios')
    }

    const guardados = obtenerDeStorage()
    if (guardados && guardados.length > 0) {
      return guardados
    }

    const desdeApi = await usuarioApi.getAll()
    guardarEnStorage(desdeApi)
    return desdeApi
  },

  async getByUsername(username: string): Promise<Usuario | undefined> {
    if (!env.useMock) {
      return api.get<Usuario>(`/usuarios/${username}`)
    }

    const lista = await this.getAll()
    return lista.find(u => u.username.toLowerCase() === username.toLowerCase())
  },

  /**
   * Obtiene el perfil propio del usuario actualmente autenticado (GET /usuarios/me).
   * Funciona para todos los roles (PACIENTE, ODONTOLOGO, SYSTEM_ADMIN).
   */
  async getMyProfile(): Promise<Usuario> {
    if (!env.useMock) {
      return api.get<Usuario>('/usuarios/me')
    }

    const guardados = obtenerDeStorage() || (await this.getAll())
    let authUser: any = null
    try {
      const raw = localStorage.getItem('user')
      if (raw) authUser = JSON.parse(raw)
    } catch {
      // ignore
    }
    const targetUsername = authUser?.username || 'admin'
    const found = guardados.find(u => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (found) {
      return { ...found }
    }
    return guardados[0] || (await usuarioApi.getAll())[0]!
  },

  /**
   * Actualiza los datos personales y de contacto del propio usuario autenticado (PUT /usuarios/me).
   * Para odontólogos, permite además actualizar especialidad y descripción.
   */
  async updateMyProfile(data: ActualizarPerfilDto): Promise<Usuario> {
    validarDatosUsuario(data)

    const payload: ActualizarPerfilDto = {
      nombre_completo: data.nombre_completo?.trim() || undefined,
      correo: data.correo?.trim().toLowerCase() || undefined,
      telefono: data.telefono?.trim() || undefined,
      especialidad: data.especialidad?.trim() || undefined,
      descripcion: data.descripcion?.trim() || undefined,
    }

    if (!env.useMock) {
      return api.put<Usuario>('/usuarios/me', payload)
    }

    const lista = await this.getAll()
    let authUser: any = null
    try {
      const raw = localStorage.getItem('user')
      if (raw) authUser = JSON.parse(raw)
    } catch {
      // ignore
    }
    const targetUsername = authUser?.username || 'admin'
    const index = lista.findIndex(u => u.username.toLowerCase() === targetUsername.toLowerCase())
    if (index === -1 || !lista[index]) {
      throw new Error('Usuario no encontrado.')
    }

    const user = lista[index]!
    if (payload.nombre_completo !== undefined) user.nombre_completo = payload.nombre_completo
    if (payload.correo !== undefined) user.correo = payload.correo
    if (payload.telefono !== undefined) user.telefono = payload.telefono
    if (payload.especialidad !== undefined) (user as any).especialidad = payload.especialidad
    if (payload.descripcion !== undefined) (user as any).descripcion = payload.descripcion

    guardarEnStorage(lista)
    return { ...user }
  },

  async create(data: CrearUsuarioDto): Promise<Usuario> {
    validarDatosUsuario(data)

    const payload: CrearUsuarioDto = {
      username: data.username.trim(),
      password: data.password,
      user_role: data.user_role,
      activo: data.activo !== undefined ? data.activo : true,
      nombre_completo: data.nombre_completo?.trim() || undefined,
      correo: data.correo?.trim().toLowerCase() || undefined,
      telefono: data.telefono?.trim() || undefined,
    }

    if (!env.useMock) {
      return api.post<Usuario>('/usuarios', payload)
    }

    const lista = await this.getAll()
    const existe = lista.some(u => u.username.toLowerCase() === payload.username.toLowerCase())
    if (existe) {
      throw new Error(`El nombre de usuario "${payload.username}" ya existe en el sistema.`)
    }

    const nuevo = await usuarioApi.create(payload)

    // Sincronizar storage
    const actualizada = [nuevo, ...lista.filter(u => u.username !== nuevo.username)]
    guardarEnStorage(actualizada)
    return nuevo
  },

  async update(username: string, data: ActualizarUsuarioDto): Promise<Usuario> {
    validarDatosUsuario(data)

    if (!env.useMock) {
      return api.patch<Usuario>(`/usuarios/${username}`, data)
    }

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

  async updateRole(
    username: string,
    rol: string,
    especialidad?: string,
    colegiatura?: string
  ): Promise<Usuario> {
    const payload: { user_role: string; especialidad?: string; colegiatura?: string } = {
      user_role: rol.trim().toUpperCase(),
    }
    if (especialidad?.trim()) {
      payload.especialidad = especialidad.trim()
    }
    if (colegiatura?.trim()) {
      payload.colegiatura = colegiatura.trim()
    }

    if (!env.useMock) {
      return api.patch<Usuario>(`/usuarios/${username}/rol`, payload)
    }

    const lista = await this.getAll()
    const index = lista.findIndex(u => u.username.toLowerCase() === username.toLowerCase())
    if (index === -1 || !lista[index]) {
      throw new Error('Usuario no encontrado.')
    }

    const user = lista[index]!
    user.user_role = payload.user_role as any
    user.role = payload.user_role
    if (payload.especialidad) (user as any).especialidad = payload.especialidad
    if (payload.colegiatura) (user as any).colegiatura = payload.colegiatura
    guardarEnStorage(lista)
    return { ...user }
  },

  async toggleStatus(username: string): Promise<Usuario> {
    if (!env.useMock) {
      return api.patch<Usuario>(`/usuarios/${username}/toggle-status`)
    }

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
    if (!env.useMock) {
      return api.delete<void>(`/usuarios/${username}`)
    }

    const lista = await this.getAll()
    const filtrados = lista.filter(u => u.username.toLowerCase() !== username.toLowerCase())
    guardarEnStorage(filtrados)
    try {
      await usuarioApi.delete(username)
    } catch {
      // Si no estaba en memoria del mock, ya fue eliminado del storage
    }
  },

  async deleteUser(username: string): Promise<void> {
    return this.delete(username)
  },

  /**
   * Obtiene la lista de odontólogos activos directamente desde la fuente de datos
   * de usuarios del sistema (sin requerir autenticación de administrador).
   * Filtra estrictamente por:
   *  - Rol: "ODONTOLOGO"
   *  - Estado: Activo (activo === true)
   */
  async getActiveDentists(): Promise<OdontologoPublico[]> {
    if (!env.useMock) {
      try {
        return await api.get<OdontologoPublico[]>('/usuarios/odontologos/activos')
      } catch {
        return await api.get<OdontologoPublico[]>('/odontologos/activos')
      }
    }

    // Modo mock / storage local: consultar la misma fuente que "Gestión de Usuarios"
    const todos = await this.getAll()
    const activos = todos.filter((u) => {
      const role = String((u as any).user_role || (u as any).role || '').toUpperCase().trim()
      return role === 'ODONTOLOGO' && u.activo === true
    })

    return activos.map((u) => {
      const parts = (u.nombre_completo || u.username).split(' ')
      const nombres = parts[0] || u.username
      const apellidos = parts.slice(1).join(' ') || ''
      const especialidad = (u as any).especialidad || 'Ortodoncia'
      const colegiatura = (u as any).colegiatura || 'COP-12345'
      return {
        id: (u as any).dni || u.username,
        dni: (u as any).dni || u.username,
        username: u.username,
        nombre: u.nombre_completo || `Dr(a). ${nombres} ${apellidos}`.trim(),
        nombres,
        apellidos,
        especialidad,
        colegiatura,
        correo: u.correo,
        telefono: u.telefono,
        descripcion: `Especialista en ${especialidad}. Colegiatura ${colegiatura}.`,
        activo: true,
      }
    })
  },
}
