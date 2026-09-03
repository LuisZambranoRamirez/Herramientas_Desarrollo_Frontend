export interface Insumo {
  insumo_id: string
  codigo_unico: string 
  nombre: string
  stock: number
  stock_minimo: number
  fecha_vencimiento: string | null
  fecha_registro: string
}

export interface CrearInsumoDto {
  codigo_unico: string
  nombre: string
  stock: number
  stock_minimo: number
  fecha_vencimiento?: string | null
}

export interface ActualizarInsumoDto {
  stock_minimo?: number
  fecha_vencimiento?: string | null
}
