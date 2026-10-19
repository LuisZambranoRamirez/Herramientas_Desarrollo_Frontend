const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api'

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
} as const
