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

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

export const authService = {
  async login(data: LoginDto): Promise<LoginResponse> {
    if (env.useMock) {
      return authApi.login(data)
    }

    // Backend FastAPI: POST /auth/login
    // Compatible con respuesta FastAPI OAuth2/JWT o personalizada
    const res = await api.post<any>('/auth/login', data)

    const accessToken = res.access_token || res.accessToken
    const user: Usuario = res.user || res.usuario || {
      username: data.username,
      activo: true,
      user_role: res.user_role || 'SYSTEM_ADMIN',
      fecha_registro: new Date().toISOString(),
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
    const user = res.user || res.usuario

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