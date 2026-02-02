'use client'

import { useAITools } from '@/hooks/useAITools'
import { ToolCard, Card, EmptyState } from '@/components/UI'
import SearchInput from '@/components/SearchInput'
import { Search, Star, Filter, Plus } from 'lucide-react'
import { useState } from 'react'
import { AITool } from '@/types'

interface AIToolsPageProps {
  onNavigate: (page: string) => void
}

export default function AIToolsPage({ onNavigate }: AIToolsPageProps) {
  const {
    tools,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showFavoritesOnly,
    setShowFavoritesOnly,
    categories,
    recommendations,
    toggleFavorite,
    incrementUsage
  } = useAITools()

  const [showRecommendations, setShowRecommendations] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">AI工具导航</h1>
          <p className="text-gray-500 mt-1">发现、收藏和使用各类AI工具</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
          <Plus size={20} />
          <span>添加工具</span>
        </button>
      </div>

      {showRecommendations && (recommendations.basedOnFavorites.length > 0 || recommendations.popular.length > 0) && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">个性化推荐</h2>
            <button
              onClick={() => setShowRecommendations(false)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              收起
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">基于您的收藏</h3>
              <div className="space-y-2">
                {recommendations.basedOnFavorites.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => incrementUsage(tool.id)}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{tool.name}</p>
                      <p className="text-xs text-gray-500">{tool.category}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFavorite(tool.id)
                      }}
                      className="text-gray-400 hover:text-yellow-500"
                    >
                      <Star size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">热门工具</h3>
              <div className="space-y-2">
                {recommendations.popular.map((tool) => (
                  <div
                    key={tool.id}
                    className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => incrementUsage(tool.id)}
                  >
                    <span className="text-2xl">{tool.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{tool.name}</p>
                      <p className="text-xs text-gray-500">使用 {tool.usageCount} 次</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索AI工具..."
            suggestions={['ChatGPT', 'Claude', 'Midjourney', '编程助手']}
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
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              selectedCategory === category
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? '全部' : category}
          </button>
        ))}
      </div>

      {tools.length === 0 ? (
        <EmptyState
          icon={<Search size={32} className="text-gray-400" />}
          title="未找到工具"
          description="没有找到符合条件的AI工具，请尝试其他搜索词"
        />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard
              key={tool.id}
              name={tool.name}
              description={tool.description}
              icon={tool.icon}
              category={tool.category}
              isFavorite={tool.isFavorite}
              onFavorite={() => toggleFavorite(tool.id)}
              onClick={() => {
                incrementUsage(tool.id)
                window.open(tool.url, '_blank')
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
