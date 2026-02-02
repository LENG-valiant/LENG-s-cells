'use client'

import { useState } from 'react'
import { Card } from '@/components/UI'
import { Heart, Star, Tag, ArrowRight } from 'lucide-react'
import { getHobbies, getHobbyContents, saveHobbies } from '@/lib/store'
import { Hobby } from '@/types'

interface HobbiesPageProps {
  onNavigate: (page: string) => void
}

export default function HobbiesPage({ onNavigate }: HobbiesPageProps) {
  const [hobbies] = useState(getHobbies())
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  const hobbyContents = getHobbyContents()

  const filteredHobbies = hobbies.filter(hobby => {
    return !showFavoritesOnly || hobby.isFavorite
  })

  const getHobbyContentCount = (hobbyId: string) => {
    return hobbyContents.filter(content => content.hobbyId === hobbyId).length
  }

  const toggleFavorite = (hobbyId: string) => {
    const updatedHobbies = hobbies.map(hobby =>
      hobby.id === hobbyId ? { ...hobby, isFavorite: !hobby.isFavorite } : hobby
    )
    saveHobbies(updatedHobbies)
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">兴趣爱好</h1>
          <p className="text-gray-500 mt-1">管理和探索您的兴趣爱好</p>
        </div>
        <button
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            showFavoritesOnly
              ? 'bg-pink-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Star size={20} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
          <span>只看收藏</span>
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHobbies.map((hobby: Hobby) => (
          <Card key={hobby.id} className="relative">
            <button
              onClick={() => toggleFavorite(hobby.id)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                hobby.isFavorite
                  ? 'text-pink-500 bg-pink-100'
                  : 'text-gray-300 hover:text-pink-500 hover:bg-gray-100'
              }`}
              title={hobby.isFavorite ? '取消收藏' : '收藏'}
            >
              <Star size={20} fill={hobby.isFavorite ? 'currentColor' : 'none'} />
            </button>
            
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-pink-100 rounded-xl flex items-center justify-center text-4xl">
                {hobby.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-lg text-gray-800">{hobby.name}</h3>
                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    {hobby.category}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{hobby.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <Tag size={16} className="text-gray-400" />
                    <span className="text-gray-500">{getHobbyContentCount(hobby.id)} 个内容</span>
                  </div>
                  <button className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 text-sm">
                    <span>查看详情</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredHobbies.length === 0 && (
        <div className="text-center py-12">
          <Heart size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">还没有收藏的兴趣爱好</h3>
          <p className="text-gray-500 mb-4">取消"只看收藏"或者添加新的兴趣爱好</p>
          <button
            onClick={() => setShowFavoritesOnly(false)}
            className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
          >
            显示全部兴趣爱好
          </button>
        </div>
      )}
    </div>
  )
}
