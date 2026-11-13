import { defineStore } from 'pinia'
import type { Usuario, LoginDto, RegistroDto } from '@/types'
import { authService } from '@/services/auth.service'
import { extractUserRole } from '@/utils/navigation'

interface AuthState {
  user: Usuario | null
  token: string | null
}

function getStoredUser(): Usuario | null {
  try {
    const raw = localStorage.getItem('user')
    if (!raw || raw === 'undefined' || raw === 'null') return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') {
      const role = extractUserRole(parsed)
      if (role) {
        parsed.user_role = role as any
        parsed.role = role
      }
      return parsed
    }
  } catch (e) {
    console.error('Error al parsear usuario de localStorage:', e)
  }
  return null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: getStoredUser(),
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    userRole: (state): string | null => {
      if (!state.user) return null
      return extractUserRole(state.user)
    },
  },

  actions: {
    async login(credentials: LoginDto): Promise<boolean> {
      try {
        const response = await authService.login(credentials)
        const token = response.accessToken || (response as any).access_token
        if (response && token) {
          const normalizedRole = extractUserRole(response) || 'PACIENTE'
          const normalizedUser: Usuario = {
            ...response.user,
            user_role: normalizedRole as any,
          }
          ;(normalizedUser as any).role = normalizedRole

          this.token = token
          this.user = normalizedUser
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(normalizedUser))
          return true
        }
        return false
      } catch (error) {
        throw error
      }
    },

    async register(data: RegistroDto): Promise<{ success: boolean; message?: string }> {
      try {
        const response = await authService.register(data)
        let token = response.accessToken || (response as any).access_token
        let user = response.user

        // Si no vino token en el registro, intentar auto-login para dejar la sesión iniciada
        if (!token) {
          try {
            const loginRes = await authService.login({
              username: data.username,
              password: data.password,
            })
            token = loginRes.accessToken
            user = loginRes.user
          } catch {
            // Continúa con la respuesta original
          }
        }

        if (token && user) {
          const normalizedRole = extractUserRole(user) || extractUserRole(response) || 'PACIENTE'
          const normalizedUser: Usuario = {
            ...user,
            user_role: normalizedRole as any,
          }
          ;(normalizedUser as any).role = normalizedRole

          this.token = token
          this.user = normalizedUser
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(normalizedUser))
        }
        return { success: true, message: response.message || 'Cuenta registrada exitosamente' }
      } catch (error: any) {
        console.error('Error al registrar usuario:', error)
        return { success: false, message: error.message || 'Error al crear la cuenta' }
      }
    },

    async logout() {
      if (this.token) {
        try {
          await authService.logout(this.token)
        } catch {
          // Continuar con limpieza local si el backend no responde
        }
      }
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})
