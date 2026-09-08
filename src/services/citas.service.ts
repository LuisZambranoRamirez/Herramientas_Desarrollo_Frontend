import type {
  Cita,
  CrearCitaDto,
  ActualizarCitaDto,
  EstadoCita,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { citaApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE CITAS
// ============================================================

export const citasService = {
  getAll(): Promise<Cita[]> {
    // Backend:
    // return api.get<Cita[]>('/citas')

    return citaApi.getAll()
  },

  getById(
    id: string,
  ): Promise<Cita | undefined> {
    // Backend:
    // return api.get<Cita>(`/citas/${id}`)

    return citaApi.getById(id)
  },

  getByPaciente(
    dniPaciente: string,
  ): Promise<Cita[]> {
    // Backend:
    // return api.get<Cita[]>(
    //   `/citas/paciente/${dniPaciente}`,
    // )

    return citaApi.getByPaciente(dniPaciente)
  },

  getByOdontologo(
    dniOdontologo: string,
  ): Promise<Cita[]> {
    // Backend:
    // return api.get<Cita[]>(
    //   `/citas/odontologo/${dniOdontologo}`,
    // )

    return citaApi.getByOdontologo(dniOdontologo)
  },

  getByEstado(
    estado: EstadoCita,
  ): Promise<Cita[]> {
    // Backend:
    // return api.get<Cita[]>(
    //   `/citas/estado/${estado}`,
    // )

    return citaApi.getByEstado(estado)
  },

  create(
    data: CrearCitaDto,
  ): Promise<Cita> {
    // Backend:
    // return api.post<Cita>(
    //   '/citas',
    //   data,
    // )

    return citaApi.create(data)
  },

  update(
    id: string,
    data: ActualizarCitaDto,
  ): Promise<Cita> {
    // Backend:
    // return api.patch<Cita>(
    //   `/citas/${id}`,
    //   data,
    // )

    return citaApi.update(id, data)
  },

  delete(
    id: string,
  ): Promise<void> {
    // Backend:
    // return api.delete<void>(
    //   `/citas/${id}`,
    // )

    return citaApi.delete(id)
  },
}
