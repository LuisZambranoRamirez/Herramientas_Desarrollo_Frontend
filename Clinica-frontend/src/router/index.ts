import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import HomeView from '../views/HomeView.vue'
import ReservarCitasView from '../views/ReservarCitasView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import InventarioView from '@/views/InventarioView.vue'
import AgendaView from '@/views/intranet/AgendaView.vue'
import PacientesView from '@/views/intranet/PacientesView.vue'
import TratamientosView from '@/views/intranet/TratamientosView.vue'
import PagosView from '@/views/intranet/PagosView.vue'
import ConfiguracionView from '@/views/intranet/ConfiguracionView.vue'

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
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/test-citas',
      name: 'test-citas',
      component: () => import('../views/intranet/CitasView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: InventarioView,
      meta: { requiresAuth: true },
    },
    {
      path: '/agenda',
      name: 'agenda',
      component: AgendaView,
      meta: { requiresAuth: true },
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: PacientesView,
      meta: { requiresAuth: true },
    },
    {
      path: '/tratamientos',
      name: 'tratamientos',
      component: TratamientosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/pagos',
      name: 'pagos',
      component: PagosView,
      meta: { requiresAuth: true },
    },
    {
      path: '/configuracion',
      name: 'configuracion',
      component: ConfiguracionView,
      meta: { requiresAuth: true },
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

// revisa auth antes de cada navegación
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login' })     // sin sesión → al login
  } else if (to.name === 'login' && authStore.isAuthenticated) {
    next({ name: 'dashboard' }) // ya logueado → al dashboard
  } else {
    next()
  }
})

export default router
