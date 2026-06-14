<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Iniciar Sesión</h1>

      <!-- Control 2: Vue escapa automáticamente — nunca usar v-html con inputs -->
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="successMessage" class="success">{{ successMessage }}</p>

      <form @submit.prevent="handleSubmit">
        <div class="field">
          <label>Correo electrónico</label>
          <input
            v-model="email"
            type="email"
            placeholder="admin@correo.com"
            @blur="validateEmail"
          />
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
        </div>

        <div class="field">
          <label>Contraseña</label>
          <input
            v-model="password"
            type="password"
            placeholder="Mínimo 8 caracteres"
            @blur="validatePassword"
          />
          <span v-if="passwordError" class="field-error">{{ passwordError }}</span>
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Verificando...' : 'Ingresar' }}
        </button>
      </form>

      <!-- Sección de demostración XSS -->
      <div class="xss-demo">
        <h3>Demo Control XSS</h3>
        <input
          v-model="xssInput"
          placeholder='Prueba: <script>alert("hackeado")</script>'
        />
        <p>Vue escapa automáticamente: {{ xssInput }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import { useAuth } from '../composables/useAuth'

    const router = useRouter()
    const { login } = useAuth()

    const email = ref('')
    const password = ref('')
    const emailError = ref('')
    const passwordError = ref('')
    const errorMessage = ref('')
    const successMessage = ref('')
    const isLoading = ref(false)
    const xssInput = ref('')

    // Control 1: Validación de entradas
    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!email.value) {
            emailError.value = 'El correo es obligatorio'
        } else if (!emailRegex.test(email.value)) {
            emailError.value = 'Formato de correo inválido'
        } else {
            emailError.value = ''
        }
    }

    const validatePassword = () => {
        if (!password.value) {
            passwordError.value = 'La contraseña es obligatoria'
        } else if (password.value.length < 8) {
            passwordError.value = 'Mínimo 8 caracteres'
        } else {
            passwordError.value = ''
        }
    }

    const handleSubmit = () => {
        validateEmail()
        validatePassword()

        if (emailError.value || passwordError.value) return

        isLoading.value = true
        errorMessage.value = ''

        // Simulamos delay de red
        setTimeout(() => {
            const result = login(email.value, password.value)
            if (result.success) {
            successMessage.value = '¡Acceso concedido! Redirigiendo...'
            setTimeout(() => router.push('/dashboard'), 1000)
            } else {
            errorMessage.value = result.message
            }
            isLoading.value = false
        }, 800)
    }
</script>

<style scoped>

    .login-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f0f2f5;
    }

    .login-card {
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        width: 100%;
        max-width: 420px;
    }

    h1 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
    }

    .field  {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.3rem; 
        font-weight: 600;
        color: #555;
    }

    input {
        width: 100%;
        padding: 0.6rem 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
        box-sizing: border-box;
    }

    input:focus {
        outline: none; border-color: #42b883;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: #42b883;
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        cursor: pointer;
        margin-top: 0.5rem;
    }

    button:disabled {
        background: #a0d4bc;
        cursor: not-allowed;
    }

    .error { 
        color: #e53e3e; background: #fff5f5; padding: 0.5rem; border-radius: 4px; 
    }

    .success { color: #276749; background: #f0fff4; padding: 0.5rem; border-radius: 4px; }
    
    .field-error { color: #e53e3e; font-size: 0.8rem; }

    .xss-demo {
    margin-top: 2rem;
    padding: 1rem;
    background: #f7f7f7;
    border-radius: 6px;
    border-left: 4px solid #42b883;
    }

    .xss-demo h3 { margin: 0 0 0.5rem; font-size: 0.9rem; color: #555; }

    .xss-demo input { margin-bottom: 0.5rem; }

    .xss-demo p { font-size: 0.85rem; color: #333; word-break: break-all; }
</style>