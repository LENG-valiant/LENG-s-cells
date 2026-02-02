'use client'

import { useState, useEffect, useRef } from 'react'
import { Card } from '@/components/UI'
import { User, Moon, Sun, Bell, CheckCircle2, XCircle, Save, Download, Upload, AlertCircle } from 'lucide-react'
import { getPreferences, savePreferences, exportData, importData } from '@/lib/store'
import { UserPreferences } from '@/types'

interface SettingsPageProps {
  onNavigate: (page: string) => void
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  // 个人信息状态
  const [personalInfo, setPersonalInfo] = useState({
    name: '用户',
    avatar: '👤',
    bio: '这是一段个人简介',
    email: ''
  })

  // 主题设置状态
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [themeAuto, setThemeAuto] = useState(false)

  // 通知设置状态
  const [notifications, setNotifications] = useState({
    enableStudyReminders: true,
    enableArticleNotifications: true,
    enableHobbyNotifications: false,
    reminderTime: '09:00'
  })

  // 从localStorage获取偏好设置
  useEffect(() => {
    const preferences = getPreferences()
    setTheme(preferences.theme)
    setNotifications({
      enableStudyReminders: preferences.enableStudyReminders,
      enableArticleNotifications: preferences.showNotifications,
      enableHobbyNotifications: false,
      reminderTime: preferences.reminderTime
    })
  }, [])

  // 保存设置
  const handleSave = () => {
    // 保存主题设置
    const newTheme = themeAuto ? 'light' : theme
    const preferences = getPreferences()
    savePreferences({
      ...preferences,
      theme: newTheme,
      enableStudyReminders: notifications.enableStudyReminders,
      showNotifications: notifications.enableArticleNotifications,
      reminderTime: notifications.reminderTime
    })

    // 应用主题到HTML根元素
    document.documentElement.classList.toggle('dark', newTheme === 'dark')

    // 显示保存成功提示
    alert('设置已保存')
  }

  // 备份和恢复功能
  const [importMessage, setImportMessage] = useState<string>('')
  const [importError, setImportError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 导出数据
  const handleExport = () => {
    exportData()
  }

  // 导入数据
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  // 处理文件选择
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      try {
        const success = importData(content)
        if (success) {
          setImportMessage('数据导入成功！页面将刷新以应用新数据。')
          setImportError('')
          // 刷新页面以应用新数据
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        } else {
          setImportError('数据导入失败：文件格式错误或数据损坏。')
          setImportMessage('')
        }
      } catch (error) {
        setImportError(`数据导入失败：${(error as Error).message}`)
        setImportMessage('')
      }
    }
    reader.onerror = () => {
      setImportError('读取文件失败，请重试。')
      setImportMessage('')
    }
    reader.readAsText(file)
    // 清空文件输入
    event.target.value = ''
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          设置
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          自定义您的个人主页和偏好设置
        </p>
      </div>

      {/* 个人信息设置 */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <User className="text-primary-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">个人信息</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              头像
            </label>
            <div className="flex items-center space-x-4">
              <div className="text-4xl">{personalInfo.avatar}</div>
              <div className="flex space-x-2">
                {['👤', '👨‍💻', '👩‍💻', '🧑‍💻', '🌟', '🔥'].map((avatar) => (
                  <button
                    key={avatar}
                    onClick={() => setPersonalInfo({ ...personalInfo, avatar })}
                    className={`text-2xl p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${personalInfo.avatar === avatar ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                    title={`使用 ${avatar} 作为头像`}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              昵称
            </label>
            <input
              type="text"
              id="name"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="输入您的昵称"
            />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              个人简介
            </label>
            <textarea
              id="bio"
              value={personalInfo.bio}
              onChange={(e) => setPersonalInfo({ ...personalInfo, bio: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="输入您的个人简介"
            ></textarea>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱（可选）
            </label>
            <input
              type="email"
              id="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="输入您的邮箱"
            />
          </div>
        </div>
      </Card>

      {/* 主题设置 */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          {theme === 'dark' ? <Moon className="text-primary-600" size={20} /> : <Sun className="text-primary-600" size={20} />}
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">主题设置</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 cursor-pointer mb-4">
              <input
                type="checkbox"
                checked={themeAuto}
                onChange={(e) => setThemeAuto(e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500 border-gray-300 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">跟随系统主题</span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setTheme('light')}
              disabled={themeAuto}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'light' && !themeAuto ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'} ${themeAuto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-2">
                <Sun className="text-yellow-500" size={24} />
                <span className="font-medium text-gray-800 dark:text-gray-200">浅色主题</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">适合在明亮环境下使用</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              disabled={themeAuto}
              className={`p-4 rounded-xl border-2 transition-all ${theme === 'dark' && !themeAuto ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30' : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700'} ${themeAuto ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center space-x-2">
                <Moon className="text-blue-500" size={24} />
                <span className="font-medium text-gray-800 dark:text-gray-200">深色主题</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">适合在黑暗环境下使用</p>
            </button>
          </div>
        </div>
      </Card>

      {/* 通知设置 */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Bell className="text-primary-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">通知设置</h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">学习提醒</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">接收学习提醒通知</p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableStudyReminders}
                  onChange={(e) => setNotifications({ ...notifications, enableStudyReminders: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">文章通知</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">接收新文章推送通知</p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableArticleNotifications}
                  onChange={(e) => setNotifications({ ...notifications, enableArticleNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-800 dark:text-gray-100">兴趣爱好通知</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">接收兴趣爱好相关通知</p>
            </div>
            <div className="flex items-center space-x-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableHobbyNotifications}
                  onChange={(e) => setNotifications({ ...notifications, enableHobbyNotifications: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>

          {notifications.enableStudyReminders && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                提醒时间
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="time"
                  value={notifications.reminderTime}
                  onChange={(e) => setNotifications({ ...notifications, reminderTime: e.target.value })}
                  className="px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500 dark:text-gray-400">每天提醒的时间</span>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* 数据备份和恢复 */}
      <Card>
        <div className="flex items-center space-x-2 mb-6">
          <Download className="text-primary-600" size={20} />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">数据备份与恢复</h2>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 justify-center px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Download size={18} />
              <span className="font-medium">导出数据</span>
            </button>
            <div className="flex space-x-4">
              <button
                onClick={handleImportClick}
                className="flex items-center space-x-2 justify-center flex-1 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              >
                <Upload size={18} />
                <span className="font-medium">导入数据</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* 导入消息 */}
          {importMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg flex items-start space-x-3">
              <CheckCircle2 className="text-green-500 mt-1 flex-shrink-0" size={20} />
              <p className="text-sm text-green-700 dark:text-green-300">{importMessage}</p>
            </div>
          )}

          {/* 导入错误 */}
          {importError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start space-x-3">
              <AlertCircle className="text-red-500 mt-1 flex-shrink-0" size={20} />
              <p className="text-sm text-red-700 dark:text-red-300">{importError}</p>
            </div>
          )}

          {/* 提示信息 */}
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              <strong>提示：</strong>数据备份包含所有个人数据，包括AI工具、文章、书籍、兴趣爱好等。请妥善保管备份文件，不要分享给他人。
            </p>
          </div>
        </div>
      </Card>

      {/* 保存按钮 */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Save size={18} />
          <span className="font-medium">保存设置</span>
        </button>
      </div>
    </div>
  )
}
