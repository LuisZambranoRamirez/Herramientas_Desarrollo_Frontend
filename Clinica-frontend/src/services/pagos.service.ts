import type {
Pago,
CrearPagoDto,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import { pagoApi } from '@/services/mock-api'

// ============================================================
// SERVICIO DE PAGOS
// ============================================================

export const pagosService = {
getAll(): Promise<Pago[]> {
// Backend:
// return api.get<Pago[]>(
// '/pagos',
// )

    return pagoApi.getAll()
},

getById(
    id: string,
): Promise<Pago | undefined> {
    // Backend:
    // return api.get<Pago>(
    //     `/pagos/${id}`,
    // )

    const pagos = pagoApi.getAll()

    return pagos.then(
        pagos =>
            pagos.find(
                pago => pago.pago_id === id,
            ),
    )
},

getByTratamiento(
    tratamientoId: string,
): Promise<Pago[]> {
    // Backend:
    // return api.get<Pago[]>(
    //     `/pagos/tratamiento/${tratamientoId}`,
    // )

    return pagoApi.getByTratamiento(
        tratamientoId,
    )
},

create(
    data: CrearPagoDto,
): Promise<Pago> {
    // Backend:
    // return api.post<Pago>(
    //     '/pagos',
    //     data,
    // )

    return pagoApi.create(data)
},


}