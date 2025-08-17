<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-sky-100 dark:bg-gray-900 px-4">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm transition-all">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
        Iniciar sesión
      </h2>

      <form @submit.prevent="login">
        <!-- Correo -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
          <input
            type="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Contraseña -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
          <input
            type="password"
            v-model="password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <!-- Error -->
        <div v-if="error" class="text-red-600 dark:text-red-400 mb-4 text-sm text-center">
          {{ error }}
        </div>

        <!-- Botón entrar -->
        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
          :disabled="loading"
        >
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>

        <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          ¿No tienes cuenta?
          <router-link to="/signup" class="text-blue-600 dark:text-blue-400 hover:underline">
            Crea una cuenta
          </router-link>
        </p>
      </form>
    </div>

    <!-- Botón instalar app -->
    <div class="mt-6 w-full max-w-sm flex justify-center">
      <InstallButton variant="inline" label="Instalar Tags" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import InstallButton from '@/components/InstallButton.vue'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    // Paso 1: pedir cookie CSRF
    await api.get('/sanctum/csrf-cookie')

    // Paso 2: login
    await api.post('/login', {
      email: email.value,
      password: password.value,
    })

    // Paso 3: redirigir
    router.push('/reminders')
  } catch (err: any) {
    console.error(err)
    if (err.response?.status === 401) {
      error.value = 'Correo o contraseña incorrectos.'
    } else {
      error.value = 'Error inesperado al iniciar sesión.'
    }
  } finally {
    loading.value = false
  }
}
</script>