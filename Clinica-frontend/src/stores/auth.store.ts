//Store de autenticación
import { defineStore } from 'pinia'
import type { Usuario, LoginDto } from '@/types'

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

      const USUARIOS_MOCK = [
        {
          username: 'admin@solident.com',
          password: 'admin123',
          user_role: 'SYSTEM_ADMIN' as const,
        },
      ]

      const encontrado = USUARIOS_MOCK.find(
        (u) => u.username === credentials.username && u.password === credentials.password
      )

      if (encontrado) {
        const fakeToken = 'mock-jwt-token-123456'
        const fakeUser: Usuario = {
          username: encontrado.username,
          activo: true,
          user_role: encontrado.user_role,
          fecha_registro: new Date().toISOString(),
        }

        this.token = fakeToken
        this.user = fakeUser
        localStorage.setItem('token', fakeToken)
        localStorage.setItem('user', JSON.stringify(fakeUser))

        return true
      }
      return false
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
