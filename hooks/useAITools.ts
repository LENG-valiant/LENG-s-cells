'use client'

import { useState, useEffect, useMemo } from 'react'
import { AITool } from '@/types'
import { getAITools, saveAITools } from '@/lib/store'

export function useAITools() {
  const [tools, setTools] = useState<AITool[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    setTools(getAITools())
  }, [])

  const categories = useMemo(() => {
    const cats = new Set(tools.map(t => t.category))
    return ['all', ...Array.from(cats)]
  }, [tools])

  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
      const matchesFavorite = !showFavoritesOnly || tool.isFavorite
      return matchesSearch && matchesCategory && matchesFavorite
    })
  }, [tools, searchQuery, selectedCategory, showFavoritesOnly])

  const personalizedRecommendations = useMemo(() => {
    const favorites = tools.filter(t => t.isFavorite).map(t => t.category)
    const topUsed = [...tools].sort((a, b) => b.usageCount - a.usageCount).slice(0, 3)
    return {
      basedOnFavorites: tools.filter(t => favorites.includes(t.category) && !t.isFavorite).slice(0, 4),
      popular: topUsed
    }
  }, [tools])

  const toggleFavorite = (id: string) => {
    const updated = tools.map(tool =>
      tool.id === id ? { ...tool, isFavorite: !tool.isFavorite } : tool
    )
    setTools(updated)
    saveAITools(updated)
  }

  const incrementUsage = (id: string) => {
    const updated = tools.map(tool =>
      tool.id === id ? { ...tool, usageCount: tool.usageCount + 1, lastUsed: new Date().toISOString() } : tool
    )
    setTools(updated)
    saveAITools(updated)
  }

  return {
    tools: filteredTools,
    allTools: tools,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    showFavoritesOnly,
    setShowFavoritesOnly,
    categories,
    recommendations: personalizedRecommendations,
    toggleFavorite,
    incrementUsage
  }
}
