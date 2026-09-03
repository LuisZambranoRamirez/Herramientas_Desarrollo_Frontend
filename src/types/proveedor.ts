export interface Proveedor {
  ruc: string
  nombre: string
  telefono: string
  fecha_registro: string
}

export interface CrearProveedorDto {
  ruc: string
  nombre: string
  telefono: string
}

export interface ActualizarProveedorDto {
  nombre?: string
  telefono?: string
}
