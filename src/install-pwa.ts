// src/install-pwa.ts
import { ref, onMounted, onUnmounted } from 'vue'

/** Tipado de beforeinstallprompt (no está en TS por defecto) */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export const canInstall = ref(false)
let deferredPrompt: BeforeInstallPromptEvent | null = null

function isIosStandalone(): boolean {
  // iOS Safari no dispara beforeinstallprompt; detectar "instalada" o si es iOS
  const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent)
  const isStandalone = (window.navigator as any).standalone === true
  return isIOS && isStandalone
}

function isIosSafari(): boolean {
  const ua = window.navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/crios|fxios|chrome|firefox/i.test(ua)
  return isIOS && isSafari
}

export function useInstallPWA() {
  const showIosHelp = ref(false)

  const onBeforeInstallPrompt = (e: Event) => {
    e.preventDefault()
    deferredPrompt = e as BeforeInstallPromptEvent
    canInstall.value = true
  }

  const installApp = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      deferredPrompt = null
      canInstall.value = false
      return choice.outcome 
    }
    // Fallback iOS: mostrar instrucciones
    if (isIosSafari()) {
      showIosHelp.value = true
    }
    return null
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    // Si ya está instalada, ocultar botón
    if (window.matchMedia('(display-mode: standalone)').matches || isIosStandalone()) {
      canInstall.value = false
    }
  })

  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  })

  return { canInstall, installApp, showIosHelp }
}