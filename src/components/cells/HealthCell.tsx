'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { HeartPulse, Plus, Trash2, Edit, CheckCircle2, XCircle, RefreshCw, ArrowLeft, Activity, Calendar, Clock, Target } from 'lucide-react'
import { getPreferences } from '@/lib/store'

interface HealthCellProps {
  onNavigate: (page: string) => void
}

interface HealthRecord {
  id: string
  type: 'exercise' | 'diet' | 'sleep' | 'mood'
  title: string
  description: string
  date: string
  duration?: number // 分钟
  calories?: number
  moodLevel?: 1 | 2 | 3 | 4 | 5
  notes: string
}

// 健康细胞配色 - 与主页对应
const HEALTH_CELL_COLORS = {
  primary: '#F1BBC9', // 芭蕾粉
  secondary: '#197CBE', // 蓝色
  accent: '#F5CB76', // 黄色
  light: '#EAEEEC', // 白色
  dark: '#197CBE', // 深蓝色
}

// 从本地存储获取健康记录数据
const getLocalHealthRecords = (): HealthRecord[] => {
  try {
    const recordsStr = localStorage.getItem('personal_homepage_health_records')
    return recordsStr ? JSON.parse(recordsStr) : []
  } catch (error) {
    console.error('获取本地健康记录数据失败:', error)
    return []
  }
}

// 保存健康记录数据到本地存储
const saveLocalHealthRecords = (records: HealthRecord[]): void => {
  try {
    localStorage.setItem('personal_homepage_health_records', JSON.stringify(records))
  } catch (error) {
    console.error('保存本地健康记录数据失败:', error)
  }
}

export default function HealthCell({ onNavigate }: HealthCellProps) {
  const [records, setRecords] = useState<HealthRecord[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState<HealthRecord | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [formData, setFormData] = useState<{
    type: 'exercise' | 'diet' | 'sleep' | 'mood'
    title: string
    description: string
    date: string
    duration: string
    calories: string
    moodLevel: string
    notes: string
  }>({
    type: 'exercise',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    calories: '',
    moodLevel: '',
    notes: ''
  })

  // 初始化主题
  useEffect(() => {
    const preferences = getPreferences()
    setTheme(preferences.theme)
  }, [])

  // 从本地存储加载健康记录数据
  useEffect(() => {
    const loadRecords = () => {
      const localRecords = getLocalHealthRecords()
      if (localRecords.length > 0) {
        setRecords(localRecords)
      } else {
        // 如果本地存储没有数据，使用默认数据
        const defaultRecords: HealthRecord[] = [
          {
            id: '1',
            type: 'exercise',
            title: '晨跑',
            description: '户外跑步',
            date: '2026-01-27',
            duration: 30,
            calories: 250,
            notes: '感觉很好，充满活力'
          },
          {
            id: '2',
            type: 'sleep',
            title: '夜间睡眠',
            description: '深度睡眠',
            date: '2026-01-26',
            duration: 480,
            notes: '睡眠质量良好'
          },
          {
            id: '3',
            type: 'mood',
            title: '心情记录',
            description: '日常心情',
            date: '2026-01-27',
            moodLevel: 4,
            notes: '今天很开心，完成了很多任务'
          }
        ]
        setRecords(defaultRecords)
        saveLocalHealthRecords(defaultRecords)
      }
    }

    loadRecords()
  }, [])

  // 当健康记录数据变化时，保存到本地存储
  useEffect(() => {
    if (records.length > 0) {
      saveLocalHealthRecords(records)
    }
  }, [records])

  // 当编辑记录或模态框打开时，更新表单数据
  useEffect(() => {
    if (isModalOpen) {
      if (editingRecord) {
        setFormData({
          type: editingRecord.type,
          title: editingRecord.title,
          description: editingRecord.description,
          date: editingRecord.date,
          duration: editingRecord.duration?.toString() || '',
          calories: editingRecord.calories?.toString() || '',
          moodLevel: editingRecord.moodLevel?.toString() || '',
          notes: editingRecord.notes
        })
      } else {
        // 重置表单
        setFormData({
          type: 'exercise',
          title: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          duration: '',
          calories: '',
          moodLevel: '',
          notes: ''
        })
      }
    }
  }, [isModalOpen, editingRecord])

  const addNewRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...record,
      id: Date.now().toString()
    }
    setRecords([...records, newRecord])
    setIsModalOpen(false)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const editRecord = (id: string, updates: Partial<HealthRecord>) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, ...updates } : record
    ))
    setIsModalOpen(false)
    setEditingRecord(null)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const deleteRecord = (id: string) => {
    setRecords(records.filter(record => record.id !== id))
    // 这里将来会实现数据同步到飞书多维表格
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise':
        return <Activity size={16} style={{ color: HEALTH_CELL_COLORS.primary }} />
      case 'diet':
        return <Target size={16} style={{ color: HEALTH_CELL_COLORS.accent }} />
      case 'sleep':
        return <Clock size={16} style={{ color: HEALTH_CELL_COLORS.secondary }} />
      case 'mood':
        return <HeartPulse size={16} style={{ color: '#F88B7C' }} />
      default:
        return <Activity size={16} style={{ color: HEALTH_CELL_COLORS.dark }} />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exercise':
        return { 
          background: `${HEALTH_CELL_COLORS.primary}20`,
          borderColor: HEALTH_CELL_COLORS.primary
        }
      case 'diet':
        return { 
          background: `${HEALTH_CELL_COLORS.accent}20`,
          borderColor: HEALTH_CELL_COLORS.accent
        }
      case 'sleep':
        return { 
          background: `${HEALTH_CELL_COLORS.secondary}20`,
          borderColor: HEALTH_CELL_COLORS.secondary
        }
      case 'mood':
        return { 
          background: '#F88B7C20',
          borderColor: '#F88B7C'
        }
      default:
        return { 
          background: `${HEALTH_CELL_COLORS.dark}20`,
          borderColor: HEALTH_CELL_COLORS.dark
        }
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exercise':
        return '运动'
      case 'diet':
        return '饮食'
      case 'sleep':
        return '睡眠'
      case 'mood':
        return '心情'
      default:
        return '其他'
    }
  }

  return (
    <div className="min-h-screen tech-background tech-grid tech-glow overflow-auto" style={{ background: `linear-gradient(to bottom, ${HEALTH_CELL_COLORS.primary}, ${HEALTH_CELL_COLORS.secondary})` }}>
      {/* 头部装饰 */}
      <div className="h-8 rounded-b-3xl shadow-md" style={{ background: `linear-gradient(to right, ${HEALTH_CELL_COLORS.primary}, ${HEALTH_CELL_COLORS.secondary}, ${HEALTH_CELL_COLORS.accent})` }}></div>

      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 shadow-sm hover:bg-[#59A3CF]/10 transition-colors"
          style={{ borderColor: HEALTH_CELL_COLORS.primary }}
        >
          <ArrowLeft size={20} style={{ color: HEALTH_CELL_COLORS.dark }} />
          <span className="font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>返回大脑</span>
        </button>

        {/* 标题 */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 opacity-50" style={{ background: HEALTH_CELL_COLORS.primary, borderRadius: '9999px' }}></div>
            <div className="relative bg-white rounded-full p-6 border-4 border-double shadow-lg" style={{ borderColor: HEALTH_CELL_COLORS.primary }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: HEALTH_CELL_COLORS.dark }}>
                健康细胞
              </h1>
              <p className="text-lg" style={{ color: HEALTH_CELL_COLORS.secondary }}>
                身体是革命的本钱，记录健康状态
              </p>
            </div>
          </div>
        </div>

        {/* 健康记录列表 */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold relative" style={{ color: HEALTH_CELL_COLORS.dark }}>
              <span className="relative z-10">我的健康记录</span>
              <span className="absolute bottom-0 left-0 w-24 h-3 -z-0" style={{ background: HEALTH_CELL_COLORS.primary, opacity: 0.3 }}></span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-colors"
              style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                borderColor: HEALTH_CELL_COLORS.primary,
                color: HEALTH_CELL_COLORS.dark
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${HEALTH_CELL_COLORS.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <Plus size={20} style={{ color: HEALTH_CELL_COLORS.dark }} />
              <span className="font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>添加记录</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {records.map((record) => (
              <Card 
              key={record.id}
              className="bg-white border-2 rounded-2xl shadow-md overflow-hidden"
              style={{ borderColor: getTypeColor(record.type).borderColor }}
            >
              {/* 记录头部 */}
              <div style={getTypeColor(record.type)}>
                <div className="flex justify-between items-center p-3">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(record.type)}
                    <h3 className="text-xl font-bold" style={{ color: HEALTH_CELL_COLORS.dark }}>{record.title}</h3>
                  </div>
                  <span className="px-3 py-1 rounded-full text-sm font-medium" style={getTypeColor(record.type)}>
                    {getTypeLabel(record.type)}
                  </span>
                </div>
                <div className="flex gap-2 px-3 pb-3">
                  <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>
                    {record.description}
                  </span>
                  <span className="px-2 py-1 bg-white/80 rounded-full text-xs font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>
                    {record.date}
                  </span>
                </div>
              </div>

                {/* 记录内容 */}
                <div className="p-6">
                  {/* 记录详情 */}
                  {(record.duration || record.calories || record.moodLevel) && (
                    <div className="mb-4 space-y-2">
                      {record.duration && (
                        <div className="flex items-center gap-2">
                          <Clock size={16} style={{ color: HEALTH_CELL_COLORS.primary }} />
                          <span className="text-sm font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>时长：{record.duration} 分钟</span>
                        </div>
                      )}
                      {record.calories && (
                        <div className="flex items-center gap-2">
                          <Activity size={16} style={{ color: HEALTH_CELL_COLORS.primary }} />
                          <span className="text-sm font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>卡路里：{record.calories} kcal</span>
                        </div>
                      )}
                      {record.moodLevel && (
                        <div className="flex items-center gap-2">
                          <HeartPulse size={16} style={{ color: HEALTH_CELL_COLORS.primary }} />
                          <span className="text-sm font-medium" style={{ color: HEALTH_CELL_COLORS.dark }}>心情指数：{record.moodLevel}/5</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 记录笔记 */}
                  {record.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2" style={{ color: HEALTH_CELL_COLORS.dark }}>记录笔记</h4>
                      <p className="text-sm p-3 rounded-lg border" style={{ 
                        color: HEALTH_CELL_COLORS.secondary,
                        background: `${HEALTH_CELL_COLORS.primary}10`,
                        borderColor: `${HEALTH_CELL_COLORS.primary}30`
                      }}>
                        {record.notes}
                      </p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setEditingRecord(record)
                        setIsModalOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border-2 text-sm font-medium transition-colors"
                      style={{ 
                        ...getTypeColor(record.type),
                        color: HEALTH_CELL_COLORS.dark
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = getTypeColor(record.type).background;
                      }}
                    >
                      <Edit size={16} />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => deleteRecord(record.id)}
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

        {/* 添加/编辑记录模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="rounded-2xl shadow-xl max-w-md w-full border-4 border-double" style={{ 
              borderColor: HEALTH_CELL_COLORS.primary, 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column',
              backgroundColor: theme === 'dark' ? '#1f2937' : 'white'
            }}>
              <div className="p-6 border-b" style={{ borderColor: `${HEALTH_CELL_COLORS.primary}30` }}>
                <h3 className="text-xl font-semibold" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                  {editingRecord ? '编辑健康记录' : '添加新健康记录'}
                </h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const {
                    type,
                    title,
                    description,
                    date,
                    duration,
                    calories,
                    moodLevel,
                    notes
                  } = formData

                  const recordData = {
                    type,
                    title,
                    description,
                    date,
                    duration: duration ? parseInt(duration) : undefined,
                    calories: calories ? parseInt(calories) : undefined,
                    moodLevel: moodLevel ? parseInt(moodLevel) as 1 | 2 | 3 | 4 | 5 : undefined,
                    notes
                  }

                  if (editingRecord) {
                    editRecord(editingRecord.id, recordData)
                  } else {
                    addNewRecord(recordData)
                  }
                }}
                className="p-6 space-y-4 overflow-y-auto flex-grow"
                style={{ maxHeight: 'calc(90vh - 120px)' }}
              >
                <div>
                  <label htmlFor="type" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    记录类型
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'exercise' | 'diet' | 'sleep' | 'mood' })}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                  >
                    <option value="exercise">运动</option>
                    <option value="diet">饮食</option>
                    <option value="sleep">睡眠</option>
                    <option value="mood">心情</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    记录标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入记录标题"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    记录描述
                  </label>
                  <input
                    type="text"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入记录描述"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    记录日期
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    时长 (分钟) (可选)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入时长"
                  />
                </div>
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    卡路里 (kcal) (可选)
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    value={formData.calories}
                    onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                    min="0"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入卡路里"
                  />
                </div>
                <div>
                  <label htmlFor="moodLevel" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    心情指数 (1-5) (可选)
                  </label>
                  <input
                    type="number"
                    id="moodLevel"
                    name="moodLevel"
                    value={formData.moodLevel}
                    onChange={(e) => setFormData({ ...formData, moodLevel: e.target.value })}
                    min="1"
                    max="5"
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入心情指数"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1" style={{ color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark }}>
                    记录笔记
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white'}`}
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary
                    }}
                    placeholder="输入记录笔记"
                  ></textarea>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingRecord(null)
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: HEALTH_CELL_COLORS.primary,
                      color: theme === 'dark' ? '#EAEEEC' : HEALTH_CELL_COLORS.dark,
                      backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.9)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${HEALTH_CELL_COLORS.primary}10`;
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
                      backgroundColor: HEALTH_CELL_COLORS.primary,
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = HEALTH_CELL_COLORS.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = HEALTH_CELL_COLORS.primary;
                    }}
                  >
                    {editingRecord ? '保存修改' : '添加记录'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="mt-16">
        <div className="h-8 rounded-t-3xl shadow-md" style={{ background: `linear-gradient(to right, ${HEALTH_CELL_COLORS.primary}, ${HEALTH_CELL_COLORS.secondary}, ${HEALTH_CELL_COLORS.accent})` }}></div>
        <div className="py-6 text-center" style={{ background: `${HEALTH_CELL_COLORS.primary}20` }}>
          <p style={{ color: HEALTH_CELL_COLORS.dark }}>
            健康细胞 • 身体是革命的本钱 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}