// Store de autenticación
import { defineStore } from 'pinia'
import type { Usuario, LoginDto, RegistroDto } from '@/types'
import { authService } from '@/services/auth.service'

interface AuthState {
  user: Usuario | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    userRole: (state) => state.user?.user_role,
  },

  actions: {
    async login(credentials: LoginDto): Promise<boolean> {
      try {
        const response = await authService.login(credentials)
        if (response && response.accessToken) {
          this.token = response.accessToken
          this.user = response.user
          localStorage.setItem('token', response.accessToken)
          localStorage.setItem('user', JSON.stringify(response.user))
          return true
        }
        return false
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return false
      }
    },

    async register(data: RegistroDto): Promise<{ success: boolean; message?: string }> {
      try {
        const response = await authService.register(data)
        const token = response.accessToken || response.access_token
        if (token && response.user) {
          this.token = token
          this.user = response.user
          localStorage.setItem('token', token)
          localStorage.setItem('user', JSON.stringify(response.user))
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
