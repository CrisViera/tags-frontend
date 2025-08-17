<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 px-4 py-10">
    <div class="max-w-5xl mx-auto">
      <header class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-bold text-blue-700 dark:text-blue-400">Mis Recordatorios</h1>

        <div class="hidden sm:flex items-center gap-3">
          <!-- Botón logout (escritorio) -->
          <button
            class="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 active:scale-[.98] shadow"
            @click="logout"
          >
            Cerrar sesión
          </button>

          <!-- Botón nuevo -->
          <button
            class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] shadow"
            @click="openCreate"
          >
            <span class="text-xl leading-none">＋</span>
            <span>Nuevo</span>
          </button>
        </div>
      </header>

      <!-- Estados -->
      <div v-if="loading" class="text-center text-gray-700 dark:text-gray-300">Cargando...</div>
      <div v-else-if="error" class="text-center text-red-600">{{ error }}</div>

      <!-- Lista -->
      <div v-else>
        <div v-if="reminders.length === 0" class="text-center text-gray-600 dark:text-gray-300">
          No tienes recordatorios. Crea el primero con el botón <span class="font-semibold">+</span>.
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="item in reminders"
            :key="item.id"
            class="bg-white dark:bg-gray-800 rounded-2xl shadow p-5 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition"
          >
            <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
              {{ item.title }}
            </h2>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
              {{ item.description }}
            </p>

            <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
              📅 {{ new Date(item.remind_at).toLocaleString() }}
            </div>

            <!-- Acciones -->
            <div class="mt-5 flex flex-wrap gap-2">
              <button
                class="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                @click="openView(item)"
              >
                Ver
              </button>
              <button
                class="px-3 py-1.5 rounded-lg bg-amber-500/90 hover:bg-amber-500 text-white"
                @click="openEdit(item)"
              >
                Editar
              </button>
              <button
                class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white"
                @click="openDelete(item)"
              >
                Eliminar
              </button>
            </div>
          </article>
        </div>
      </div>
    </div>

    <!-- FAB (+) móvil -->
    <button
      class="fixed bottom-6 right-6 sm:hidden inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-600 text-white text-3xl shadow-xl hover:bg-blue-700 active:scale-95"
      @click="openCreate"
      aria-label="Crear recordatorio"
    >
      +
    </button>

    <!-- FAB Logout móvil -->
    <button
      class="fixed bottom-6 left-6 sm:hidden inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-600 text-white text-sm shadow-xl hover:bg-red-700 active:scale-95"
      @click="logout"
      aria-label="Cerrar sesión"
      title="Cerrar sesión"
    >
      Salir
    </button>

    <!-- MODAL FORM (Crear/Editar) -->
    <Teleport to="body">
      <transition name="fade">
        <div
          v-if="showForm"
          class="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div class="absolute inset-0 bg-black/70" @click="showForm = false"></div>

          <div
            class="relative z-10 w-[95%] max-w-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl"
          >
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {{ formMode === 'create' ? 'Nuevo recordatorio' : 'Editar recordatorio' }}
            </h3>

            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
                <input
                  v-model="form.title"
                  type="text"
                  class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p v-if="formErrors.title" class="text-xs text-red-600 mt-1">{{ formErrors.title }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descripción</label>
                <textarea
                  v-model="form.description"
                  rows="3"
                  class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <p v-if="formErrors.description" class="text-xs text-red-600 mt-1">{{ formErrors.description }}</p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Recordar el</label>
                <input
                  v-model="form.remind_at"
                  type="datetime-local"
                  :min="nowLocal"
                  class="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p v-if="formErrors.remind_at" class="text-xs text-red-600 mt-1">{{ formErrors.remind_at }}</p>
              </div>

              <div class="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                  @click="showForm = false"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {{ formMode === 'create' ? 'Crear' : 'Guardar' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- MODAL VER -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showView && viewItem" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/70" @click="showView = false"></div>
          <div class="relative z-10 w-[95%] max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">{{ viewItem.title }}</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300 whitespace-pre-line">{{ viewItem.description }}</p>
            <div class="mt-4 text-sm text-gray-500 dark:text-gray-400">
              <p><strong>Recordar:</strong> {{ new Date(viewItem.remind_at).toLocaleString() }}</p>
              <p v-if="viewItem.created_at"><strong>Creado:</strong> {{ new Date(viewItem.created_at).toLocaleString() }}</p>
            </div>
            <div class="mt-6 text-right">
              <button
                class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
                @click="showView = false"
              >Cerrar</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- MODAL ELIMINAR -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="showDelete && deleteTarget" class="fixed inset-0 z-50 flex items-center justify-center">
          <div class="absolute inset-0 bg-black/70" @click="showDelete = false"></div>
          <div class="relative z-10 w-[95%] max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-xl">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">Eliminar recordatorio</h3>
            <p class="mt-2 text-gray-700 dark:text-gray-300">
              ¿Seguro que deseas eliminar <span class="font-semibold">{{ deleteTarget.title }}</span>?
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button
                class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                @click="showDelete = false"
              >Cancelar</button>
              <button
                class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
                @click="confirmDelete"
              >Eliminar</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
  <InstallButton variant="inline" label="Instalar Tags" />
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import InstallButton from '@/components/InstallButton.vue'
import api from '@/services/api'

interface Reminder {
  id: number
  title: string
  description: string | null
  remind_at: string
  created_at?: string
  updated_at?: string
}

type FormState = {
  id?: number | null
  title: string
  description: string
  remind_at: string
}

const router = useRouter()

const reminders = ref<Reminder[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const showForm = ref(false)
const formMode = ref<'create' | 'edit'>('create')
const form = reactive<FormState>({
  id: null,
  title: '',
  description: '',
  remind_at: ''
})
const formErrors = ref<Record<string, string>>({})

const showView = ref(false)
const viewItem = ref<Reminder | null>(null)

const showDelete = ref(false)
const deleteTarget = ref<Reminder | null>(null)

const nowLocal = computed(() => toDatetimeLocal(new Date()))

onMounted(async () => {
  await fetchReminders()
})

/** Utils */
function toDatetimeLocal(d: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const yyyy = d.getFullYear()
  const mm = pad(d.getMonth() + 1)
  const dd = pad(d.getDate())
  const hh = pad(d.getHours())
  const mi = pad(d.getMinutes())
  return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
}

function localInputToISO(local: string) {
  const date = new Date(local)
  if (Number.isNaN(date.getTime())) return new Date().toISOString()
  return date.toISOString()
}

function resetForm() {
  form.id = null
  form.title = ''
  form.description = ''
  form.remind_at = nowLocal.value
  formErrors.value = {}
}

function unwrapOne<T = any>(respData: any): T {
  return (respData?.data && typeof respData.data === 'object' && !Array.isArray(respData.data))
    ? respData.data as T
    : (respData as T)
}

function unwrapList<T = any>(respData: any): T[] {
  if (Array.isArray(respData)) return respData as T[]
  if (Array.isArray(respData?.data)) return respData.data as T[]
  if (Array.isArray(respData?.data?.data)) return respData.data.data as T[]
  return []
}

/** API */
async function fetchReminders() {
  loading.value = true
  error.value = null
  try {
    const { data } = await api.get('/api/reminders')
    reminders.value = unwrapList<Reminder>(data)
  } catch (e: any) {
    console.error(e)
    error.value = e?.response?.data?.message ?? 'Error al cargar los recordatorios.'
  } finally {
    loading.value = false
  }
}

function openCreate() {
  formMode.value = 'create'
  resetForm()
  showForm.value = true
}

function openEdit(item: Reminder) {
  formMode.value = 'edit'
  form.id = item.id
  form.title = item.title
  form.description = item.description ?? ''
  form.remind_at = toDatetimeLocal(new Date(item.remind_at))
  formErrors.value = {}
  showForm.value = true
}

function openView(item: Reminder) {
  viewItem.value = item
  showView.value = true
}

function openDelete(item: Reminder) {
  deleteTarget.value = item
  showDelete.value = true
}

async function submitForm() {
  formErrors.value = {}

  const payload = {
    title: form.title.trim(),
    description: form.description.trim(),
    remind_at: localInputToISO(form.remind_at),
  }

  try {
    if (formMode.value === 'create') {
      const { data } = await api.post('/api/reminders', payload)
      const created = unwrapOne<Reminder>(data)
      if (created?.id) reminders.value.unshift(created)
      ;(window as any).$toast?.success?.('Recordatorio creado')
    } else {
      if (form.id == null || Number.isNaN(Number(form.id))) {
        ;(window as any).$toast?.error?.('ID del recordatorio no definido')
        return
      }
      const id = Number(form.id)
      const { data } = await api.put(`/api/reminders/${id}`, payload)
      const updated = unwrapOne<Reminder>(data)
      const idx = reminders.value.findIndex(r => r.id === id)
      if (idx !== -1) reminders.value[idx] = updated
      ;(window as any).$toast?.success?.('Recordatorio actualizado')
    }
    showForm.value = false
  } catch (e: any) {
    console.error('STATUS', e?.response?.status)
    console.error('DATA', e?.response?.data)
    console.error('ERRORS', e?.response?.data?.errors)
    formErrors.value = e?.response?.data?.errors ?? {}
    if (e?.response?.status !== 422) {
      ;(window as any).$toast?.error?.('No se pudo guardar el recordatorio')
    }
  }
}

async function confirmDelete() {
  if (!deleteTarget.value?.id || Number.isNaN(Number(deleteTarget.value.id))) {
    ;(window as any).$toast?.error?.('ID no definido para eliminar')
    return
  }
  const id = Number(deleteTarget.value.id)
  try {
    await api.delete(`/api/reminders/${id}`)
    reminders.value = reminders.value.filter(r => r.id !== id)
    ;(window as any).$toast?.success?.('Recordatorio eliminado')
  } catch (e) {
    console.error(e)
    ;(window as any).$toast?.error?.('No se pudo eliminar')
  } finally {
    showDelete.value = false
  }
}

async function logout() {
  try {
    await api.post('/logout')
    ;(window as any).$toast?.success?.('Sesión cerrada')
    router.push('/login')
  } catch (e) {
    console.error(e)
    ;(window as any).$toast?.error?.('No se pudo cerrar sesión')
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>