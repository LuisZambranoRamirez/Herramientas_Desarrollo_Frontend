import type {
Odontologo,
HorarioPersonal,
Especialidad,
DiaSemana,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import {
odontologoApi,
horarioApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE ODONTÓLOGOS
// ============================================================

export const odontologosService = {
getAll(): Promise<Odontologo[]> {
// Backend:
// return api.get<Odontologo[]>(
// '/odontologos',
// )

    return odontologoApi.getAll()
},

getByDni(
    dni: string,
): Promise<Odontologo | undefined> {
    // Backend:
    // return api.get<Odontologo>(
    //     `/odontologos/${dni}`,
    // )

    return odontologoApi.getByDni(dni)
},

getByEspecialidad(
    especialidad: Especialidad,
): Promise<Odontologo[]> {
    // Backend:
    // return api.get<Odontologo[]>(
    //     `/odontologos/especialidad/${especialidad}`,
    // )

    return odontologoApi.getByEspecialidad(especialidad)
},

getHorarios(
    dni: string,
): Promise<HorarioPersonal[]> {
    // Backend:
    // return api.get<HorarioPersonal[]>(
    //     `/odontologos/${dni}/horarios`,
    // )

    return horarioApi.getByOdontologo(dni)
},

getHorariosByDia(
    dni: string,
    dia: DiaSemana,
): Promise<HorarioPersonal[]> {
    // Backend:
    // return api.get<HorarioPersonal[]>(
    //     `/odontologos/${dni}/horarios/${dia}`,
    // )

    return horarioApi.getByOdontologo(dni).then(
        horarios =>
            horarios.filter(
                horario =>
                    horario.dia_semana === dia,
            ),
    )
},


}