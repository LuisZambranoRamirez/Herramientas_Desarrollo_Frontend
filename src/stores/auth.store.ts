// Store de autenticación
import { defineStore } from 'pinia'
import type { Usuario, LoginDto } from '@/types'
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
