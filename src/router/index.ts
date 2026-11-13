import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { getDefaultRouteByRole } from '@/utils/navigation'
import HomeView from '../views/HomeView.vue'
import ReservarCitasView from '../views/ReservarCitasView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DashboardView from '@/views/DashboardView.vue'
import InventarioView from '@/views/InventarioView.vue'
import AgendaView from '@/views/intranet/AgendaView.vue'
import PacientesView from '@/views/intranet/PacientesView.vue'
import UsuariosView from '@/views/intranet/UsuariosView.vue'
import TratamientosView from '@/views/intranet/TratamientosView.vue'
import PagosView from '@/views/intranet/PagosView.vue'
import ConfiguracionView from '@/views/intranet/ConfiguracionView.vue'
import OdontologoDashboardView from '@/views/odontologo/OdontologoDashboardView.vue'
import PacienteDashboardView from '@/views/paciente/PacienteDashboardView.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/reservar',
      name: 'reservar',
      component: ReservarCitasView,
    },
    {
      path: '/test-citas',
      redirect: '/agenda',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/registro',
      name: 'registro',
      component: RegisterView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN'] },
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN'] },
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: AgendaView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN', 'ODONTOLOGO'] },
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: PacientesView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN', 'ODONTOLOGO'] },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: UsuariosView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN'] },
    },
    {
      path: '/tratamientos',
      name: 'tratamientos',
      component: TratamientosView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN', 'ODONTOLOGO'] },
    },
    {
      path: '/pagos',
      name: 'pagos',
      component: PagosView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN'] },
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: ConfiguracionView,
      meta: { requiresAuth: true, roles: ['SYSTEM_ADMIN'] },
    },
    {
      path: '/odontologo/dashboard',
      name: 'odontologo-dashboard',
      component: OdontologoDashboardView,
      meta: { requiresAuth: true, roles: ['ODONTOLOGO', 'SYSTEM_ADMIN'] },
    },
    {
      path: '/paciente/dashboard',
      name: 'paciente-dashboard',
      component: PacienteDashboardView,
      meta: { requiresAuth: true, roles: ['PACIENTE', 'CLIENTE'] },
    },
    {
      path: '/cliente/dashboard',
      redirect: '/paciente/dashboard',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    }
    return { top: 0 }
  },
})

// Revisa auth y permisos RBAC antes de cada navegación
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // 1. Proteger rutas que requieren autenticación
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login', query: to.fullPath !== '/' ? { redirect: to.fullPath } : undefined }
  }

  // Resolver rol de forma ultra-defensiva para usuarios autenticados
  let resolvedRole: string | null = null
  if (authStore.isAuthenticated) {
    const rawRole =
      authStore.userRole ||
      (authStore.user as any)?.role ||
      (authStore.user as any)?.rol

    if (rawRole) {
      resolvedRole = String(rawRole).toUpperCase().trim()
    } else {
      try {
        const stored = localStorage.getItem('user')
        if (stored) {
          const parsed = JSON.parse(stored)
          const fallbackRole = parsed?.user_role || parsed?.role || parsed?.rol
          if (fallbackRole) {
            resolvedRole = String(fallbackRole).toUpperCase().trim()
          }
        }
      } catch {
        // ignore
      }
    }

    // Si aún así no hay rol, asignar PACIENTE por defecto para cuentas del portal
    if (!resolvedRole) {
      resolvedRole = 'PACIENTE'
    }
  }

  // 2. Si ya está autenticado e intenta ir a login o registro, redirigir a su dashboard correspondiente
  if ((to.name === 'login' || to.name === 'registro') && authStore.isAuthenticated) {
    return getDefaultRouteByRole(resolvedRole)
  }

  // 3. Control de acceso por rol (RBAC)
  if (to.meta.requiresAuth && to.meta.roles && Array.isArray(to.meta.roles)) {
    const allowedRoles = to.meta.roles.map((r) => r.toUpperCase())
    const currentRole = resolvedRole ? resolvedRole.toUpperCase() : null

    const hasRole =
      currentRole &&
      (allowedRoles.includes(currentRole) ||
        ((currentRole === 'ADMIN' || currentRole === 'SYSTEM_ADMIN') &&
          (allowedRoles.includes('SYSTEM_ADMIN') || allowedRoles.includes('ADMIN'))) ||
        ((currentRole === 'PACIENTE' || currentRole === 'CLIENTE') &&
          (allowedRoles.includes('PACIENTE') || allowedRoles.includes('CLIENTE'))))

    if (!hasRole) {
      // Redirigir al dashboard por defecto del usuario según su rol (nunca a '/' ni bucle)
      return getDefaultRouteByRole(resolvedRole)
    }
  }

  return true
})

export default router
