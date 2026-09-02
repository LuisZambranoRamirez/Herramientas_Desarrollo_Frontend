export interface Paciente {
  dni: string
  username: string
  nombres: string
  apellidos: string
  direccion: string | null
  telefono: string | null
  correo: string | null
  observaciones: string
  fecha_nacimiento: string
  fecha_registro: string
}

export interface CrearPacienteDto {
  dni: string
  username: string
  nombres: string
  apellidos: string
  direccion?: string
  telefono?: string
  correo?: string
  observaciones: string
  fecha_nacimiento: string
}

export interface ActualizarPacienteDto {
  nombres?: string
  apellidos?: string
  direccion?: string | null
  telefono?: string | null
  correo?: string | null
  observaciones?: string
  fecha_nacimiento?: string
}
