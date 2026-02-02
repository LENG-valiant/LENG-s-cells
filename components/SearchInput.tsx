'use client'

import { Search, X } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  suggestions?: string[]
  onSelectSuggestion?: (suggestion: string) => void
}

export default function SearchInput({
  value,
  onChange,
  placeholder = '搜索...',
  suggestions = [],
  onSelectSuggestion
}: SearchInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // 检测当前主题
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    // 初始检测
    checkDarkMode()

    // 监听主题变化
    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    return () => observer.disconnect()
  }, [])

  const filteredSuggestions = suggestions.filter(
    s => s.toLowerCase().includes(value.toLowerCase()) && s !== value
  )

  useEffect(() => {
    if (value) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [value])

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={20} />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          style={isDarkMode ? {
            color: 'white',
            backgroundColor: '#3b82f6',
            WebkitTextFillColor: 'white',
            WebkitTextStrokeColor: 'white',
            WebkitTextStrokeWidth: '0.2px'
          } : {}}
          onFocus={() => value && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden z-10">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectSuggestion?.(suggestion)
                onChange(suggestion)
                setShowSuggestions(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center space-x-2 transition-colors text-gray-800 dark:text-gray-100"
            >
              <Search size={16} className="text-gray-400 dark:text-gray-400" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
