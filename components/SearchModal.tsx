'use client'

import { useEffect, useRef } from 'react'
import { X, Bot, FileText, BookOpen, Heart, Bell, ExternalLink } from 'lucide-react'
import { SearchResult } from '@/hooks/useSearch'
import SearchInput from './SearchInput'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  searchQuery: string
  onSearchQueryChange: (query: string) => void
  searchResults: SearchResult[]
  searchSuggestions: string[]
  onNavigate: (page: string) => void
}

export default function SearchModal({
  isOpen,
  onClose,
  searchQuery,
  onSearchQueryChange,
  searchResults,
  searchSuggestions,
  onNavigate
}: SearchModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  // 点击模态框外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.body.style.overflow = 'auto'
    }
  }, [isOpen, onClose])

  // 按ESC键关闭
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  // 获取结果类型图标
  const getResultTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return <Bot size={16} className="text-purple-500" />
      case 'article': return <FileText size={16} className="text-blue-500" />
      case 'book': return <BookOpen size={16} className="text-orange-500" />
      case 'hobby': return <Heart size={16} className="text-pink-500" />
      case 'hobbyContent': return <FileText size={16} className="text-green-500" />
      case 'reminder': return <Bell size={16} className="text-yellow-500" />
      default: return null
    }
  }

  // 获取结果类型标签
  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'tool': return 'AI工具'
      case 'article': return '文章'
      case 'book': return '书籍'
      case 'hobby': return '兴趣爱好'
      case 'hobbyContent': return '兴趣内容'
      case 'reminder': return '提醒'
      default: return ''
    }
  }

  // 处理结果点击
  const handleResultClick = (result: SearchResult) => {
    // 根据结果类型跳转到对应页面
    switch (result.type) {
      case 'tool': onNavigate('ai-tools'); break
      case 'article': onNavigate('articles'); break
      case 'book': onNavigate('reading'); break
      case 'hobby': onNavigate('hobbies'); break
      case 'hobbyContent': onNavigate('hobbies'); break
      case 'reminder': onNavigate('home'); break
      default: break
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start pt-24 px-4">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl mx-auto max-h-[80vh] overflow-hidden flex flex-col"
      >
        {/* 搜索头部 */}
        <div className="p-4 border-b dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <SearchInput
              value={searchQuery}
              onChange={onSearchQueryChange}
              placeholder="在所有资源中搜索..."
              suggestions={searchSuggestions}
              onSelectSuggestion={(suggestion) => {
                onSearchQueryChange(suggestion)
              }}
            />
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="关闭搜索"
            >
              <X size={20} className="text-gray-600 dark:text-white" />
            </button>
          </div>
        </div>

        {/* 搜索结果 */}
        <div className="flex-1 overflow-y-auto">
          {searchQuery ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-white">
                  搜索结果 ({searchResults.length})
                </h3>
                {searchResults.length > 0 && (
                  <button
                    onClick={() => onSearchQueryChange('')}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200"
                  >
                    清除搜索
                  </button>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((result) => (
                    <div
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer flex items-start space-x-3"
                    >
                      <div className="mt-1">
                        {getResultTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-800 dark:text-white truncate">
                            {result.title}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-300">
                            {getResultTypeLabel(result.type)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-300 mt-1 line-clamp-2">
                          {result.content}
                        </p>
                        {result.source && (
                          <div className="flex items-center mt-2 text-xs text-gray-500 dark:text-gray-300">
                            <span className="mr-2">来源: {result.source}</span>
                          </div>
                        )}
                      </div>
                      {result.url && (
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                          title="在新窗口打开"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <X size={32} className="text-gray-400 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    没有找到匹配的结果
                  </h3>
                  <p className="text-gray-500 dark:text-gray-300">
                    请尝试使用其他关键词搜索
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-white mb-4">
                热门搜索
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['AI工具', '编程', '产品设计', '学习', '摄影', '阅读'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => onSearchQueryChange(topic)}
                    className="px-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
