import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CreateUser from '@/views/CreateUser.vue'
import ReminderView from '@/views/ReminderView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useSession } from '@/stores/session'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView, meta: { title: 'Inicio' } },
  { path: '/login', name: 'Login', component: LoginView, meta: { title: 'Iniciar sesión', guestOnly: true } },
  { path: '/signup', name: 'Signup', component: CreateUser, meta: { title: 'Crear cuenta', guestOnly: true } },
  { path: '/reminders', name: 'Reminders', component: ReminderView, meta: { title: 'Recordatorios', requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView, meta: { title: 'No encontrado' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guard global
router.beforeEach(async (to) => {
  const { isAuthenticated, ensureSession } = useSession()

  // Solo pedimos /api/user la primera vez
  await ensureSession()

  // Protegidas
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // Solo invitados
  if (to.meta.guestOnly && isAuthenticated.value) {
    return { name: 'Reminders' }
  }

  return true
})

router.afterEach((to) => {
  const defaultTitle = 'Tags App'
  document.title = (to.meta.title as string) || defaultTitle
})

export default router