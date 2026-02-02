import { useState, useMemo } from 'react'
import { AITool, Article, Book, Hobby, HobbyContent, Reminder } from '@/types'
import { getAITools, getArticles, getBooks, getHobbies, getHobbyContents, getReminders } from '@/lib/store'

export interface SearchResult {
  id: string
  type: 'tool' | 'article' | 'book' | 'hobby' | 'hobbyContent' | 'reminder'
  title: string
  content: string
  icon: string
  url?: string
  source?: string
}

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // 获取所有可搜索的资源
  const allResources = useMemo(() => {
    const tools = getAITools()
    const articles = getArticles()
    const books = getBooks()
    const hobbies = getHobbies()
    const hobbyContents = getHobbyContents()
    const reminders = getReminders()

    return {
      tools,
      articles,
      books,
      hobbies,
      hobbyContents,
      reminders
    }
  }, []) // 注意：由于get*函数返回的是新数组，这里不需要依赖项，每次都会重新计算

  // 执行搜索
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const results: SearchResult[] = []

    // 搜索AI工具
    allResources.tools.forEach((tool: AITool) => {
      if (tool.name.toLowerCase().includes(query) || tool.description.toLowerCase().includes(query) || tool.category.toLowerCase().includes(query) || tool.tags.some(tag => tag.toLowerCase().includes(query))) {
        results.push({
          id: tool.id,
          type: 'tool',
          title: tool.name,
          content: tool.description,
          icon: tool.icon,
          url: tool.url
        })
      }
    })

    // 搜索文章
    allResources.articles.forEach((article: Article) => {
      if (article.title.toLowerCase().includes(query) || article.summary.toLowerCase().includes(query) || article.source.toLowerCase().includes(query) || article.tags.some(tag => tag.toLowerCase().includes(query))) {
        results.push({
          id: article.id,
          type: 'article',
          title: article.title,
          content: article.summary,
          icon: '📄',
          url: article.url,
          source: article.source
        })
      }
    })

    // 搜索书籍
    allResources.books.forEach((book: Book) => {
      if ((book.title && book.title.toLowerCase().includes(query)) || (book.author && book.author.toLowerCase().includes(query)) || (book.category && book.category.toLowerCase().includes(query))) {
        results.push({
          id: book.id,
          type: 'book',
          title: book.title || '未知书名',
          content: `作者: ${book.author || '未知作者'}`,
          icon: book.cover
        })
      }
    })

    // 搜索兴趣爱好
    allResources.hobbies.forEach((hobby: Hobby) => {
      if (hobby.name.toLowerCase().includes(query) || hobby.description.toLowerCase().includes(query) || hobby.category.toLowerCase().includes(query)) {
        results.push({
          id: hobby.id,
          type: 'hobby',
          title: hobby.name,
          content: hobby.description,
          icon: hobby.icon
        })
      }
    })

    // 搜索兴趣内容
    allResources.hobbyContents.forEach((content: HobbyContent) => {
      if (content.title.toLowerCase().includes(query) || content.content.toLowerCase().includes(query) || content.tags.some(tag => tag.toLowerCase().includes(query))) {
        const hobby = allResources.hobbies.find(h => h.id === content.hobbyId)
        results.push({
          id: content.id,
          type: 'hobbyContent',
          title: content.title,
          content: content.content,
          icon: hobby?.icon || '📝',
          source: hobby?.name
        })
      }
    })

    // 搜索提醒
    allResources.reminders.forEach((reminder: Reminder) => {
      if (reminder.title.toLowerCase().includes(query) || reminder.content.toLowerCase().includes(query)) {
        results.push({
          id: reminder.id,
          type: 'reminder',
          title: reminder.title,
          content: reminder.content,
          icon: '⏰'
        })
      }
    })

    return results
  }, [searchQuery, allResources])

  // 获取搜索建议
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return []

    const query = searchQuery.toLowerCase()
    const suggestions: string[] = []
    const seen = new Set<string>()

    // 从工具中获取建议
    allResources.tools.forEach((tool: AITool) => {
      if (tool.name.toLowerCase().includes(query) && !seen.has(tool.name)) {
        suggestions.push(tool.name)
        seen.add(tool.name)
      }
      tool.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query) && !seen.has(tag)) {
          suggestions.push(tag)
          seen.add(tag)
        }
      })
    })

    // 从文章中获取建议
    allResources.articles.forEach((article: Article) => {
      if (article.title.toLowerCase().includes(query) && !seen.has(article.title)) {
        suggestions.push(article.title)
        seen.add(article.title)
      }
      if (article.source.toLowerCase().includes(query) && !seen.has(article.source)) {
        suggestions.push(article.source)
        seen.add(article.source)
      }
      article.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query) && !seen.has(tag)) {
          suggestions.push(tag)
          seen.add(tag)
        }
      })
    })

    // 从书籍中获取建议
    allResources.books.forEach((book: Book) => {
      if (book.title && book.title.toLowerCase().includes(query) && !seen.has(book.title)) {
        suggestions.push(book.title)
        seen.add(book.title)
      }
      if (book.author && book.author.toLowerCase().includes(query) && !seen.has(book.author)) {
        suggestions.push(book.author)
        seen.add(book.author)
      }
      if (book.category && book.category.toLowerCase().includes(query) && !seen.has(book.category)) {
        suggestions.push(book.category)
        seen.add(book.category)
      }
    })

    // 从兴趣爱好中获取建议
    allResources.hobbies.forEach((hobby: Hobby) => {
      if (hobby.name.toLowerCase().includes(query) && !seen.has(hobby.name)) {
        suggestions.push(hobby.name)
        seen.add(hobby.name)
      }
      if (hobby.category.toLowerCase().includes(query) && !seen.has(hobby.category)) {
        suggestions.push(hobby.category)
        seen.add(hobby.category)
      }
    })

    // 从兴趣内容中获取建议
    allResources.hobbyContents.forEach((content: HobbyContent) => {
      if (content.title.toLowerCase().includes(query) && !seen.has(content.title)) {
        suggestions.push(content.title)
        seen.add(content.title)
      }
      content.tags.forEach(tag => {
        if (tag.toLowerCase().includes(query) && !seen.has(tag)) {
          suggestions.push(tag)
          seen.add(tag)
        }
      })
    })

    // 从提醒中获取建议
    allResources.reminders.forEach((reminder: Reminder) => {
      if (reminder.title.toLowerCase().includes(query) && !seen.has(reminder.title)) {
        suggestions.push(reminder.title)
        seen.add(reminder.title)
      }
    })

    return suggestions.slice(0, 5)
  }, [searchQuery, allResources])

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchSuggestions,
    isSearchOpen,
    setIsSearchOpen
  }
}
