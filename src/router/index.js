// Control 3: Guards de ruta (control de acceso)
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import * as Sentry from '@sentry/vue'

const routes = [
  { path: '/', redirect: '/login' },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresGuest: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global — se ejecuta antes de cada navegación
router.beforeEach((to) => {
  const { checkSession } = useAuth()
  const isAuth = checkSession()

  if (to.meta.requiresAuth && !isAuth) {
    // LOG DE ACCESO: acceso denegado a ruta protegida
    Sentry.logger.warn('Acceso denegado a ruta protegida', {
      tags: { log_type: 'acceso', event: 'access_denied' },
      extra: { rutaSolicitada: to.path, timestamp: new Date().toISOString() }
    })
    return '/login'
  }

  if (to.meta.requiresGuest && isAuth) {
    // LOG DE ACCESO: redirección por sesión activa
    Sentry.logger.info('Redirección automática: sesión ya activa', {
      tags: { log_type: 'acceso', event: 'already_authenticated' },
      extra: { rutaSolicitada: to.path, timestamp: new Date().toISOString() }
    })
    return '/dashboard'
  }

  // LOG DE ACCESO: acceso permitido
  Sentry.logger.info('Acceso permitido a ruta', {
    tags: { log_type: 'acceso', event: 'access_granted' },
    extra: { ruta: to.path, timestamp: new Date().toISOString() }
  })

  return true
})

export default router