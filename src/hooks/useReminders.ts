import { useEffect, useState } from 'react'
import { Reminder, UserPreferences } from '@/types'
import { getReminders, getPreferences, savePreferences, saveReminders, addReminder, updateReminder, deleteReminder } from '@/lib/store'

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const [preferences, setPreferences] = useState<UserPreferences>(getPreferences())
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null)

  useEffect(() => {
    // 请求通知权限
    const requestPermission = async () => {
      if ('Notification' in window) {
        const perm = await Notification.requestPermission()
        setPermission(perm)
      }
    }

    requestPermission()
    setReminders(getReminders())
  }, [])

  // 检查提醒时间并发送通知
  useEffect(() => {
    if (permission !== 'granted' || !preferences.enableStudyReminders) return

    const checkReminders = () => {
      const now = new Date()
      const currentTime = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
      
      reminders.forEach(reminder => {
        if (reminder.isEnabled && reminder.time === currentTime && !reminder.isCompleted) {
          sendNotification(reminder)
        }
      })
    }

    // 每分钟检查一次
    const interval = setInterval(checkReminders, 60000)
    
    // 初始检查
    checkReminders()

    return () => clearInterval(interval)
  }, [reminders, permission, preferences.enableStudyReminders])

  const sendNotification = (reminder: Reminder) => {
    if ('Notification' in window && permission === 'granted') {
      new Notification(reminder.title, {
        body: reminder.content,
        icon: '/favicon.ico'
      })
    }
  }

  const toggleReminderEnabled = (id: string, isEnabled: boolean) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, isEnabled, updatedAt: new Date().toISOString() } : r
    )
    setReminders(updatedReminders)
    saveReminders(updatedReminders)
  }

  const toggleStudyReminders = (enable: boolean) => {
    const updatedPrefs = { ...preferences, enableStudyReminders: enable }
    setPreferences(updatedPrefs)
    savePreferences(updatedPrefs)
  }

  const addNewReminder = (reminder: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const updatedReminders = [...reminders, newReminder]
    setReminders(updatedReminders)
    addReminder(newReminder)
    setIsModalOpen(false)
  }

  const editReminder = (id: string, updates: Partial<Reminder>) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
    )
    setReminders(updatedReminders)
    updateReminder(id, updates)
    setIsModalOpen(false)
    setEditingReminder(null)
  }

  const removeReminder = (id: string) => {
    const updatedReminders = reminders.filter(r => r.id !== id)
    setReminders(updatedReminders)
    deleteReminder(id)
  }

  const toggleReminderCompleted = (id: string, isCompleted: boolean) => {
    const updatedReminders = reminders.map(r => 
      r.id === id ? { ...r, isCompleted, updatedAt: new Date().toISOString() } : r
    )
    setReminders(updatedReminders)
    updateReminder(id, { isCompleted })
  }

  return {
    reminders,
    preferences,
    permission,
    isModalOpen,
    editingReminder,
    toggleReminderEnabled,
    toggleStudyReminders,
    sendNotification,
    addNewReminder,
    editReminder,
    removeReminder,
    toggleReminderCompleted,
    setIsModalOpen,
    setEditingReminder
  }
}
