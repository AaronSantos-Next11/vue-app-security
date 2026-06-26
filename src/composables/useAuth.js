// Control 4: Gestión de sesión con token simulado
import { ref } from 'vue'
import * as Sentry from '@sentry/vue'

const isAuthenticated = ref(false)
const currentUser = ref(null)

export function useAuth() {
  const login = (email, password) => {
    // Credenciales simuladas (en producción esto va en el backend)
    if (email === 'admin@correo.com' && password === 'Admin1234') {
      const fakeToken = btoa(JSON.stringify({
        user: email,
        exp: Date.now() + 3600000 // 1 hora
      }))
      sessionStorage.setItem('auth_token', fakeToken)
      isAuthenticated.value = true
      currentUser.value = email

      // LOG DE ACCESO: login exitoso
      Sentry.logger.info('Inicio de sesión exitoso', {
        tags: { log_type: 'acceso', event: 'login_success' },
        extra: { user: email, timestamp: new Date().toISOString() }
      })

      // LOG DE AUDITORÍA: creación de sesión/token
      Sentry.logger.info('Token de sesión creado', {
        tags: { log_type: 'auditoria', event: 'session_created' },
        extra: { user: email, expira: new Date(Date.now() + 3600000).toISOString() }
      })

      return { success: true }
    }

    // LOG DE ACCESO: login fallido
    Sentry.logger.warn('Intento de inicio de sesión fallido', {
      tags: { log_type: 'acceso', event: 'login_failed' },
      extra: { emailIntentado: email, timestamp: new Date().toISOString() }
    })

    return { success: false, message: 'Credenciales incorrectas' }
  }

  const logout = () => {
    const user = currentUser.value

    sessionStorage.removeItem('auth_token')
    isAuthenticated.value = false
    currentUser.value = null

    // LOG DE AUDITORÍA: cierre de sesión
    Sentry.logger.info('Sesión cerrada por el usuario', {
      tags: { log_type: 'auditoria', event: 'session_closed' },
      extra: { user, timestamp: new Date().toISOString() }
    })
  }

  const checkSession = () => {
    const token = sessionStorage.getItem('auth_token')
    if (token) {
      const data = JSON.parse(atob(token))
      if (Date.now() < data.exp) {
        isAuthenticated.value = true
        currentUser.value = data.user
        return true
      }

      // LOG DE AUDITORÍA: sesión expirada
      Sentry.logger.warn('Sesión expirada detectada', {
        tags: { log_type: 'auditoria', event: 'session_expired' },
        extra: { user: data.user, timestamp: new Date().toISOString() }
      })

      logout()
    }
    return false
  }

  return { isAuthenticated, currentUser, login, logout, checkSession }
}