import type {
  Usuario,
  Personal,
  Paciente,
  Odontologo,
  HorarioPersonal,
  Cita,
  TratamientoPaciente,
  AgendaTratamiento,
  Insumo,
  Proveedor,
  InsumoComprado,
  ConsumoInsumo,
  Pago,
  RolePermiso,
  CrearPacienteDto,
  ActualizarPacienteDto,
  CrearCitaDto,
  ActualizarCitaDto,
  CrearTratamientoPacienteDto,
  ActualizarTratamientoPacienteDto,
  CrearInsumoDto,
  ActualizarInsumoDto,
  CrearProveedorDto,
  ActualizarProveedorDto,
  CrearPagoDto,
  EstadoCita,
  EstadoTratamiento,
  TratamientoOdontologico,
  Especialidad,
  MetodoPago,
  DiaSemana,
  UserRole,
  Permiso,
} from '@/types'

// ============================================================
// CONFIGURACIÓN
// ============================================================

const DELAY = 400

const delay = (ms = DELAY): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

// ============================================================
// HELPERS
// ============================================================

const generateId = (): string => {
  return crypto.randomUUID()
}

const now = (): string => {
  return new Date().toISOString()
}

// ============================================================
// BASE DE DATOS EN MEMORIA
// ============================================================

export const mockDb = {
  usuarios: [] as Usuario[],
  personal: [] as Personal[],
  pacientes: [] as Paciente[],
  odontologos: [] as Odontologo[],
  horarios: [] as HorarioPersonal[],
  citas: [] as Cita[],
  tratamientos: [] as TratamientoPaciente[],
  agendasTratamientos: [] as AgendaTratamiento[],
  insumos: [] as Insumo[],
  proveedores: [] as Proveedor[],
  insumosComprados: [] as InsumoComprado[],
  consumosInsumos: [] as ConsumoInsumo[],
  rolePermisos: [] as RolePermiso[],
  pagos: [] as Pago[],
}

// ============================================================
// DATOS INICIALES
// ============================================================

mockDb.usuarios.push(
  {
    username: 'admin',
    activo: true,
    user_role: 'SYSTEM_ADMIN',
    fecha_registro: '2026-08-01T08:00:00',
  },
  {
    username: 'dr.garcia',
    activo: true,
    user_role: 'ODONTOLOGO',
    fecha_registro: '2026-08-02T09:00:00',
  },
  {
    username: 'maria.lopez',
    activo: true,
    user_role: 'PACIENTE',
    fecha_registro: '2026-08-03T10:00:00',
  },
)

mockDb.personal.push(
  {
    dni: '45678912',
    nombres: 'Carlos',
    apellidos: 'García López',
    telefono: '987654321',
    correo: 'carlos.garcia@clinica.com',
    activo: true,
    fecha_registro: '2026-08-02T09:00:00',
  },
  {
    dni: '47891236',
    nombres: 'Ana',
    apellidos: 'Martínez Torres',
    telefono: '912345678',
    correo: 'ana.martinez@clinica.com',
    activo: true,
    fecha_registro: '2026-08-02T09:30:00',
  },
)

mockDb.pacientes.push(
  {
    dni: '72845631',
    username: 'maria.lopez',
    nombres: 'María',
    apellidos: 'López García',
    direccion: 'Av. Arequipa 1234',
    telefono: '987111222',
    correo: 'maria.lopez@gmail.com',
    observaciones: 'Paciente con sensibilidad dental.',
    fecha_nacimiento: '1998-05-20',
    fecha_registro: '2026-08-03T10:00:00',
  },
  {
    dni: '71523489',
    username: 'juan.perez',
    nombres: 'Juan',
    apellidos: 'Pérez Torres',
    direccion: 'Jr. Los Olivos 456',
    telefono: '912333444',
    correo: 'juan.perez@gmail.com',
    observaciones: 'Sin observaciones.',
    fecha_nacimiento: '1995-11-12',
    fecha_registro: '2026-08-04T14:30:00',
  },
)

mockDb.odontologos.push(
  {
    dni: '45678912',
    colegiatura: 'COP-12345',
    especialidad: 'ORTODONCIA',
    username: 'dr.garcia',
  },
  {
    dni: '47891236',
    colegiatura: 'COP-67890',
    especialidad: 'ENDODONCIA',
    username: 'dra.martinez',
  },
)

mockDb.horarios.push(
  {
    horario_odontologo_id: generateId(),
    dni: '45678912',
    dia_semana: 'LUNES',
    hora_inicio: '08:00:00',
    hora_fin: '13:00:00',
  },
  {
    horario_odontologo_id: generateId(),
    dni: '45678912',
    dia_semana: 'MIERCOLES',
    hora_inicio: '14:00:00',
    hora_fin: '19:00:00',
  },
  {
    horario_odontologo_id: generateId(),
    dni: '47891236',
    dia_semana: 'MARTES',
    hora_inicio: '08:00:00',
    hora_fin: '13:00:00',
  },
)

mockDb.citas.push(
  {
    cita_id: generateId(),
    dni_paciente: '72845631',
    dni_odontologo: '45678912',
    fecha: '2026-09-02',
    hora: '09:00:00',
    motivo_consulta: 'Dolor dental',
    diagnostico: null,
    estado: 'PROGRAMADA',
    fecha_registro: '2026-08-25T10:00:00',
  },
  {
    cita_id: generateId(),
    dni_paciente: '71523489',
    dni_odontologo: '47891236',
    fecha: '2026-09-02',
    hora: '10:30:00',
    motivo_consulta: 'Revisión general',
    diagnostico: 'Caries dental',
    estado: 'CONFIRMADA',
    fecha_registro: '2026-08-26T11:00:00',
  },
  {
    cita_id: generateId(),
    dni_paciente: '72845631',
    dni_odontologo: '45678912',
    fecha: '2026-08-28',
    hora: '11:00:00',
    motivo_consulta: 'Control de ortodoncia',
    diagnostico: 'Tratamiento en progreso',
    estado: 'ATENDIDA',
    fecha_registro: '2026-08-20T09:00:00',
  },
)

mockDb.tratamientos.push(
  {
    tratamiento_paciente_id: generateId(),
    dni_paciente: '72845631',
    dni_odontologo: '45678912',
    observaciones: 'Tratamiento de ortodoncia inicial.',
    precio: 2500,
    tratamiento: 'Ortopedia_maxilar',
    estado: 'EN_PROCESO',
    fecha_registro: '2026-08-10T09:00:00',
  },
  {
    tratamiento_paciente_id: generateId(),
    dni_paciente: '71523489',
    dni_odontologo: '47891236',
    observaciones: 'Limpieza y prevención.',
    precio: 180,
    tratamiento: 'Limpieza_dental_profunda',
    estado: 'FINALIZADO',
    fecha_registro: '2026-08-12T11:00:00',
  },
)

mockDb.insumos.push(
  {
    insumo_id: generateId(),
    nombre: 'Guantes de nitrilo',
    stock: 250,
    stock_minimo: 50,
    fecha_vencimiento: '2028-05-30',
    fecha_registro: '2026-08-01T08:00:00',
  },
  {
    insumo_id: generateId(),
    nombre: 'Resina dental',
    stock: 25,
    stock_minimo: 10,
    fecha_vencimiento: '2027-11-20',
    fecha_registro: '2026-08-05T09:30:00',
  },
  {
    insumo_id: generateId(),
    nombre: 'Anestesia dental',
    stock: 8,
    stock_minimo: 10,
    fecha_vencimiento: '2027-03-15',
    fecha_registro: '2026-08-05T10:00:00',
  },
)

mockDb.proveedores.push(
  {
    ruc: '20123456789',
    nombre: 'Dental Supplies SAC',
    telefono: '987123456',
    fecha_registro: '2026-07-15T09:00:00',
  },
  {
    ruc: '20987654321',
    nombre: 'Medical Dental Perú SAC',
    telefono: '912987654',
    fecha_registro: '2026-07-20T10:00:00',
  },
)

// ============================================================
// USUARIOS
// ============================================================

export const usuarioApi = {
  async getAll(): Promise<Usuario[]> {
    await delay()

    return [...mockDb.usuarios]
  },

  async getByUsername(
    username: string,
  ): Promise<Usuario | undefined> {
    await delay()

    return mockDb.usuarios.find(
      usuario => usuario.username === username,
    )
  },
}

// ============================================================
// PERSONAL
// ============================================================

export const personalApi = {
  async getAll(): Promise<Personal[]> {
    await delay()

    return [...mockDb.personal]
  },

  async getByDni(
    dni: string,
  ): Promise<Personal | undefined> {
    await delay()

    return mockDb.personal.find(
      personal => personal.dni === dni,
    )
  },
}

// ============================================================
// PACIENTES
// ============================================================

export const pacienteApi = {
  async getAll(): Promise<Paciente[]> {
    await delay()

    return [...mockDb.pacientes]
  },

  async getByDni(
    dni: string,
  ): Promise<Paciente | undefined> {
    await delay()

    return mockDb.pacientes.find(
      paciente => paciente.dni === dni,
    )
  },

  async create(
    data: CrearPacienteDto,
  ): Promise<Paciente> {
    await delay()

    const paciente: Paciente = {
      dni: data.dni,
      username: data.username,
      nombres: data.nombres,
      apellidos: data.apellidos,
      direccion: data.direccion ?? null,
      telefono: data.telefono ?? null,
      correo: data.correo ?? null,
      observaciones: data.observaciones,
      fecha_nacimiento: data.fecha_nacimiento,
      fecha_registro: now(),
    }

    mockDb.pacientes.push(paciente)

    return paciente
  },

  async update(
    dni: string,
    data: ActualizarPacienteDto,
  ): Promise<Paciente> {
    await delay()

    const paciente = mockDb.pacientes.find(
      paciente => paciente.dni === dni,
    )

    if (!paciente) {
      throw new Error('Paciente no encontrado')
    }

    Object.assign(paciente, data)

    return paciente
  },

  async delete(dni: string): Promise<void> {
    await delay()

    const index = mockDb.pacientes.findIndex(
      paciente => paciente.dni === dni,
    )

    if (index === -1) {
      throw new Error('Paciente no encontrado')
    }

    mockDb.pacientes.splice(index, 1)
  },
}

// ============================================================
// ODONTÓLOGOS
// ============================================================

export const odontologoApi = {
  async getAll(): Promise<Odontologo[]> {
    await delay()

    return [...mockDb.odontologos]
  },

  async getByDni(
    dni: string,
  ): Promise<Odontologo | undefined> {
    await delay()

    return mockDb.odontologos.find(
      odontologo => odontologo.dni === dni,
    )
  },

  async getByEspecialidad(
    especialidad: Especialidad,
  ): Promise<Odontologo[]> {
    await delay()

    return mockDb.odontologos.filter(
      odontologo =>
        odontologo.especialidad === especialidad,
    )
  },
}

// ============================================================
// HORARIOS
// ============================================================

export const horarioApi = {
  async getAll(): Promise<HorarioPersonal[]> {
    await delay()

    return [...mockDb.horarios]
  },

  async getByOdontologo(
    dni: string,
  ): Promise<HorarioPersonal[]> {
    await delay()

    return mockDb.horarios.filter(
      horario => horario.dni === dni,
    )
  },

  async getByDia(
    dia: DiaSemana,
  ): Promise<HorarioPersonal[]> {
    await delay()

    return mockDb.horarios.filter(
      horario => horario.dia_semana === dia,
    )
  },
}

// ============================================================
// CITAS
// ============================================================

export const citaApi = {
  async getAll(): Promise<Cita[]> {
    await delay()

    return [...mockDb.citas]
  },

  async getById(
    citaId: string,
  ): Promise<Cita | undefined> {
    await delay()

    return mockDb.citas.find(
      cita => cita.cita_id === citaId,
    )
  },

  async getByPaciente(
    dni: string,
  ): Promise<Cita[]> {
    await delay()

    return mockDb.citas.filter(
      cita => cita.dni_paciente === dni,
    )
  },

  async getByOdontologo(
    dni: string,
  ): Promise<Cita[]> {
    await delay()

    return mockDb.citas.filter(
      cita => cita.dni_odontologo === dni,
    )
  },

  async getByEstado(
    estado: EstadoCita,
  ): Promise<Cita[]> {
    await delay()

    return mockDb.citas.filter(
      cita => cita.estado === estado,
    )
  },

  async create(
    data: CrearCitaDto,
  ): Promise<Cita> {
    await delay()

    const cita: Cita = {
      cita_id: generateId(),
      dni_paciente: data.dni_paciente,
      dni_odontologo: data.dni_odontologo,
      fecha: data.fecha,
      hora: data.hora,
      motivo_consulta: data.motivo_consulta,
      diagnostico: null,
      estado: 'PROGRAMADA',
      fecha_registro: now(),
    }

    mockDb.citas.push(cita)

    return cita
  },

  async update(
    citaId: string,
    data: ActualizarCitaDto,
  ): Promise<Cita> {
    await delay()

    const cita = mockDb.citas.find(
      cita => cita.cita_id === citaId,
    )

    if (!cita) {
      throw new Error('Cita no encontrada')
    }

    Object.assign(cita, data)

    return cita
  },

  async delete(citaId: string): Promise<void> {
    await delay()

    const index = mockDb.citas.findIndex(
      cita => cita.cita_id === citaId,
    )

    if (index === -1) {
      throw new Error('Cita no encontrada')
    }

    mockDb.citas.splice(index, 1)
  },
}

// ============================================================
// TRATAMIENTOS
// ============================================================

export const tratamientoApi = {
  async getAll(): Promise<TratamientoPaciente[]> {
    await delay()

    return [...mockDb.tratamientos]
  },

  async getById(
    id: string,
  ): Promise<TratamientoPaciente | undefined> {
    await delay()

    return mockDb.tratamientos.find(
      tratamiento =>
        tratamiento.tratamiento_paciente_id === id,
    )
  },

  async getByPaciente(
    dni: string,
  ): Promise<TratamientoPaciente[]> {
    await delay()

    return mockDb.tratamientos.filter(
      tratamiento =>
        tratamiento.dni_paciente === dni,
    )
  },

  async getByEstado(
    estado: EstadoTratamiento,
  ): Promise<TratamientoPaciente[]> {
    await delay()

    return mockDb.tratamientos.filter(
      tratamiento => tratamiento.estado === estado,
    )
  },

  async create(
    data: CrearTratamientoPacienteDto,
  ): Promise<TratamientoPaciente> {
    await delay()

    const tratamiento: TratamientoPaciente = {
      tratamiento_paciente_id: generateId(),
      dni_paciente: data.dni_paciente,
      dni_odontologo: data.dni_odontologo,
      observaciones: data.observaciones,
      precio: data.precio,
      tratamiento: data.tratamiento,
      estado: 'INICIADO',
      fecha_registro: now(),
    }

    mockDb.tratamientos.push(tratamiento)

    return tratamiento
  },

  async update(
    id: string,
    data: ActualizarTratamientoPacienteDto,
  ): Promise<TratamientoPaciente> {
    await delay()

    const tratamiento =
      mockDb.tratamientos.find(
        tratamiento =>
          tratamiento.tratamiento_paciente_id === id,
      )

    if (!tratamiento) {
      throw new Error('Tratamiento no encontrado')
    }

    Object.assign(tratamiento, data)

    return tratamiento
  },
}

// ============================================================
// AGENDAS DE TRATAMIENTO
// ============================================================

export const agendaTratamientoApi = {
  async getAll(): Promise<AgendaTratamiento[]> {
    await delay()

    return [...mockDb.agendasTratamientos]
  },

  async getByTratamiento(
    tratamientoId: string,
  ): Promise<AgendaTratamiento[]> {
    await delay()

    return mockDb.agendasTratamientos.filter(
      agenda =>
        agenda.id_tratamiento_paciente ===
        tratamientoId,
    )
  },
}

// ============================================================
// INSUMOS
// ============================================================

export const insumoApi = {
  async getAll(): Promise<Insumo[]> {
    await delay()

    return [...mockDb.insumos]
  },

  async getById(
    id: string,
  ): Promise<Insumo | undefined> {
    await delay()

    return mockDb.insumos.find(
      insumo => insumo.insumo_id === id,
    )
  },

  async getStockBajo(): Promise<Insumo[]> {
    await delay()

    return mockDb.insumos.filter(
      insumo => insumo.stock <= insumo.stock_minimo,
    )
  },

  async create(
    data: CrearInsumoDto,
  ): Promise<Insumo> {
    await delay()

    const insumo: Insumo = {
      insumo_id: generateId(),
      nombre: data.nombre,
      stock: data.stock,
      stock_minimo: data.stock_minimo,
      fecha_vencimiento:
        data.fecha_vencimiento ?? null,
      fecha_registro: now(),
    }

    mockDb.insumos.push(insumo)

    return insumo
  },

  async update(
    id: string,
    data: ActualizarInsumoDto,
  ): Promise<Insumo> {
    await delay()

    const insumo = mockDb.insumos.find(
      insumo => insumo.insumo_id === id,
    )

    if (!insumo) {
      throw new Error('Insumo no encontrado')
    }

    Object.assign(insumo, data)

    return insumo
  },

  async delete(id: string): Promise<void> {
    await delay()

    const index = mockDb.insumos.findIndex(
      insumo => insumo.insumo_id === id,
    )

    if (index === -1) {
      throw new Error('Insumo no encontrado')
    }

    mockDb.insumos.splice(index, 1)
  },
}

// ============================================================
// PROVEEDORES
// ============================================================

export const proveedorApi = {
  async getAll(): Promise<Proveedor[]> {
    await delay()

    return [...mockDb.proveedores]
  },

  async getByRuc(
    ruc: string,
  ): Promise<Proveedor | undefined> {
    await delay()

    return mockDb.proveedores.find(
      proveedor => proveedor.ruc === ruc,
    )
  },

  async create(
    data: CrearProveedorDto,
  ): Promise<Proveedor> {
    await delay()

    const proveedor: Proveedor = {
      ruc: data.ruc,
      nombre: data.nombre,
      telefono: data.telefono,
      fecha_registro: now(),
    }

    mockDb.proveedores.push(proveedor)

    return proveedor
  },

  async update(
    ruc: string,
    data: ActualizarProveedorDto,
  ): Promise<Proveedor> {
    await delay()

    const proveedor = mockDb.proveedores.find(
      proveedor => proveedor.ruc === ruc,
    )

    if (!proveedor) {
      throw new Error('Proveedor no encontrado')
    }

    Object.assign(proveedor, data)

    return proveedor
  },

  async delete(ruc: string): Promise<void> {
    await delay()

    const index = mockDb.proveedores.findIndex(
      proveedor => proveedor.ruc === ruc,
    )

    if (index === -1) {
      throw new Error('Proveedor no encontrado')
    }

    mockDb.proveedores.splice(index, 1)
  },
}

// ============================================================
// INSUMOS COMPRADOS
// ============================================================

export const insumoCompradoApi = {
  async getAll(): Promise<InsumoComprado[]> {
    await delay()

    return [...mockDb.insumosComprados]
  },

  async getByInsumo(
    idInsumo: string,
  ): Promise<InsumoComprado[]> {
    await delay()

    return mockDb.insumosComprados.filter(
      compra => compra.id_insumo === idInsumo,
    )
  },

  async create(
    data: Omit<
      InsumoComprado,
      'insumo_comprado_id' | 'fecha_registro'
    >,
  ): Promise<InsumoComprado> {
    await delay()

    const compra: InsumoComprado = {
      insumo_comprado_id: generateId(),
      id_insumo: data.id_insumo,
      id_proveedor: data.id_proveedor,
      cantidad: data.cantidad,
      precio_unitario: data.precio_unitario,
      fecha_registro: now(),
    }

    mockDb.insumosComprados.push(compra)

    const insumo = mockDb.insumos.find(
      insumo =>
        insumo.insumo_id === data.id_insumo,
    )

    if (insumo) {
      insumo.stock += data.cantidad
    }

    return compra
  },
}

// ============================================================
// CONSUMO DE INSUMOS
// ============================================================

export const consumoInsumoApi = {
  async getAll(): Promise<ConsumoInsumo[]> {
    await delay()

    return [...mockDb.consumosInsumos]
  },

  async getByAgenda(
    agendaId: string,
  ): Promise<ConsumoInsumo[]> {
    await delay()

    return mockDb.consumosInsumos.filter(
      consumo =>
        consumo.id_agenda_tratamiento === agendaId,
    )
  },

  async create(
    data: Omit<ConsumoInsumo, 'consumo_insumos_id'>,
  ): Promise<ConsumoInsumo> {
    await delay()

    const consumo: ConsumoInsumo = {
      consumo_insumos_id: generateId(),
      id_agenda_tratamiento:
        data.id_agenda_tratamiento,
      id_insumo: data.id_insumo,
      cantidad: data.cantidad,
    }

    mockDb.consumosInsumos.push(consumo)

    const insumo = mockDb.insumos.find(
      insumo =>
        insumo.insumo_id === data.id_insumo,
    )

    if (insumo) {
      insumo.stock -= data.cantidad
    }

    return consumo
  },
}

// ============================================================
// PAGOS
// ============================================================

export const pagoApi = {
  async getAll(): Promise<Pago[]> {
    await delay()

    return [...mockDb.pagos]
  },

  async getByTratamiento(
    tratamientoId: string,
  ): Promise<Pago[]> {
    await delay()

    return mockDb.pagos.filter(
      pago =>
        pago.id_tratamiento_paciente ===
        tratamientoId,
    )
  },

  async create(
    data: CrearPagoDto,
  ): Promise<Pago> {
    await delay()

    const pago: Pago = {
      pago_id: generateId(),
      id_tratamiento_paciente:
        data.id_tratamiento_paciente,
      monto: data.monto,
      metodo_pago: data.metodo_pago,
      fecha_registro: now(),
    }

    mockDb.pagos.push(pago)

    return pago
  },
}

// ============================================================
// ROLE / PERMISOS
// ============================================================

export const rolePermisoApi = {
  async getAll(): Promise<RolePermiso[]> {
    await delay()

    return [...mockDb.rolePermisos]
  },

  async getByRole(
    role: UserRole,
  ): Promise<RolePermiso[]> {
    await delay()

    return mockDb.rolePermisos.filter(
      permiso => permiso.role === role,
    )
  },
}

// ============================================================
// AUTENTICACIÓN SIMULADA
// ============================================================

export interface LoginDto {
  username: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  user: Usuario
}

export const authApi = {
  async login(
    data: LoginDto,
  ): Promise<LoginResponse> {
    await delay()

    const usuario = mockDb.usuarios.find(
      usuario =>
        usuario.username === data.username,
    )

    if (!usuario) {
      throw new Error(
        'Usuario o contraseña incorrectos',
      )
    }

    if (!usuario.activo) {
      throw new Error('Usuario inactivo')
    }

    // Token ficticio solamente para la demo.
    const accessToken = `mock-token-${generateId()}`

    return {
      accessToken,
      user: usuario,
    }
  },

  async logout(): Promise<void> {
    await delay(200)
  },

  async me(
    username: string,
  ): Promise<Usuario | undefined> {
    await delay()

    return mockDb.usuarios.find(
      usuario => usuario.username === username,
    )
  },
}
