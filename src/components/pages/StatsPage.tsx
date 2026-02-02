'use client'

import { useMemo } from 'react'
import { Card } from '@/components/UI'
import { TrendingUp, BarChart3, PieChart, Clock, Award, BookOpen, Bot, FileText, Heart, Bell } from 'lucide-react'
import { getStats } from '@/lib/store'

interface StatsPageProps {
  onNavigate: (page: string) => void
}

export default function StatsPage({ onNavigate }: StatsPageProps) {
  const stats = useMemo(() => getStats(), [])

  // 简化的进度条组件
  const ProgressBar = ({ value, max = 100, color = 'bg-primary-500', label }: { value: number; max?: number; color?: string; label?: string }) => {
    const percentage = Math.min(100, Math.round((value / max) * 100))
    return (
      <div className="space-y-2">
        {label && <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-300">{label}</span>
          <span className="font-medium text-gray-800 dark:text-gray-100">{value}/{max}</span>
        </div>}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${color}`} 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    )
  }

  // 简化的柱状图组件
  const BarChart = ({ data, title }: { data: Array<{ label: string; value: number }>; title?: string }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1)
    return (
      <div className="space-y-4">
        {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h4>}
        <div className="flex items-end justify-between space-x-3 h-40">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center space-y-2 flex-1">
              <div 
                className="w-full bg-primary-500 rounded-t-lg transition-all duration-300 hover:bg-primary-600"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '4px' }}
                title={`${item.label}: ${item.value}`}
              ></div>
              <span className="text-xs text-gray-600 dark:text-gray-300 rotate-45 origin-center transform whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // 简化的饼图组件
  const PieChartSimple = ({ data, title }: { data: Array<{ label: string; value: number; color: string }>; title?: string }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500', 'bg-orange-500']
    
    let currentAngle = 0
    const segments = data.map((item, index) => {
      const percentage = (item.value / total) * 100
      const angle = (item.value / total) * 360
      const segment = {
        ...item,
        angle,
        startAngle: currentAngle,
        endAngle: currentAngle + angle,
        color: item.color || colors[index % colors.length]
      }
      currentAngle += angle
      return segment
    })

    return (
      <div className="space-y-4">
        {title && <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{title}</h4>}
        <div className="relative w-40 h-40 mx-auto">
          <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={`M 80 80 L ${80 + 80 * Math.cos(segment.startAngle * Math.PI / 180)} ${80 + 80 * Math.sin(segment.startAngle * Math.PI / 180)} A 80 80 0 0 1 ${80 + 80 * Math.cos(segment.endAngle * Math.PI / 180)} ${80 + 80 * Math.sin(segment.endAngle * Math.PI / 180)} Z`}
                  fill={segment.color.replace('bg-', '#').replace('500', '500')}
                  className="transition-all duration-300 hover:opacity-80"
                  aria-label={`${segment.label}: ${segment.value} (${Math.round((segment.value / total) * 100)}%)`}
                />
              </g>
            ))}
            <circle cx="80" cy="80" r="60" fill="white" className="dark:fill-gray-800" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{total}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">总数</span>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${segment.color}`}></div>
              <span className="text-xs text-gray-600 dark:text-gray-300">{segment.label} ({Math.round((segment.value / total) * 100)}%)</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          数据统计
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          查看您的学习和使用数据
        </p>
      </div>

      {/* 总览卡片 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <Card className="p-4 text-center">
          <Bot className="text-purple-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.totalTools}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI工具</p>
        </Card>
        <Card className="p-4 text-center">
          <FileText className="text-blue-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.totalArticles}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">文章</p>
        </Card>
        <Card className="p-4 text-center">
          <BookOpen className="text-orange-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.totalBooks}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">书籍</p>
        </Card>
        <Card className="p-4 text-center">
          <Heart className="text-pink-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.totalHobbies}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">兴趣爱好</p>
        </Card>
        <Card className="p-4 text-center">
          <Bell className="text-green-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.totalReminders}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">提醒</p>
        </Card>
        <Card className="p-4 text-center">
          <Award className="text-yellow-500 mx-auto mb-2" size={24} />
          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{stats.favoriteResources}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">收藏资源</p>
        </Card>
      </div>

      {/* 学习概览 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <TrendingUp className="mr-2 text-primary-500" size={20} />
          学习概览
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">完成进度</h3>
            <ProgressBar label="已读文章" value={stats.readArticles} max={stats.totalArticles} color="bg-blue-500" />
            <ProgressBar label="已完成书籍" value={stats.completedBooks} max={stats.totalBooks} color="bg-orange-500" />
            <ProgressBar label="已完成提醒" value={stats.completedReminders} max={stats.totalReminders} color="bg-green-500" />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">书籍状态分布</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 text-center">
                <h4 className="text-2xl font-bold text-blue-500">{stats.readingBooks}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">阅读中</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-2xl font-bold text-green-500">{stats.completedBooks}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">已完成</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-2xl font-bold text-yellow-500">{stats.wantToReadBooks}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">想读</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* AI工具使用统计 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Bot className="mr-2 text-purple-500" size={20} />
          AI工具使用统计
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">使用频率最高的工具</h3>
            <div className="space-y-3">
              {stats.mostUsedTools.map((tool, index) => (
                <div key={tool.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-gray-100">{tool.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{tool.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{tool.usageCount}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">次使用</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">工具类别分布</h3>
            <BarChart 
              data={Object.entries(stats.toolsByCategory).map(([label, value]) => ({ label, value }))}
            />
          </div>
        </div>
      </Card>

      {/* 文章和书籍统计 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 文章统计 */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <FileText className="mr-2 text-blue-500" size={20} />
            文章统计
          </h2>
          <PieChartSimple 
            title="文章来源分布" 
            data={Object.entries(stats.articlesBySource).map(([label, value], index) => ({
              label,
              value,
              color: ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-red-500'][index % 5]
            }))}
          />
        </Card>

        {/* 书籍统计 */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
            <BookOpen className="mr-2 text-orange-500" size={20} />
            书籍统计
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">平均评分</span>
              <span className="text-2xl font-bold text-yellow-500">⭐ {stats.averageBookRating}</span>
            </div>
            <div className="h-px bg-gray-200 dark:bg-gray-700"></div>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.totalBooks}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">总书籍</p>
              </Card>
              <Card className="p-4 text-center">
                <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100">{stats.totalNotes}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">总笔记</p>
              </Card>
            </div>
          </div>
        </Card>
      </div>

      {/* 兴趣爱好统计 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Heart className="mr-2 text-pink-500" size={20} />
          兴趣爱好统计
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">兴趣类别分布</h3>
            <BarChart 
              data={Object.entries(stats.hobbiesByCategory).map(([label, value]) => ({ label, value }))}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">概览</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">总兴趣爱好</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">{stats.totalHobbies}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">收藏的兴趣</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">{stats.favoriteHobbies}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">兴趣内容总数</span>
                <span className="font-bold text-gray-800 dark:text-gray-100">{stats.totalHobbyContents}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* 最近活动 */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center">
          <Clock className="mr-2 text-primary-500" size={20} />
          最近活动
        </h2>
        <div className="space-y-3">
          {stats.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="mt-1">
                {activity.type === 'tool' && <Bot className="text-purple-500" size={18} />}
                {activity.type === 'article' && <FileText className="text-blue-500" size={18} />}
                {activity.type === 'reminder' && <Bell className="text-green-500" size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-800 dark:text-gray-100">
                    {activity.type === 'tool' && `使用了工具: ${activity.item.name}`}
                    {activity.type === 'article' && `发布了文章: ${activity.item.title}`}
                    {activity.type === 'reminder' && `创建了提醒: ${activity.item.title}`}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(activity.date).toLocaleDateString()}
                  </span>
                </div>
                {activity.type === 'article' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.item.source}</p>
                )}
                {activity.type === 'reminder' && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activity.item.time} - {activity.item.content}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
