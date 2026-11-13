import type {
  Cita,
  CitaOdontologoResumen,
  CrearCitaDto,
  ActualizarCitaDto,
  EstadoCita,
} from '@/types'
import { api } from '@/services/api/client'

// ============================================================
// SERVICIO DE CITAS
// ============================================================

export const citasService = {
  getAll(): Promise<Cita[]> {
    return api.get<Cita[]>('/citas')
  },

  getMisCitas(): Promise<Cita[]> {
    return api.get<Cita[]>('/citas/mis-citas')
  },

  getOdontologos(): Promise<CitaOdontologoResumen[]> {
    return api.get<CitaOdontologoResumen[]>('/citas/odontologos')
  },

  getById(id: string): Promise<Cita | undefined> {
    return api.get<Cita>(`/citas/${id}`)
  },

  getByPaciente(dniPaciente: string): Promise<Cita[]> {
    return api.get<Cita[]>(`/citas?dni_paciente=${dniPaciente}`)
  },

  getByOdontologo(dniOdontologo: string): Promise<Cita[]> {
    return api.get<Cita[]>(`/citas?dni_odontologo=${dniOdontologo}`)
  },

  getByEstado(estado: EstadoCita): Promise<Cita[]> {
    return api.get<Cita[]>(`/citas?estado=${estado}`)
  },

  create(data: CrearCitaDto): Promise<Cita> {
    return api.post<Cita>('/citas', data)
  },

  update(id: string, data: ActualizarCitaDto): Promise<Cita> {
    return api.put<Cita>(`/citas/${id}`, data)
  },

  delete(id: string): Promise<Cita> {
    return api.patch<Cita>(`/citas/${id}/cancelar`)
  },
}
