'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, Badge } from '@/components/UI'
import { 
  BookOpen, Plus, Trash2, Edit, CheckCircle, XCircle, 
  RefreshCw, ArrowLeft, Quote, Sparkles, MessageSquare,
  Clock, Target, TrendingUp, Heart
} from 'lucide-react'
import { Book as BookType, Note } from '@/types'

interface ReadingCellProps {
  onNavigate: (page: string) => void
}

// 扩展Book类型，确保与types/index.ts中的Book类型兼容
interface Book {
  id: string
  title: string
  author: string
  status: 'wantToRead' | 'reading' | 'completed'
  progress: number
  totalPages: number
  currentPage: number
  notes: string
  quotes: string[]
  cover?: string
}

interface Quote {
  id: string
  content: string
  book: string
  author: string
}

// 阅读细胞配色 - 与主页对应
const READING_CELL_COLORS = {
  primary: '#197CBE', // 主蓝色
  secondary: '#59A3CF', // 浅蓝色
  accent: '#F88B7C', // 粉色
  warm: '#F5CB76', // 黄色
  light: '#EAEEEC', // 白色
  dark: '#197CBE', // 深蓝色
  highlight: '#F5CB76', // 黄色
  progress: '#F5CB76', // 黄色
}

const ENCOURAGEMENTS = [
  "今天的阅读，是你送给未来自己最好的礼物 🌟",
  "每一页都是成长的印记，继续加油！📚",
  "阅读的旅程从未如此精彩，你正在书写属于自己的故事 ✨",
  "知识的力量在你身上显现，今天也要继续闪耀！💫",
  "阅读的习惯是最珍贵的财富，坚持就是胜利！🏆",
  "书页翻动的声音，是世界上最美的乐章 🎵",
  "你的阅读进度令人欣喜，每一天都在进步！🌈",
  "阅读让你遇见更好的自己，今天也要元气满满！⚡"
]

const DEBATE_SYSTEM_PROMPT = `你是一个批判性思维教练和辩论伙伴。你的任务是：
1. 首先理解用户提出的观点
2. 从完全相反的角度进行辩论和质疑
3. 找出用户观点中的逻辑漏洞和假设
4. 提供不同视角和思考维度
5. 用苏格拉底式提问引导用户深入思考
6. 最后帮助用户形成更全面、深入的反思

请用温和但犀利的语气进行辩论，就像一个智慧的导师。`

// 从本地存储获取书籍数据
const getLocalBooks = (): Book[] => {
  try {
    const booksStr = localStorage.getItem('personal_homepage_books')
    return booksStr ? JSON.parse(booksStr) : []
  } catch (error) {
    console.error('获取本地书籍数据失败:', error)
    return []
  }
}

// 保存书籍数据到本地存储
const saveLocalBooks = (books: Book[]): void => {
  try {
    localStorage.setItem('personal_homepage_books', JSON.stringify(books))
  } catch (error) {
    console.error('保存本地书籍数据失败:', error)
  }
}

export default function ReadingCell({ onNavigate }: ReadingCellProps) {
  const [books, setBooks] = useState<Book[]>([])

  const [quotes, setQuotes] = useState<Quote[]>([
    { id: '1', content: "阅读是灵魂的粮食，思考是心灵的呼吸。", book: "阅读的力量", author: "弗朗西斯·培根" },
    { id: '2', content: "一本书就像一艘船，带领我们从狭隘的地方驶向无限广阔的海域。", book: "书的世界", author: "海伦·凯勒" },
    { id: '3', content: "学习不是填满一个桶，而是点燃一把火。", book: "教育之道", author: "威廉·巴特勒·叶芝" },
    { id: '4', content: "知识的价值不在于占有，而在于使用。", book: "智慧之路", author: "苏格拉底" },
    { id: '5', content: "不经巨大的困难，不会有伟大的事业。", book: "哲学通信", author: "伏尔泰" },
    { id: '6', content: "书籍是巨大的力量。", book: "列宁全集", author: "列宁" },
    { id: '7', content: "成功不是终点，失败不是致命，继续前进的勇气才是最重要的。", book: "丘吉尔演讲集", author: "丘吉尔" },
    { id: '8', content: "坚持是成功的关键，只要你不放弃，就永远有机会。", book: "李娜自传", author: "李娜" },
    { id: '9', content: "每一次比赛都是新的开始，我要全力以赴。", book: "樊振东访谈", author: "樊振东" },
    { id: '10', content: "成功不是得到多少，而是付出多少。", book: "周杰伦访谈", author: "周杰伦" },
    { id: '11', content: "时间就像海绵里的水，只要愿挤，总还是有的。", book: "鲁迅全集", author: "鲁迅" },
    { id: '12', content: "路漫漫其修远兮，吾将上下而求索。", book: "离骚", author: "屈原" },
    { id: '13', content: "生活就像海洋，只有意志坚强的人才能到达彼岸。", book: "马克思恩格斯选集", author: "马克思" },
    { id: '14', content: "天才是百分之一的灵感加上百分之九十九的汗水。", book: "爱迪生传", author: "爱迪生" },
    { id: '15', content: "信心是命运的主宰。", book: "卡耐基成功学", author: "卡耐基" },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)
  const [activeTab, setActiveTab] = useState<'books' | 'debate'>('books')
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isQuoteAnimating, setIsQuoteAnimating] = useState(false)
  const [debateInput, setDebateInput] = useState('')
  const [debateResult, setDebateResult] = useState('')
  const [isDebating, setIsDebating] = useState(false)
  const [updatingBookId, setUpdatingBookId] = useState<string | null>(null)
  const quoteTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 从本地存储加载书籍数据
  useEffect(() => {
    const loadBooks = () => {
      const localBooks = getLocalBooks()
      if (localBooks.length > 0) {
        setBooks(localBooks)
      } else {
        // 如果本地存储没有数据，使用默认数据
        const defaultBooks: Book[] = [
          {
            id: '1',
            title: '原子习惯',
            author: '詹姆斯·克利尔',
            status: 'reading',
            progress: 65,
            totalPages: 320,
            currentPage: 208,
            notes: '习惯养成的四步法：提示、渴望、回应、奖励',
            quotes: [
              "习惯是重复足够次数后变得自动化的行为。",
              "你不需要改变，只需要改进1%。",
              "环境往往比意志更重要。"
            ]
          },
          {
            id: '2',
            title: '思考，快与慢',
            author: '丹尼尔·卡尼曼',
            status: 'completed',
            progress: 100,
            totalPages: 450,
            currentPage: 450,
            notes: '系统1和系统2的思考方式',
            quotes: [
              "我们对自己知道的东西往往过于自信。",
              "直觉并不可靠，尤其是在复杂情境中。"
            ]
          },
          {
            id: '3',
            title: '人类简史',
            author: '尤瓦尔·赫拉利',
            status: 'wantToRead',
            progress: 0,
            totalPages: 400,
            currentPage: 0,
            notes: '',
            quotes: []
          }
        ]
        setBooks(defaultBooks)
        saveLocalBooks(defaultBooks)
      }
    }

    loadBooks()
    startQuoteRotation()
    return () => {
      if (quoteTimerRef.current) {
        clearTimeout(quoteTimerRef.current)
      }
    }
  }, [])

  // 当书籍数据变化时，保存到本地存储
  useEffect(() => {
    if (books.length > 0) {
      saveLocalBooks(books)
    }
  }, [books])

  const startQuoteRotation = () => {
    quoteTimerRef.current = setTimeout(() => {
      setIsQuoteAnimating(true)
      setTimeout(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
        setIsQuoteAnimating(false)
        startQuoteRotation()
      }, 500)
    }, 5000)
  }

  const handlePageUpdate = useCallback(async (bookId: string, newPage: number) => {
    const book = books.find(b => b.id === bookId)
    if (!book || newPage < 0 || newPage > book.totalPages) return

    setUpdatingBookId(bookId)
    setTimeout(() => {
      setBooks(prevBooks => 
        prevBooks.map(b => 
          b.id === bookId 
            ? { 
                ...b, 
                currentPage: newPage,
                progress: Math.round((newPage / b.totalPages)) * 100
              } 
            : b
        )
      )
      setUpdatingBookId(null)
    }, 300)
  }, [books])

  const handleSliderChange = (bookId: string, value: number) => {
    const book = books.find(b => b.id === bookId)
    if (book) {
      handlePageUpdate(bookId, value)
    }
  }

  const addNewBook = (book: Omit<Book, 'id'>) => {
    const newBook: Book = {
      ...book,
      id: Date.now().toString()
    }
    setBooks([...books, newBook])
    setIsModalOpen(false)
  }

  const editBook = (id: string, updates: Partial<Book>) => {
    setBooks(books.map(book => 
      book.id === id ? { ...book, ...updates } : book
    ))
    setIsModalOpen(false)
    setEditingBook(null)
  }

  const deleteBook = (id: string) => {
    setBooks(books.filter(book => book.id !== id))
  }

  const handleDebate = async () => {
    if (!debateInput.trim()) return
    
    setIsDebating(true)
    setDebateResult('')
    
    try {
      const response = await fetch('/api/debate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: debateInput,
          systemPrompt: DEBATE_SYSTEM_PROMPT 
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setDebateResult(data.result)
      } else {
        setDebateResult('抱歉，AI辩论服务暂时不可用。请稍后再试。')
      }
    } catch {
      setDebateResult('网络错误，请检查连接后重试。')
    } finally {
      setIsDebating(false)
    }
  }

  const readingBooks = books.filter(b => b.status === 'reading')
  const completedBooks = books.filter(b => b.status === 'completed')
  const wantToReadBooks = books.filter(b => b.status === 'wantToRead')

  const getRandomEncouragement = () => {
    return ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)]
  }

  return (
    <div className="min-h-screen tech-background tech-grid tech-glow" style={{ background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)` }}>
      {/* 顶部装饰 */}
      <div 
        className="h-12 rounded-b-3xl shadow-lg relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 50%, ${READING_CELL_COLORS.accent} 100%)`
        }}
      >
        <div className="absolute inset-0 bg-white/10"></div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 导航栏 */}
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 mb-6"
          style={{ color: READING_CELL_COLORS.primary }}
        >
          <ArrowLeft size={20} />
          <span className="font-medium">返回大脑</span>
        </button>

        {/* 标题区域 */}
        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div 
              className="absolute -inset-4 rounded-3xl opacity-30"
              style={{ background: READING_CELL_COLORS.accent }}
            ></div>
            <div className="relative bg-white rounded-2xl p-8 shadow-xl border-2" style={{ borderColor: READING_CELL_COLORS.secondary }}>
              <div className="flex items-center justify-center gap-3 mb-3">
                <BookOpen size={36} style={{ color: READING_CELL_COLORS.primary }} />
                <h1 className="text-4xl font-bold" style={{ color: READING_CELL_COLORS.dark }}>
                  LENG阅读细胞
                </h1>
              </div>
              <p className="text-lg" style={{ color: READING_CELL_COLORS.secondary }}>
                探索知识的海洋，记录阅读心得
              </p>
            </div>
          </div>
        </div>

        {/* 好词好句轮播 */}
        <div className="mb-10">
          <div 
            className="relative overflow-hidden rounded-2xl p-8 text-center shadow-lg"
            style={{ 
              background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)`
            }}
          >
            <Quote className="absolute top-4 left-4 opacity-20" size={48} color="white" />
            <div className={`transition-all duration-500 ${isQuoteAnimating ? 'opacity-0 transform translate-y-4' : 'opacity-100'}`}>
              <p className="text-2xl font-medium text-white mb-4 leading-relaxed">
                "{quotes[currentQuoteIndex].content}"
              </p>
              <p className="text-white/80">
                —— {quotes[currentQuoteIndex].book} · {quotes[currentQuoteIndex].author}
              </p>
            </div>
            <div className="flex justify-center gap-2 mt-6">
              {quotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (quoteTimerRef.current) clearTimeout(quoteTimerRef.current)
                    setIsQuoteAnimating(true)
                    setTimeout(() => {
                      setCurrentQuoteIndex(index)
                      setIsQuoteAnimating(false)
                      startQuoteRotation()
                    }, 500)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentQuoteIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('books')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'books' 
                ? 'shadow-lg transform scale-[1.02]' 
                : 'bg-white/50 hover:bg-white shadow'
            }`}
            style={{ 
              background: activeTab === 'books' ? READING_CELL_COLORS.primary : undefined,
              color: activeTab === 'books' ? 'white' : READING_CELL_COLORS.dark
            }}
          >
            <BookOpen size={20} />
            <span>阅读管理</span>
          </button>
          <button
            onClick={() => setActiveTab('debate')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'debate' 
                ? 'shadow-lg transform scale-[1.02]' 
                : 'bg-white/50 hover:bg-white shadow'
            }`}
            style={{ 
              background: activeTab === 'debate' ? READING_CELL_COLORS.accent : undefined,
              color: activeTab === 'debate' ? 'white' : READING_CELL_COLORS.dark
            }}
          >
            <MessageSquare size={20} />
            <span>AI辩论反思</span>
          </button>
        </div>

        {activeTab === 'books' ? (
          <>
            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <Card className="text-center py-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target size={24} style={{ color: READING_CELL_COLORS.highlight }} />
                </div>
                <p className="text-3xl font-bold" style={{ color: READING_CELL_COLORS.dark }}>{readingBooks.length}</p>
                <p className="text-sm" style={{ color: READING_CELL_COLORS.secondary }}>进行中</p>
              </Card>
              <Card className="text-center py-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock size={24} style={{ color: READING_CELL_COLORS.primary }} />
                </div>
                <p className="text-3xl font-bold" style={{ color: READING_CELL_COLORS.dark }}>{wantToReadBooks.length}</p>
                <p className="text-sm" style={{ color: READING_CELL_COLORS.secondary }}>待阅读</p>
              </Card>
              <Card className="text-center py-5">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle size={24} style={{ color: '#48bb78' }} />
                </div>
                <p className="text-3xl font-bold" style={{ color: READING_CELL_COLORS.dark }}>{completedBooks.length}</p>
                <p className="text-sm" style={{ color: READING_CELL_COLORS.secondary }}>已完成</p>
              </Card>
            </div>

            {/* 添加按钮 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mb-8 py-4 rounded-2xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.01]"
              style={{ background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)` }}
            >
              <Plus size={24} />
              <span>添加新书籍</span>
            </button>

            {/* 正在进行中的鼓励 */}
            {readingBooks.length > 0 && (
              <div 
                className="mb-8 p-5 rounded-2xl shadow-md"
                style={{ background: `linear-gradient(135deg, ${READING_CELL_COLORS.warm} 0%, ${READING_CELL_COLORS.accent} 100%)` }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-white" size={24} />
                  <span className="text-white font-medium">今日鼓励</span>
                </div>
                <p className="text-white/90 text-lg leading-relaxed">
                  {getRandomEncouragement()}
                </p>
              </div>
            )}

            {/* 书籍列表 */}
            <div className="space-y-6">
              {books.map((book) => (
                <Card 
                  key={book.id}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    updatingBookId === book.id ? 'scale-[1.01]' : ''
                  }`}
                >
                  {/* 状态标签 */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ 
                      background: book.status === 'completed' 
                        ? '#48bb78' 
                        : book.status === 'reading'
                          ? READING_CELL_COLORS.highlight
                          : READING_CELL_COLORS.secondary
                    }}
                  />

                  <div className="pt-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{book.title}</h3>
                        <p className="text-gray-500">作者：{book.author}</p>
                      </div>
                      <Badge
                        variant={
                          book.status === 'completed' ? 'success' :
                          book.status === 'reading' ? 'warning' : 'default'
                        }
                      >
                        {book.status === 'reading' ? '进行中' : 
                         book.status === 'completed' ? '已读' : '待读'}
                      </Badge>
                    </div>

                    {/* 阅读进度 */}
                    {book.status === 'reading' && (
                      <div className="mb-5 p-5 rounded-xl bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex items-center gap-2">
                          <TrendingUp size={20} style={{ color: READING_CELL_COLORS.highlight }} />
                          <span className="font-medium text-gray-700">阅读进度</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold" style={{ color: READING_CELL_COLORS.highlight }}>
                            {Math.round((book.currentPage / book.totalPages) * 100)}%
                          </span>
                        </div>
                        </div>

                        {/* 进度条 */}
                        <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden mb-4">
                          <div 
                            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
                            style={{ 
                              width: `${(book.currentPage / book.totalPages) * 100}%`,
                              background: `linear-gradient(90deg, ${READING_CELL_COLORS.highlight} 0%, #fbbf24 100%)`
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {book.currentPage} / {book.totalPages} 页
                            </span>
                          </div>
                        </div>

                        {/* 页码输入和滑块 */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min="0"
                              max={book.totalPages}
                              value={book.currentPage}
                              onChange={(e) => handleSliderChange(book.id, parseInt(e.target.value))}
                              className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
                              style={{
                                background: `linear-gradient(to right, ${READING_CELL_COLORS.highlight} 0%, ${READING_CELL_COLORS.highlight} ${(book.currentPage / book.totalPages) * 100}%, #e5e7eb ${(book.currentPage / book.totalPages) * 100}%, #e5e7eb 100%)`
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <input
                              type="number"
                              value={book.currentPage}
                              onChange={(e) => {
                                const val = Math.max(0, Math.min(book.totalPages, parseInt(e.target.value) || 0))
                                handlePageUpdate(book.id, val)
                              }}
                              className="w-24 px-4 py-2 border-2 border-gray-200 rounded-xl text-center font-medium focus:outline-none focus:border-orange-400 transition-colors"
                            />
                            <span className="text-gray-500">/ {book.totalPages} 页</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 读书笔记 */}
                    {book.notes && (
                      <div className="mb-4 p-4 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="flex items-center gap-2 mb-2">
                          <Edit size={16} className="text-amber-600" />
                          <span className="text-sm font-medium text-amber-800">笔记</span>
                        </div>
                        <p className="text-gray-700">{book.notes}</p>
                      </div>
                    )}

                    {/* 操作按钮 */}
                    <div className="flex justify-between pt-3 border-t border-gray-100">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBook(book)
                            setIsModalOpen(true)
                          }}
                          className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                          <Edit size={16} />
                          <span>编辑</span>
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <Trash2 size={16} />
                          <span>删除</span>
                        </button>
                      </div>
                      {book.status !== 'completed' && (
                        <button
                          onClick={() => editBook(book.id, { 
                            status: book.status === 'wantToRead' ? 'reading' : 'completed',
                            currentPage: book.status === 'wantToRead' ? 1 : book.totalPages
                          })}
                          className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                          style={{ 
                            background: book.status === 'reading' 
                              ? '#48bb78' 
                              : `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)`
                          }}
                        >
                          {book.status === 'reading' ? (
                            <>
                              <CheckCircle size={18} />
                              <span>标记读完</span>
                            </>
                          ) : (
                            <>
                              <BookOpen size={18} />
                              <span>开始阅读</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        ) : (
          /* AI辩论反思区域 */
          <div className="space-y-6">
            <Card className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ background: `${READING_CELL_COLORS.accent}20` }}>
                  <MessageSquare size={32} style={{ color: READING_CELL_COLORS.accent }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">AI辩论反思</h2>
                <p className="text-gray-500">输入你的观点，AI将从反方角度进行辩论，帮助你深入思考</p>
              </div>

              <div className="space-y-4">
                <textarea
                  value={debateInput}
                  onChange={(e) => setDebateInput(e.target.value)}
                  placeholder="请输入你想要探讨的观点或想法..."
                  className="w-full p-5 border-2 border-gray-200 rounded-xl resize-none focus:outline-none focus:border-orange-400 transition-colors text-lg leading-relaxed"
                  rows={4}
                />

                <button
                  onClick={handleDebate}
                  disabled={isDebating || !debateInput.trim()}
                  className="w-full py-4 rounded-xl font-medium text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
                  style={{ 
                    background: `linear-gradient(135deg, ${READING_CELL_COLORS.accent} 0%, ${READING_CELL_COLORS.warm} 100%)`
                  }}
                >
                  {isDebating ? (
                    <>
                      <RefreshCw size={24} className="animate-spin" />
                      <span>AI正在思考...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={24} />
                      <span>开始AI辩论</span>
                    </>
                  )}
                </button>

                {debateResult && (
                  <div 
                    className="p-6 rounded-xl border-l-4 animate-fade-in"
                    style={{ 
                      background: `${READING_CELL_COLORS.light}`,
                      borderLeftColor: READING_CELL_COLORS.accent
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Heart size={20} style={{ color: READING_CELL_COLORS.accent }} />
                      <span className="font-medium" style={{ color: READING_CELL_COLORS.dark }}>AI辩论结果</span>
                    </div>
                    <div className="prose prose-orange max-w-none">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{debateResult}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">使用说明</h3>
              <div className="space-y-3 text-gray-600">
                <p>1. 在上方输入框中输入你的观点或想法</p>
                <p>2. 点击"开始AI辩论"按钮</p>
                <p>3. AI将从反方角度进行质疑和辩论</p>
                <p>4. 仔细阅读AI的反驳，思考不同的角度</p>
                <p>5. 这有助于你形成更全面、深入的思考</p>
              </div>
            </Card>
          </div>
        )}

        {/* 底部装饰 */}
        <div className="mt-12 text-center">
          <div 
            className="h-8 rounded-t-3xl"
            style={{ 
              background: `linear-gradient(135deg, ${READING_CELL_COLORS.secondary} 0%, ${READING_CELL_COLORS.primary} 100%)`
            }}
          />
          <div className="py-6" style={{ background: READING_CELL_COLORS.light }}>
            <p className="text-gray-500">
              LENG阅读细胞 · {new Date().getFullYear()} · 用心阅读，用爱成长 ❤️
            </p>
          </div>
        </div>
      </div>

      {/* 添加/编辑书籍模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => {
          setIsModalOpen(false)
          setEditingBook(null)
        }}>
          <div 
            className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
            className="p-6"
            style={{ background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)` }}
          >
            <h3 className="text-xl font-bold text-white">
              {editingBook ? '编辑书籍' : '添加新书籍'}
            </h3>
          </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const title = formData.get('title') as string
                const author = formData.get('author') as string
                const status = formData.get('status') as 'reading' | 'completed' | 'wantToRead'
                const totalPages = parseInt(formData.get('totalPages') as string) || 300
                const notes = formData.get('notes') as string

                if (editingBook) {
                  editBook(editingBook.id, {
                    title,
                    author,
                    status,
                    totalPages,
                    currentPage: status === 'completed' ? totalPages : editingBook.currentPage,
                    notes
                  })
                } else {
                  addNewBook({
                    title,
                    author,
                    status,
                    totalPages,
                    currentPage: 0,
                    notes,
                    quotes: [],
                    progress: 0
                  })
                }
              }}
              className="p-6 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">书名</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingBook?.title}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="输入书名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  name="author"
                  defaultValue={editingBook?.author}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="输入作者"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
                <select
                  name="status"
                  defaultValue={editingBook?.status || 'wantToRead'}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
                >
                  <option value="wantToRead">待读</option>
                  <option value="reading">进行中</option>
                  <option value="completed">已读</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">总页数</label>
                <input
                  type="number"
                  name="totalPages"
                  defaultValue={editingBook?.totalPages || 300}
                  min="1"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors"
                  placeholder="输入总页数"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">笔记（可选）</label>
                <textarea
                  name="notes"
                  defaultValue={editingBook?.notes}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 transition-colors resize-none"
                  placeholder="输入读书笔记"
                />
              </div>
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingBook(null)
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl text-white font-medium shadow-md hover:shadow-lg transition-all duration-300"
                  style={{ 
                    background: `linear-gradient(135deg, ${READING_CELL_COLORS.primary} 0%, ${READING_CELL_COLORS.secondary} 100%)`
                  }}
                >
                  {editingBook ? '保存修改' : '添加书籍'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
