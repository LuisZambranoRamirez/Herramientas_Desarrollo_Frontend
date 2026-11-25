import type {
  Odontologo,
  OdontologoPublico,
  HorarioPersonal,
  Especialidad,
  DiaSemana,
} from '@/types'
import { api } from '@/services/api/client'
import { env } from '@/config/env'
import { usuariosService } from '@/services/usuarios.service'

// ============================================================
// SERVICIO DE ODONTÓLOGOS
// ============================================================

export const odontologosService = {
  /**
   * Consulta pública de especialistas activos (sin requerir sesión de admin).
   * Obtiene la lista filtrada por rol 'ODONTOLOGO' y estado 'activo'.
   */
  async getActiveDentists(): Promise<OdontologoPublico[]> {
    if (!env.useMock) {
      try {
        return await api.get<OdontologoPublico[]>('/odontologos/activos')
      } catch {
        return await api.get<OdontologoPublico[]>('/usuarios/odontologos/activos')
      }
    }
    return usuariosService.getActiveDentists()
  },

  getAll(): Promise<Odontologo[]> {
    return api.get<Odontologo[]>('/odontologos')
  },

  getMe(): Promise<Odontologo> {
    return api.get<Odontologo>('/odontologos/me')
  },

  getByDni(dni: string): Promise<Odontologo | undefined> {
    return api.get<Odontologo>(`/odontologos/${dni}`)
  },

  getByEspecialidad(especialidad: Especialidad): Promise<Odontologo[]> {
    return api.get<Odontologo[]>(`/odontologos?especialidad=${especialidad}`)
  },

  getHorarios(dni: string): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios`).catch(() => [])
  },

  getHorariosByDia(dni: string, dia: DiaSemana): Promise<HorarioPersonal[]> {
    return api.get<HorarioPersonal[]>(`/odontologos/${dni}/horarios/${dia}`).catch(() => [])
  },
}