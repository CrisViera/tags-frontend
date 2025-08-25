// Store mínimo para cachear el usuario autenticado vía Sanctum
import { shallowRef, computed } from 'vue'
import type { User } from '@/types/User'
import { getUser } from '@/services/auth'

const currentUser = shallowRef<User | null>(null)
const loaded = shallowRef(false)
let inflight: Promise<void> | null = null 

export const useSession = () => {
  const isAuthenticated = computed(() => !!currentUser.value)

  async function ensureSession(): Promise<void> {
    if (loaded.value) return
    if (!inflight) {
      inflight = (async () => {
        try {
          const { data } = await getUser()
          currentUser.value = data
        } catch {
          currentUser.value = null
        } finally {
          loaded.value = true
          inflight = null
        }
      })()
    }
    await inflight
  }

  function setUser(user: User | null) {
    currentUser.value = user
    loaded.value = true
  }

  return {
    currentUser,
    isAuthenticated,
    loaded,
    ensureSession,
    setUser,
  }
}