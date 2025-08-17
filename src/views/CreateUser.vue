<template>
  <div class="min-h-screen flex items-center justify-center bg-sky-100 dark:bg-gray-900 px-4">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm transition-all">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
        Crear usuario
      </h2>

      <form @submit.prevent="createUser">
        <!-- Nombre -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
          <input
            type="text"
            v-model="name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p v-if="fieldErrors.name" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ fieldErrors.name }}
          </p>
        </div>

        <!-- Correo -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Correo electrónico</label>
          <input
            type="email"
            v-model="email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <p v-if="fieldErrors.email" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ fieldErrors.email }}
          </p>
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
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- Error general -->
        <div v-if="error" class="text-red-600 dark:text-red-400 mb-4 text-sm text-center">
          {{ error }}
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-500 transition disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Creando...' : 'Crear usuario' }}
        </button>

        <p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          ¿Ya tienes cuenta?
          <router-link to="/login" class="text-blue-600 dark:text-blue-400 hover:underline">Inicia sesión</router-link>
        </p>
      </form>
    </div>
    <InstallButton variant="inline" label="Instalar Tags" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import InstallButton from '@/components/InstallButton.vue'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const fieldErrors = reactive<{ name?: string; email?: string; password?: string }>({})

const createUser = async () => {
  loading.value = true
  error.value = ''
  fieldErrors.name = fieldErrors.email = fieldErrors.password = undefined

  try {

    await api.get('/sanctum/csrf-cookie')

    await api.post('/users', {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    router.push('/reminders')
  } catch (err: any) {
    const status = err?.response?.status
    const data = err?.response?.data

    if (status === 422 && data?.errors) {
      fieldErrors.name = data.errors.name?.[0]
      fieldErrors.email = data.errors.email?.[0]
      fieldErrors.password = data.errors.password?.[0]
    } else {
      error.value = data?.message || 'Error inesperado al crear el usuario.'
    }

  } finally {
    loading.value = false
  }
}
</script>