'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Badge, EmptyState } from '@/components/UI'
import { Plus, Book, BookOpen, Star, Clock, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { Book as BookType, Note } from '@/types'
import { getBooks, getNotes, saveBooks, saveNotes } from '@/lib/store'

interface ReadingPageProps {
  onNavigate: (page: string) => void
}

export default function ReadingPage({ onNavigate }: ReadingPageProps) {
  const [books, setBooks] = useState<BookType[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [activeTab, setActiveTab] = useState<'books' | 'notes'>('books')
  const [showAddBookModal, setShowAddBookModal] = useState(false)
  const [showAddNoteModal, setShowAddNoteModal] = useState(false)
  const [selectedBookForNote, setSelectedBookForNote] = useState<string | null>(null)

  useEffect(() => {
    setBooks(getBooks())
    setNotes(getNotes())
  }, [])

  const booksByCategory = useMemo(() => {
    const grouped: Record<string, BookType[]> = {}
    books.forEach(book => {
      if (!grouped[book.category]) {
        grouped[book.category] = []
      }
      grouped[book.category].push(book)
    })
    return grouped
  }, [books])

  const readingStats = useMemo(() => ({
    reading: books.filter(b => b.status === 'reading').length,
    completed: books.filter(b => b.status === 'completed').length,
    wantToRead: books.filter(b => b.status === 'wantToRead').length,
    totalNotes: notes.length,
  }), [books, notes])

  const updateBookStatus = (bookId: string, status: BookType['status']) => {
    const updated = books.map(book =>
      book.id === bookId
        ? {
            ...book,
            status,
            startDate: status === 'reading' ? new Date().toISOString().split('T')[0] : book.startDate,
            finishDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined
          }
        : book
    )
    setBooks(updated)
    saveBooks(updated)
  }

  const addBook = (book: Partial<BookType>) => {
    const newBook: BookType = {
      id: Date.now().toString(),
      title: book.title || '',
      author: book.author || '',
      cover: '📚',
      status: 'wantToRead',
      rating: 0,
      notes: [],
      category: book.category || '未分类',
      startDate: undefined,
      finishDate: undefined,
      pdfUrl: book.pdfUrl,
      totalPages: book.totalPages,
      currentPage: 1,
    }
    const updated = [...books, newBook]
    setBooks(updated)
    saveBooks(updated)
  }

  const handlePDFUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      // 创建临时URL用于预览
      const pdfUrl = URL.createObjectURL(file)
      // 提取文件名作为书名
      const title = file.name.replace('.pdf', '')
      addBook({
        title,
        author: '未知作者',
        category: 'PDF文档',
        pdfUrl,
        status: 'reading',
      })
    }
  }

  const addNote = (note: Partial<Note>) => {
    if (!note.bookId) return
    const newNote: Note = {
      id: Date.now().toString(),
      content: note.content || '',
      pageNumber: note.pageNumber,
      chapter: note.chapter,
      createdAt: new Date().toISOString(),
      bookId: note.bookId,
    }
    const updated = [...notes, newNote]
    setNotes(updated)
    saveNotes(updated)
  }

  const getBookTitle = (bookId: string) => {
    return books.find(b => b.id === bookId)?.title || '未知书籍'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">个人阅读角</h1>
          <p className="text-gray-500 mt-1">管理您的书籍收藏和阅读笔记</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAddBookModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <Plus size={20} />
            <span>添加书籍</span>
          </button>
        </div>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'books'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Book size={20} />
          <span>书籍管理</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-2 px-4 py-3 border-b-2 transition-colors ${
            activeTab === 'notes'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Edit2 size={20} />
          <span>阅读笔记</span>
          <span className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full text-xs">
            {notes.length}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card hover={false}>
          <div className="text-center">
            <BookOpen size={32} className="mx-auto text-orange-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{readingStats.reading}</p>
            <p className="text-sm text-gray-500">正在阅读</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <CheckCircle size={32} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{readingStats.completed}</p>
            <p className="text-sm text-gray-500">已读完</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Clock size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{readingStats.wantToRead}</p>
            <p className="text-sm text-gray-500">待阅读</p>
          </div>
        </Card>
        <Card hover={false}>
          <div className="text-center">
            <Edit2 size={32} className="mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-gray-800">{readingStats.totalNotes}</p>
            <p className="text-sm text-gray-500">笔记数量</p>
          </div>
        </Card>
      </div>

      {activeTab === 'books' ? (
        books.length === 0 ? (
          <EmptyState
            icon={<Book size={32} className="text-gray-400" />}
            title="还没有添加任何书籍"
            description="添加您想阅读的书籍，开始管理您的阅读计划"
            action={
              <button
                onClick={() => setShowAddBookModal(true)}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                添加书籍
              </button>
            }
          />
        ) : (
          Object.entries(booksByCategory).map(([category, categoryBooks]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <span>{category}</span>
                <span className="text-sm text-gray-500">({categoryBooks.length}本)</span>
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {categoryBooks.map((book) => (
                  <Card key={book.id} className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-20 bg-orange-100 rounded-lg flex items-center justify-center text-3xl">
                        {book.cover}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{book.title}</h4>
                        <p className="text-sm text-gray-500">{book.author}</p>
                        <div className="mt-2">
                          <Badge
                            variant={
                              book.status === 'completed' ? 'success' :
                              book.status === 'reading' ? 'warning' : 'default'
                            }
                          >
                            {book.status === 'completed' ? '已读完' :
                             book.status === 'reading' ? '在读' : '想读'}
                          </Badge>
                        </div>
                        {book.status === 'completed' && book.rating > 0 && (
                          <div className="flex mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < book.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex space-x-1">
                        {book.status === 'wantToRead' && (
                          <button
                            onClick={() => updateBookStatus(book.id, 'reading')}
                            className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
                          >
                            开始阅读
                          </button>
                        )}
                        {book.status === 'reading' && (
                          <button
                            onClick={() => updateBookStatus(book.id, 'completed')}
                            className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                          >
                            标记读完
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedBookForNote(book.id)
                            setShowAddNoteModal(true)
                          }}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                        >
                          添加笔记
                        </button>
                        {book.pdfUrl && (
                          <button
                            onClick={() => {
                              // 打开PDF预览
                              window.open(book.pdfUrl, '_blank')
                            }}
                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                          >
                            阅读PDF
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))
        )
      ) : (
        notes.length === 0 ? (
          <EmptyState
            icon={<Edit2 size={32} className="text-gray-400" />}
            title="还没有任何笔记"
            description="在阅读时添加笔记，帮助您更好地理解和记忆"
          />
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <Card key={note.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Book size={16} className="text-orange-600" />
                      <span className="text-sm font-medium text-orange-600">
                        {getBookTitle(note.bookId)}
                      </span>
                      {note.pageNumber && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">第{note.pageNumber}页</span>
                        </>
                      )}
                      {note.chapter && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-500">{note.chapter}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )
      )}

      {showAddBookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加书籍</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  书名
                </label>
                <input
                  type="text"
                  id="bookTitle"
                  placeholder="输入书名"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  作者
                </label>
                <input
                  type="text"
                  id="bookAuthor"
                  placeholder="输入作者名"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  分类
                </label>
                <input
                  type="text"
                  id="bookCategory"
                  placeholder="产品、设计、技术..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  上传PDF文件（可选）
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    id="bookPDF"
                    accept=".pdf"
                    onChange={handlePDFUpload}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  />
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddBookModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const title = (document.getElementById('bookTitle') as HTMLInputElement).value
                    const author = (document.getElementById('bookAuthor') as HTMLInputElement).value
                    const category = (document.getElementById('bookCategory') as HTMLInputElement).value
                    if (title) {
                      addBook({ title, author, category })
                      setShowAddBookModal(false)
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  添加
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">添加笔记</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  书籍
                </label>
                <select
                  id="noteBook"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={selectedBookForNote || ''}
                  onChange={(e) => setSelectedBookForNote(e.target.value)}
                >
                  <option value="">选择书籍</option>
                  {books.map((book) => (
                    <option key={book.id} value={book.id}>{book.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  页码（可选）
                </label>
                <input
                  type="text"
                  id="notePage"
                  placeholder="例如：第42页"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  章节（可选）
                </label>
                <input
                  type="text"
                  id="noteChapter"
                  placeholder="例如：第三章"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  笔记内容
                </label>
                <textarea
                  id="noteContent"
                  placeholder="记录您的想法和感悟..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddNoteModal(false)
                    setSelectedBookForNote(null)
                  }}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    const bookId = (document.getElementById('noteBook') as HTMLSelectElement).value
                    const pageNumber = (document.getElementById('notePage') as HTMLInputElement).value
                    const chapter = (document.getElementById('noteChapter') as HTMLInputElement).value
                    const content = (document.getElementById('noteContent') as HTMLTextAreaElement).value
                    if (bookId && content) {
                      addNote({ bookId, pageNumber, chapter, content })
                      setShowAddNoteModal(false)
                      setSelectedBookForNote(null)
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
