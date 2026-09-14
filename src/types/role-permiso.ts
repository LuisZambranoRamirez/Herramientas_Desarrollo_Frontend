import type {
  UserRole,
  Permiso,
} from './enums'

export interface RolePermiso {
  role: UserRole
  permisos: Permiso
}
