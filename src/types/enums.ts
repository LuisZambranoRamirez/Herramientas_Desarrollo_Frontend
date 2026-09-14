export type UserRole =
  | 'SYSTEM_ADMIN'
  | 'ODONTOLOGO'
  | 'PACIENTE'

export type DiaSemana =
  | 'LUNES'
  | 'MARTES'
  | 'MIERCOLES'
  | 'JUEVES'
  | 'VIERNES'
  | 'SABADO'
  | 'DOMINGO'

export type Especialidad =
  | 'ORTODONCIA'
  | 'ENDODONCIA'
  | 'PERIODONCIA'
  | 'ODONTOPEDIATRIA'
  | 'CIRUGIA_MAXILOFACIAL'
  | 'IMPLANTOLOGIA'
  | 'REHABILITACION_ORAL'
  | 'ODONTOLOGIA_ESTETICA'

export type EstadoCita =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'ATENDIDA'
  | 'CANCELADA'
  | 'NO_ASISTIO'
  | 'REPROGRAMADA'
  | 'EN_PROCESO'

export type EstadoTratamiento =
  | 'INICIADO'
  | 'EN_PROCESO'
  | 'FINALIZADO'
  | 'PENDIENTE'

export type Permiso =
  | 'LEER'
  | 'ACTULIZAR'
  | 'ELIMINAR'
  | 'CREAR'

export type MetodoPago =
  | 'efectivo'
  | 'digital'

export type TratamientoOdontologico =
  | 'Limpieza_dental_profunda'
  | 'Aplicacion_de_fluor'
  | 'Selladores_de_fosas_y_fisuras'
  | 'Restauracion_con_resina'
  | 'Ortopedia_maxilar'
  | 'Implante_dental'
