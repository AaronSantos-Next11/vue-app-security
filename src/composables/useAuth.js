// Control 4: Gestión de sesión con token simulado
import { ref } from 'vue'

const isAuthenticated = ref(false)
const currentUser = ref(null)

export function useAuth() {
  const login = (email, password) => {

    // Credenciales simuladas (en producción esto va en el backend)

    if (email === 'admin@correo.com' && password === 'Admin1234') {
      
      // Simula recepción de token JWT del servidor
      const fakeToken = btoa(JSON.stringify({
        user: email,
        exp: Date.now() + 3600000 // 1 hora
      }))
      sessionStorage.setItem('auth_token', fakeToken)
      isAuthenticated.value = true
      currentUser.value = email
      return { success: true }
    }
    return { success: false, message: 'Credenciales incorrectas' }
  }

  const logout = () => {
    sessionStorage.removeItem('auth_token')
    isAuthenticated.value = false
    currentUser.value = null
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
      logout()
    }
    return false
  }

  return { isAuthenticated, currentUser, login, logout, checkSession }
}