export interface InsumoComprado {
  insumo_comprado_id: string
  id_insumo: string
  id_proveedor: string
  cantidad: number
  precio_unitario: number
  fecha_registro: string
}

export interface CrearInsumoCompradoDto {
  id_insumo: string
  id_proveedor: string
  cantidad: number
  precio_unitario: number
}
