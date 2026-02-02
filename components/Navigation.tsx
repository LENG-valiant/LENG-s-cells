'use client'

import { Home, Bot, Users, FileText, BookOpen, Search, Menu, X, Star, Heart, Moon, Sun, BarChart3, Settings } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getPreferences, savePreferences } from '@/lib/store'
import { useSearch } from '@/hooks/useSearch'
import SearchModal from './SearchModal'

interface NavigationProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const navItems = [
  { id: 'home', label: '第二大脑', icon: Home },
  { id: 'reading', label: '阅读细胞', icon: BookOpen },
  { id: 'food', label: '美食细胞', icon: Heart },
  { id: 'learning', label: '学习细胞', icon: FileText },
  { id: 'ai', label: 'AI细胞', icon: Bot },
  { id: 'health', label: '健康细胞', icon: Heart },
]

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // 使用搜索hook
  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchSuggestions,
    isSearchOpen,
    setIsSearchOpen
  } = useSearch()

  useEffect(() => {
    // 从localStorage获取主题偏好
    const preferences = getPreferences()
    setTheme(preferences.theme)
    // 应用主题到HTML根元素
    document.documentElement.classList.toggle('dark', preferences.theme === 'dark')
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    // 保存主题偏好到localStorage
    const preferences = getPreferences()
    savePreferences({ ...preferences, theme: newTheme })
    // 应用主题到HTML根元素
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  const handleSearchClick = () => {
    setIsSearchOpen(true)
  }

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              个人主页
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              )
            })}
            
            {/* 搜索按钮 */}
            <button
              onClick={handleSearchClick}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              title="搜索"
            >
              <Search size={20} className="text-gray-600 dark:text-gray-300" />
            </button>
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              title="切换主题"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* 只在移动端显示的菜单按钮 */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            {/* 移动端搜索按钮 */}
            <button
              onClick={() => {
                handleSearchClick()
                setIsMobileMenuOpen(false)
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            >
              <Search size={20} />
              <span>搜索</span>
            </button>
            
            
            
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentPage === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id)
                    setIsMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
      
      {/* 搜索模态框 */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => {
          setIsSearchOpen(false)
          setSearchQuery('')
        }}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        searchResults={searchResults}
        searchSuggestions={searchSuggestions}
        onNavigate={onNavigate}
      />
    </nav>
  )
}
