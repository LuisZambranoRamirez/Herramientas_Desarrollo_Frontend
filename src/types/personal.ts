export interface Personal {
  dni: string
  nombres: string
  apellidos: string
  telefono: string
  correo: string
  activo: boolean
  fecha_registro: string
}

export interface CrearPersonalDto {
  dni: string
  nombres: string
  apellidos: string
  telefono: string
  correo: string
}

export interface ActualizarPersonalDto {
  nombres?: string
  apellidos?: string
  telefono?: string
  correo?: string
  activo?: boolean
}
