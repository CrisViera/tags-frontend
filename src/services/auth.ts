// src/services/auth.ts
import api from '@/services/api'
import type { User } from '@/types/User'

export const register = (name: string, email: string, password: string) => {
  return api.post('/api/register', { name, email, password })
}

export const login = (email: string, password: string) => {
  return api.get('/sanctum/csrf-cookie').then(() =>
    api.post('/api/login', { email, password })
  )
}

export const getUser = () => {
  return api.get<User>('/api/user')
}

export const logout = () => {
  return api.post('/api/logout')
}