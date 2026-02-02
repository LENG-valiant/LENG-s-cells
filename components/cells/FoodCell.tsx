'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { Utensils, Plus, Trash2, Edit, CheckCircle2, XCircle, RefreshCw, ArrowLeft, Star } from 'lucide-react'
import { getPreferences } from '@/lib/store'
import { Food } from '@/types'

interface FoodCellProps {
  onNavigate: (page: string) => void
}

// 美食细胞配色 - 与主页对应
const FOOD_CELL_COLORS = {
  primary: '#F5CB76', // 黄色
  secondary: '#197CBE', // 蓝色
  accent: '#F88B7C', // 粉色
  light: '#EAEEEC', // 白色
  dark: '#197CBE', // 深蓝色
}

// 从本地存储获取美食数据
const getLocalFoods = (): Food[] => {
  try {
    const foodsStr = localStorage.getItem('personal_homepage_foods')
    if (foodsStr) {
      return JSON.parse(foodsStr)
    }
    // 默认数据
    return [
      {
        id: '1',
        name: '红烧肉',
        category: '中餐',
        description: '肥而不腻，入口即化',
        rating: 5,
        location: '外婆家',
        date: '2026-01-20',
        isFavorite: true
      },
      {
        id: '2',
        name: '意大利面',
        category: '西餐',
        description: '酱汁浓郁，口感Q弹',
        rating: 4,
        location: '必胜客',
        date: '2026-01-15',
        isFavorite: false
      },
      {
        id: '3',
        name: '寿司拼盘',
        category: '日料',
        description: '新鲜美味，品种丰富',
        rating: 5,
        location: '寿司王',
        date: '2026-01-10',
        isFavorite: true
      }
    ]
  } catch (error) {
    console.error('获取本地美食数据失败:', error)
    return []
  }
}

// 保存美食数据到本地存储
const saveLocalFoods = (foods: Food[]): void => {
  try {
    localStorage.setItem('personal_homepage_foods', JSON.stringify(foods))
  } catch (error) {
    console.error('保存本地美食数据失败:', error)
  }
}

export default function FoodCell({ onNavigate }: FoodCellProps) {
  const [foods, setFoods] = useState<Food[]>(getLocalFoods())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFood, setEditingFood] = useState<Food | null>(null)
  const [foodImage, setFoodImage] = useState<string>('') // 添加图片状态
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  // 获取当前主题
  useEffect(() => {
    const preferences = getPreferences()
    setTheme(preferences.theme)
  }, [])

  // 从本地存储加载美食数据
  useEffect(() => {
    const loadFoods = () => {
      const localFoods = getLocalFoods()
      setFoods(localFoods)
    }

    loadFoods()
  }, [])

  // 当美食数据变化时，保存到本地存储
  useEffect(() => {
    if (foods.length > 0) {
      saveLocalFoods(foods)
    }
  }, [foods])

  const addNewFood = (food: Omit<Food, 'id'>) => {
    const newFood: Food = {
      ...food,
      id: Date.now().toString()
    }
    setFoods([...foods, newFood])
    setIsModalOpen(false)
  }

  const editFood = (id: string, updates: Partial<Food>) => {
    setFoods(foods.map(food => 
      food.id === id ? { ...food, ...updates } : food
    ))
    setIsModalOpen(false)
    setEditingFood(null)
  }

  const deleteFood = (id: string) => {
    setFoods(foods.filter(food => food.id !== id))
  }

  const toggleFavorite = (id: string) => {
    setFoods(foods.map(food => 
      food.id === id ? { ...food, isFavorite: !food.isFavorite } : food
    ))
  }

  return (
    <div className={`min-h-screen tech-background tech-grid tech-glow ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-b from-[#F5CB76] to-[#F88B7C]'}`}>
      {/* 头部装饰 */}
      <div className="h-8 bg-gradient-to-r from-[#F5CB76] via-[#F88B7C] to-[#197CBE] rounded-b-3xl shadow-md"></div>

      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm hover:bg-opacity-10 transition-colors ${
            theme === 'dark' ? 'bg-gray-800 border-gray-600 hover:bg-gray-700' : 'bg-white border-[#F5CB76] hover:bg-[#F5CB76]'
          }`}
        >
          <ArrowLeft size={20} style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }} />
          <span className="font-medium" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>返回大脑</span>
        </button>

        {/* 标题 */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2" style={{ background: FOOD_CELL_COLORS.primary, borderRadius: '9999px', opacity: 0.5 }}></div>
            <div className={`relative rounded-full p-6 border-4 border-double shadow-lg ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} style={{ borderColor: FOOD_CELL_COLORS.primary }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                美食细胞
              </h1>
              <p className="text-lg" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.secondary }}>
                品尝生活的味道，记录美食记忆
              </p>
            </div>
          </div>
        </div>

        {/* 美食列表 */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold relative" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
              <span className="relative z-10">我的美食记忆</span>
              <span className="absolute bottom-0 left-0 w-24 h-3 -z-0" style={{ background: FOOD_CELL_COLORS.primary, opacity: 0.3 }}></span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-colors"
              style={{ 
                background: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)',
                borderColor: FOOD_CELL_COLORS.primary,
                color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${FOOD_CELL_COLORS.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <Plus size={20} style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }} />
              <span className="font-medium">添加美食</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {foods.map((food) => (
              <Card 
                key={food.id}
                className={`border-2 rounded-2xl shadow-md overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
                style={{ borderColor: FOOD_CELL_COLORS.primary }}
              >
                {/* 美食图片 */}
                {food.image && (
                  <div className="w-full">
                    <img 
                      src={food.image} 
                      alt={food.name} 
                      className="w-full aspect-square object-cover"
                    />
                  </div>
                )}
                
                {/* 美食头部 */}
                <div className="p-3" style={{ background: `${FOOD_CELL_COLORS.primary}20` }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>{food.name}</h3>
                    <button
                      onClick={() => toggleFavorite(food.id)}
                      className={`p-1 rounded-full transition-colors ${food.isFavorite ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30' : 'text-gray-300 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/30'}`}
                    >
                      <Star size={20} className={food.isFavorite ? 'fill-current' : ''} />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${FOOD_CELL_COLORS.primary}40`, color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      {food.category}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ background: `${FOOD_CELL_COLORS.accent}40`, color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      {food.location}
                    </span>
                  </div>
                </div>

                {/* 美食内容 */}
                <div className="p-6">
                  {/* 评分 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={`${star <= food.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className={`text-sm font-medium ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{food.rating}/5</span>
                    </div>
                  </div>

                  {/* 描述 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>美食描述</h4>
                    <p className="text-sm p-3 rounded-lg border" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.secondary, background: `${FOOD_CELL_COLORS.primary}10`, borderColor: `${FOOD_CELL_COLORS.primary}30` }}>
                      {food.description}
                    </p>
                  </div>

                  {/* 日期 */}
                  <div className="mb-4">
                    <p className="text-sm" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.secondary }}>品尝日期：{food.date}</p>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setEditingFood(food)
                        setFoodImage(food.image || '') // 加载现有图片
                        setIsModalOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-colors"
                      style={{ 
                        background: `${FOOD_CELL_COLORS.primary}20`,
                        borderColor: FOOD_CELL_COLORS.primary,
                        color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${FOOD_CELL_COLORS.primary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${FOOD_CELL_COLORS.primary}20`;
                      }}
                    >
                      <Edit size={16} />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => deleteFood(food.id)}
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

        {/* 添加/编辑美食模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-2xl shadow-xl max-w-md w-full border-4 border-double ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`} style={{ borderColor: FOOD_CELL_COLORS.primary }}>
              <div className="p-6 border-b" style={{ borderColor: `${FOOD_CELL_COLORS.primary}30` }}>
                <h3 className="text-xl font-semibold" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                  {editingFood ? '编辑美食' : '添加新美食'}
                </h3>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const name = formData.get('name') as string
                    const category = formData.get('category') as string
                    const description = formData.get('description') as string
                    const rating = parseInt(formData.get('rating') as string) || 0
                    const location = formData.get('location') as string
                    const date = formData.get('date') as string
                    const isFavorite = formData.get('isFavorite') === 'on'

                    if (editingFood) {
                      editFood(editingFood.id, {
                        name,
                        category,
                        description,
                        rating,
                        location,
                        date,
                        isFavorite,
                        image: foodImage || undefined
                      })
                    } else {
                      addNewFood({
                        name,
                        category,
                        description,
                        rating,
                        location,
                        date,
                        isFavorite,
                        image: foodImage
                      })
                    }
                  }}
                  onPaste={(e) => {
                    // 处理粘贴图片
                    const items = e.clipboardData?.items
                    if (items) {
                      for (let i = 0; i < items.length; i++) {
                        if (items[i].type.indexOf('image') !== -1) {
                          const file = items[i].getAsFile()
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setFoodImage(event.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                          break
                        }
                      }
                    }
                  }}
                  className="p-6 space-y-4"
                >
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      美食名称
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={editingFood?.name}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                      placeholder="输入美食名称"
                    />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      美食分类
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      defaultValue={editingFood?.category}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                      placeholder="输入美食分类"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      品尝地点
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      defaultValue={editingFood?.location}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                      placeholder="输入品尝地点"
                    />
                  </div>
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      品尝日期
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      defaultValue={editingFood?.date}
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="rating" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      评分 (1-5)
                    </label>
                    <input
                      type="number"
                      id="rating"
                      name="rating"
                      defaultValue={editingFood?.rating || 5}
                      min="1"
                      max="5"
                      required
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                      placeholder="输入评分"
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      美食描述
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      defaultValue={editingFood?.description}
                      rows={3}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${
                        theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                      }`}
                      style={{
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                      placeholder="输入美食描述"
                    ></textarea>
                  </div>
                  {/* 美食图片 */}
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      美食图片
                    </label>
                    <div className="space-y-2">
                      {/* 图片预览 */}
                      {foodImage && (
                        <div className="relative w-full max-w-xs mx-auto">
                          <img 
                            src={foodImage} 
                            alt="美食图片" 
                            className="w-full h-full aspect-square object-cover rounded-lg border-2" 
                            style={{ borderColor: FOOD_CELL_COLORS.primary }}
                          />
                          <button
                            type="button"
                            onClick={() => setFoodImage('')}
                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        </div>
                      )}
                      
                      {/* 文件上传 */}
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        className={`w-full px-4 py-2 border rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'
                        }`}
                        style={{ borderColor: FOOD_CELL_COLORS.primary }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              setFoodImage(event.target?.result as string)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                      />
                      
                      {/* 粘贴提示 */}
                      <p className={`text-xs text-center ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        或者直接粘贴图片到页面
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFavorite"
                      name="isFavorite"
                      defaultChecked={editingFood?.isFavorite || false}
                      className="w-4 h-4 rounded focus:ring-2 focus:border-transparent"
                      style={{ 
                        color: FOOD_CELL_COLORS.primary,
                        borderColor: FOOD_CELL_COLORS.primary
                      }}
                    />
                    <label htmlFor="isFavorite" className="text-sm font-medium" style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
                      收藏为最爱
                    </label>
                  </div>
                  <div className="flex space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false)
                        setEditingFood(null)
                        setFoodImage('') // 清除图片状态
                      }}
                      className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                      style={{ 
                        borderColor: FOOD_CELL_COLORS.primary,
                        color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark,
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${FOOD_CELL_COLORS.primary}10`;
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
                        backgroundColor: FOOD_CELL_COLORS.primary,
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = FOOD_CELL_COLORS.secondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = FOOD_CELL_COLORS.primary;
                      }}
                    >
                      {editingFood ? '保存修改' : '添加美食'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="mt-16">
        <div className="h-8 bg-gradient-to-r from-[#F5CB76] via-[#F88B7C] to-[#197CBE] rounded-t-3xl shadow-md"></div>
        <div className="py-6 text-center" style={{ background: theme === 'dark' ? '#1f2937' : `${FOOD_CELL_COLORS.primary}20` }}>
          <p style={{ color: theme === 'dark' ? '#EAEEEC' : FOOD_CELL_COLORS.dark }}>
            美食细胞 • 品尝生活的味道 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}
