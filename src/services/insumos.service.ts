import type {
Insumo,
CrearInsumoDto,
ActualizarInsumoDto,
InsumoComprado,
CrearInsumoCompradoDto,
ConsumoInsumo,
CrearConsumoInsumoDto,
} from '@/types'

// ============================================================
// MOCKS
// ============================================================

import {
insumoApi,
insumoCompradoApi,
consumoInsumoApi,
} from '@/services/mock-api'

// ============================================================
// SERVICIO DE INSUMOS
// ============================================================

export const insumosService = {
getAll(): Promise<Insumo[]> {
// Backend:
// return api.get<Insumo[]>(
// '/insumos',
// )

    return insumoApi.getAll()
},

getById(
    id: string,
): Promise<Insumo | undefined> {
    // Backend:
    // return api.get<Insumo>(
    //     `/insumos/${id}`,
    // )

    return insumoApi.getById(id)
},

getStockBajo(): Promise<Insumo[]> {
    // Backend:
    // return api.get<Insumo[]>(
    //     '/insumos/stock-bajo',
    // )

    return insumoApi.getStockBajo()
},

create(
    data: CrearInsumoDto,
): Promise<Insumo> {
    // Backend:
    // return api.post<Insumo>(
    //     '/insumos',
    //     data,
    // )

    return insumoApi.create(data)
},

update(
    id: string,
    data: ActualizarInsumoDto,
): Promise<Insumo> {
    // Backend:
    // return api.patch<Insumo>(
    //     `/insumos/${id}`,
    //     data,
    // )

    return insumoApi.update(id, data)
},

delete(
    id: string,
): Promise<void> {
    // Backend:
    // return api.delete<void>(
    //     `/insumos/${id}`,
    // )

    return insumoApi.delete(id)
},

getCompras(
    id: string,
): Promise<InsumoComprado[]> {
    // Backend:
    // return api.get<InsumoComprado[]>(
    //     `/insumos/${id}/compras`,
    // )

    return insumoCompradoApi.getByInsumo(id)
},

createCompra(
    data: CrearInsumoCompradoDto,
): Promise<InsumoComprado> {
    // Backend:
    // return api.post<InsumoComprado>(
    //     '/insumos/compras',
    //     data,
    // )

    return insumoCompradoApi.create(data)
},

getConsumos(): Promise<ConsumoInsumo[]> {
    // Backend:
    // return api.get<ConsumoInsumo[]>(
    //     '/insumos/consumos',
    // )

    return consumoInsumoApi.getAll()
},

createConsumo(
    data: CrearConsumoInsumoDto,
): Promise<ConsumoInsumo> {
    // Backend:
    // return api.post<ConsumoInsumo>(
    //     '/insumos/consumos',
    //     data,
    // )

    return consumoInsumoApi.create(data)
},


}