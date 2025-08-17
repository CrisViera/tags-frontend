// src/types/Reminder.ts
export interface Reminder {
  id?: number
  title: string
  description?: string
  reminder_date: string
  notified?: boolean
  created_at?: string
  updated_at?: string
}