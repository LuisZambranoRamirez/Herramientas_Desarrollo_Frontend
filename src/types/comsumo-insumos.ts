export interface ConsumoInsumo {
  consumo_insumos_id: string
  id_agenda_tratamiento: string
  id_insumo: string
  cantidad: number
}

export interface CrearConsumoInsumoDto {
  id_agenda_tratamiento: string
  id_insumo: string
  cantidad: number
}
