// Control 3: Guards de ruta (control de acceso)
import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
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
    meta: { requiresAuth: true }  // Ruta protegida
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global — se ejecuta antes de cada navegación
router.beforeEach((to, from, next) => {
  const { checkSession } = useAuth()
  const isAuth = checkSession()

  if (to.meta.requiresAuth && !isAuth) {
    // Usuario no autenticado intenta acceder a ruta protegida
    next('/login')
  } else if (to.meta.requiresGuest && isAuth) {
    // Usuario ya autenticado intenta volver al login
    next('/dashboard')
  } else {
    next()
  }
})

export default router