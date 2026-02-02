'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Badge, EmptyState } from '@/components/UI'
import SearchInput from '@/components/SearchInput'
import { Plus, Star, FileText, Tag, ExternalLink, Bookmark, Clock } from 'lucide-react'
import { Article } from '@/types'
import { getArticles, saveArticles } from '@/lib/store'

interface ArticlesPageProps {
  onNavigate: (page: string) => void
}

export default function ArticlesPage({ onNavigate }: ArticlesPageProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setArticles(getArticles())
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set<string>()
    articles.forEach(article => article.tags.forEach(tag => tags.add(tag)))
    return ['all', ...Array.from(tags)]
  }, [articles])

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesTag = selectedTag === 'all' || article.tags.includes(selectedTag)
      const matchesFavorite = !showFavoritesOnly || article.isFavorite
      return matchesSearch && matchesTag && matchesFavorite
    })
  }, [articles, searchQuery, selectedTag, showFavoritesOnly])

  const toggleRead = (id: string) => {
    const updated = articles.map(article =>
      article.id === id ? { ...article, isRead: !article.isRead } : article
    )
    setArticles(updated)
    saveArticles(updated)
  }

  const toggleFavorite = (id: string) => {
    const updated = articles.map(article =>
      article.id === id ? { ...article, isFavorite: !article.isFavorite } : article
    )
    setArticles(updated)
    saveArticles(updated)
  }

  const stats = useMemo(() => ({
    total: articles.length,
    unread: articles.filter(a => !a.isRead).length,
    favorites: articles.filter(a => a.isFavorite).length,
  }), [articles])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">文章推送</h1>
          <p className="text-gray-500 mt-1">管理和阅读自动抓取的文章推送</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus size={20} />
          <span>添加链接</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="text-center">
            <FileText size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            <p className="text-sm text-gray-500">文章总数</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Clock size={32} className="mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.unread}</p>
            <p className="text-sm text-gray-500">未读文章</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Star size={32} className="mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{stats.favorites}</p>
            <p className="text-sm text-gray-500">收藏文章</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Bookmark size={32} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {Math.round((stats.total - stats.unread) / Math.max(stats.total, 1) * 100)}%
            </p>
            <p className="text-sm text-gray-500">阅读完成率</p>
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索文章..."
            suggestions={['AI工具', '产品设计', '编程']}
          />
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-xl border transition-colors ${
            showFavoritesOnly
              ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Star size={20} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          <span>只显示收藏</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedTag === tag
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tag === 'all' ? '全部标签' : tag}
          </button>
        ))}
      </div>

      {filteredArticles.length === 0 ? (
        <EmptyState
          icon={<FileText size={32} className="text-gray-400" />}
          title="没有找到文章"
          description="没有找到符合条件的文章，请尝试其他搜索条件"
        />
      ) : (
        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-gray-500">{article.source}</span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    {!article.isRead && (
                      <Badge variant="success">未读</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{article.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{article.summary}</p>
                  <div className="flex items-center space-x-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => toggleRead(article.id)}
                    className={`p-2 rounded-full transition-colors ${
                      article.isRead
                        ? 'text-gray-300 hover:text-blue-500'
                        : 'text-blue-500 bg-blue-50'
                    }`}
                    title={article.isRead ? '标记为未读' : '标记为已读'}
                  >
                    <FileText size={20} />
                  </button>
                  <button
                    onClick={() => toggleFavorite(article.id)}
                    className={`p-2 rounded-full transition-colors ${
                      article.isFavorite
                        ? 'text-yellow-500 bg-yellow-50'
                        : 'text-gray-300 hover:text-yellow-500'
                    }`}
                    title={article.isFavorite ? '取消收藏' : '收藏'}
                  >
                    <Star size={20} fill={article.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-gray-100 transition-colors"
                    title="打开原文"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加文章链接</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  文章链接
                </label>
                <input
                  type="text"
                  placeholder="输入文章链接（公众号或网页）"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  标签（可选，用逗号分隔）
                </label>
                <input
                  type="text"
                  placeholder="AI, 产品设计, 编程"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
