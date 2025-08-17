<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white via-sky-100 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 text-gray-800 dark:text-white px-4 transition-all"
  >
    <h1 class="text-4xl sm:text-5xl font-bold mb-6 animate-fade-in-up text-center">
      Bienvenido a <span class="text-blue-600 dark:text-blue-400">Tags</span>
    </h1>
    <p class="text-lg text-gray-600 dark:text-gray-300 mb-10 text-center animate-fade-in delay-200">
      Tu gestor inteligente de recordatorios
    </p>

    <RouterLink
      to="/login"
      class="animate-fade-in-up delay-300 px-6 mb-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
    >
      Entrar
    </RouterLink>

    <RouterLink
      to="/signup"
      class="animate-fade-in-up delay-300 px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition"
    >
      ¡Unete ahora!
    </RouterLink>
  </div>
  <InstallButton variant="inline" label="Instalar Tags" />
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import InstallButton from '@/components/InstallButton.vue';
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}
</style>