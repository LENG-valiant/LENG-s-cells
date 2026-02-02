'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/UI'
import { GraduationCap, Plus, Trash2, Edit, CheckCircle2, XCircle, RefreshCw, ArrowLeft, Clock, Calendar } from 'lucide-react'

interface LearningCellProps {
  onNavigate: (page: string) => void
}

interface Course {
  id: string
  title: string
  subject: string
  instructor: string
  startDate: string
  endDate: string
  status: 'ongoing' | 'completed' | 'planned'
  progress: number
  notes: string
}

// 学习细胞配色 - 与主页对应
const LEARNING_CELL_COLORS = {
  primary: '#F88B7C', // 粉色
  secondary: '#197CBE', // 蓝色
  accent: '#F5CB76', // 黄色
  light: '#EAEEEC', // 白色
  dark: '#197CBE', // 深蓝色
}

// 从本地存储获取课程数据
const getLocalCourses = (): Course[] => {
  try {
    const coursesStr = localStorage.getItem('personal_homepage_courses')
    return coursesStr ? JSON.parse(coursesStr) : []
  } catch (error) {
    console.error('获取本地课程数据失败:', error)
    return []
  }
}

// 保存课程数据到本地存储
const saveLocalCourses = (courses: Course[]): void => {
  try {
    localStorage.setItem('personal_homepage_courses', JSON.stringify(courses))
  } catch (error) {
    console.error('保存本地课程数据失败:', error)
  }
}

export default function LearningCell({ onNavigate }: LearningCellProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  // 从本地存储加载课程数据
  useEffect(() => {
    const loadCourses = () => {
      const localCourses = getLocalCourses()
      if (localCourses.length > 0) {
        setCourses(localCourses)
      } else {
        // 如果本地存储没有数据，使用默认数据
        const defaultCourses: Course[] = [
          {
            id: '1',
            title: 'React 进阶',
            subject: '前端开发',
            instructor: '张老师',
            startDate: '2026-01-01',
            endDate: '2026-03-01',
            status: 'ongoing',
            progress: 45,
            notes: '组件化开发，Hooks 深入理解'
          },
          {
            id: '2',
            title: 'TypeScript 基础',
            subject: '前端开发',
            instructor: '李老师',
            startDate: '2025-10-01',
            endDate: '2025-12-01',
            status: 'completed',
            progress: 100,
            notes: '类型系统，接口，泛型'
          },
          {
            id: '3',
            title: 'Node.js 后端开发',
            subject: '后端开发',
            instructor: '王老师',
            startDate: '2026-03-01',
            endDate: '2026-05-01',
            status: 'planned',
            progress: 0,
            notes: ''
          }
        ]
        setCourses(defaultCourses)
        saveLocalCourses(defaultCourses)
      }
    }

    loadCourses()
  }, [])

  // 当课程数据变化时，保存到本地存储
  useEffect(() => {
    if (courses.length > 0) {
      saveLocalCourses(courses)
    }
  }, [courses])

  const addNewCourse = (course: Omit<Course, 'id'>) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString()
    }
    setCourses([...courses, newCourse])
    setIsModalOpen(false)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const editCourse = (id: string, updates: Partial<Course>) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updates } : course
    ))
    setIsModalOpen(false)
    setEditingCourse(null)
    // 这里将来会实现数据同步到飞书多维表格
  }

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id))
    // 这里将来会实现数据同步到飞书多维表格
  }

  return (
    <div className="min-h-screen tech-background tech-grid tech-glow" style={{ background: `linear-gradient(to bottom, ${LEARNING_CELL_COLORS.primary}, ${LEARNING_CELL_COLORS.accent})` }}>
      {/* 头部装饰 */}
      <div className="h-8 rounded-b-3xl shadow-md" style={{ background: `linear-gradient(to right, ${LEARNING_CELL_COLORS.primary}, ${LEARNING_CELL_COLORS.accent}, ${LEARNING_CELL_COLORS.secondary})` }}></div>

      {/* 导航栏 */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border-2 shadow-sm hover:bg-[#F88B7C]/10 transition-colors"
          style={{ borderColor: LEARNING_CELL_COLORS.primary }}
        >
          <ArrowLeft size={20} style={{ color: LEARNING_CELL_COLORS.dark }} />
          <span className="font-medium" style={{ color: LEARNING_CELL_COLORS.dark }}>返回大脑</span>
        </button>

        {/* 标题 */}
        <div className="mt-8 text-center">
          <div className="relative inline-block">
            <div className="absolute -inset-2 opacity-50" style={{ background: LEARNING_CELL_COLORS.primary, borderRadius: '9999px' }}></div>
            <div className="relative bg-white rounded-full p-6 border-4 border-double shadow-lg" style={{ borderColor: LEARNING_CELL_COLORS.primary }}>
              <h1 className="text-4xl font-bold mb-2" style={{ color: LEARNING_CELL_COLORS.dark }}>
                学习细胞
              </h1>
              <p className="text-lg" style={{ color: LEARNING_CELL_COLORS.secondary }}>
                成长的阶梯，知识的积累
              </p>
            </div>
          </div>
        </div>

        {/* 课程列表 */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold relative" style={{ color: LEARNING_CELL_COLORS.dark }}>
              <span className="relative z-10">我的学习课程</span>
              <span className="absolute bottom-0 left-0 w-24 h-3 -z-0" style={{ background: LEARNING_CELL_COLORS.primary, opacity: 0.3 }}></span>
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 shadow-sm transition-colors"
              style={{ 
                background: 'rgba(255, 255, 255, 0.9)',
                borderColor: LEARNING_CELL_COLORS.primary,
                color: LEARNING_CELL_COLORS.dark
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${LEARNING_CELL_COLORS.primary}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              }}
            >
              <Plus size={20} style={{ color: LEARNING_CELL_COLORS.dark }} />
              <span className="font-medium">添加课程</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card 
                key={course.id}
                className="bg-white border-2 rounded-2xl shadow-md overflow-hidden"
                style={{ borderColor: LEARNING_CELL_COLORS.primary }}
              >
                {/* 课程头部 */}
                <div className="p-3" style={{ background: `${LEARNING_CELL_COLORS.primary}20` }}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold" style={{ color: LEARNING_CELL_COLORS.dark }}>{course.title}</h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ 
                      background: `${LEARNING_CELL_COLORS.primary}40`,
                      color: LEARNING_CELL_COLORS.dark
                    }}>
                      {course.status === 'ongoing' ? '进行中' : course.status === 'completed' ? '已完成' : '计划中'}
                    </span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                      background: `${LEARNING_CELL_COLORS.primary}40`,
                      color: LEARNING_CELL_COLORS.dark
                    }}>
                      {course.subject}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ 
                      background: `${LEARNING_CELL_COLORS.accent}40`,
                      color: LEARNING_CELL_COLORS.dark
                    }}>
                      {course.instructor}
                    </span>
                  </div>
                </div>

                {/* 课程内容 */}
                <div className="p-6">
                  {/* 学习进度 */}
                  {course.status === 'ongoing' && (
                    <div className="mb-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium" style={{ color: LEARNING_CELL_COLORS.dark }}>学习进度</span>
                        <span className="text-sm font-medium" style={{ color: LEARNING_CELL_COLORS.primary }}>{course.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div 
                          className="h-4 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${course.progress}%`,
                            background: LEARNING_CELL_COLORS.primary
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* 课程时间 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={16} style={{ color: LEARNING_CELL_COLORS.primary }} />
                      <span className="text-sm font-medium" style={{ color: LEARNING_CELL_COLORS.dark }}>课程时间</span>
                    </div>
                    <p className="text-sm ml-6" style={{ color: LEARNING_CELL_COLORS.secondary }}>
                      {course.startDate} 至 {course.endDate}
                    </p>
                  </div>

                  {/* 课程笔记 */}
                  {course.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2" style={{ color: LEARNING_CELL_COLORS.dark }}>课程笔记</h4>
                      <p className="text-sm p-3 rounded-lg border" style={{ 
                        color: LEARNING_CELL_COLORS.secondary,
                        background: `${LEARNING_CELL_COLORS.primary}10`,
                        borderColor: `${LEARNING_CELL_COLORS.primary}30`
                      }}>
                        {course.notes}
                      </p>
                    </div>
                  )}

                  {/* 操作按钮 */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => {
                        setEditingCourse(course)
                        setIsModalOpen(true)
                      }}
                      className="flex items-center gap-1 px-3 py-1 rounded-full border text-sm font-medium transition-colors"
                      style={{ 
                        background: `${LEARNING_CELL_COLORS.primary}20`,
                        borderColor: LEARNING_CELL_COLORS.primary,
                        color: LEARNING_CELL_COLORS.dark
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${LEARNING_CELL_COLORS.primary}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = `${LEARNING_CELL_COLORS.primary}20`;
                      }}
                    >
                      <Edit size={16} />
                      <span>编辑</span>
                    </button>
                    <button
                      onClick={() => deleteCourse(course.id)}
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

        {/* 添加/编辑课程模态框 */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border-4 border-double" style={{ borderColor: LEARNING_CELL_COLORS.primary }}>
              <div className="p-6 border-b" style={{ borderColor: `${LEARNING_CELL_COLORS.primary}30` }}>
                <h3 className="text-xl font-semibold" style={{ color: LEARNING_CELL_COLORS.dark }}>
                  {editingCourse ? '编辑课程' : '添加新课程'}
                </h3>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const title = formData.get('title') as string
                  const subject = formData.get('subject') as string
                  const instructor = formData.get('instructor') as string
                  const startDate = formData.get('startDate') as string
                  const endDate = formData.get('endDate') as string
                  const status = formData.get('status') as 'ongoing' | 'completed' | 'planned'
                  const progress = parseInt(formData.get('progress') as string) || 0
                  const notes = formData.get('notes') as string

                  if (editingCourse) {
                    editCourse(editingCourse.id, {
                      title,
                      subject,
                      instructor,
                      startDate,
                      endDate,
                      status,
                      progress,
                      notes
                    })
                  } else {
                    addNewCourse({
                      title,
                      subject,
                      instructor,
                      startDate,
                      endDate,
                      status,
                      progress,
                      notes
                    })
                  }
                }}
                className="p-6 space-y-4"
              >
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    课程名称
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={editingCourse?.title}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                    placeholder="输入课程名称"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    学科类别
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    defaultValue={editingCourse?.subject}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                    placeholder="输入学科类别"
                  />
                </div>
                <div>
                  <label htmlFor="instructor" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    讲师
                  </label>
                  <input
                    type="text"
                    id="instructor"
                    name="instructor"
                    defaultValue={editingCourse?.instructor}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                    placeholder="输入讲师姓名"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                      开始日期
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      defaultValue={editingCourse?.startDate}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ 
                        borderColor: LEARNING_CELL_COLORS.primary
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                      结束日期
                    </label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      defaultValue={editingCourse?.endDate}
                      required
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                      style={{ 
                        borderColor: LEARNING_CELL_COLORS.primary
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    课程状态
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={editingCourse?.status || 'planned'}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                  >
                    <option value="planned">计划中</option>
                    <option value="ongoing">进行中</option>
                    <option value="completed">已完成</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="progress" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    学习进度 (%)
                  </label>
                  <input
                    type="number"
                    id="progress"
                    name="progress"
                    defaultValue={editingCourse?.progress || 0}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                    placeholder="输入学习进度"
                  />
                </div>
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium mb-1" style={{ color: LEARNING_CELL_COLORS.dark }}>
                    课程笔记
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    defaultValue={editingCourse?.notes}
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:border-transparent"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary
                    }}
                    placeholder="输入课程笔记"
                  ></textarea>
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false)
                      setEditingCourse(null)
                    }}
                    className="flex-1 px-4 py-2 border rounded-lg transition-colors"
                    style={{ 
                      borderColor: LEARNING_CELL_COLORS.primary,
                      color: LEARNING_CELL_COLORS.dark,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${LEARNING_CELL_COLORS.primary}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                    }}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: LEARNING_CELL_COLORS.primary,
                      color: 'white'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = LEARNING_CELL_COLORS.secondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = LEARNING_CELL_COLORS.primary;
                    }}
                  >
                    {editingCourse ? '保存修改' : '添加课程'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="mt-16">
        <div className="h-8 rounded-t-3xl shadow-md" style={{ background: `linear-gradient(to right, ${LEARNING_CELL_COLORS.primary}, ${LEARNING_CELL_COLORS.accent}, ${LEARNING_CELL_COLORS.secondary})` }}></div>
        <div className="py-6 text-center" style={{ background: `${LEARNING_CELL_COLORS.primary}20` }}>
          <p style={{ color: LEARNING_CELL_COLORS.dark }}>
            学习细胞 • 成长的阶梯 • {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  )
}