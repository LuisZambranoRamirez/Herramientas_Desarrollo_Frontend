import { defineStore } from 'pinia'
import type { Usuario, LoginDto, RegistroDto } from '@/types'
import { authService } from '@/services/auth.service'

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
      const role = parsed.user_role || parsed.role || parsed.rol
      if (role && !parsed.user_role) {
        parsed.user_role = String(role).toUpperCase().trim()
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
      const u = state.user as any
      if (!u) return null
      const raw = u.user_role || u.role || u.rol
      return raw ? String(raw).toUpperCase().trim() : null
    },
  },

  actions: {
    async login(credentials: LoginDto): Promise<boolean> {
      try {
        const response = await authService.login(credentials)
        const token = response.accessToken || (response as any).access_token
        if (response && token) {
          const rawRole =
            (response.user as any)?.user_role ||
            (response.user as any)?.role ||
            (response.user as any)?.rol ||
            (response as any)?.role ||
            (response as any)?.user_role ||
            'PACIENTE'
          const normalizedRole = String(rawRole).toUpperCase().trim()
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
          const rawRole =
            (user as any)?.user_role ||
            (user as any)?.role ||
            (user as any)?.rol ||
            (response as any)?.role ||
            'PACIENTE'
          const normalizedRole = String(rawRole).toUpperCase().trim()
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
