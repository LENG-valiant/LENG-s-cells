'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { Bot, Plus, Trash2, Edit, CheckCircle2, XCircle, RefreshCw, ArrowLeft, Star, Link } from 'lucide-react'
import { getPreferences, getAITools, saveAITools } from '@/lib/store'
import { AITool } from '@/types'

interface AICellProps {
  onNavigate: (page: string) => void
}

// AI细胞配色 - 与主页对应
const AI_CELL_COLORS = {
  primary: '#4D613C', // 苔藓绿
  secondary: '#197CBE', // 蓝色
  accent: '#F5CB76', // 黄色
  light: '#EAEEEC', // 白色
  dark: '#4D613C', // 苔藓绿
}

export default function AICell({ onNavigate }: AICellProps) {
  const [tools, setTools] = useState<AITool[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTool, setEditingTool] = useState<AITool | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 获取当前主题
  useEffect(() => {
    const preferences = getPreferences()
    setTheme(preferences.theme)
  }, [])

  // 从store获取AI工具数据
  useEffect(() => {
    const loadTools = () => {
      const storedTools = getAITools()
      setTools(storedTools)
    }

    // 初始加载
    loadTools()

    // 可以添加一个定时器，定期检查数据变化（实际项目中可能会使用更复杂的状态管理）
    const interval = setInterval(loadTools, 5000) // 每5秒检查一次

    return () => clearInterval(interval)
  }, [])

  // 模拟从飞书多维表格获取数据
  useEffect(() => {
    // 这里将来会实现与飞书多维表格的集成
    console.log('从飞书多维表格获取AI工具数据...')
  }, [])

  const addNewTool = (tool: Omit<AITool, 'id'>) => {
    const newTool: AITool = {
      ...tool,
      id: Date.now().toString(),
      tags: [] // 添加tags字段，与store.ts中的AITool接口保持一致
    }
    const updatedTools = [...tools, newTool]
    setTools(updatedTools)
    saveAITools(updatedTools) // 保存到store
    setIsModalOpen(false)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const editTool = (id: string, updates: Partial<AITool>) => {
    const updatedTools = tools.map(tool => 
      tool.id === id ? { ...tool, ...updates } : tool
    )
    setTools(updatedTools)
    saveAITools(updatedTools) // 保存到store
    setIsModalOpen(false)
    setEditingTool(null)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const deleteTool = (id: string) => {
    const updatedTools = tools.filter(tool => tool.id !== id)
    setTools(updatedTools)
    saveAITools(updatedTools) // 保存到store
    // 这里将来会实现数据同步到飞书多维表格
  }

  const toggleFavorite = (id: string) => {
    const updatedTools = tools.map(tool => 
      tool.id === id ? { ...tool, isFavorite: !tool.isFavorite } : tool
    )
    setTools(updatedTools)
    saveAITools(updatedTools) // 保存到store
    // 这里将来会实现数据同步到飞书多维表格
  }

  const incrementUsage = (id: string) => {
    const updatedTools = tools.map(tool => 
      tool.id === id ? { 
        ...tool, 
        usageCount: tool.usageCount + 1,
        lastUsed: new Date().toISOString()
      } : tool
    )
    setTools(updatedTools)
    saveAITools(updatedTools) // 保存到store
    // 这里将来会实现数据同步到飞书多维表格
  }

  return (
    <div className={`min-h-screen tech-background tech-grid tech-glow ${theme === 'dark' ? 'bg-gray-900' : ''}`} style={{ background: theme === 'dark' ? '' : `linear-gradient(to bottom, ${AI_CELL_COLORS.primary}, ${AI_CELL_COLORS.secondary})` }}>
      {/* 头部装饰 */}
      <div className="h-8 rounded-b-3xl shadow-md" style={{ background: `linear-gradient(to right, ${AI_CELL_COLORS.primary}, ${AI_CELL_COLORS.secondary}, ${AI_CELL_COLORS.accent})` }}></div>

      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm hover:bg-opacity-10 transition-colors ${
            theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-[#4D613C] hover:bg-[#59A3CF]'
          }`}
          style={{ borderColor: theme === 'dark' ? '#6b7280' : AI_CELL_COLORS.primary }}
        >
          <ArrowLeft size={20} style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }} />
          <span className="font-medium" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>返回大脑</span>
        </button>

        {/* 标题 */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 opacity-50" style={{ background: AI_CELL_COLORS.primary, borderRadius: '9999px' }}></div>
            <div className={`relative rounded-full p-6 border-4 border-double shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} style={{ borderColor: AI_CELL_COLORS.primary }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                AI细胞
              </h1>
              <p className="text-lg" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.secondary }}>
                探索人工智能的无限可能
              </p>
            </div>
          </div>
        </div>

        {/* AI工具列表 */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold relative" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
              <span className="relative z-10">我的AI工具</span>
              <span className="absolute bottom-0 left-0 w-24 h-3 -z-0" style={{ background: AI_CELL_COLORS.primary, opacity: 0.3 }}></span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-colors"
              style={{ 
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: AI_CELL_COLORS.primary,
                color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${AI_CELL_COLORS.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <Plus size={20} style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }} />
              <span className="font-medium">添加工具</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Card 
              key={tool.id}
              className={`border-2 rounded-2xl shadow-md overflow-hidden ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{ borderColor: AI_CELL_COLORS.primary }}
            >
              {/* 工具头部 */}
              <div className="p-3" style={{ background: `${AI_CELL_COLORS.primary}20` }}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>{tool.name}</h3>
                  <button
                    onClick={() => toggleFavorite(tool.id)}
                    className={`p-1 rounded-full transition-colors ${tool.isFavorite ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'}`}
                  >
                    <Star size={20} className={tool.isFavorite ? 'fill-current' : ''} />
                  </button>
                </div>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                    background: `${AI_CELL_COLORS.primary}40`,
                    color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark
                  }}>
                    {tool.category}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                    background: `${AI_CELL_COLORS.accent}40`,
                    color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark
                  }}>
                    使用 {tool.usageCount} 次
                  </span>
                </div>
              </div>

                {/* 工具内容 */}
                <div className="p-6">
                  {/* 工具描述 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>工具描述</h4>
                    <p className="text-sm p-3 rounded-lg border" style={{ 
                      color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.secondary,
                      background: `${AI_CELL_COLORS.primary}10`,
                      borderColor: `${AI_CELL_COLORS.primary}30`
                    }}>
                      {tool.description}
                    </p>
                  </div>

                  {/* 工具链接 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Link size={16} style={{ color: AI_CELL_COLORS.primary }} />
                      <span className="text-sm font-medium" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>工具链接</span>
                    </div>
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => incrementUsage(tool.id)}
                      className="text-sm ml-6 transition-colors"
                      style={{ 
                        color: AI_CELL_COLORS.primary,
                        textDecoration: 'underline'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = AI_CELL_COLORS.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = AI_CELL_COLORS.primary;
                      }}
                    >
                      {tool.url}
                    </a>
                  </div>

                  {/* 最后使用时间 */}
                  <div className="mb-4">
                    <p className="text-sm" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.secondary }}>最后使用：{tool.lastUsed}</p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setEditingTool(tool)
                        setIsModalOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-colors"
                      style={{ 
                        background: `${AI_CELL_COLORS.primary}20`,
                        borderColor: AI_CELL_COLORS.primary,
                        color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${AI_CELL_COLORS.primary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${AI_CELL_COLORS.primary}20`;
                      }}
                    >
                      <Edit size={16} />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => deleteTool(tool.id)}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-colors"
                      style={{ 
                        background: 'rgba(239, 68, 68, 0.1)',
                        borderColor: '#ef4444',
                        color: '#ef4444'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      }}
                    >
                      <Trash2 size={16} />
                      <span>删除</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 添加/编辑工具模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-xl max-w-md w-full border-4 border-double ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} style={{ borderColor: AI_CELL_COLORS.primary }}>
              <div className="p-6 border-b" style={{ borderColor: `${AI_CELL_COLORS.primary}30` }}>
                <h3 className="text-xl font-semibold" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                  {editingTool ? '编辑AI工具' : '添加新AI工具'}
                </h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const name = formData.get('name') as string
                  const category = formData.get('category') as string
                  const description = formData.get('description') as string
                  const url = formData.get('url') as string
                  const isFavorite = formData.get('isFavorite') === 'on'
                  const usageCount = parseInt(formData.get('usageCount') as string) || 0
                  const lastUsed = formData.get('lastUsed') as string || new Date().toISOString().split('T')[0]

                  if (editingTool) {
                    editTool(editingTool.id, {
                      name,
                      category,
                      description,
                      url,
                      isFavorite,
                      usageCount,
                      lastUsed
                    })
                  } else {
                    addNewTool({
                      name,
                      category,
                      description,
                      url,
                      icon: '🤖',
                      tags: [],
                      isFavorite,
                      usageCount,
                      lastUsed
                    })
                  }
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    工具名称
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    defaultValue={editingTool?.name}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                    placeholder="输入工具名称"
                  />
                </div>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    工具分类
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    defaultValue={editingTool?.category}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                    placeholder="输入工具分类"
                  />
                </div>
                <div>
                  <label htmlFor="url" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    工具链接
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    defaultValue={editingTool?.url}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                    placeholder="输入工具链接"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    工具描述
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={editingTool?.description}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                    placeholder="输入工具描述"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="usageCount" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    使用次数
                  </label>
                  <input
                    type="number"
                    id="usageCount"
                    name="usageCount"
                    defaultValue={editingTool?.usageCount || 0}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                    placeholder="输入使用次数"
                  />
                </div>
                <div>
                  <label htmlFor="lastUsed" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    最后使用日期
                  </label>
                  <input
                    type="date"
                    id="lastUsed"
                    name="lastUsed"
                    defaultValue={editingTool?.lastUsed || new Date().toISOString().split('T')[0]}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                      theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                    }`}
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isFavorite"
                    name="isFavorite"
                    defaultChecked={editingTool?.isFavorite || false}
                    className="w-4 h-4 rounded focus:border-transparent"
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary
                    }}
                  />
                  <label htmlFor="isFavorite" className="text-sm font-medium" style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
                    收藏为最爱
                  </label>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingTool(null)
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: AI_CELL_COLORS.primary,
                      color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark,
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${AI_CELL_COLORS.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: AI_CELL_COLORS.primary,
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = AI_CELL_COLORS.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = AI_CELL_COLORS.primary;
                    }}
                  >
                    {editingTool ? '保存修改' : '添加工具'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="mt-16">
        <div className="h-8 rounded-t-3xl shadow-md" style={{ background: `linear-gradient(to right, ${AI_CELL_COLORS.primary}, ${AI_CELL_COLORS.secondary}, ${AI_CELL_COLORS.accent})` }}></div>
        <div className="py-6 text-center" style={{ background: theme === 'dark' ? '#1f2937' : `${AI_CELL_COLORS.primary}20` }}>
          <p style={{ color: theme === 'dark' ? '#EAEEEC' : AI_CELL_COLORS.dark }}>
            AI细胞 • 探索人工智能的无限可能 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}