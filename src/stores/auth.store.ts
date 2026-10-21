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
  },

  actions: {
    async login(credentials: LoginDto) {
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
        throw error
      }
    },

    logout() {
      //limpia sesión del estado y localStorage
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  }
})
