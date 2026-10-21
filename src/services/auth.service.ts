import type {
  LoginDto,
  LoginResponse,
  RegistroDto,
  RegistroResponse,
  Usuario,
} from '@/types'
import { api } from '@/services/api/client'

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

export const authService = {
  async login(data: LoginDto): Promise<LoginResponse> {
    const res = await api.post<any>('/auth/login', data)

    const accessToken = res.accessToken || res.access_token
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
    const res = await api.post<any>('/auth/register', data)
    const accessToken = res.accessToken || res.access_token
    const user = res.user || res.usuario

    return {
      message: res.message || 'Registro exitoso',
      accessToken,
      user,
    }
  },

  async me(token?: string): Promise<Usuario | undefined> {
    return api.get<Usuario>('/auth/me', { token })
  },

  async logout(token?: string): Promise<void> {
    try {
      await api.post<void>('/auth/logout', undefined, { token })
    } catch {
      // Ignorar error si el backend no implementa logout stateful
    }
  },
}