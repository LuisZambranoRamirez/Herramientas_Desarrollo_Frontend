import type {
Paciente,
CrearPacienteDto,
ActualizarPacienteDto,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { pacienteApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE PACIENTES
// ============================================================

export const pacientesService = {
getAll(): Promise<Paciente[]> {
// Backend:
// return api.get<Paciente[]>(
// '/pacientes',
// )

    return pacienteApi.getAll()
},

getByDni(
    dni: string,
): Promise<Paciente | undefined> {
    // Backend:
    // return api.get<Paciente>(
    //     `/pacientes/${dni}`,
    // )

    return pacienteApi.getByDni(dni)
},

create(
    data: CrearPacienteDto,
): Promise<Paciente> {
    // Backend:
    // return api.post<Paciente>(
    //     '/pacientes',
    //     data,
    // )

    return pacienteApi.create(data)
},

update(
    dni: string,
    data: ActualizarPacienteDto,
): Promise<Paciente> {
    // Backend:
    // return api.patch<Paciente>(
    //     `/pacientes/${dni}`,
    //     data,
    // )

    return pacienteApi.update(dni, data)
},

delete(
    dni: string,
): Promise<void> {
    // Backend:
    // return api.delete<void>(
    //     `/pacientes/${dni}`,
    // )

    return pacienteApi.delete(dni)
},


}