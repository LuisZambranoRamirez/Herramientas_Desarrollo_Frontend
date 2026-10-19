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

  // Inyectar token explícito o recuperarlo de localStorage
  const authToken = token || localStorage.getItem('token')
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const response = await fetch(
    `${env.apiUrl}${endpoint}`,
    {
      ...fetchOptions,
      headers,
    },
  )

  if (!response.ok) {
    let message = 'Ha ocurrido un error'

    try {
      const error = await response.json()
      // Compatibilidad con FastAPI (error.detail) y respuestas estándar (error.message)
      if (typeof error.detail === 'string') {
        message = error.detail
      } else if (Array.isArray(error.detail)) {
        message = error.detail
          .map((d: { msg?: string }) => d.msg || JSON.stringify(d))
          .join(', ')
      } else if (error.message) {
        message = error.message
      }
    } catch {
      // La respuesta no contenía JSON
    }

    if (response.status === 401 && !endpoint.includes('/auth/login')) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
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
