<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-sky-100 dark:bg-gray-900 px-4">
    <div class="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm transition-all">
      <h2 class="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
        Crear usuario
      </h2>

      <form @submit.prevent="createUser" novalidate>
        <!-- Nombre -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre</label>
          <input
            type="text"
            v-model.trim="name"
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
            v-model.trim="email"
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
            minlength="6"
            required
          />
          <p v-if="fieldErrors.password" class="mt-1 text-sm text-red-600 dark:text-red-400">
            {{ fieldErrors.password }}
          </p>
        </div>

        <!-- Error general -->
        <div v-if="uiError" class="mb-4 rounded-md border border-red-300/50 bg-red-50 dark:bg-red-900/20 p-3">
          <p class="text-sm text-red-700 dark:text-red-300 font-medium">
            {{ uiError }}
          </p>

          <!-- Línea de estado -->
          <p v-if="statusLine" class="mt-1 text-xs text-red-700/80 dark:text-red-300/80">
            {{ statusLine }}
            <span v-if="requestId"> · ID: <code class="px-1 py-0.5 bg-black/10 rounded">{{ requestId }}</code></span>
          </p>

          <!-- Botón detalles -->
          <button
            type="button"
            class="mt-2 text-xs underline text-red-700/90 dark:text-red-300/90 hover:opacity-80"
            @click="showDetails = !showDetails"
          >
            {{ showDetails ? 'Ocultar detalles técnicos' : 'Ver detalles técnicos' }}
          </button>

          <!-- Detalles técnicos -->
          <pre
            v-if="showDetails"
            class="mt-2 max-h-40 overflow-auto text-xs leading-5 whitespace-pre-wrap bg-white/70 dark:bg-gray-950/50 rounded p-2 border border-red-300/40"
          >{{ technicalDetails }}</pre>
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

    <!-- Botón de instalar app, centrado y con separación -->
    <div class="mt-6 w-full max-w-sm flex justify-center">
      <InstallButton variant="inline" label="Instalar Tags" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import InstallButton from '@/components/InstallButton.vue'

const router = useRouter()

const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')

const loading = ref<boolean>(false)

// UI error principal y metadatos
const uiError = ref<string>('')
const statusLine = ref<string>('')
const requestId = ref<string>('')

// Detalles técnicos (colapsable)
const showDetails = ref<boolean>(false)
const technicalDetails = ref<string>('')

type FieldErrors = { name?: string; email?: string; password?: string }
const fieldErrors = reactive<FieldErrors>({})

function buildStatusLine(status?: number, statusText?: string): string {
  if (!status) return ''
  return `${status} ${statusText ?? ''}`.trim()
}

function friendlyMessage(status?: number, data?: unknown): string {
  switch (status) {
    case 419: return 'La sesión CSRF ha caducado. Recarga la página e inténtalo de nuevo.'
    case 401: return 'No autorizado para realizar esta acción.'
    case 403: return 'Acceso denegado.'
    case 404: return 'Ruta de registro no encontrada.'
    case 409: return 'El correo ya está registrado.'
    case 422: return 'Revisa los campos marcados.'
    case 429: return 'Demasiadas peticiones. Espera un momento.'
    case 500: return 'Error interno del servidor al crear el usuario.'
    case 503: return 'El servicio no está disponible temporalmente.'
    default:
      const msg = (data as any)?.message
      return msg || 'Error inesperado al crear el usuario.'
  }
}

const createUser = async () => {
  loading.value = true
  uiError.value = ''
  statusLine.value = ''
  requestId.value = ''
  showDetails.value = false
  technicalDetails.value = ''
  fieldErrors.name = fieldErrors.email = fieldErrors.password = undefined

  try {

    await api.get('/sanctum/csrf-cookie')
    await api.post('/api/users', {
      name: name.value,
      email: email.value,
      password: password.value,
    })

    router.push('/reminders')
  } catch (err: unknown) {
    type AxiosLike = {
      message?: string
      response?: {
        status?: number
        statusText?: string
        data?: any
        headers?: Record<string, string>
      }
    }

    const e = err as AxiosLike
    const status = e?.response?.status
    const data = e?.response?.data
    const statusText = e?.response?.statusText || ''

    statusLine.value = buildStatusLine(status, statusText)
    requestId.value = e?.response?.headers?.['x-request-id'] ?? ''

    if (status === 422 && data?.errors) {
      fieldErrors.name = data.errors.name?.[0]
      fieldErrors.email = data.errors.email?.[0]
      fieldErrors.password = data.errors.password?.[0]
    }

    uiError.value = friendlyMessage(status, data)

    const tech = {
      status,
      statusText,
      requestId: requestId.value || undefined,
      url: (data && data.url) || undefined,
      message: (data && data.message) || e.message || undefined,
      error: (data && (data.error || data.exception)) || undefined,
      errors: data?.errors ? Object.fromEntries(
        Object.entries(data.errors).map(([k, v]: [string, any]) => [k, (v as string[]).slice(0, 2)])
      ) : undefined,
    }
    technicalDetails.value = JSON.stringify(tech, null, 2)
  } finally {
    loading.value = false
  }
}
</script>