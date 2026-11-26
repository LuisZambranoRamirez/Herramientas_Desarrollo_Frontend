import { api } from '@/services/api/client'

export interface DashboardResumen {
  citas_hoy: number
  pacientes_total: number
  tratamientos_en_proceso: number
  insumos_stock_bajo: number
}

export const dashboardService = {
  getResumen(): Promise<DashboardResumen> {
    return api.get<DashboardResumen>('/dashboard/resumen')
  },
}