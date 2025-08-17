// src/pwa.ts
import { registerSW } from 'virtual:pwa-register'

export const startPWA = () => {
  registerSW({
    immediate: true,
    onNeedRefresh() {},
    onOfflineReady() {},
  })
}