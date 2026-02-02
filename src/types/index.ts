export interface AITool {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  url: string
  icon: string
  isFavorite: boolean
  usageCount: number
  lastUsed: string
}

export interface PublicAccount {
  id: string
  name: string
  description: string
  avatar: string
  articles: Article[]
  isFavorite: boolean
  lastUpdated: string
  rssUrl?: string
  webUrl?: string
}

export interface Article {
  id: string
  title: string
  url: string
  source: string
  publishedAt: string
  summary: string
  isRead: boolean
  isFavorite: boolean
  tags: string[]
}

export interface Book {
  id: string
  title: string
  author: string
  cover: string
  status: 'reading' | 'completed' | 'wantToRead'
  rating: number
  notes: Note[]
  category: string
  startDate?: string
  finishDate?: string
  pdfUrl?: string
  totalPages?: number
  currentPage?: number
}

export interface Note {
  id: string
  content: string
  pageNumber?: string
  chapter?: string
  createdAt: string
  bookId: string
}

export interface Reminder {
  id: string
  title: string
  content: string
  time: string
  isEnabled: boolean
  isCompleted: boolean
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  theme: 'light' | 'dark'
  defaultCategory: string
  showNotifications: boolean
  enableStudyReminders: boolean
  reminderTime: string
  lastSyncTime?: string
}

export interface Encouragement {
  id: string
  content: string
  category: 'motivation' | 'study' | 'life' | 'work'
  createdAt: string
}

export interface Hobby {
  id: string
  name: string
  description: string
  category: string
  icon: string
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface HobbyContent {
  id: string
  hobbyId: string
  title: string
  content: string
  url?: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Food {
  id: string
  name: string
  category: string
  description: string
  rating: number
  location: string
  date: string
  isFavorite: boolean
  image?: string
}

export interface Course {
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

export interface HealthRecord {
  id: string
  type: 'exercise' | 'diet' | 'sleep' | 'mood'
  title: string
  description: string
  date: string
  duration?: number
  calories?: number
  moodLevel?: 1 | 2 | 3 | 4 | 5
  notes: string
}

export interface Stats {
  // AI工具统计
  totalTools: number
  favoriteTools: number
  mostUsedTools: AITool[]
  toolsByCategory: Record<string, number>
  
  // 文章统计
  totalArticles: number
  unreadArticles: number
  readArticles: number
  favoriteArticles: number
  articlesBySource: Record<string, number>
  recentArticles: Article[]
  
  // 书籍统计
  totalBooks: number
  readingBooks: number
  completedBooks: number
  wantToReadBooks: number
  favoriteBooks: number
  averageBookRating: number
  totalNotes: number
  
  // 提醒统计
  totalReminders: number
  enabledReminders: number
  completedReminders: number
  enabledRemindersCount: number
  
  // 兴趣爱好统计
  totalHobbies: number
  favoriteHobbies: number
  totalHobbyContents: number
  hobbiesByCategory: Record<string, number>
  
  // 整体概览
  totalResources: number
  favoriteResources: number
  recentActivity: Array<{ type: string; item: any; date: string }>
}
