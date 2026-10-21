import { env } from '@/config/env'

type RequestOptions = RequestInit & {
  token?: string
}

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers)

  headers.set('Content-Type', 'application/json')

  const authToken = token || (typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null)

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  let response: Response
  try {
    response = await fetch(
      `${env.apiUrl}${endpoint}`,
      {
        ...fetchOptions,
        headers,
      },
    )
  } catch (error: any) {
    if (error instanceof TypeError) {
      throw new Error(
        'Error de conexión: No se pudo comunicar con el servidor backend (revisa si está activo o bloqueado por CORS).',
      )
    }
    throw error
  }

  if (!response.ok) {
    let message = 'Ha ocurrido un error'

    try {
      const error = await response.json()
      message = error.detail ?? error.message ?? message
    } catch {
      // La respuesta no contenía JSON
    }

    throw new Error(message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export const api = {
  get<T>(endpoint: string, options?: RequestOptions) {
    return request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions,
  ) {
    return request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ) {
    return request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  },
}
