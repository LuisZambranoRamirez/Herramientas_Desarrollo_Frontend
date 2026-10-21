const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api'

export const env = {
  apiUrl: apiUrl.replace(/\/+$/, ''),
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
} as const
