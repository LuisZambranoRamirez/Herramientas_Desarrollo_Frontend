// src/services/auth.service.ts

import { api } from './api/client'

import type {
  LoginDto,
  LoginResponse,
  Usuario,
} from '@/types'

export const authService = {
  login(
    data: LoginDto,
  ): Promise<LoginResponse> {
    return api.post<LoginResponse>(
      '/auth/login',
      data,
    )
  },

  me(
    token: string,
  ): Promise<Usuario> {
    return api.get<Usuario>(
      '/auth/me',
      {
        token,
      },
    )
  },

  logout(
    token: string,
  ): Promise<void> {
    return api.post<void>(
      '/auth/logout',
      undefined,
      {
        token,
      },
    )
  },
}
