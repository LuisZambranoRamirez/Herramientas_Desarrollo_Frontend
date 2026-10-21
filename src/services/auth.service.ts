import type {
  LoginDto,
  LoginResponse,
  Usuario,
} from '@/types'
import { api } from '@/services/api/client'

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

export const authService = {
  login(data: LoginDto): Promise<LoginResponse> {
    return api.post<LoginResponse>('/auth/login', data)
  },

  me(token: string): Promise<Usuario | undefined> {
    return api.get<Usuario>('/auth/me', { token })
  },

  logout(): void {
    // Limpieza de sesión
  },
}