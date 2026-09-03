import type { MetodoPago } from './enums'

export interface Pago {
  pago_id: string
  id_tratamiento_paciente: string
  monto: number
  metodo_pago: MetodoPago
  fecha_registro: string
}

export interface CrearPagoDto {
  id_tratamiento_paciente: string
  monto: number
  metodo_pago: MetodoPago
}
