<template>
  <div class="dashboard">
    <div class="dashboard-card">
      <h1>Dashboard Protegido</h1>
      <p>Bienvenido, <strong>{{ currentUser }}</strong></p>

      <div class="info-box">
        <h3>Sesión activa</h3>
        <p>Token almacenado en <code>sessionStorage</code></p>
        <p>Expira en: <strong>{{ tiempoRestante }}</strong></p>
      </div>

      <div class="controls-info">
        <h3>Controles de seguridad activos</h3>
        <ul>
          <li>✅ Control 1: Validación de entradas aplicada en login</li>
          <li>✅ Control 2: Protección XSS automática de Vue.js</li>
          <li>✅ Control 3: Guard de ruta activo — esta página requiere autenticación</li>
          <li>✅ Control 4: Sesión gestionada con token en sessionStorage</li>
        </ul>
      </div>

      <button @click="handleLogout">Cerrar sesión</button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { currentUser, logout, checkSession } = useAuth()

const tiempoRestante = computed(() => {
  const token = sessionStorage.getItem('auth_token')
  if (!token) return 'Expirada'
  const data = JSON.parse(atob(token))
  const minutos = Math.floor((data.exp - Date.now()) / 60000)
  return `${minutos} minuto(s)`
})

const handleLogout = () => {
  logout()
  router.push('/login')
}

onMounted(() => {
  checkSession()
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
}
.dashboard-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 500px;
}
h1 { color: #333; margin-bottom: 0.5rem; }
.info-box {
  background: #f0fff4;
  border: 1px solid #9ae6b4;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}
.info-box h3 { margin: 0 0 0.5rem; color: #276749; }
.controls-info {
  background: #ebf8ff;
  border: 1px solid #90cdf4;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
}
.controls-info h3 { margin: 0 0 0.5rem; color: #2b6cb0; }
.controls-info ul { margin: 0; padding-left: 1rem; }
.controls-info li { margin-bottom: 0.3rem; font-size: 0.9rem; }
button {
  width: 100%;
  padding: 0.75rem;
  background: #e53e3e;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}
button:hover { background: #c53030; }
</style>