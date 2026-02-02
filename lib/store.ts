import { AITool, PublicAccount, Article, Book, Note, UserPreferences, Hobby, HobbyContent, Reminder, Encouragement } from '@/types'

const STORAGE_KEYS = {
  AI_TOOLS: 'personal_homepage_ai_tools',
  ACCOUNTS: 'personal_homepage_accounts',
  ARTICLES: 'personal_homepage_articles',
  BOOKS: 'personal_homepage_books',
  NOTES: 'personal_homepage_notes',
  PREFERENCES: 'personal_homepage_preferences',
  HOBBIES: 'personal_homepage_hobbies',
  HOBBY_CONTENTS: 'personal_homepage_hobby_contents',
  REMINDERS: 'personal_homepage_reminders',
  ENCOURAGEMENTS: 'personal_homepage_encouragements',
}

const initialAITools: AITool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'OpenAI开发的大型语言模型对话系统',
    category: '对话助手',
    tags: ['对话', '写作', '编程', '翻译'],
    url: 'https://chat.openai.com',
    icon: '🤖',
    isFavorite: true,
    usageCount: 150,
    lastUsed: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Claude',
    description: 'Anthropic开发的AI助手，擅长长文本分析',
    category: '对话助手',
    tags: ['对话', '写作', '分析'],
    url: 'https://claude.ai',
    icon: '🧠',
    isFavorite: true,
    usageCount: 89,
    lastUsed: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Midjourney',
    description: '强大的AI图像生成工具',
    category: '图像生成',
    tags: ['图像', '设计', '艺术'],
    url: 'https://midjourney.com',
    icon: '🎨',
    isFavorite: false,
    usageCount: 45,
    lastUsed: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Stable Diffusion',
    description: '开源的AI图像生成模型',
    category: '图像生成',
    tags: ['图像', '设计', '开源'],
    url: 'https://stability.ai',
    icon: '🌈',
    isFavorite: false,
    usageCount: 32,
    lastUsed: new Date().toISOString()
  },
  {
    id: '5',
    name: 'GitHub Copilot',
    description: 'AI编程助手，与IDE深度集成',
    category: '编程辅助',
    tags: ['编程', '代码', 'IDE'],
    url: 'https://github.com/features/copilot',
    icon: '💻',
    isFavorite: true,
    usageCount: 200,
    lastUsed: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Cursor',
    description: 'AI优先的代码编辑器',
    category: '编程辅助',
    tags: ['编程', '代码', '编辑器'],
    url: 'https://cursor.sh',
    icon: '📝',
    isFavorite: false,
    usageCount: 78,
    lastUsed: new Date().toISOString()
  },
  {
    id: '7',
    name: 'Notion AI',
    description: 'Notion内置的AI写作和摘要助手',
    category: '写作辅助',
    tags: ['写作', '笔记', '摘要'],
    url: 'https://notion.ai',
    icon: '📓',
    isFavorite: false,
    usageCount: 56,
    lastUsed: new Date().toISOString()
  },
  {
    id: '8',
    name: 'Perplexity',
    description: 'AI搜索引擎，提供实时信息',
    category: '信息检索',
    tags: ['搜索', '研究', '问答'],
    url: 'https://perplexity.ai',
    icon: '🔍',
    isFavorite: true,
    usageCount: 67,
    lastUsed: new Date().toISOString()
  }
]

const initialAccounts: PublicAccount[] = [
  {
    id: '1',
    name: '即刻技术圈',
    description: '分享互联网产品、设计、技术相关内容',
    avatar: '⚡',
    articles: [],
    isFavorite: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: '产品经理',
    description: '产品设计和产品经理成长相关内容',
    avatar: '📦',
    articles: [],
    isFavorite: true,
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'AI科技大爆炸',
    description: 'AI领域最新资讯和技术分享',
    avatar: '🤖',
    articles: [],
    isFavorite: false,
    lastUpdated: new Date().toISOString()
  }
]

const initialArticles: Article[] = [
  {
    id: '1',
    title: '2024年AI工具全景图：从对话到创作的全方位指南',
    url: '#',
    source: '即刻技术圈',
    publishedAt: new Date().toISOString(),
    summary: '本文全面介绍了2024年最优秀的AI工具，涵盖对话、写作、图像生成、编程等多个领域。',
    isRead: false,
    isFavorite: true,
    tags: ['AI', '工具', '指南']
  },
  {
    id: '2',
    title: '产品设计中的用户旅程地图绘制方法',
    url: '#',
    source: '产品经理',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    summary: '详细讲解如何绘制用户旅程地图，帮助产品团队更好地理解用户体验。',
    isRead: true,
    isFavorite: false,
    tags: ['产品设计', 'UX', '方法论']
  },
  {
    id: '3',
    title: 'Claude 3.5 vs GPT-4：谁更强？',
    url: '#',
    source: 'AI科技大爆炸',
    publishedAt: new Date(Date.now() - 172800000).toISOString(),
    summary: '对比分析最新的大型语言模型，帮你选择最适合的AI助手。',
    isRead: false,
    isFavorite: false,
    tags: ['AI', '对比', 'Claude', 'GPT']
  }
]

const initialBooks: Book[] = [
  {
    id: '1',
    title: '产品思维30讲',
    author: '刘润',
    cover: '📚',
    status: 'completed',
    rating: 5,
    notes: [],
    category: '产品',
    startDate: '2024-01-01',
    finishDate: '2024-01-15'
  },
  {
    id: '2',
    title: '深度工作',
    author: 'Cal Newport',
    cover: '🎯',
    status: 'reading',
    rating: 0,
    notes: [],
    category: '自我提升',
    startDate: '2024-02-01'
  },
  {
    id: '3',
    title: '设计心理学',
    author: 'Don Norman',
    cover: '🧠',
    status: 'wantToRead',
    rating: 0,
    notes: [],
    category: '设计'
  }
]

const initialHobbies: Hobby[] = [
  {
    id: '1',
    name: '摄影',
    description: '记录生活美好瞬间，学习摄影技巧',
    category: '艺术',
    icon: '📸',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: '跑步',
    description: '坚持跑步，保持身体健康',
    category: '运动',
    icon: '🏃',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: '编程',
    description: '学习新的编程技术和框架',
    category: '技术',
    icon: '💻',
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '4',
    name: '阅读',
    description: '阅读各类书籍，拓宽知识面',
    category: '学习',
    icon: '📚',
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const initialHobbyContents: HobbyContent[] = [
  {
    id: '1',
    hobbyId: '1',
    title: '摄影构图技巧',
    content: '三分法则、引导线、框架构图等摄影构图技巧详解',
    url: '#',
    tags: ['摄影', '构图', '技巧'],
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    hobbyId: '2',
    title: '跑步前的热身运动',
    content: '5分钟跑步热身动作，减少运动伤害',
    url: '#',
    tags: ['跑步', '热身', '运动'],
    isFavorite: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    hobbyId: '3',
    title: 'Next.js 14新特性',
    content: 'Next.js 14的App Router和Server Components详解',
    url: '#',
    tags: ['编程', 'Next.js', 'React'],
    isFavorite: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const initialReminders: Reminder[] = [
  {
    id: '1',
    title: '学习时间',
    content: '该开始今天的学习了！',
    time: '09:00',
    isEnabled: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: '休息一下',
    content: '记得起来活动活动，保护眼睛！',
    time: '11:00',
    isEnabled: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: '阅读时间',
    content: '每天阅读30分钟，坚持下去！',
    time: '20:00',
    isEnabled: true,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

const initialEncouragements: Encouragement[] = [
  {
    id: '1',
    content: '今天也要加油呀！💪',
    category: 'motivation',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    content: '每一次努力都不会白费！✨',
    category: 'study',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    content: '保持专注，你会收获更多！🎯',
    category: 'work',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    content: '生活因努力而精彩！🌈',
    category: 'life',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    content: '相信自己，你能行！🌟',
    category: 'motivation',
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    content: '学习是一个不断成长的过程！📚',
    category: 'study',
    createdAt: new Date().toISOString()
  }
]

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

export function getAITools(): AITool[] {
  return getFromStorage<AITool[]>(STORAGE_KEYS.AI_TOOLS, initialAITools)
}

export function saveAITools(tools: AITool[]): void {
  saveToStorage(STORAGE_KEYS.AI_TOOLS, tools)
}

export function getAccounts(): PublicAccount[] {
  return getFromStorage<PublicAccount[]>(STORAGE_KEYS.ACCOUNTS, initialAccounts)
}

export function saveAccounts(accounts: PublicAccount[]): void {
  saveToStorage(STORAGE_KEYS.ACCOUNTS, accounts)
}

export function getArticles(): Article[] {
  return getFromStorage<Article[]>(STORAGE_KEYS.ARTICLES, initialArticles)
}

export function saveArticles(articles: Article[]): void {
  saveToStorage(STORAGE_KEYS.ARTICLES, articles)
}

export function getBooks(): Book[] {
  return getFromStorage<Book[]>(STORAGE_KEYS.BOOKS, initialBooks)
}

export function saveBooks(books: Book[]): void {
  saveToStorage(STORAGE_KEYS.BOOKS, books)
}

export function getNotes(): Note[] {
  return getFromStorage<Note[]>(STORAGE_KEYS.NOTES, [])
}

export function saveNotes(notes: Note[]): void {
  saveToStorage(STORAGE_KEYS.NOTES, notes)
}

export function getHobbies(): Hobby[] {
  return getFromStorage<Hobby[]>(STORAGE_KEYS.HOBBIES, initialHobbies)
}

export function saveHobbies(hobbies: Hobby[]): void {
  saveToStorage(STORAGE_KEYS.HOBBIES, hobbies)
}

export function getHobbyContents(): HobbyContent[] {
  return getFromStorage<HobbyContent[]>(STORAGE_KEYS.HOBBY_CONTENTS, initialHobbyContents)
}

export function saveHobbyContents(contents: HobbyContent[]): void {
  saveToStorage(STORAGE_KEYS.HOBBY_CONTENTS, contents)
}

export function getPreferences(): UserPreferences {
  return getFromStorage<UserPreferences>(STORAGE_KEYS.PREFERENCES, {
    theme: 'light',
    defaultCategory: 'all',
    showNotifications: true,
    enableStudyReminders: true,
    reminderTime: '09:00'
  })
}

export function savePreferences(preferences: UserPreferences): void {
  saveToStorage(STORAGE_KEYS.PREFERENCES, preferences)
}

export function getReminders(): Reminder[] {
  return getFromStorage<Reminder[]>(STORAGE_KEYS.REMINDERS, initialReminders)
}

export function saveReminders(reminders: Reminder[]): void {
  saveToStorage(STORAGE_KEYS.REMINDERS, reminders)
}

export function addReminder(reminder: Reminder): void {
  const reminders = getReminders()
  saveReminders([...reminders, reminder])
}

export function updateReminder(id: string, updates: Partial<Reminder>): void {
  const reminders = getReminders()
  const updatedReminders = reminders.map(r => r.id === id ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r)
  saveReminders(updatedReminders)
}

export function deleteReminder(id: string): void {
  const reminders = getReminders()
  saveReminders(reminders.filter(r => r.id !== id))
}

export function getEncouragements(): Encouragement[] {
  return getFromStorage<Encouragement[]>(STORAGE_KEYS.ENCOURAGEMENTS, initialEncouragements)
}

export function saveEncouragements(encouragements: Encouragement[]): void {
  saveToStorage(STORAGE_KEYS.ENCOURAGEMENTS, encouragements)
}

export function addEncouragement(encouragement: Encouragement): void {
  const encouragements = getEncouragements()
  saveEncouragements([...encouragements, encouragement])
}

export function getRandomEncouragement(category?: string): Encouragement {
  const encouragements = getEncouragements()
  const filtered = category ? encouragements.filter(e => e.category === category) : encouragements
  return filtered[Math.floor(Math.random() * filtered.length)]
}

export function getStats() {
  const tools = getAITools()
  const accounts = getAccounts()
  const articles = getArticles()
  const books = getBooks()
  const reminders = getReminders()
  const hobbies = getHobbies()
  const hobbyContents = getHobbyContents()
  const notes = getNotes()

  // AI工具统计
  const mostUsedTools = [...tools].sort((a, b) => b.usageCount - a.usageCount).slice(0, 5)
  const toolsByCategory = tools.reduce((acc, tool) => {
    acc[tool.category] = (acc[tool.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 文章统计
  const readArticles = articles.filter(a => a.isRead).length
  const favoriteArticles = articles.filter(a => a.isFavorite).length
  const articlesBySource = articles.reduce((acc, article) => {
    acc[article.source] = (acc[article.source] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const recentArticles = [...articles].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5)

  // 书籍统计
  const readingBooks = books.filter(b => b.status === 'reading').length
  const wantToReadBooks = books.filter(b => b.status === 'wantToRead').length
  const favoriteBooks = books.filter(b => b.rating > 4).length
  const ratedBooks = books.filter(b => b.rating > 0)
  const averageBookRating = ratedBooks.length > 0 
    ? parseFloat((ratedBooks.reduce((sum, book) => sum + book.rating, 0) / ratedBooks.length).toFixed(1))
    : 0

  // 提醒统计
  const enabledReminders = reminders.filter(r => r.isEnabled).length
  const completedReminders = reminders.filter(r => r.isCompleted).length

  // 兴趣爱好统计
  const hobbiesByCategory = hobbies.reduce((acc, hobby) => {
    acc[hobby.category] = (acc[hobby.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // 整体概览
  const totalResources = tools.length + articles.length + books.length + hobbies.length
  const favoriteResources = tools.filter(t => t.isFavorite).length + 
                           articles.filter(a => a.isFavorite).length + 
                           books.filter(b => b.rating > 4).length + 
                           hobbies.filter(h => h.isFavorite).length

  // 最近活动
  const recentActivity: Array<{ type: string; item: any; date: string }> = []
  
  // 添加最近使用的工具
  tools.sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
    .slice(0, 3)
    .forEach(tool => {
      recentActivity.push({ type: 'tool', item: tool, date: tool.lastUsed })
    })

  // 添加最近发布的文章
  articles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 3)
    .forEach(article => {
      recentActivity.push({ type: 'article', item: article, date: article.publishedAt })
    })

  // 添加最近创建的提醒
  reminders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)
    .forEach(reminder => {
      recentActivity.push({ type: 'reminder', item: reminder, date: reminder.createdAt })
    })

  // 按时间排序
  recentActivity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return {
    // AI工具统计
    totalTools: tools.length,
    favoriteTools: tools.filter(t => t.isFavorite).length,
    mostUsedTools,
    toolsByCategory,
    
    // 文章统计
    totalArticles: articles.length,
    unreadArticles: articles.filter(a => !a.isRead).length,
    readArticles,
    favoriteArticles,
    articlesBySource,
    recentArticles,
    
    // 书籍统计
    totalBooks: books.length,
    readingBooks,
    completedBooks: books.filter(b => b.status === 'completed').length,
    wantToReadBooks,
    favoriteBooks,
    averageBookRating,
    totalNotes: notes.length,
    
    // 提醒统计
    totalReminders: reminders.length,
    enabledReminders,
    completedReminders,
    enabledRemindersCount: enabledReminders,
    
    // 兴趣爱好统计
    totalHobbies: hobbies.length,
    favoriteHobbies: hobbies.filter(h => h.isFavorite).length,
    totalHobbyContents: hobbyContents.length,
    hobbiesByCategory,
    
    // 整体概览
    totalResources,
    favoriteResources,
    recentActivity: recentActivity.slice(0, 8)
  }
}

// 数据备份和恢复功能
export interface BackupData {
  version: string
  timestamp: string
  data: {
    aiTools: AITool[]
    accounts: PublicAccount[]
    articles: Article[]
    books: Book[]
    notes: Note[]
    preferences: UserPreferences
    hobbies: Hobby[]
    hobbyContents: HobbyContent[]
    reminders: Reminder[]
    encouragements: Encouragement[]
  }
}

// 导出数据为JSON文件
export function exportData(): void {
  const data: BackupData = {
    version: '1.0',
    timestamp: new Date().toISOString(),
    data: {
      aiTools: getAITools(),
      accounts: getAccounts(),
      articles: getArticles(),
      books: getBooks(),
      notes: getNotes(),
      preferences: getPreferences(),
      hobbies: getHobbies(),
      hobbyContents: getHobbyContents(),
      reminders: getReminders(),
      encouragements: getEncouragements()
    }
  }

  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `personal-homepage-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// 从JSON文件导入数据
export function importData(jsonStr: string): boolean {
  try {
    const data: BackupData = JSON.parse(jsonStr)
    
    // 保存所有数据到localStorage
    saveAITools(data.data.aiTools)
    saveAccounts(data.data.accounts)
    saveArticles(data.data.articles)
    saveBooks(data.data.books)
    saveNotes(data.data.notes)
    savePreferences(data.data.preferences)
    saveHobbies(data.data.hobbies)
    saveHobbyContents(data.data.hobbyContents)
    saveReminders(data.data.reminders)
    saveEncouragements(data.data.encouragements)

    // 应用主题
    document.documentElement.classList.toggle('dark', data.data.preferences.theme === 'dark')

    return true
  } catch (e) {
    console.error('Failed to import data:', e)
    return false
  }
}
