// src/services/Reminders.ts
import api from '@/services/api'
import type { Reminder } from '@/types/Reminder'

export const getAllReminders = () => api.get<Reminder[]>('/api/reminders')

export const getReminder = (id: number) => api.get<Reminder>(`/api/reminders/${id}`)

export const createReminder = (data: Reminder) => api.post('/api/reminders', data)

export const updateReminder = (id: number, data: Reminder) => api.put(`/api/reminders/${id}`, data)

export const deleteReminder = (id: number) => api.delete(`/api/reminders/${id}`)