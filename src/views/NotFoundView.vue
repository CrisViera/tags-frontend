<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSession } from '@/stores/session'

const router = useRouter()
const { isAuthenticated } = useSession()

const primaryCta = computed(() =>
  isAuthenticated.value
    ? { label: 'Ir a mis recordatorios', to: '/reminders' }
    : { label: 'Iniciar sesión', to: '/login' }
)

function go(to: string) {
  router.push(to)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
    <div class="w-full max-w-xl bg-white/80 dark:bg-gray-800/90 backdrop-blur rounded-2xl shadow-lg p-8 text-center animate-fade-in">

      <div class="mx-auto mb-6 w-24 h-24 rounded-full bg-white dark:bg-gray-700 shadow flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12" viewBox="0 0 24 24" fill="none">
          <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M15.5 13a3.5 3.5 0 1 1-7.001 0A3.5 3.5 0 0 1 15.5 13Z" stroke="currentColor" stroke-width="1.5"/>
          <path d="M14.25 13a2.25 2.25 0 1 1-4.5 0" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </div>

      <p class="text-sm uppercase tracking-widest text-blue-600 dark:text-blue-300 font-semibold">Error</p>
      <h1 class="text-5xl font-extrabold mt-1 text-gray-900 dark:text-white">404</h1>
      <p class="mt-3 text-gray-700 dark:text-gray-300">
        La página que buscas no existe o ha cambiado de lugar.
      </p>

      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          class="px-5 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-[.98] shadow"
          @click="go(primaryCta.to)"
        >
          {{ primaryCta.label }}
        </button>

        <button
          class="px-5 py-3 rounded-xl bg-white text-blue-700 border border-blue-200 hover:bg-blue-50 dark:bg-gray-700 dark:text-blue-200 dark:border-gray-600"
          @click="go('/')"
        >
          Volver al inicio
        </button>
      </div>

      <p class="mt-6 text-xs text-gray-500 dark:text-gray-400">
        Si crees que esto es un error, comprueba la URL o vuelve a intentarlo más tarde.
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in .35s ease-out; }
</style>