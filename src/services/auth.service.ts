import type {
LoginDto,
LoginResponse,
Usuario,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { authApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE AUTENTICACIÓN
// ============================================================

export const authService = {
login(
data: LoginDto,
): Promise<LoginResponse> {
// Backend:
// return api.post<LoginResponse>(
// '/auth/login',
// data,
// )

    return authApi.login(data)
},

me(
    token: string,
): Promise<Usuario | undefined> {
    // Backend:
    // return api.get<Usuario>(
    //     '/auth/me',
    //     {
    //         token,
    //     },
    // )

    const username = token.replace(
        'mock-token-',
        '',
    )

    return authApi.me(username)
},

logout(
    token: string,
): Promise<void> {
    // Backend:
    // return api.post<void>(
    //     '/auth/logout',
    //     undefined,
    //     {
    //         token,
    //     },
    // )

    return authApi.logout()
},


}