import type {
  LoginDto,
  LoginResponse,
  RegistroDto,
  RegistroResponse,
  Usuario,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { authApi } from '@/services/mock-api'
import { extractUserRole } from '@/utils/navigation'

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

export const authService = {
  async login(data: LoginDto): Promise<LoginResponse> {
    if (env.useMock) {
      return authApi.login(data)
    }

    // Backend FastAPI: POST /auth/login
    const res = await api.post<any>('/auth/login', data)

    const accessToken = res.access_token || res.accessToken
    const rawUser = res.user || res.usuario || {}
    const userRole = extractUserRole(res) || extractUserRole(rawUser) || 'PACIENTE'

    const user: Usuario = {
      ...rawUser,
      username: rawUser.username || res.username || data.username,
      nombre_completo: rawUser.nombre_completo || res.nombre_completo,
      correo: rawUser.correo || res.correo,
      telefono: rawUser.telefono || res.telefono,
      activo: rawUser.activo ?? res.activo ?? true,
      user_role: userRole as any,
      fecha_registro: rawUser.fecha_registro || res.fecha_registro || new Date().toISOString(),
      odontologo: rawUser.odontologo || res.odontologo,
      paciente: rawUser.paciente || res.paciente,
      role: userRole,
    }

    return {
      accessToken,
      user,
    }
  },

  async register(data: RegistroDto): Promise<RegistroResponse> {
    if (env.useMock) {
      return {
        message: 'Cuenta registrada exitosamente',
        accessToken: `mock-token-paciente-${Date.now()}`,
        user: {
          username: data.username,
          activo: true,
          user_role: 'PACIENTE',
          fecha_registro: new Date().toISOString(),
        },
      }
    }

    const res = await api.post<any>('/auth/register', data)
    const accessToken = res.access_token || res.accessToken
    const rawUser = res.user || res.usuario || {}
    const userRole = extractUserRole(res) || extractUserRole(rawUser) || 'PACIENTE'

    const user: Usuario = {
      ...rawUser,
      username: rawUser.username || data.username,
      nombre_completo: rawUser.nombre_completo || `${data.nombres} ${data.apellidos}`.trim(),
      correo: rawUser.correo || data.correo,
      telefono: rawUser.telefono || data.telefono,
      activo: rawUser.activo ?? true,
      user_role: userRole as any,
      fecha_registro: rawUser.fecha_registro || new Date().toISOString(),
      odontologo: rawUser.odontologo,
      paciente: rawUser.paciente,
      role: userRole,
    }

    return {
      message: res.message || 'Registro exitoso',
      accessToken,
      user,
    }
  },

  async me(token?: string): Promise<Usuario | undefined> {
    if (env.useMock) {
      const username = (token || '').replace('mock-token-', '')
      return authApi.me(username)
    }

    return api.get<Usuario>('/auth/me', { token })
  },

  async logout(token?: string): Promise<void> {
    if (env.useMock) {
      return authApi.logout()
    }

    try {
      await api.post<void>('/auth/logout', undefined, { token })
    } catch {
      // Ignorar error si el backend no implementa logout stateful
    }
  },
}
