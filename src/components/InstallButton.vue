<!-- src/components/InstallButton.vue -->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useInstallPWA, canInstall } from '@/install-pwa'

type Variant = 'fab' | 'inline'

const props = withDefaults(defineProps<{
  variant?: Variant
  label?: string
}>(), {
  variant: 'fab',
  label: 'Instalar app',
})

const { installApp, showIosHelp } = useInstallPWA()
const installing = ref(false)

const visible = computed(() => canInstall.value || showIosHelp.value)

const onClick = async () => {
  if (installing.value) return
  installing.value = true
  try {
    await installApp()
  } finally {
    installing.value = false
  }
}
</script>

<template>
  <div v-if="visible">
    <!-- FAB flotante -->
    <button
      v-if="variant === 'fab'"
      @click="onClick"
      :disabled="installing"
      class="fixed bottom-4 right-4 px-4 py-2 rounded-xl bg-blue-600 text-white shadow-lg hover:bg-blue-700 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed
             dark:bg-blue-500 dark:hover:bg-blue-400"
      aria-label="Instalar aplicación"
    >
      <span v-if="!installing">{{ label }}</span>
      <span v-else>Procesando…</span>
    </button>

    <!-- Botón inline -->
    <button
      v-else
      @click="onClick"
      :disabled="installing"
      class="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white shadow hover:bg-blue-700 active:scale-[.98] disabled:opacity-60
             dark:bg-blue-500 dark:hover:bg-blue-400"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v12m0 0l-3-3m3 3l3-3M4 20h16"/>
      </svg>
      <span v-if="!installing">{{ label }}</span>
      <span v-else>Procesando…</span>
    </button>

    <!-- Popover ayuda iOS -->
    <div
      v-if="showIosHelp"
      class="fixed bottom-20 right-4 max-w-xs p-3 rounded-xl bg-white text-gray-800 shadow-lg border border-gray-200
             dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
    >
      <p class="text-sm">
        En iPhone/iPad abre en Safari, toca <strong>Compartir</strong> y elige
        <strong>“Añadir a pantalla de inicio”</strong>.
      </p>
    </div>
  </div>
</template>

<style scoped>
</style>