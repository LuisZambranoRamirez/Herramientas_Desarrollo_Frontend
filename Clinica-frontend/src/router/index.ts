import { createRouter, createWebHistory } from 'vue-router'
import ReservarCitasView from '../views/ReservarCitasView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'reservar-citas',
      component: ReservarCitasView,
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
  ],
})

export default router
