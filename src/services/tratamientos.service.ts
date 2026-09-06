import type {
TratamientoPaciente,
CrearTratamientoPacienteDto,
ActualizarTratamientoPacienteDto,
AgendaTratamiento,
CrearAgendaTratamientoDto,
EstadoTratamiento,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import {
tratamientoApi,
agendaTratamientoApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE TRATAMIENTOS
// ============================================================

export const tratamientosService = {
getAll(): Promise<TratamientoPaciente[]> {
// Backend:
// return api.get<TratamientoPaciente[]>(
// '/tratamientos',
// )

    return tratamientoApi.getAll()
},

getById(
    id: string,
): Promise<TratamientoPaciente | undefined> {
    // Backend:
    // return api.get<TratamientoPaciente>(
    //     `/tratamientos/${id}`,
    // )

    return tratamientoApi.getById(id)
},

getByPaciente(
    dni: string,
): Promise<TratamientoPaciente[]> {
    // Backend:
    // return api.get<TratamientoPaciente[]>(
    //     `/tratamientos/paciente/${dni}`,
    // )

    return tratamientoApi.getByPaciente(dni)
},

getByEstado(
    estado: EstadoTratamiento,
): Promise<TratamientoPaciente[]> {
    // Backend:
    // return api.get<TratamientoPaciente[]>(
    //     `/tratamientos/estado/${estado}`,
    // )

    return tratamientoApi.getByEstado(estado)
},

create(
    data: CrearTratamientoPacienteDto,
): Promise<TratamientoPaciente> {
    // Backend:
    // return api.post<TratamientoPaciente>(
    //     '/tratamientos',
    //     data,
    // )

    return tratamientoApi.create(data)
},

update(
    id: string,
    data: ActualizarTratamientoPacienteDto,
): Promise<TratamientoPaciente> {
    // Backend:
    // return api.patch<TratamientoPaciente>(
    //     `/tratamientos/${id}`,
    //     data,
    // )

    return tratamientoApi.update(id, data)
},

getAgenda(
    tratamientoId: string,
): Promise<AgendaTratamiento[]> {
    // Backend:
    // return api.get<AgendaTratamiento[]>(
    //     `/tratamientos/${tratamientoId}/agenda`,
    // )

    return agendaTratamientoApi.getByTratamiento(
        tratamientoId,
    )
},

createAgenda(
    data: CrearAgendaTratamientoDto,
): Promise<AgendaTratamiento> {
    // Backend:
    // return api.post<AgendaTratamiento>(
    //     '/tratamientos/agenda',
    //     data,
    // )

    throw new Error(
        'createAgenda aún no está implementado en el mock API',
    )
},


}