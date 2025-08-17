import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import CreateUser from '@/views/CreateUser.vue'
import ReminderView from '@/views/ReminderView.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'Home', component: HomeView, meta: { title: 'Inicio' } },
  { path: '/login', name: 'Login', component: LoginView, meta: { title: 'Iniciar sesión' } },
  { path: '/signup', name: 'Signup', component: CreateUser, meta: { title: 'Crear cuenta' } },
  { path: '/reminders', name: 'Reminders', component: ReminderView, meta: { title: 'Recordatorios' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to) => {
  const defaultTitle = 'Tags App'
  document.title = (to.meta.title as string) || defaultTitle
})

export default router