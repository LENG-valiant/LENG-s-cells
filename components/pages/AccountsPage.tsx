'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Badge, EmptyState } from '@/components/UI'
import { Plus, Star, Users, FileText, ExternalLink, RefreshCw } from 'lucide-react'
import { PublicAccount, Article } from '@/types'
import { getAccounts, saveAccounts } from '@/lib/store'

interface AccountsPageProps {
  onNavigate: (page: string) => void
}

export default function AccountsPage({ onNavigate }: AccountsPageProps) {
  const [accounts, setAccounts] = useState<PublicAccount[]>([])
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    setAccounts(getAccounts())
  }, [])

  const totalArticles = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.articles.length, 0)
  }, [accounts])

  const toggleFavorite = (id: string) => {
    const updated = accounts.map(acc =>
      acc.id === id ? { ...acc, isFavorite: !acc.isFavorite } : acc
    )
    setAccounts(updated)
    saveAccounts(updated)
  }

  const [selectedAccount, setSelectedAccount] = useState<PublicAccount | null>(null)
  const [isScraping, setIsScraping] = useState(false)

  const simulateScrapeArticles = (accountId: string) => {
    setIsScraping(true)
    // 模拟文章抓取
    setTimeout(() => {
      const updated = accounts.map(acc => {
        if (acc.id === accountId) {
          // 生成模拟文章
          const mockArticles: Article[] = [
            {
              id: Date.now().toString() + '1',
              title: `${acc.name}最新文章：2024年AI发展趋势`,
              url: '#',
              source: acc.name,
              publishedAt: new Date().toISOString(),
              summary: `这是一篇关于2024年AI发展趋势的深度分析文章，来自${acc.name}。`,
              isRead: false,
              isFavorite: false,
              tags: ['AI', '趋势', '分析']
            },
            {
              id: Date.now().toString() + '2',
              title: `${acc.name}：如何提高工作效率`,
              url: '#',
              source: acc.name,
              publishedAt: new Date(Date.now() - 86400000).toISOString(),
              summary: `分享了一些提高工作效率的实用技巧，来自${acc.name}。`,
              isRead: false,
              isFavorite: false,
              tags: ['效率', '工作', '技巧']
            },
            {
              id: Date.now().toString() + '3',
              title: `${acc.name}：产品设计的核心原则`,
              url: '#',
              source: acc.name,
              publishedAt: new Date(Date.now() - 172800000).toISOString(),
              summary: `探讨了产品设计的核心原则和实践方法，来自${acc.name}。`,
              isRead: false,
              isFavorite: false,
              tags: ['产品设计', '原则', '实践']
            }
          ]
          return {
            ...acc,
            articles: [...acc.articles, ...mockArticles],
            lastUpdated: new Date().toISOString()
          }
        }
        return acc
      })
      setAccounts(updated)
      saveAccounts(updated)
      setIsScraping(false)
    }, 1500)
  }

  const getAccountArticles = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId)
    return account?.articles || []
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">公众号关注</h1>
          <p className="text-gray-500 mt-1">管理您关注的微信公众号</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <Plus size={20} />
          <span>添加公众号</span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="text-center">
            <Users size={32} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{accounts.length}</p>
            <p className="text-sm text-gray-500">关注的公众号</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Star size={32} className="mx-auto text-yellow-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">
              {accounts.filter(a => a.isFavorite).length}
            </p>
            <p className="text-sm text-gray-500">收藏的公众号</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <FileText size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{totalArticles}</p>
            <p className="text-sm text-gray-500">文章总数</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <ExternalLink size={32} className="mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">-</p>
            <p className="text-sm text-gray-500">最近更新</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 公众号列表 */}
        <div className="lg:col-span-1">
          {accounts.length === 0 ? (
            <EmptyState
              icon={<Users size={32} className="text-gray-400" />}
              title="还没有关注任何公众号"
              description="添加您感兴趣的公众号，开始管理您的信息源"
              action={
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  添加公众号
                </button>
              }
            />
          ) : (
            <div className="space-y-4">
              {accounts.map((account) => (
                <Card 
                  key={account.id} 
                  className={`relative ${selectedAccount?.id === account.id ? 'ring-2 ring-green-500' : ''}`}
                  onClick={() => setSelectedAccount(account)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(account.id)
                    }}
                    className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                      account.isFavorite
                        ? 'text-yellow-500 bg-yellow-50'
                        : 'text-gray-300 hover:text-yellow-500'
                    }`}
                  >
                    <Star size={20} fill={account.isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center text-3xl">
                      {account.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-800">{account.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2">{account.description}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-gray-500">{account.articles.length}篇文章</span>
                        <span className="text-gray-300">•</span>
                        <span className="text-xs text-gray-500">
                          更新于 {new Date(account.lastUpdated).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <Badge variant={account.isFavorite ? 'success' : 'default'}>
                      {account.isFavorite ? '已收藏' : '未收藏'}
                    </Badge>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        simulateScrapeArticles(account.id)
                      }}
                      className="text-green-600 hover:text-green-700 text-sm flex items-center space-x-1"
                    >
                      <RefreshCw size={14} className={isScraping ? 'animate-spin' : ''} />
                      <span>刷新文章</span>
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* 文章列表 */}
        <div className="lg:col-span-2">
          {selectedAccount ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{selectedAccount.name}的文章</h2>
                  <p className="text-gray-500 text-sm">共 {selectedAccount.articles.length} 篇文章</p>
                </div>
                <button 
                  onClick={() => simulateScrapeArticles(selectedAccount.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw size={18} className={isScraping ? 'animate-spin' : ''} />
                  <span>{isScraping ? '抓取中...' : '刷新文章'}</span>
                </button>
              </div>
              
              {selectedAccount.articles.length === 0 ? (
                <EmptyState
                  icon={<FileText size={32} className="text-gray-400" />}
                  title="还没有文章"
                  description="点击上方按钮刷新文章，或手动添加文章"
                />
              ) : (
                <div className="space-y-4">
                  {selectedAccount.articles.sort((a, b) => 
                    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
                  ).map((article) => (
                    <Card key={article.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
                          <FileText size={24} className="text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 line-clamp-2">{article.title}</h3>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-3 text-xs text-gray-500">
                              <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                              <span className="text-gray-300">•</span>
                              <span>{article.source}</span>
                              {article.tags.length > 0 && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex space-x-1">
                                    {article.tags.slice(0, 2).map((tag) => (
                                      <Badge key={tag} variant="default">{tag}</Badge>
                                    ))}
                                    {article.tags.length > 2 && (
                                      <span>+{article.tags.length - 2}</span>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {article.isFavorite && (
                                <Star size={16} className="text-yellow-500 fill-current" />
                              )}
                              <button 
                                onClick={() => window.open(article.url, '_blank')}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <ExternalLink size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState
              icon={<FileText size={32} className="text-gray-400" />}
              title="请选择一个公众号"
              description="从左侧选择一个公众号，查看其最新文章"
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加公众号</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公众号名称
                </label>
                <input
                  type="text"
                  placeholder="输入公众号名称"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  公众号描述
                </label>
                <textarea
                  placeholder="简单描述这个公众号的内容"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  文章抓取链接（可选）
                </label>
                <input
                  type="text"
                  placeholder="输入公众号文章链接用于自动抓取"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
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
